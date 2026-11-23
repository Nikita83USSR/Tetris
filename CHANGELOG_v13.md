# Synth Block v13 — Danger State & Mobile Joystick

- Added a stack-height danger state with a rising meter, red solar tint, chassis warning glow, critical heartbeat and a low warning pulse.
- Added event-focused camera punches for hard drops, line clears, Perfect Clear and critical danger. The camera motion uses a smooth envelope and stays subtle during normal play.
- Added an optional floating joystick control mode alongside the existing horizontal slider.
- Floating joystick mapping: up rotates, left/right move one cell with controlled DAS repeat, down holds soft drop, and a center tap performs hard drop.
- Added persistent mobile control preferences: slider/joystick mode, sensitivity and best-effort vibration feedback where supported by the browser/device.
- Added settings access from the gear button. Opening settings during a live game pauses it; closing settings resumes the game.
- Kept manual fullscreen only; the game does not request fullscreen automatically.
- Fixed the danger panel visibility at critical state and compacted its label for narrow mobile HUD columns.
- Fixed mobile danger-card opacity during the critical heartbeat animation; compact labels and percentage now fit narrow HUD columns.
- Settings overlay hides the touch controls behind it until settings are closed.
