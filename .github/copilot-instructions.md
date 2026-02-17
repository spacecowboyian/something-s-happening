# Copilot Instructions

## Validation Workflow

- For any UI/UX change, verify behavior in the browser in addition to linting/tests.
- Start the app with `npm run dev` and validate the affected route(s) manually.
- Confirm key interactions, layout behavior, and responsive behavior for the changed feature.
- Include a short note in handoff describing what was browser-verified.

## User Story Update Requirement

- Whenever a commit includes design changes, update the relevant user story with an entry describing what design changed.
- The update should describe how the design shifted during the work; reasoning is not required.
- Keep each design update concise so there is a clear historical record of design evolution over time.

## Tooltip & Style Reuse

- Prefer React Aria tooltip primitives (`TooltipTrigger`, `Tooltip`) over custom CSS-only tooltip behavior.
- Prefer reusable shared styles/components (e.g., in `/src/components`) instead of one-off styles scoped to a single app feature component when the pattern is generic.
