# RiderRanker

A React application that lets users rank a collection of images through head-to-head comparisons, then save the final ordered list.

## Purpose

Ranking a large set of images by direct comparison is more intuitive than assigning numerical scores. RiderRanker presents pairs of images one at a time and asks the user to pick a preference (or declare a tie). A merge-sort algorithm drives the sequence of comparisons, producing a complete ranked list in far fewer steps than exhaustive pairwise matching would require.

## Scope

- **Image input** — users upload any number of local image files via drag-and-drop or a file picker. Two built-in demo sets are available for quick testing: five Kamen Rider characters (PNG) and five Unit Fighters (SVG).
- **Comparison phase** — comparisons are driven by a bottom-up merge sort, requiring only ~N×log₂(N) comparisons rather than the N×(N−1)/2 needed for full exhaustive ranking. The upload screen shows both numbers so the user can see the difference. A progress bar and pass counter track completion. Users can finish early and receive a partial ranking based on comparisons completed so far.
- **Results** — images are displayed in the order produced by the sort. The top three positions are highlighted with gold, silver, and bronze accents. If the user finished early, the results are labelled "Partial Rankings" with an explanatory note.
- **Export** — the ranked list can be saved as a **JSON** file (rank, name, base64-encoded image data) or as a **CSV** file (rank, name).

## Project Structure

```
RiderRanker/
├── README.md
└── riderranker/
    └── src/
        ├── App.js                          # Root component; mounts MainLayout
        ├── App.css                         # Global dark-theme styles
        ├── assets/images/
        │   ├── AGITO.png                   # Demo set 1: Kamen Rider characters
        │   ├── BLADE.png
        │   ├── FAIZ.png
        │   ├── KUUGA.png
        │   ├── RYUKI.png
        │   └── set2/                       # Demo set 2: Unit Fighters (SVG)
        │       ├── ZERO.svg
        │       ├── PHANTOM.svg
        │       ├── TITAN.svg
        │       ├── NOVA.svg
        │       └── SPECTER.svg
        ├── layouts/
        │   └── MainLayout.jsx              # Top-level state machine (upload → battling → results)
        └── components/
            ├── ImageUpload.jsx             # Upload screen with drag-and-drop and demo buttons
            ├── ImageBattle.jsx             # Head-to-head comparison UI with progress display
            └── RankingResults.jsx          # Ranked list display with JSON/CSV export
```

## Running the App

```bash
cd riderranker
npm install
npm start
```

> **Note:** The project uses Create React App 3 with webpack 4, which is incompatible with Node 17+. The `start` and `build` scripts include `NODE_OPTIONS=--openssl-legacy-provider` to work around this. No action is needed beyond running `npm start`.

## Ranking Algorithm

Comparisons are driven by a **bottom-up merge sort**. The images are shuffled, then split into individual sorted runs. Each pass merges adjacent runs by asking the user to compare the front item of each run; their choice determines which item is placed next in the merged result. Ties advance both items simultaneously.

This continues until all runs have merged into one, giving a complete total ordering.

| Images | Exhaustive battles | Merge sort (est. upper bound) |
|--------|-------------------|-------------------------------|
| 10     | 45                | ~40                           |
| 50     | 1,225             | ~300                          |
| 100    | 4,950             | ~700                          |
| 500    | 124,750           | ~4,500                        |

If the user finishes early, a best-effort partial ranking is constructed from whichever sorted runs have been completed.
