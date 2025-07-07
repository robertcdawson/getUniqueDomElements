/**
 * Get Unique DOM Elements - Modern Implementation
 * 
 * Three improved versions that correctly identify unique DOM elements 
 * within the body element, fixing the fundamental hierarchy issues
 * of the original implementation.
 */

// =============================================================================
// OPTION 1: Simple and Correct Implementation
// =============================================================================

/**
 * Returns unique DOM element tag names found within the body element
 * @returns {string[]} Array of unique tag names, sorted alphabetically
 */
const getUniqueDomElements = () => {
  // Actually get elements that are descendants of body (not all page elements)
  const bodyElements = document.body?.querySelectorAll('*') || [];
  
  // Use Set for efficient O(1) uniqueness checking
  const uniqueTagNames = [...new Set([...bodyElements].map(el => el.tagName))];
  
  return uniqueTagNames.sort();
};

// =============================================================================
// OPTION 2: Robust Implementation with Configuration Options
// =============================================================================

/**
 * Returns unique DOM element tag names with configurable options
 * @param {Object} options - Configuration options
 * @param {Element} options.container - Container element to search within (default: document.body)
 * @param {boolean} options.includeContainer - Whether to include the container tag (default: false)
 * @param {boolean} options.toLowerCase - Whether to return lowercase tag names (default: false)
 * @param {boolean} options.sortResults - Whether to sort the results (default: true)
 * @returns {string[]} Array of unique tag names
 */
const getUniqueDomElementsRobust = (options = {}) => {
  const {
    container = document.body,
    includeContainer = false,
    toLowerCase = false,
    sortResults = true
  } = options;

  // Error handling for missing container
  if (!container) {
    throw new Error('Container element not found');
  }

  // Get all descendant elements of the container
  const elements = container.querySelectorAll('*');
  
  // Extract tag names with optional case conversion
  const tagNames = [...elements].map(el => 
    toLowerCase ? el.tagName.toLowerCase() : el.tagName
  );

  // Optionally include the container element itself
  if (includeContainer) {
    tagNames.push(toLowerCase ? container.tagName.toLowerCase() : container.tagName);
  }

  // Remove duplicates using Set
  const unique = [...new Set(tagNames)];
  
  // Optionally sort results
  return sortResults ? unique.sort() : unique;
};

// =============================================================================
// OPTION 3: Enhanced Implementation with Metadata
// =============================================================================

/**
 * Returns unique DOM elements with optional metadata about each element type
 * @param {boolean} includeMetadata - Whether to include count and first instance data
 * @returns {string[]|Object[]} Array of tag names or metadata objects
 */
const getUniqueDomElementsWithMetadata = (includeMetadata = false) => {
  // Only get elements within body
  const bodyElements = document.body?.querySelectorAll('*') || [];
  const elementMap = new Map();

  // Build map with counts and first instances
  bodyElements.forEach(element => {
    const tagName = element.tagName;
    if (!elementMap.has(tagName)) {
      elementMap.set(tagName, {
        tagName,
        count: 0,
        firstInstance: element,
        // Additional metadata that might be useful
        firstInstanceAttributes: [...element.attributes].reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {}),
        firstInstanceClasses: [...element.classList]
      });
    }
    elementMap.get(tagName).count++;
  });

  if (includeMetadata) {
    // Return full metadata objects sorted by tag name
    return Array.from(elementMap.values())
      .sort((a, b) => a.tagName.localeCompare(b.tagName));
  } else {
    // Return just tag names sorted
    return Array.from(elementMap.keys()).sort();
  }
};

// =============================================================================
// LEGACY COMPATIBILITY (Optional)
// =============================================================================

/**
 * Legacy wrapper that maintains backward compatibility while fixing the logic
 * Mimics the original function signature but with correct implementation
 * @deprecated Use getUniqueDomElements() instead
 */
var getUniqueDomElementsLegacy = function() {
  console.warn('getUniqueDomElementsLegacy is deprecated. Use getUniqueDomElements() instead.');
  return getUniqueDomElements();
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Utility function to analyze DOM structure and provide insights
 * @returns {Object} Analysis object with various DOM statistics
 */
const analyzeDomStructure = () => {
  const bodyElements = document.body?.querySelectorAll('*') || [];
  const tagCounts = new Map();
  
  bodyElements.forEach(el => {
    tagCounts.set(el.tagName, (tagCounts.get(el.tagName) || 0) + 1);
  });

  const sortedByCount = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1]);

  return {
    totalElements: bodyElements.length,
    uniqueElements: tagCounts.size,
    mostCommon: sortedByCount[0] || null,
    leastCommon: sortedByCount[sortedByCount.length - 1] || null,
    elementFrequency: Object.fromEntries(sortedByCount),
    deepestNesting: getMaxNestingDepth()
  };
};

/**
 * Helper function to calculate maximum nesting depth in body
 * @returns {number} Maximum nesting depth
 */
const getMaxNestingDepth = () => {
  let maxDepth = 0;
  
  const calculateDepth = (element, currentDepth = 0) => {
    maxDepth = Math.max(maxDepth, currentDepth);
    [...element.children].forEach(child => {
      calculateDepth(child, currentDepth + 1);
    });
  };
  
  if (document.body) {
    calculateDepth(document.body);
  }
  
  return maxDepth;
};

// =============================================================================
// EXAMPLES AND USAGE
// =============================================================================

/**
 * Example usage function that demonstrates all implementations
 * Uncomment and run in console to see examples
 */
const runExamples = () => {
  console.log('=== Simple Implementation ===');
  console.log('getUniqueDomElements():', getUniqueDomElements());
  
  console.log('\n=== Robust Implementation ===');
  console.log('Default options:', getUniqueDomElementsRobust());
  console.log('Lowercase tags:', getUniqueDomElementsRobust({ toLowerCase: true }));
  console.log('Include body tag:', getUniqueDomElementsRobust({ includeContainer: true }));
  
  console.log('\n=== With Metadata ===');
  console.log('Tag names only:', getUniqueDomElementsWithMetadata());
  console.log('With metadata:', getUniqueDomElementsWithMetadata(true));
  
  console.log('\n=== DOM Analysis ===');
  console.log('DOM structure analysis:', analyzeDomStructure());
};

// Expose the main function globally for console usage (maintains backward compatibility)
window.getUniqueDomElements = getUniqueDomElements;

// Also expose other versions for advanced usage
window.getUniqueDomElementsRobust = getUniqueDomElementsRobust;
window.getUniqueDomElementsWithMetadata = getUniqueDomElementsWithMetadata;
window.analyzeDomStructure = analyzeDomStructure;
window.runExamples = runExamples;
