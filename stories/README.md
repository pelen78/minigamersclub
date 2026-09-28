# Glup and the Munchy Bug

A silent, nine-scene interactive story. The library card is appended below the three grades by `app.js`. Opening a story pauses the existing music and voice; leaving restores the user's existing music preference.

- `munchy-bug.js`: scene titles, narrative, success messages, tasks and items. Each scene has `audioIntro` and `audioSuccess` set to `null`. No story narration or audio playback is implemented yet.
- `art.js`: original, editable SVG placeholder illustrations for Bug, food, egg, cocoon and butterfly. The existing Glup artwork is reused unchanged from `assets/playroom-atlas.png`.
- `player.js`: book rendering, tap interactions, page completion, previous/next navigation, replay and home. Previous pages preserve their completion during the current story; restarting or reopening resets the story.
- `story.css`: library card, book spread, garden illustration and responsive styles.

Food interactions use taps/clicks, not dragging. Each food can only count once. Next is absent until every required interaction on the page is completed. Page 9 reveals replay and home. Buttons support keyboard interaction, have accessible names, and use reduced motion preferences. The future Listen button is hidden and disabled.

To edit the story, change scene content or item lists in `munchy-bug.js`. Artwork can be replaced in `art.js` without changing the interaction buttons. Audio paths are placeholders only; filling them later requires connecting real recordings to a narration control.

Verified locally: all nine scenes, counts 1–5, leaf selection, three stars, butterfly reveal, previous-page progress, replay reset, home navigation, silent story mode, and 390px/320px mobile layout.
