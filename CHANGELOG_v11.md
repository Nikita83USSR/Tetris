# Cyber Tetris v11 — Mobile Performance

## What changed
- Cached pre-rendered glossy block variants and ghost cell to reduce per-cell gradient, clip, and shadow work.
- Cached static cinematic backplate, starfield, ship silhouettes and particle glow sprites.
- Reduced high-DPI backing-store cost on mobile while preserving desktop rendering density.
- Decoupled mobile background rendering from gameplay rendering so the board/effects remain on native RAF.
- Removed per-frame DOM class churn and repaint-heavy animated border/filter effects on touch devices.

## What did not change
- Gameplay rules, T-Spin / Back-to-Back / Perfect Clear, line-clear sequence, Game Over destruction, music, sound files, leaderboard hooks and daily challenges.
