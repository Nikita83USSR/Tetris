# Cyber Tetris — TEST build: adaptive touch stabilization

**Status:** Experimental test release (2026-11-20). Not considered a stable release.

## Change
The mobile horizontal slider now temporarily buffers tiny opposite-direction movements (up to a 3.2 px threshold) while a movement direction is established. Once a reversal crosses the threshold, it is applied promptly. This is intended to reduce unintended micro-reversals without smoothing all input or adding a general movement delay.

## Backup
Pre-test source: `backups/game-before-adaptive-touch-stabilization-test-2026-11-20.html`

## Test focus
- Is normal, confident movement as responsive as before?
- Does accidental tiny finger jitter cause fewer unintended cell changes?
- Does a deliberate direction reversal remain responsive?
- Does it avoid delayed movement after finger-up or wall contact?

## Scope
Only mobile slider movement interpretation was changed. Rendering, background, frame rate, game rules, and desktop controls were not intentionally changed.

## Limitations
This commit was verified in the GitHub source only. No physical-device or browser testing has been performed yet.
