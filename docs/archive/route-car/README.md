# Archived: the 2D road, car and intro plate

Removed from the published page for v2.0 (2026-11-16). Kept here, as `.txt` so
nothing compiles or lints them, for the design brainstorm in `docs/book-of-work.md`.

| File | What it was |
|---|---|
| `route-document.tsx.txt` | The 2D road + car: document-anchored SVG, fixed car, arc-length follower with a sideways speed cap, stations, inspector. |
| `route-doc.ts.txt`, `route-doc.test.ts.txt` | Pure geometry for the road, with its 15 tests. |
| `route-stage.tsx.txt` | Picks the 2D road (>= 1280px), the old 3D scene, or the rail. |
| `route-rail.tsx.txt` | The zero-JS rail with an SVG car on a CSS scroll timeline. |
| `route-car.css.txt` | All the CSS for the above (and the removed 3D canvas). |
| `intro-plate.tsx.txt`, `intro-plate.css.txt` | The split-door opening plate. |
| `role-rotator.tsx.txt` | The CSS-only rotating role line (with per-count keyframes). |

To bring one back: copy it to its original path (drop `.txt`), restore the CSS
block, the `data-waypoint` / `data-station` attributes in `app/page.tsx`, and the
`<RouteStage />` mount. The old 3D scene (`route-canvas.tsx`, `three`) was
deleted outright; it is in git history only if it was ever committed.
