# RiderRanker

A React application that lets users rank a collection of images through head-to-head pairwise battles, then save the final ordered list.

## Purpose

Ranking a large set of images by direct comparison is more intuitive than assigning numerical scores. RiderRanker presents every possible pair of images one at a time and asks the user to pick a winner (or declare a tie). Once all battles are resolved, the images are sorted by accumulated score and the full ranked list can be exported.

## Scope

- **Image input** — users upload any number of local image files via drag-and-drop or a file picker. A built-in demo set of five Kamen Rider characters is also available for quick testing.
- **Battle phase** — every unique pair of images is compared exactly once (N × (N−1) / 2 total battles). Battles are shuffled so adjacent images are not always matched first. A progress bar tracks completion. Users can end early and rank with only the battles completed so far.
- **Scoring** — a win awards 1 point to the chosen image; a tie awards 0.5 points to each. Images that were never compared (due to an early finish) receive 0 points.
- **Results** — images are displayed in descending score order. The top three positions are highlighted with gold, silver, and bronze accents.
- **Export** — the ranked list can be saved as a **JSON** file (includes rank, name, score, and base64-encoded image data) or as a **CSV** file (rank, name, score).

## Project Structure

```
riderranker/
└── src/
    ├── App.js                        # Root component; mounts MainLayout
    ├── App.css                       # Global dark-theme styles
    ├── assets/images/                # Built-in demo images (Kamen Rider)
    ├── layouts/
    │   └── MainLayout.jsx            # Top-level state machine (upload → battling → results)
    └── components/
        ├── ImageUpload.jsx           # Upload screen with drag-and-drop and demo option
        ├── ImageBattle.jsx           # Head-to-head battle UI with progress bar
        └── RankingResults.jsx        # Ranked list display with JSON/CSV export
```

## Running the App

```bash
cd riderranker
npm install
npm start
```

> **Note:** The project uses Create React App 3 with webpack 4, which is incompatible with Node 17+. The `start` and `build` scripts include `NODE_OPTIONS=--openssl-legacy-provider` to work around this. No action is needed beyond running `npm start`.

## Scoring Algorithm

The ranking uses a simple points tally:

| Outcome       | Winner  | Loser   |
|---------------|---------|---------|
| One wins      | +1 pt   | +0 pts  |
| Tie / skipped | +0.5 pt | +0.5 pt |

Images with equal scores retain a stable relative order (the order they were uploaded).
