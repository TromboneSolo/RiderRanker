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

## About Kamen Rider

### A Brief History of the Franchise

Kamen Rider began in 1971, created by manga artist Shotaro Ishinomori and produced by Toei Company. The original series followed Takeshi Hongo, a motorcycle-riding man rebuilt as a cyborg by the evil organization Shocker — who then turned against his creators to fight for humanity. The show was a sensation in Japan, combining motorcycle action, transformation sequences, and a monster-of-the-week format that would define the *tokusatsu* ("special effects") genre for decades.

The original **Showa era** (1971–1989) produced thirteen series and cemented Kamen Rider as a cultural institution in Japan. Iconic entries include *Kamen Rider V3*, *Kamen Rider Amazon*, and *Kamen Rider Black*, each introducing new riders, new villains, and increasingly elaborate suit designs and stunts.

After a decade-long hiatus, Toei relaunched the franchise in 2000 with *Kamen Rider Kuuga*, kicking off the **Heisei era** (2000–2019). This era reimagined the formula almost entirely with each new series — shifting from simple good-vs-evil plots to serialized storytelling, morally complex characters, and thematic depth that attracted adult audiences alongside children. Standout Heisei entries include:

- **Kuuga** (2000) — grounded horror tone, the reboot that proved the franchise still had legs
- **Agito** (2001) — a direct spiritual successor to Kuuga with a mystery-thriller structure
- **Ryuki** (2002) — thirteen Riders fighting each other in a death game, years before *Battle Royale* was mainstream
- **Faiz** (2003) — existential questions about humanity wrapped in a dark, stylish aesthetic
- **Blade** (2004) — card-based powers and an emotionally devastating finale

Four of those five are the demo images in this app, which is not a coincidence.

The current **Reiwa era** (2019–present) began with *Kamen Rider Zero-One* and continues to push the franchise forward with new themes, production techniques, and multimedia tie-ins. Over fifty years after its debut, new Kamen Rider series still air weekly in Japan.

### Why It Never Broke Through in America — and Why It Still Could

Toei made two serious attempts to crack the American market. In 1995, Saban Entertainment (fresh off localizing *Super Sentai* into *Power Rangers*) produced *Masked Rider*, a heavily Americanized adaptation of *Kamen Rider Black RX*. It lasted one season. In 2009, *Kamen Rider Dragon Knight* — a faithful adaptation of *Ryuki* — aired on The CW4Kids, won a Daytime Emmy, and was cancelled before its final episodes aired on television. The American appetite for the material was clearly there; the timing and platform were not.

The honest obstacle since then has been Marvel. From 2008 onward, the Marvel Cinematic Universe rewired what American audiences expect from superhero media: interconnected narratives, movie-scale production values, and characters backed by fifty years of existing cultural familiarity. Kamen Rider, despite being older and in many ways more ambitious in its per-series storytelling, arrives to American audiences with no inherited name recognition and no studio willing to spend MCU money introducing it.

If Marvel hadn't monopolized the superhero conversation — or if the MCU bubble deflates — Kamen Rider is almost perfectly positioned to fill the gap. The Heisei-era formula of a self-contained one-season story with a strong emotional arc, a visually distinctive hero, and genuine thematic weight is exactly what prestige television is supposed to do. It just needs a platform, a dub, and one breakout season. It has fifty-plus years of source material to choose from.

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
