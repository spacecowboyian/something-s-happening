# User Story Template Validation Tests

This directory contains automated tests to ensure all user stories in the `user-stories/` directory follow the standard template defined in `user-stories/STORY_TEMPLATE.md`.

## What is Tested

The test suite validates that each user story file contains:

1. **A title (H1 heading)** - The story must have a descriptive title
2. **All required sections** - Each story must have these sections:
   - Status
   - User Story
   - Acceptance Criteria
   - Technical Notes
   - Dependencies
   - Priority
   - Estimated Complexity
   - Implementation Details
   - Testing Notes

3. **Proper Status section** - Must include checkboxes for:
   - Not Started
   - In Progress
   - Completed
   - Must have exactly one option selected

4. **Proper User Story format** - Must follow the format:
   - "As a [type of user]..."
   - "I want [goal]..."
   - "So that [benefit/reason]..."

5. **At least one Acceptance Criterion** - Must have at least one checkbox item

6. **Proper Priority section** - Must include checkboxes for:
   - Critical (MVP)
   - High
   - Medium
   - Low
   - Must have exactly one option selected

7. **Proper Estimated Complexity section** - Must include checkboxes for:
   - Small (1-2 days)
   - Medium (3-5 days)
   - Large (1-2 weeks)
   - X-Large (2+ weeks)
   - Must have exactly one option selected

## Running the Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode (automatically re-run when files change):
```bash
npm run test:watch
```

## Test Results

Current status: **All 14 user stories pass validation** ✅

The tests validate 253 individual assertions across all user story files:
- 10-mvp-infrastructure-and-developer-experience/10-001-ci-cd-pipeline-setup.md
- 09-system-administration-and-governance/09-001-system-health-monitoring.md
- 08-privacy-permissions-and-content-lifecycle/08-001-public-content-verification.md
- 07-moderation-and-trust-signals/07-001-content-reporting-moderation.md
- 06-event-discovery-and-navigation/06-001-active-events-discovery.md
- 05-timeline-and-event-presentation/05-001 through 05-005
- 04-public-media-aggregation/04-001-social-media-integration.md
- 03-event-creation-lightweight/03-001-quick-event-creation.md
- 02-event-resolution-and-context-detection/02-001-event-duplicate-detection.md
- 01-user-entry-and-onboarding/01-001-qr-code-event-access.md

## Adding New User Stories

When creating a new user story:
1. Use the template in `user-stories/STORY_TEMPLATE.md`
2. Run `npm test` to validate your story matches the template
3. Fix any validation errors reported by the tests

The tests will automatically discover and validate any new `.md` files in the `user-stories/` directory (excluding README, TEMPLATE, and QUICK_START files).
