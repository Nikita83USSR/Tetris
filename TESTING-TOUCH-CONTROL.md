# Cyber Tetris — TEST build: horizontal touch diagnostics

**Status:** Experimental test release (2026-11-20). Not a stable release.

## Branch and backup

Test branch: `test/horizontal-touch-diagnostics-2026-11-20`

Backup of the exact source before this test:
`backups/game-before-horizontal-touch-diagnostics-2026-11-20.html`

The previous adaptive reversal-threshold experiment remains unchanged in this branch. The normal `main` branch is not modified.

## Changes in this test

- Apply the final horizontal coordinate from `pointerup` when it differs from the last `pointermove`. Do not apply a final coordinate on `pointercancel`.
- Keep the same left/right movement threshold and reversal-buffer behavior; no direction-specific acceleration or sensitivity was introduced.
- Add opt-in local diagnostics, enabled only by opening the game with `?touchdiag=1`.
- Record event timestamps, received-at times, coordinates, deltas, coalesced sample counts, accumulator/reversal state, movement direction and whether `playerMove()` succeeded.
- Keep a bounded log (maximum 1,200 entries) in local browser storage. No diagnostic data is sent over the network.
- Add a small **COPY TOUCH LOG** button only in diagnostic mode. Tap it after testing and paste the copied JSON log into the issue/chat.
- When diagnostics are disabled, the per-sample logging and timing work is skipped to avoid adding overhead to normal gameplay.

## Test procedure

1. Open the test branch's GitHub Pages deployment with `?touchdiag=1` appended to the URL.
2. Use the **slider** control mode, not the floating joystick.
3. On a clear part of the board, make several separate left-only and right-only drags of similar physical length.
4. Repeat with deliberate right-to-left and left-to-right reversals.
5. Include a few quick drags where the finger is released while still moving.
6. Tap **COPY TOUCH LOG** and send the resulting JSON.

Please test both directions from neutral and after reversal. Avoid changing sensitivity between the paired tests.

## Scope

Only horizontal slider input is changed or instrumented. Vertical gestures, rotation, drop, joystick behavior, game physics, rendering and frame scheduling are not intentionally changed.

## What this test can establish

The log can show whether perceived directional differences come from:
- unequal physical finger trajectories;
- different event timing or coalesced sample delivery;
- reversal-buffer state;
- lost final movement before release;
- blocked moves caused by collision.

## Limitations

Source-level changes and backup are committed. No physical-device or browser test has been performed by the developer. The test result depends on testing the deployed branch on the target phone/browser.
