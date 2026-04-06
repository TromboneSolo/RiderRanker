// ============================================================
// RiderRanker — Google Apps Script backend
// ============================================================
// Deploy this as a Web App:
//   Extensions → Apps Script → Deploy → New deployment
//   Type: Web app
//   Execute as: Me
//   Who has access: Anyone
// Then paste the deployment URL into src/config.js.
// ============================================================

const SHEET_NAME      = "Rankings";
const DRIVE_FOLDER_ID = ""; // optional — paste a Drive folder ID to also save per-session JSON files
const SUBMISSION_SECRET = "riderranker-2026"; // must match src/config.js

// ------------------------------------------------------------
// POST  — receives a ranking submission from the browser
// ------------------------------------------------------------
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data._key !== SUBMISSION_SECRET) {
      return jsonResponse({ success: false, error: "Unauthorized" });
    }

    // Write one row per ranked item into the Rankings sheet
    const sheet = getOrCreateSheet();
    data.rankings.forEach(function(item) {
      sheet.appendRow([
        data.timestamp,
        data.sessionId,
        data.imageCount,
        item.rank,
        item.name,
      ]);
    });

    // Optionally archive the full submission as a JSON file in Drive
    if (DRIVE_FOLDER_ID) {
      var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      folder.createFile(
        "ranking_" + data.sessionId + ".json",
        JSON.stringify(data, null, 2),
        MimeType.PLAIN_TEXT
      );
    }

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// ------------------------------------------------------------
// GET  — returns aggregated stats when ?action=stats is passed
// ------------------------------------------------------------
function doGet(e) {
  if (e.parameter.action === "stats") {
    return jsonResponse(computeStats());
  }
  return jsonResponse({ status: "ok" });
}

// ------------------------------------------------------------
// Aggregation — average rank, count, and times ranked #1
// ------------------------------------------------------------
function computeStats() {
  var sheet = getOrCreateSheet();
  var rows  = sheet.getDataRange().getValues();

  if (rows.length === 0) {
    return { totalSessions: 0, rankings: [] };
  }

  var sessions = {};   // sessionId → true  (for counting unique sessions)
  var stats    = {};   // name      → { name, totalRank, count, timesFirst }

  // Skip the first row only if it's the header (identified by the literal value "Rank").
  var dataRows = String(rows[0][3]) === "Rank" ? rows.slice(1) : rows;

  dataRows.forEach(function(row) {
    var timestamp  = row[0];
    var sessionId  = row[1];
    var imageCount = row[2];
    var rank       = Number(row[3]);
    var name       = String(row[4]);

    sessions[sessionId] = true;

    if (!stats[name]) {
      stats[name] = { name: name, totalRank: 0, count: 0, timesFirst: 0 };
    }
    stats[name].totalRank += rank;
    stats[name].count     += 1;
    if (rank === 1) stats[name].timesFirst += 1;
  });

  var rankings = Object.values(stats)
    .map(function(s) {
      return {
        name:       s.name,
        avgRank:    s.totalRank / s.count,
        count:      s.count,
        timesFirst: s.timesFirst,
      };
    })
    .sort(function(a, b) { return a.avgRank - b.avgRank; });

  return {
    totalSessions: Object.keys(sessions).length,
    rankings:      rankings,
  };
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

// Returns the Rankings sheet, creating it with a header row if absent.
function getOrCreateSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "SessionID", "ImageCount", "Rank", "Name"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Wraps a plain object as a JSON ContentService response.
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
