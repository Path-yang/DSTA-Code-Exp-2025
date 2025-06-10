const fs = require('fs');
const path = require('path');

// Get the latest test results file
function getLatestTestResults() {
  const scriptsDir = path.join(__dirname, '../');
  const testResultFiles = fs.readdirSync(scriptsDir)
    .filter(file => file.startsWith('test-results-'))
    .sort()
    .reverse();
  
  if (testResultFiles.length === 0) {
    throw new Error('No test results found. Please run test-detector.js first.');
  }
  
  const latestFile = path.join(scriptsDir, testResultFiles[0]);
  console.log(`📊 Analyzing latest test results: ${testResultFiles[0]}`);
  return JSON.parse(fs.readFileSync(latestFile, 'utf8'));
}

// Analyze results and generate improvement recommendations
function analyzeResults(results) {
  const recommendations = {
    thresholds: analyzeThresholds(results),
    featureImportance: analyzeFeatureImportance(results),
    falsePositives: analyzeFalsePositives(results),
    falseNegatives: analyzeFalseNegatives(results),
    performanceIssues: analyzePerformanceIssues(results),
    modelAccuracy: analyzeModelAccuracy(results)
  };
  
  return recommendations;
}

// Analyze risk score thresholds
function analyzeThresholds(results) {
  const { avgRiskScores, riskDistribution } = results;
  const recommendations = [];
  
  // Check if trusted sites have high risk scores
  if (avgRiskScores.trusted > 30) {
    recommendations.push({
      issue: 'Trusted websites have high average risk scores',
      recommendation: 'Lower base risk scores for well-known domains',
      implementation: 'Expand the trusted domains whitelist and reduce the base risk score for known legitimate sites'
    });
  }
  
  // Check if phishing sites have low risk scores
  if (avgRiskScores.phishing < 70) {
    recommendations.push({
      issue: 'Phishing websites have low average risk scores',
      recommendation: 'Increase penalties for suspicious patterns',
      implementation: 'Increase risk weights for phishing indicators like brand impersonation and suspicious TLDs'
    });
  }
  
  // Check for overlap in risk distributions
  const trustedHighRisk = Object.entries(riskDistribution.trusted)
    .filter(([range, count]) => {
      const [min] = range.split('-').map(Number);
      return min > 50 && count > 0;
    }).reduce((sum, [_, count]) => sum + count, 0);
    
  const phishingLowRisk = Object.entries(riskDistribution.phishing)
    .filter(([range, count]) => {
      const [min, max] = range.split('-').map(Number);
      return max < 50 && count > 0;
    }).reduce((sum, [_, count]) => sum + count, 0);
  
  if (trustedHighRisk > 0) {
    recommendations.push({
      issue: `${trustedHighRisk} trusted websites received high risk scores (>50%)`,
      recommendation: 'Review and adjust scoring for legitimate sites showing high risk',
      implementation: 'Identify patterns in these false positives and reduce their risk contribution'
    });
  }
  
  if (phishingLowRisk > 0) {
    recommendations.push({
      issue: `${phishingLowRisk} phishing websites received low risk scores (<50%)`,
      recommendation: 'Strengthen detection for subtle phishing patterns',
      implementation: 'Add more granular detection for specific phishing techniques like typosquatting and URL obfuscation'
    });
  }
  
  // Suggest optimal threshold ranges
  const optimalThresholds = calculateOptimalThresholds(results);
  recommendations.push({
    issue: 'Current thresholds may not be optimal based on test results',
    recommendation: `Consider adjusting thresholds: Safe (0-${optimalThresholds.safeCutoff}%), Suspicious (${optimalThresholds.safeCutoff+1}-${optimalThresholds.dangerousCutoff-1}%), Dangerous (${optimalThresholds.dangerousCutoff}%+)`,
    implementation: 'Update threshold values in scamDetection.js categorizeRiskLevel function'
  });
  
  return recommendations;
}

// Calculate optimal threshold ranges based on results
function calculateOptimalThresholds(results) {
  // Simple implementation - can be made more sophisticated
  const trustedMedian = findMedianRiskScore(results.wrongClassifications.trusted);
  const phishingMedian = findMedianRiskScore(results.wrongClassifications.phishing);
  
  // Default values if we can't calculate from data
  let safeCutoff = 30;
  let dangerousCutoff = 60;
  
  // If we have enough data points, use them
  if (results.avgRiskScores.trusted < results.avgRiskScores.suspicious && 
      results.avgRiskScores.suspicious < results.avgRiskScores.phishing) {
    // Use midpoints between category averages
    safeCutoff = Math.round((results.avgRiskScores.trusted + results.avgRiskScores.suspicious) / 2);
    dangerousCutoff = Math.round((results.avgRiskScores.suspicious + results.avgRiskScores.phishing) / 2);
  }
  
  return { safeCutoff, dangerousCutoff };
}

// Find median risk score from array of results
function findMedianRiskScore(items) {
  if (!items || items.length === 0) return 50;
  
  const scores = items.map(item => item.riskScore).sort((a, b) => a - b);
  const mid = Math.floor(scores.length / 2);
  
  return scores.length % 2 === 0
    ? (scores[mid - 1] + scores[mid]) / 2
    : scores[mid];
}

// Analyze feature importance based on patterns in misclassifications
function analyzeFeatureImportance(results) {
  const { wrongClassifications } = results;
  const recommendations = [];
  
  // Analyze false positives (trusted sites marked as suspicious/phishing)
  if (wrongClassifications.trusted.length > 0) {
    const patterns = identifyCommonPatterns(wrongClassifications.trusted);
    
    if (patterns.length > 0) {
      recommendations.push({
        issue: 'False positives in trusted websites',
        recommendation: 'Reduce sensitivity for patterns triggering false positives',
        implementation: `Reduce weight of features: ${patterns.join(', ')}`,
        examples: wrongClassifications.trusted.slice(0, 3).map(w => w.url)
      });
    }
  }
  
  // Analyze false negatives (phishing sites marked as safe)
  if (wrongClassifications.phishing.length > 0) {
    const safePhishing = wrongClassifications.phishing.filter(w => w.actualResult === 'Not Phishing');
    
    if (safePhishing.length > 0) {
      recommendations.push({
        issue: 'Phishing websites incorrectly marked as safe',
        recommendation: 'Add detection for advanced phishing techniques',
        implementation: 'Implement more sophisticated checks for obfuscation, homograph attacks, and evasion techniques',
        examples: safePhishing.slice(0, 3).map(w => w.url)
      });
    }
  }
  
  // Add recommendations for suspicious domain detection
  if (wrongClassifications.suspicious.filter(w => w.actualResult === 'Not Phishing').length > 0) {
    recommendations.push({
      issue: 'Suspicious websites incorrectly marked as safe',
      recommendation: 'Improve detection of unusual but not malicious patterns',
      implementation: 'Add more nuanced checks for uncommon TLDs, numeric domains, and keyword patterns',
      examples: wrongClassifications.suspicious.filter(w => w.actualResult === 'Not Phishing').slice(0, 3).map(w => w.url)
    });
  }
  
  return recommendations;
}

// Identify common patterns in misclassified websites
function identifyCommonPatterns(misclassifications) {
  // Simplified implementation - in a real system, would analyze the actual features
  const patterns = [];
  
  // Check for common substrings in domain names
  const domains = misclassifications.map(m => m.url.split('/')[0].replace('www.', ''));
  
  // Look for numeric domains
  if (domains.some(d => /\d{3,}/.test(d))) {
    patterns.push('numeric pattern detection');
  }
  
  // Look for hyphens
  if (domains.some(d => d.includes('-'))) {
    patterns.push('hyphenated domain detection');
  }
  
  // Look for long domains
  if (domains.some(d => d.length > 25)) {
    patterns.push('long domain detection');
  }
  
  // Look for uncommon TLDs
  if (domains.some(d => {
    const tld = d.split('.').pop();
    return !['com', 'org', 'net', 'io', 'gov', 'edu'].includes(tld);
  })) {
    patterns.push('uncommon TLD detection');
  }
  
  return patterns;
}

// Analyze false positives
function analyzeFalsePositives(results) {
  const recommendations = [];
  const { confusionMatrix } = results;
  
  // Trusted sites marked as suspicious or phishing
  const trustedFalsePositives = confusionMatrix.trusted.Suspicious + confusionMatrix.trusted.Phishing;
  const trustedTotal = Object.values(confusionMatrix.trusted).reduce((sum, val) => sum + val, 0);
  const trustedFPRate = (trustedFalsePositives / trustedTotal * 100).toFixed(2);
  
  if (trustedFalsePositives > 0) {
    recommendations.push({
      issue: `False positive rate for trusted websites: ${trustedFPRate}%`,
      recommendation: 'Expand whitelist and improve legitimate site detection',
      implementation: 'Add more trusted domains to whitelist and refine legitimate pattern recognition'
    });
  }
  
  // Suspicious sites marked as phishing
  const suspiciousFalsePositives = confusionMatrix.suspicious.Phishing;
  const suspiciousTotal = Object.values(confusionMatrix.suspicious).reduce((sum, val) => sum + val, 0);
  const suspiciousFPRate = (suspiciousFalsePositives / suspiciousTotal * 100).toFixed(2);
  
  if (suspiciousFalsePositives > 0) {
    recommendations.push({
      issue: `${suspiciousFPRate}% of suspicious websites incorrectly marked as phishing`,
      recommendation: 'Better distinguish between suspicious and malicious',
      implementation: 'Create more gradations in risk scoring between unusual but benign sites and truly malicious ones'
    });
  }
  
  return recommendations;
}

// Analyze false negatives
function analyzeFalseNegatives(results) {
  const recommendations = [];
  const { confusionMatrix } = results;
  
  // Phishing sites marked as safe
  const phishingFalseNegatives = confusionMatrix.phishing['Not Phishing'];
  const phishingTotal = Object.values(confusionMatrix.phishing).reduce((sum, val) => sum + val, 0);
  const phishingFNRate = (phishingFalseNegatives / phishingTotal * 100).toFixed(2);
  
  if (phishingFalseNegatives > 0) {
    recommendations.push({
      issue: `${phishingFNRate}% of phishing websites incorrectly marked as safe`,
      recommendation: 'Strengthen detection for sophisticated phishing techniques',
      implementation: 'Add detection for homograph attacks, URL obfuscation, and brand impersonation variations'
    });
  }
  
  // Suspicious sites marked as safe
  const suspiciousFalseNegatives = confusionMatrix.suspicious['Not Phishing'];
  const suspiciousTotal = Object.values(confusionMatrix.suspicious).reduce((sum, val) => sum + val, 0);
  const suspiciousFNRate = (suspiciousFalseNegatives / suspiciousTotal * 100).toFixed(2);
  
  if (suspiciousFalseNegatives > 0) {
    recommendations.push({
      issue: `${suspiciousFNRate}% of suspicious websites incorrectly marked as safe`,
      recommendation: 'Improve detection of unusual patterns',
      implementation: 'Add more checks for uncommon domain patterns, keyword stuffing, and unusual formatting'
    });
  }
  
  return recommendations;
}

// Analyze performance issues
function analyzePerformanceIssues(results) {
  const recommendations = [];
  
  // Check if analysis time is too high
  if (results.timePerAnalysis > 500) {
    recommendations.push({
      issue: `Average analysis time is high: ${results.timePerAnalysis.toFixed(2)}ms per website`,
      recommendation: 'Optimize detection algorithms',
      implementation: 'Refactor to reduce computational complexity and implement early exit for obvious cases'
    });
  }
  
  return recommendations;
}

// Analyze overall model accuracy
function analyzeModelAccuracy(results) {
  const recommendations = [];
  
  // Calculate overall accuracy
  let totalCorrect = 0;
  let totalTests = 0;
  
  Object.values(results.byCategory).forEach(category => {
    totalCorrect += category.correct;
    totalTests += category.total;
  });
  
  const overallAccuracy = (totalCorrect / totalTests * 100).toFixed(2);
  
  // Categories with poor accuracy
  const poorCategories = [];
  Object.entries(results.byCategory).forEach(([category, data]) => {
    const accuracy = (data.correct / data.total * 100).toFixed(2);
    if (accuracy < 75) {
      poorCategories.push({
        category,
        accuracy: `${accuracy}%`
      });
    }
  });
  
  recommendations.push({
    issue: `Overall model accuracy: ${overallAccuracy}%`,
    recommendation: poorCategories.length > 0 
      ? `Focus improvements on categories with low accuracy: ${poorCategories.map(p => p.category).join(', ')}`
      : 'Continue refining model to improve overall performance',
    implementation: 'Implement the high-priority recommendations from other sections'
  });
  
  return recommendations;
}

// Generate improvement recommendations for scamDetection.js
function generateImprovedModel(results, recommendations) {
  // Analyze wrong classifications to identify needed changes
  const { wrongClassifications } = results;
  
  // Identify key areas for improvement
  const improvements = {
    whitelistAdditions: identifyWhitelistAdditions(wrongClassifications),
    suspiciousPatterns: identifyNewSuspiciousPatterns(wrongClassifications),
    phishingPatterns: identifyNewPhishingPatterns(wrongClassifications),
    thresholds: calculateOptimalThresholds(results)
  };
  
  // Generate code recommendations
  const codeChanges = generateCodeChanges(improvements);
  return codeChanges;
}

// Identify legitimate domains to add to whitelist
function identifyWhitelistAdditions(wrongClassifications) {
  // Find trusted domains incorrectly marked as suspicious or phishing
  return wrongClassifications.trusted
    .filter(w => w.actualResult !== 'Not Phishing')
    .map(w => {
      // Extract domain from URL
      let domain = w.url;
      if (domain.includes('://')) {
        domain = domain.split('://')[1];
      }
      if (domain.includes('/')) {
        domain = domain.split('/')[0];
      }
      if (domain.startsWith('www.')) {
        domain = domain.substring(4);
      }
      return domain;
    })
    .filter(domain => {
      // Filter out obviously suspicious domains
      return !domain.includes('phishing') && 
             !domain.includes('secure') && 
             !domain.includes('login') &&
             !domain.includes('-') &&
             !domain.match(/\d{3,}/);
    })
    .slice(0, 20); // Limit to 20 domains
}

// Identify new patterns for suspicious URL detection
function identifyNewSuspiciousPatterns(wrongClassifications) {
  // Look for suspicious domains incorrectly marked as safe
  const missedSuspicious = wrongClassifications.suspicious
    .filter(w => w.actualResult === 'Not Phishing')
    .map(w => w.url);
  
  // Simple pattern extraction - in real implementation would be more sophisticated
  const patterns = [];
  
  // Check for numeric patterns
  if (missedSuspicious.some(url => url.match(/\d{3,}/))) {
    patterns.push('consecutive numbers');
  }
  
  // Check for hyphens
  if (missedSuspicious.some(url => url.split('/')[0].split('-').length > 2)) {
    patterns.push('multiple hyphens');
  }
  
  // Check for long domains
  if (missedSuspicious.some(url => {
    const domain = url.split('/')[0].replace('www.', '');
    return domain.length > 25;
  })) {
    patterns.push('excessive length');
  }
  
  // Check for uncommon TLDs
  const uncommonTlds = [];
  missedSuspicious.forEach(url => {
    const domain = url.split('/')[0].replace('www.', '');
    const tld = domain.split('.').pop();
    if (!['com', 'org', 'net', 'io', 'gov', 'edu'].includes(tld) && 
        !uncommonTlds.includes(tld)) {
      uncommonTlds.push(tld);
    }
  });
  
  if (uncommonTlds.length > 0) {
    patterns.push(`uncommon TLDs (${uncommonTlds.join(', ')})`);
  }
  
  return patterns;
}

// Identify new patterns for phishing URL detection
function identifyNewPhishingPatterns(wrongClassifications) {
  // Look for phishing domains incorrectly marked as safe or suspicious
  const missedPhishing = wrongClassifications.phishing
    .filter(w => w.actualResult !== 'Phishing')
    .map(w => w.url);
  
  // Simple pattern extraction
  const patterns = [];
  
  // Check for brand impersonation
  const brands = ['google', 'apple', 'microsoft', 'amazon', 'facebook', 'netflix', 'paypal'];
  const brandImpersonations = [];
  
  missedPhishing.forEach(url => {
    const domain = url.split('/')[0].replace('www.', '');
    brands.forEach(brand => {
      if (domain.includes(brand) && domain !== `${brand}.com`) {
        brandImpersonations.push(brand);
      }
    });
  });
  
  if (brandImpersonations.length > 0) {
    const uniqueBrands = [...new Set(brandImpersonations)];
    patterns.push(`brand impersonation (${uniqueBrands.join(', ')})`);
  }
  
  // Check for security keywords
  const securityKeywords = ['secure', 'verify', 'login', 'account', 'password', 'update'];
  const foundKeywords = [];
  
  missedPhishing.forEach(url => {
    const domain = url.split('/')[0].replace('www.', '');
    securityKeywords.forEach(keyword => {
      if (domain.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    });
  });
  
  if (foundKeywords.length > 0) {
    const uniqueKeywords = [...new Set(foundKeywords)];
    patterns.push(`security keywords (${uniqueKeywords.join(', ')})`);
  }
  
  return patterns;
}

// Generate code change suggestions
function generateCodeChanges(improvements) {
  let changes = {
    whitelistChanges: '',
    suspiciousPatternChanges: '',
    phishingPatternChanges: '',
    thresholdChanges: ''
  };
  
  // Generate whitelist additions
  if (improvements.whitelistAdditions.length > 0) {
    changes.whitelistChanges = `// Add these domains to the TRUSTED_DOMAINS array:\n` +
      improvements.whitelistAdditions.map(domain => `  '${domain}',`).join('\n');
  }
  
  // Generate suspicious pattern additions
  if (improvements.suspiciousPatterns.length > 0) {
    changes.suspiciousPatternChanges = `// Add these checks to suspicious pattern detection:\n` +
      improvements.suspiciousPatterns.map(pattern => 
        `// Check for ${pattern}\n` +
        `if (${generateCodeSnippetForPattern(pattern)}) {\n` +
        `  riskScore += 15; // Adjust weight as needed\n` +
        `}\n`
      ).join('\n');
  }
  
  // Generate phishing pattern additions
  if (improvements.phishingPatterns.length > 0) {
    changes.phishingPatternChanges = `// Add these checks to phishing pattern detection:\n` +
      improvements.phishingPatterns.map(pattern => 
        `// Check for ${pattern}\n` +
        `if (${generateCodeSnippetForPattern(pattern)}) {\n` +
        `  riskScore += 25; // Adjust weight as needed\n` +
        `}\n`
      ).join('\n');
  }
  
  // Generate threshold changes
  changes.thresholdChanges = `// Update risk thresholds based on test results:\n` +
    `function categorizeRiskLevel(riskScore) {\n` +
    `  if (riskScore < ${improvements.thresholds.safeCutoff}) {\n` +
    `    return 'Not Phishing';\n` +
    `  } else if (riskScore < ${improvements.thresholds.dangerousCutoff}) {\n` +
    `    return 'Suspicious';\n` +
    `  } else {\n` +
    `    return 'Phishing';\n` +
    `  }\n` +
    `}\n`;
  
  return changes;
}

// Helper to generate code snippets for pattern detection
function generateCodeSnippetForPattern(pattern) {
  if (pattern.includes('consecutive numbers')) {
    return "normalizedUrl.match(/\\d{3,}/)";
  }
  if (pattern.includes('multiple hyphens')) {
    return "normalizedUrl.split('/')[0].split('-').length > 2";
  }
  if (pattern.includes('excessive length')) {
    return "normalizedUrl.split('/')[0].replace('www.', '').length > 25";
  }
  if (pattern.includes('uncommon TLDs')) {
    return "!['com', 'org', 'net', 'io', 'gov', 'edu'].includes(tld)";
  }
  if (pattern.includes('brand impersonation')) {
    return "POPULAR_BRANDS.some(brand => normalizedUrl.includes(brand) && !TRUSTED_DOMAINS.includes(normalizedUrl))";
  }
  if (pattern.includes('security keywords')) {
    return "['secure', 'verify', 'login', 'account', 'password', 'update'].some(keyword => normalizedUrl.includes(keyword))";
  }
  
  return "/* Add implementation for this pattern */";
}

// Execute analysis and print recommendations
async function main() {
  try {
    const results = getLatestTestResults();
    const recommendations = analyzeResults(results);
    
    console.log('\n📋 IMPROVEMENT RECOMMENDATIONS');
    console.log('============================');
    
    // Print threshold recommendations
    console.log('\n🔍 Risk Threshold Adjustments:');
    recommendations.thresholds.forEach((rec, i) => {
      console.log(`${i+1}. ${rec.issue}`);
      console.log(`   → ${rec.recommendation}`);
      console.log(`   📝 ${rec.implementation}`);
    });
    
    // Print feature importance recommendations
    console.log('\n⚙️ Feature Improvements:');
    recommendations.featureImportance.forEach((rec, i) => {
      console.log(`${i+1}. ${rec.issue}`);
      console.log(`   → ${rec.recommendation}`);
      console.log(`   📝 ${rec.implementation}`);
      if (rec.examples) {
        console.log(`   📊 Examples: ${rec.examples.join(', ')}`);
      }
    });
    
    // Print false positive recommendations
    console.log('\n❌ False Positive Reduction:');
    recommendations.falsePositives.forEach((rec, i) => {
      console.log(`${i+1}. ${rec.issue}`);
      console.log(`   → ${rec.recommendation}`);
      console.log(`   📝 ${rec.implementation}`);
    });
    
    // Print false negative recommendations
    console.log('\n⚠️ False Negative Reduction:');
    recommendations.falseNegatives.forEach((rec, i) => {
      console.log(`${i+1}. ${rec.issue}`);
      console.log(`   → ${rec.recommendation}`);
      console.log(`   📝 ${rec.implementation}`);
    });
    
    // Print overall model recommendations
    console.log('\n📊 Overall Model Accuracy:');
    recommendations.modelAccuracy.forEach((rec, i) => {
      console.log(`${i+1}. ${rec.issue}`);
      console.log(`   → ${rec.recommendation}`);
      console.log(`   📝 ${rec.implementation}`);
    });
    
    // Generate code improvement suggestions
    const codeChanges = generateImprovedModel(results, recommendations);
    
    console.log('\n💻 SUGGESTED CODE CHANGES');
    console.log('======================');
    
    // Print whitelist changes
    if (codeChanges.whitelistChanges) {
      console.log('\n🔒 Whitelist Additions:');
      console.log(codeChanges.whitelistChanges);
    }
    
    // Print suspicious pattern changes
    if (codeChanges.suspiciousPatternChanges) {
      console.log('\n⚠️ Suspicious Pattern Additions:');
      console.log(codeChanges.suspiciousPatternChanges);
    }
    
    // Print phishing pattern changes
    if (codeChanges.phishingPatternChanges) {
      console.log('\n🚨 Phishing Pattern Additions:');
      console.log(codeChanges.phishingPatternChanges);
    }
    
    // Print threshold changes
    console.log('\n🔍 Threshold Adjustments:');
    console.log(codeChanges.thresholdChanges);
    
    // Save code changes to file
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filePath = path.join(__dirname, `../improvement-suggestions-${timestamp}.js`);
    
    fs.writeFileSync(filePath, `// Improvement suggestions generated on ${new Date().toLocaleString()}\n\n` +
      `// ==== WHITELIST ADDITIONS ====\n${codeChanges.whitelistChanges || '// No changes recommended'}\n\n` +
      `// ==== SUSPICIOUS PATTERN ADDITIONS ====\n${codeChanges.suspiciousPatternChanges || '// No changes recommended'}\n\n` +
      `// ==== PHISHING PATTERN ADDITIONS ====\n${codeChanges.phishingPatternChanges || '// No changes recommended'}\n\n` +
      `// ==== THRESHOLD ADJUSTMENTS ====\n${codeChanges.thresholdChanges || '// No changes recommended'}\n`
    );
    
    console.log(`\n💾 Detailed improvement suggestions saved to ${filePath}`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

main(); 