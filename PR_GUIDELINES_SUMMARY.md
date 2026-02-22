# PR Title and Description Guidelines - Implementation Summary

## What Was Requested

The user requested adding instructions to ensure that:
- PR titles and descriptions should NOT be changed to match only the last thing that was done
- Both PR title and description should serve to summarize ALL changes in the branch

## What Was Implemented

Added a comprehensive new section to `.github/copilot-instructions.md` titled **"PR Title and Description Management"** that includes:

### Key Guidelines

1. **DO NOT** change the PR title and description to match only the last commit or change
2. **DO** ensure both serve to summarize ALL changes in the branch
3. **DO** update descriptions to add new items while maintaining overall context
4. **DO** keep PR titles broad enough to encompass all work

### PR Title Guidelines

- Describes the overall goal/theme of the branch
- Not just the most recent change
- Includes examples of good (comprehensive) vs bad (too specific) titles

### PR Description Guidelines

- Maintains a checklist of all major changes/features
- Add new items as work progresses
- Keep completed items marked
- Provide summary describing full scope
- Include context about why changes were made

### When to Update vs Preserve

Clear guidance on:
- **Update:** New checklist items, mark completions, add details
- **Preserve:** Overall PR title, main summary, completed work items
- **Never:** Replace entire description with only latest change

## Examples Included

The documentation includes:
- ✅ Good examples showing comprehensive PR titles and descriptions
- ❌ Bad examples showing titles/descriptions that only reflect the last change

## Location

File: `.github/copilot-instructions.md`
Section: Added after "User Story Update Requirement" section (line 75-138)

## Commit

```
fdbdc46 docs(copilot): add PR title and description management guidelines
```

This follows the conventional commits format and is now part of the branch.
