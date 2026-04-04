# Global Stats — Setup Guide

## Overview

Global stats are powered by a Google Apps Script web app that sits in front of a Google Sheet. The browser POSTs ranking results to the script, the script appends rows to the sheet, and a GET request to the same URL returns aggregated stats.

## Step 1 — Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it something like **RiderRanker Stats**.
3. The Apps Script will create the **Rankings** sheet and its header row automatically on first use.
4. Copy the spreadsheet's ID from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

## Step 2 — Create the Apps Script

1. Inside the spreadsheet, open **Extensions → Apps Script**.
2. Delete the default `myFunction` stub.
3. Paste the entire contents of `apps-script/Code.gs` into the editor.
4. Save the project (Ctrl+S). Name it **RiderRanker**.

## Step 3 — (Optional) Enable Drive file saving

If you want each submission also saved as an individual JSON file in a Drive folder:

1. Create a folder in Google Drive.
2. Copy the folder ID from its URL:
   `https://drive.google.com/drive/folders/`**`THIS_PART`**
3. Paste it into the `DRIVE_FOLDER_ID` constant at the top of `Code.gs`.

## Step 4 — Deploy the Web App

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the gear icon next to **Type** and select **Web app**.
3. Set:
   - **Description**: `RiderRanker v1` (or anything)
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy** and authorise the permissions when prompted.
5. Copy the **Web app URL** — it looks like:
   `https://script.google.com/macros/s/AKfy.../exec`

## Step 5 — Add the URL to the React app

Open `src/config.js` and paste the URL:

```js
export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
```

Rebuild and redeploy the app (`npm run deploy`).

## How it works

| Action | Method | What happens |
|--------|--------|--------------|
| Ranking completed | `POST` (no-cors) | One row per image appended to the Rankings sheet |
| View Global Stats | `GET ?action=stats` | Script aggregates the sheet and returns JSON |

### Why no-cors for POST?

Google Apps Script web apps redirect POST requests from `script.google.com` to `script.googleusercontent.com`. Browsers block cross-origin redirects in normal `cors` mode. Using `no-cors` allows the request to go through — the script still receives and processes it — but the browser discards the response. The app therefore shows an optimistic "Submitted" message rather than waiting for a confirmed reply.

GET requests do not trigger a redirect, so stats are fetched normally and the full response is readable.

## Redeploying after code changes

If you edit `Code.gs`, you must create a **new deployment** (not update the existing one) for the changes to take effect on the live URL. The URL stays the same; only the version increments.
