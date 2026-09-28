# Glup and the Munchy Bug

A silent, nine-scene interactive story. The library card is appended below the three grades by `app.js`. Opening a story pauses the existing music and voice; leaving restores the user's existing music preference.

- `munchy-bug.js`: scene titles, narrative, success messages, tasks and items. Each scene has `audioIntro` and `audioSuccess` set to `null`. No story narration or audio playback is implemented yet.
- `art.js`: original, editable SVG placeholder illustrations for Bug, food, egg, cocoon and butterfly. The existing Glup artwork is reused unchanged from `assets/playroom-atlas.png`.
- `player.js`: book rendering, tap interactions, page completion, previous/next navigation, replay and home. Previous pages preserve their completion during the current story; restarting or reopening resets the story.
- `story.css`: library card, book spread, garden illustration and responsive styles.

Food interactions use taps/clicks, not dragging. Each food can only count once. Next is absent until every required interaction on the page is completed. Page 9 reveals replay and home. Buttons support keyboard interaction, have accessible names, and use reduced motion preferences. The future Listen button is hidden and disabled.

To edit the story, change scene content or item lists in `munchy-bug.js`. Artwork can be replaced in `art.js` without changing the interaction buttons. Audio paths are placeholders only; filling them later requires connecting real recordings to a narration control.

Verified locally: all nine scenes, counts 1–5, leaf selection, three stars, butterfly reveal, previous-page progress, replay reset, home navigation, silent story mode, and 390px/320px mobile layout.

## Second book: Glup and the Little Seed

`little-seed.js` contains the nine scene records, future audio placeholders and a small visual adapter. `seed-art.js` contains the seed, pot, growing plant, watering can, rain, colored flowers and garden visitors. `player.js` registers both books and shares progress, next/previous, replay and home logic between them. Library buttons select a book by `data-story`.

Planting supports pointer dragging (mouse or touch) into a forgiving pot target, plus a tap/keyboard alternative. Other seed tasks use taps. A missed drop returns the seed without completing the page. The first book's data and artwork remain unchanged.

Verified: both full nine-page story flows; seed drag into the pot; tap planting at 320px; next-page gates; separate book selection; first story's butterfly ending; no horizontal overflow on mobile. Audio remains unimplemented for both books.

## Read-Along Stories: Glup and the Moonlight Wish

The home library now separates the two interactive books under **Play-Along Stories** from narrated picture books under **Read-Along Stories**. `moonlight.js` defines the nine scenes, non-interactive illustration adapter and a separate read-along controller. Each record has `audioNarration: null`; no synthetic voice or final recording is added. When a recording path is supplied, the narration button can replay it; page changes and exit stop it.

Read-along pages have no task state, targets, counters or completion gates. Next and Back turn pages freely; the ending offers Read Again and Back to Stories. Returning focuses the corresponding library section. `moonlight.css` supplies moonlight, forest, lake, hill, firefly and star movements with a reduced-motion fallback. Glup uses the existing atlas unchanged.

Verified: all nine pages on desktop and at 320px, back, restart, return to the right shelf, disabled narration placeholders, no horizontal overflow, silent story audio, and both existing book entry points plus Munchy Bug's first interaction gate.
