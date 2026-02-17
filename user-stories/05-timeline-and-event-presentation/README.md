# Epic 5: Timeline & Event Presentation

## Overview
Displaying aggregated media in a chronological, evidence-first timeline (live vs archived behavior).

## Scope
This epic covers how events and their associated media are displayed:
- Chronological timeline view
- Live updates vs archived state
- Media rendering (images, videos, text)
- Sequential media playback with auto-advance
- Animated text rendering (caption-style display)
- Background image slideshows during text moments
- Source attribution
- Timestamp display
- Responsive design for all devices
- Mobile-specific behaviors (autoplay, portrait mode, collapsible headers)
- Infinite scroll / pagination
- Media preview and full view

## Key User Flows
1. **View Timeline**: User opens event → sees chronological media stream
2. **Live Updates**: Active event → timeline updates in real-time
3. **Archive View**: Past event → static timeline with all content
4. **Media Interaction**: User taps media → full screen view with details
5. **Source Navigation**: User taps source → sees original content

## Technical Considerations
- Real-time data updates (WebSockets or polling)
- Media optimization and lazy loading
- Responsive image/video rendering
- Performance optimization for long timelines
- Accessibility (screen readers, keyboard navigation)
- State management for live vs archived
- Mobile detection and device-specific behavior
- Caption animation and text word-grouping algorithms
- Image preloading and slideshow transitions
- Dynamic duration calculation for text-based moments

## MVP Priority
🔴 Critical - Core user experience of the platform

## Story Naming Convention
Files should be named: `05-[story-number]-[description].md` and placed in the `frontend/` subdirectory.

Example: `frontend/05-001-playable-ai-driven-event-timeline.md`
