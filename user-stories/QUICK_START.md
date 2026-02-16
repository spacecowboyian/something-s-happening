# Quick Start Guide for User Stories

## Overview
This guide helps you quickly understand and use the user stories structure for "Something's Happening".

## Structure at a Glance

```
user-stories/
├── README.md                  # Main documentation (you should read this!)
├── STORY_TEMPLATE.md          # Template for creating new stories
│
├── 01-user-entry-and-onboarding/
├── 02-event-resolution-and-context-detection/
├── 03-event-creation-lightweight/
├── 04-public-media-aggregation/
├── 05-timeline-and-event-presentation/
├── 06-event-discovery-and-navigation/
├── 07-moderation-and-trust-signals/
├── 08-privacy-permissions-and-content-lifecycle/
├── 09-system-administration-and-governance/
└── 10-mvp-infrastructure-and-developer-experience/
```

Each epic directory contains:
- `README.md` - Epic overview, scope, and guidelines
- `[epic-number]-[story-number]-[description].md` - Individual user stories

## How to Work with GitHub Copilot

### Creating a New User Story

1. **Decide which epic** the story belongs to
2. **Navigate** to that epic's directory
3. **Copy** the `STORY_TEMPLATE.md` to the epic directory
4. **Rename** following the pattern: `[epic-number]-[story-number]-[description].md`
   - Example: `01-002-shared-link-handling.md`
5. **Fill in** all sections of the template
6. **Commit** the file to the repository

### Working on a Story with Copilot

**Example prompt:**
```
I want to work on user story user-stories/03-event-creation-lightweight/03-001-quick-event-creation.md

Please read the story and:
1. Review the acceptance criteria
2. Propose an implementation approach
3. Create the necessary components
4. Update the story file with implementation details
```

### Batch Story Creation

To create multiple related stories at once:

```
I want to create 3 user stories for Epic 1 (User Entry & Onboarding):
1. Shared link handling
2. URL parameter parsing
3. First-time user welcome screen

Please create these stories in user-stories/01-user-entry-and-onboarding/ 
following the naming convention and template format.
```

## MVP Priority Stories

Focus on these epics first for MVP:
- ✅ **Epic 1**: User Entry & Onboarding
- ✅ **Epic 3**: Event Creation (Lightweight)
- ✅ **Epic 5**: Timeline & Event Presentation
- ✅ **Epic 10**: MVP Infrastructure & Developer Experience

## Story Naming Convention

Format: `[epic-number]-[story-number]-[short-description].md`

Examples:
- `01-001-qr-code-event-access.md`
- `03-001-quick-event-creation.md`
- `05-001-chronological-timeline-view.md`
- `10-001-ci-cd-pipeline-setup.md`

**Tips:**
- Use lowercase with hyphens for descriptions
- Keep descriptions short but descriptive
- Number sequentially within each epic (001, 002, 003...)

## Example Stories

We've created example stories in 4 epics to show the format:
1. `user-stories/01-user-entry-and-onboarding/01-001-qr-code-event-access.md`
2. `user-stories/03-event-creation-lightweight/03-001-quick-event-creation.md`
3. `user-stories/05-timeline-and-event-presentation/05-001-chronological-timeline-view.md`
4. `user-stories/10-mvp-infrastructure-and-developer-experience/10-001-ci-cd-pipeline-setup.md`

Read these to understand the expected format and level of detail.

## Status Tracking

Each story has checkboxes for:
- **Status**: Not Started → In Progress → Completed
- **Acceptance Criteria**: Individual items to check off
- **Priority**: Critical, High, Medium, Low
- **Complexity**: Small, Medium, Large, X-Large

Update these as you work on stories.

## Tips for Success

1. **Keep stories atomic** - One feature or capability per story
2. **Link dependencies** - Reference related stories
3. **Update regularly** - Check off criteria as you complete them
4. **Be specific** - Clear acceptance criteria lead to better implementations
5. **Use examples** - Include examples in stories when helpful

## Common Copilot Prompts

**Review a story:**
```
Review the user story at user-stories/[epic]/[story].md and 
suggest any improvements or missing acceptance criteria.
```

**Implement a story:**
```
Implement the user story at user-stories/[epic]/[story].md.
Update the story file with implementation details when done.
```

**Check story status:**
```
Show me all completed stories in epic [number]
```

**Find related stories:**
```
Find all stories related to [topic/feature]
```

## Need Help?

- Read `user-stories/README.md` for full documentation
- Check epic-specific README files for context
- Review example stories for format guidance
- Use the STORY_TEMPLATE.md as a starting point
