# Timeline Media Player (Sequential Playback Engine)

## Status
- [x] Not Started
- [ ] In Progress
- [ ] Completed

## User Story
As a **user**,
I want **to press play and automatically move through event media sequentially**,
So that **I can experience the event like a continuous stream or show**.

## Acceptance Criteria
- [ ] Media player displays current item
- [ ] Play / Pause controls available
- [ ] Auto-advance to next item after completion
- [ ] Supports images (auto duration), videos, and text posts
- [ ] Playback respects selected timeline order
- [ ] Live playback waits for new content if chronological mode selected
- [ ] Playback can run continuously without user interaction
- [ ] Playback suitable for passive display (TV/browser window)

## Technical Notes
- Implement queue-based playback model
- Define default duration for static media (e.g., 5–10 seconds)
- Video playback must detect completion event
- Queue must dynamically update when new items are ingested

## Dependencies
- Media rendering layer
- Timeline ordering system
- Live ingestion system

## Priority
- [x] Critical (MVP)
- [ ] High
- [ ] Medium
- [ ] Low

## Estimated Complexity
- [ ] Small (1-2 days)
- [x] Medium (3-5 days)
- [ ] Large (1-2 weeks)
- [ ] X-Large (2+ weeks)

## Implementation Details
To be filled during implementation

## Testing Notes
- Test playback across media types
- Test large queue sizes
- Test memory leaks during long playback sessions
- Test behavior when media fails to load

## Additions
### 2026-02-17 — Requested by: @spacecowboyian
- Align media-player UX to standard web video player behavior: icon controls (play/pause, previous, next), progress bar tied to real media duration, and scrubbing support for video/audio.
- Add keyboard shortcut support so pressing Space toggles play/pause, and keep mute always available with cyan speaker state when unmuted vs gray slashed-speaker state when muted.
- Add arrow-key transport shortcuts (left/right for previous/next) and preserve selected playback mode semantics so click-selected moments can play as single-item while transport-started playback can continue sequentially.
