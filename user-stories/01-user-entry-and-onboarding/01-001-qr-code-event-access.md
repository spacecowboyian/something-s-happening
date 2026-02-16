# QR Code Event Access

## Status
- [x] Not Started
- [ ] In Progress
- [ ] Completed

## User Story
As a **user scanning a QR code at a physical location**,
I want **to be instantly taken to the relevant event**,
So that **I can quickly see what's happening and contribute content**.

## Acceptance Criteria
- [ ] QR code scans redirect to correct event page
- [ ] Works on both iOS and Android devices
- [ ] Handles invalid or expired QR codes gracefully
- [ ] Loading state shown during redirect
- [ ] Deep linking works even if app not installed (web fallback)
- [ ] Analytics track QR code source for each scan

## Technical Notes
- Use standard QR code format with deep link URL structure
- URL pattern: `somethingshappening.app/e/{event-id}?source=qr&location={location-code}`
- Handle app vs web routing appropriately
- Consider universal links (iOS) and App Links (Android)
- QR codes should be generated server-side with unique tracking codes

## Dependencies
- Event detail page must exist (Epic 5)
- Deep linking infrastructure (Epic 10)

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
- Test with multiple QR code readers
- Test on various devices and OS versions
- Test network failure scenarios
- Test with expired event links
