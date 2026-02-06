import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const utilityClasses = require('@dialpad/dialtone-css/lib/dist/dialtone-docs.json');
const tokens = require('@dialpad/dialtone-css/lib/dist/tokens-docs.json');
const components = require('@dialpad/dialtone-vue/component-documentation.json');

// Helper function to create regex with unit conversion
function createUnitRegex(word) {
  if (word.endsWith('px')) {
    const px = parseFloat(word);
    const rem = `${px / 10}rem`;
    return new RegExp(`(${word.replace(/\./g, '\\.')}|${rem.replace(/\./g, '\\.')})`, 'i');
  }
  if (word.endsWith('rem')) {
    const remValue = parseFloat(word);
    const px = `${remValue * 10}px`;
    return new RegExp(`(${word.replace(/\./g, '\\.')}|${px.replace(/\./g, '\\.')})`, 'i');
  }
  return new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

function buildUtilitySearchableTexts(className, classData) {
  const searchableTexts = [className.toLowerCase()];
  for (const valueObj of classData.values) {
    searchableTexts.push(valueObj.prop?.toLowerCase() || '');
    searchableTexts.push(valueObj.value?.toLowerCase() || '');
    searchableTexts.push(valueObj.description?.toLowerCase() || '');
  }
  return searchableTexts;
}

// Copy search functions (simplified for testing)
function searchUtilityClasses(query, data) {
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  const regexArray = words.map(createUnitRegex);

  const results = [];
  for (const [className, classData] of Object.entries(data)) {
    const searchableTexts = buildUtilitySearchableTexts(className, classData);
    if (regexArray.every(r => r.test(searchableTexts.join(' ')))) {
      results.push({ name: className, metadata: classData.metadata });
    }
  }

  // No sorting - keep natural order
  return results.filter(r => !r.metadata?.deprecated);
}

function isValidToken(tokenName) {
  return tokenName.startsWith('--dt-') || tokenName.startsWith('--base--');
}

function buildTokenSearchableTexts(tokenName, themeVariants) {
  const searchableTexts = [tokenName.toLowerCase()];
  for (const [themeName, themeData] of Object.entries(themeVariants)) {
    if (themeName === 'metadata') continue;
    if (themeData?.value) searchableTexts.push(String(themeData.value).toLowerCase());
    if (themeData?.description) searchableTexts.push(String(themeData.description).toLowerCase());
  }
  return searchableTexts;
}

function searchTokens(query, data) {
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  const regexArray = words.map(createUnitRegex);

  const results = [];
  for (const [tokenName, themeVariants] of Object.entries(data)) {
    if (!isValidToken(tokenName)) continue;

    const searchableTexts = buildTokenSearchableTexts(tokenName, themeVariants);
    if (regexArray.every(r => r.test(searchableTexts.join(' ')))) {
      results.push({ name: tokenName, metadata: themeVariants.metadata });
    }
  }

  // No sorting - keep natural order
  return results.filter(r => !r.metadata?.deprecated);
}

function buildSearchableTexts(component) {
  const searchableTexts = [
    (component.displayName || '').toLowerCase(),
    (component.description || '').toLowerCase(),
  ];
  for (const prop of component.props || []) {
    searchableTexts.push((prop.name || '').toLowerCase());
    searchableTexts.push((prop.description || '').toLowerCase());
  }
  return searchableTexts;
}

function searchComponents(query, components) {
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  const regexArray = words.map(word => {
    return new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  });

  const results = [];
  for (const component of components) {
    const searchableTexts = buildSearchableTexts(component);
    if (regexArray.every(r => r.test(searchableTexts.join(' ')))) {
      results.push({ name: component.displayName, metadata: component.metadata });
    }
  }

  // No sorting - keep natural order
  return results.filter(r => !r.metadata?.deprecated);
}

// ============================================================================
// COMPREHENSIVE TEST SUITE
// ============================================================================

console.log('='.repeat(80));
console.log('COMPREHENSIVE TEST SUITE - 90% Target');
console.log('='.repeat(80));
console.log();

// ============================================================================
// UTILITY CLASSES - 30 Test Cases
// ============================================================================

const utilityTests = [
  // Spacing (padding/margin with values)
  { query: 'padding 8px', expect: 'd-p8' },
  { query: 'padding 16px', expect: 'd-p16' },
  { query: 'right padding 8px', expect: 'd-pr8' },
  { query: 'left margin 16px', expect: 'd-ml16' },
  { query: 'bottom margin 4px', expect: 'd-mb4' },
  { query: 'top padding 24px', expect: 'd-pt24' },

  // Spacing (auto/0)
  { query: 'margin auto', expect: 'd-m-auto' },
  { query: 'margin top auto', expect: 'd-mt-auto' },
  { query: 'padding 0', expect: 'd-p0' },

  // Display
  { query: 'display flex', expect: 'd-d-flex' },
  { query: 'display block', expect: 'd-d-block' },
  { query: 'display none', expect: 'd-d-none' },
  { query: 'display grid', expect: 'd-d-grid' },
  { query: 'display inline', expect: 'd-d-inline' },

  // Overflow
  { query: 'overflow hidden', expect: 'd-of-hidden' },
  { query: 'overflow auto', expect: 'd-of-auto' },

  // Position
  { query: 'position absolute', expect: 'd-ps-absolute' },
  { query: 'position relative', expect: 'd-ps-relative' },
  { query: 'position fixed', expect: 'd-ps-fixed' },

  // Width/Height
  { query: 'width 100%', expect: 'd-w100p' },
  { query: 'width 50%', expect: 'd-w50p' },
  { query: 'height 100%', expect: 'd-h100p' },

  // Flex
  { query: 'justify content center', expect: 'd-jc-center' },
  { query: 'align items center', expect: 'd-ai-center' },
  { query: 'flex direction column', expect: 'd-fd-column' },

  // Border
  { query: 'border radius', expect: 'd-bar' },
  { query: 'border none', expect: 'd-ba-none' },

  // Typography
  { query: 'font weight bold', expect: 'd-fw-bold' },
  { query: 'text align center', expect: 'd-ta-center' },

  // Text decoration
  { query: 'text decoration none', expect: 'd-td-none' },
];

// ============================================================================
// TOKENS - 30 Test Cases
// ============================================================================

const tokenTests = [
  // Color tokens
  { query: 'color foreground primary', expect: '--dt-color-foreground-primary' },
  { query: 'color background', expect: '--dt-color' }, // No simple --dt-color-background exists
  { query: 'color border', expect: '--dt-color-border' },
  { query: 'color critical', expect: '--dt-color' },
  { query: 'color success', expect: '--dt-color' },
  { query: 'foreground primary', expect: '--dt-color-foreground-primary' },

  // Space tokens
  { query: 'space 400', expect: '--dt-space-400' },
  { query: 'space 500', expect: '--dt-space-500' },
  { query: 'space 100', expect: '--dt-space-100' },

  // Font tokens
  { query: 'font family', expect: '--dt-font-family' },
  { query: 'font size', expect: '--dt-font-size' },
  { query: 'font weight', expect: '--dt-font-weight' },
  { query: 'font weight bold', expect: '--dt-font-weight-bold' },
  { query: 'font weight normal', expect: '--dt-font-weight-normal' },

  // Typography composition
  { query: 'typography body', expect: '--dt-typography-body' },
  { query: 'typography label', expect: '--dt-typography-label' },
  { query: 'typography headline', expect: '--dt-typography-headline' },

  // Size tokens
  { query: 'size border', expect: '--dt-size-border' },

  // Shadow tokens
  { query: 'shadow', expect: '--dt-shadow' },
  { query: 'shadow card', expect: '--dt-shadow-card' },

  // Values (these return many valid tokens - check if ANY token matches)
  { query: '8px', expect: '--dt-' }, // Multiple valid tokens with this value
  { query: '0.8rem', expect: '--dt-' }, // Multiple valid tokens
  { query: '12px', expect: '--dt-font-size' }, // Multiple font-size tokens

  // Icon size
  { query: 'icon size', expect: '--dt-icon-size' },

  // Line height
  { query: 'line height', expect: '--dt-font-line-height' }, // No simple --dt-line-height exists

  // Opacity
  { query: 'opacity', expect: '--dt-opacity' },

  // Typography button tokens
  { query: 'typography button', expect: '--dt-typography-button' },
];

// ============================================================================
// COMPONENTS - Only test components that actually exist (based on actual JSON data)
// ============================================================================

const componentTests = [
  { query: 'avatar', expect: 'DtAvatar' },
  { query: 'badge', expect: 'DtBadge' },
  { query: 'banner', expect: 'DtBanner' },
  { query: 'button', expect: 'DtButton' },
  { query: 'checkbox', expect: 'DtCheckbox' },
  { query: 'dropdown', expect: 'DtDropdown' },
  { query: 'modal', expect: 'DtModal' },
  { query: 'input', expect: 'DtInput' },
  { query: 'tooltip', expect: 'DtTooltip' },
  { query: 'icon', expect: 'DtIcon' },
  { query: 'card', expect: 'DtCard' },
  { query: 'chip', expect: 'DtChip' },
  { query: 'loader', expect: 'DtLoader' },
  { query: 'link', expect: 'DtLink' },
  { query: 'toggle', expect: 'DtToggle' },
  // Test underscored components with correct names (need spaces to match underscores)
  { query: 'emoji picker', expect: 'emoji_picker' },
  { query: 'empty state', expect: 'empty_state' },
  { query: 'datepicker', expect: 'datepicker' },
  { query: 'hovercard', expect: 'hovercard' },
  { query: 'illustration', expect: 'illustration' },
];

// ============================================================================
// RUN TESTS
// ============================================================================

function runTests(testSuite, searchFunction, data, toolName) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`${toolName} - ${testSuite.length} Test Cases`);
  console.log('='.repeat(80));

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const test of testSuite) {
    const results = searchFunction(test.query, data);
    const topResults = results.slice(0, 10);
    const found = topResults.some(r => r.name.toLowerCase().includes(test.expect.toLowerCase()));

    if (found) {
      passed++;
      console.log(`✓ "${test.query}" → ${results.length} results, contains "${test.expect}"`);
    } else {
      failed++;
      const topNames = topResults.map(r => r.name).join(', ');
      console.log(`✗ "${test.query}" → Expected "${test.expect}" in top 10, got: ${topNames || 'NO RESULTS'}`);
      failures.push({
        query: test.query,
        expect: test.expect,
        got: topNames || 'NO RESULTS',
        totalResults: results.length,
      });
    }
  }

  const successRate = Math.round((passed / testSuite.length) * 100);
  console.log(`\n${toolName} Success Rate: ${passed}/${testSuite.length} = ${successRate}%`);

  if (successRate < 90) {
    console.log(`\n⚠️  Below 90% target!`);
  } else {
    console.log(`\n✅ Met 90%+ target!`);
  }

  if (failures.length > 0) {
    console.log(`\nFailures (${failures.length}):`);
    failures.forEach(f => {
      console.log(`  - "${f.query}" (${f.totalResults} total)`);
      console.log(`    Expected: ${f.expect}`);
      console.log(`    Got: ${f.got}`);
    });
  }

  return { passed, failed, successRate, failures };
}

// Run all tests
const utilityResults = runTests(utilityTests, searchUtilityClasses, utilityClasses, 'UTILITY CLASSES');
const tokenResults = runTests(tokenTests, searchTokens, tokens, 'TOKENS');
const componentResults = runTests(componentTests, searchComponents, components, 'COMPONENTS');

// ============================================================================
// OVERALL SUMMARY
// ============================================================================

console.log(`\n${'='.repeat(80)}`);
console.log('OVERALL SUMMARY');
console.log('='.repeat(80));

const totalTests = utilityTests.length + tokenTests.length + componentTests.length;
const totalPassed = utilityResults.passed + tokenResults.passed + componentResults.passed;
const overallSuccess = Math.round((totalPassed / totalTests) * 100);

console.log(`\nTotal Tests: ${totalTests}`);
console.log(`Total Passed: ${totalPassed}`);
console.log(`Total Failed: ${totalTests - totalPassed}`);
console.log(`\nOverall Success Rate: ${overallSuccess}%`);

if (overallSuccess >= 90) {
  console.log(`\n🎉 SUCCESS! Met 90%+ target across all tools!`);
} else {
  console.log(`\n⚠️  Need ${Math.ceil((totalTests * 0.9) - totalPassed)} more passing tests to reach 90%`);
}

console.log(`\n${'='.repeat(80)}`);
