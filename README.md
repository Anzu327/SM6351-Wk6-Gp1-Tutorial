# SM6351 Wk6 Gp1 Tutorial

An interactive D3 code walkthrough and live-edit lab for the Global Economy by GDP hierarchy. The source [Gist](https://gist.github.com/Kcnarf/fa95aa7b076f537c00aed614c29bb568) shows a Voronoi treemap; this project implements a **collapsible node-link tree** from its JSON. The GDP shares are a **January 2017 historical snapshot**, not current figures.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. To prepare an offline classroom build:

```bash
npm run build
npm run preview
```

The built `dist/` uses local assets, including the copied D3 bundle; after the build is created, the classroom page does not fetch a CDN. You can copy `dist/` to the presentation computer and serve it without Node:

```bash
cd dist
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Opening `index.html` directly with `file://` is not supported.

## Classroom link

Open the [SM6351 Wk6 Gp1 Tutorial](https://anzu327.github.io/sm6351/).

The public GitHub Pages site is built from `main` by [the deployment workflow](.github/workflows/deploy.yml). Every student can edit and run `collapsibleTree.js` in their own browser. Their draft is stored locally in that browser and is not sent to GitHub or shared with other students. **Export .js** saves just their edited script; **Download project ZIP** saves a complete offline project containing their edits. Students should download before clearing browser storage or switching devices.

To publish later changes, push to `main` and wait for the **Deploy classroom lab** GitHub Action to finish. The Vite build uses relative asset paths so the site works at a repository subpath.

## Files

- `Visualizations/collapsibleTree.js`: the independent D3 visualization source and the editor's initial code. It expects `d3`, `data`, and `container` to be supplied by a host page; the lab's isolated preview runner supplies them.
- `data/globalEconomyByGDP.json`: dataset transcribed from the linked Gist. Original names and values are retained, including source spellings. The chart displays entries as countries and regions, including “Hong Kong SAR, China”.
- `src/main.js`, `src/styles.css`: teaching page, editor, exercise controls, and design.
- `student-project/project/index.html`, `student-project/project/styles.css`: the standalone HTML and CSS shown read-only in the student file list and placed in the ZIP download.
- `PRESENTATION_NOTES.md`: local presenter-only outline, excluded from the public repository.

The file list shows the three main project files under `project/` and the GDP JSON under `data/`. Only `collapsibleTree.js` is editable. The editor saves its draft only in the current browser's local storage. **Export .js** downloads the edited script; **Download project ZIP** includes that script, the displayed standalone HTML/CSS, the source JSON, an offline data loader generated from the JSON, and a local D3 bundle. Unzip it and open `project/index.html` directly, even offline. Neither download overwrites `Visualizations/collapsibleTree.js`. Reset clears the draft. Each answer button unlocks only after its task region was manually changed and Run was pressed.

The editor's left rail can collapse the file explorer or focus on code by hiding the preview. After locating code from a walkthrough or task button, use **Back to where I was** at the top of the workspace to return to the original button. The hint above the preview points students to the clickable regional group circles. Groups start with the different colors stored in the data; Task 1 changes them to one shared blue. Task 2 adds one layout line to double the vertical gap between nodes.

To run browser checks, start `npm run dev` in one terminal and then `npm test` in another. The check captures a temporary workspace screenshot at `/private/tmp/group5-lab-workspace.png`.

## Source and attribution

Data: [Kcnarf, “d3-voronoi-treemap usage”](https://gist.github.com/Kcnarf/fa95aa7b076f537c00aed614c29bb568), citing HowMuch.net's “The Global Economy by GDP” (January 2017). The Gist displays an LGPL-3.0 license marker. This project's D3 tree implementation is original to this lab.
