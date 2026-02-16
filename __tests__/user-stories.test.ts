import * as fs from 'fs';
import * as path from 'path';
import { globSync } from 'glob';

const USER_STORIES_DIR = path.join(__dirname, '../user-stories');

// Required sections from STORY_TEMPLATE.md
const REQUIRED_SECTIONS = [
  '## Status',
  '## User Story',
  '## Acceptance Criteria',
  '## Technical Notes',
  '## Dependencies',
  '## Priority',
  '## Estimated Complexity',
  '## Implementation Details',
  '## Testing Notes',
];

// Find all user story markdown files, excluding README, TEMPLATE, and QUICK_START
const pattern = path.join(USER_STORIES_DIR, '**/*.md');
const allFiles = globSync(pattern);
const userStoryFiles = allFiles.filter(file => {
  const basename = path.basename(file);
  return !basename.includes('README') && 
         !basename.includes('TEMPLATE') && 
         !basename.includes('QUICK_START');
});

describe('User Story Template Validation', () => {
  test('should find at least one user story file', () => {
    expect(userStoryFiles.length).toBeGreaterThan(0);
  });

  describe.each(userStoryFiles.map(file => [file]))('User Story: %s', (filePath: string) => {
    let content: string;

    beforeAll(() => {
      content = fs.readFileSync(filePath, 'utf-8');
    });

    test('should have a title (H1)', () => {
      const titleMatch = content.match(/^# .+/m);
      expect(titleMatch).not.toBeNull();
      // Title should be meaningful (more than "# " plus at least 3 characters)
      expect(titleMatch![0].length).toBeGreaterThan(5);
    });

    test.each(REQUIRED_SECTIONS)('should have section: %s', (section: string) => {
      expect(content).toContain(section);
    });

    test('should have Status section with checkboxes', () => {
      const statusSection = content.match(/## Status[\s\S]*?(?=##|$)/);
      expect(statusSection).not.toBeNull();
      expect(statusSection![0]).toMatch(/- \[[ x]\] Not Started/);
      expect(statusSection![0]).toMatch(/- \[[ x]\] In Progress/);
      expect(statusSection![0]).toMatch(/- \[[ x]\] Completed/);
    });

    test('should have User Story section with proper format', () => {
      const userStorySection = content.match(/## User Story[\s\S]*?(?=##|$)/);
      expect(userStorySection).not.toBeNull();
      
      // Check for the "As a... I want... So that..." pattern
      const storyText = userStorySection![0];
      expect(storyText).toMatch(/As a/i);
      expect(storyText).toMatch(/I want/i);
      expect(storyText).toMatch(/So that/i);
    });

    test('should have at least one Acceptance Criterion', () => {
      const criteriaSection = content.match(/## Acceptance Criteria[\s\S]*?(?=##|$)/);
      expect(criteriaSection).not.toBeNull();
      
      // Check for at least one checkbox item
      const checkboxes = criteriaSection![0].match(/- \[ \]/g);
      expect(checkboxes).not.toBeNull();
      expect(checkboxes!.length).toBeGreaterThanOrEqual(1);
    });

    test('should have Priority section with checkboxes', () => {
      const prioritySection = content.match(/## Priority[\s\S]*?(?=##|$)/);
      expect(prioritySection).not.toBeNull();
      
      const priorityText = prioritySection![0];
      expect(priorityText).toMatch(/- \[[ x]\] Critical \(MVP\)/);
      expect(priorityText).toMatch(/- \[[ x]\] High/);
      expect(priorityText).toMatch(/- \[[ x]\] Medium/);
      expect(priorityText).toMatch(/- \[[ x]\] Low/);
    });

    test('should have Estimated Complexity section with checkboxes', () => {
      const complexitySection = content.match(/## Estimated Complexity[\s\S]*?(?=##|$)/);
      expect(complexitySection).not.toBeNull();
      
      const complexityText = complexitySection![0];
      expect(complexityText).toMatch(/- \[[ x]\] Small \(1-2 days\)/);
      expect(complexityText).toMatch(/- \[[ x]\] Medium \(3-5 days\)/);
      expect(complexityText).toMatch(/- \[[ x]\] Large \(1-2 weeks\)/);
      expect(complexityText).toMatch(/- \[[ x]\] X-Large \(2\+ weeks\)/);
    });

    test('should have exactly one Priority option selected', () => {
      const prioritySection = content.match(/## Priority[\s\S]*?(?=##|$)/);
      expect(prioritySection).not.toBeNull();
      
      const checkedBoxes = prioritySection![0].match(/- \[x\]/g);
      expect(checkedBoxes).not.toBeNull();
      expect(checkedBoxes!.length).toBe(1);
    });

    test('should have exactly one Estimated Complexity option selected', () => {
      const complexitySection = content.match(/## Estimated Complexity[\s\S]*?(?=##|$)/);
      expect(complexitySection).not.toBeNull();
      
      const checkedBoxes = complexitySection![0].match(/- \[x\]/g);
      expect(checkedBoxes).not.toBeNull();
      expect(checkedBoxes!.length).toBe(1);
    });

    test('should have exactly one Status option selected', () => {
      const statusSection = content.match(/## Status[\s\S]*?(?=##|$)/);
      expect(statusSection).not.toBeNull();
      
      const checkedBoxes = statusSection![0].match(/- \[x\]/g);
      expect(checkedBoxes).not.toBeNull();
      expect(checkedBoxes!.length).toBe(1);
    });
  });
});
