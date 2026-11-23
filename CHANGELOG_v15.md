# v15 — cinematic boot, holographic rewards, living energy bezel

- `index.html` is now a very lightweight first-paint splash. It loads `game.html` inside a fullscreen-capable iframe, while the public GitHub Pages URL remains unchanged. The splash receives boot milestones through same-origin `postMessage`, shows progress, and reveals the game only after the iframe load event.
- `game.html` contains the complete game and remains a single-page game document. All relative `assets/` and `backend/` paths remain intact.
- Added volumetric holographic reward cards for four-line clears, T-Spin, Back-to-Back, Perfect Clear, challenges, level-up and Overdrive. The highest-priority simultaneous reward takes precedence to avoid stacking multiple cards.
- Upgraded the arena bezel with continuous flowing energy, level-scaled orbit speed, and short event-specific surges for four-line clears, Perfect Clear, Overdrive and danger.
- Music tracks were re-mastered with subtle low-end/presence EQ and peak limiting, re-encoded at 44.1 kHz / 192 kbps MP3 and Vorbis q6 OGG, and prepared with BPM-aligned 2-bar loop crossfades. Separate loop-only MP3s provide a seamless HTMLAudio fallback.
- SFX now use `preload=none`; the first music file is warmed after the game load event, so audio does not delay the splash.


## v15.1 — splash readiness hardening

- Registered image load/error handlers before assigning `src`, preventing cached assets from racing the handlers.
- The splash no longer treats the iframe document `load` event as proof that all game-created image assets are ready.
- `game.html` sends the final readiness milestone only after the first game frame has been drawn and both the background scene and effects atlas have either loaded or reached their fallback state.
- Audio remains intentionally lazy and does not block the first playable screen.
