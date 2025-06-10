#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import the scam detection utility
const ScamDetector = require('../utils/scamDetection.js').default;

// Comprehensive test websites - 1000 total
const TEST_WEBSITES = {
  // SAFE/TRUSTED (0-30%) - 300 websites
  TRUSTED: [
    // Major tech companies
    'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com',
    'linkedin.com', 'microsoft.com', 'apple.com', 'amazon.com', 'netflix.com',
    'spotify.com', 'dropbox.com', 'github.com', 'stackoverflow.com', 'reddit.com',
    'discord.com', 'slack.com', 'zoom.us', 'whatsapp.com', 'telegram.org',
    
    // E-commerce & Services
    'ebay.com', 'etsy.com', 'shopify.com', 'paypal.com', 'stripe.com',
    'square.com', 'uber.com', 'lyft.com', 'airbnb.com', 'booking.com',
    'expedia.com', 'tripadvisor.com', 'yelp.com', 'opentable.com',
    
    // News & Media
    'cnn.com', 'bbc.com', 'reuters.com', 'bloomberg.com', 'nytimes.com',
    'theguardian.com', 'wsj.com', 'forbes.com', 'techcrunch.com', 'wired.com',
    'nationalgeographic.com', 'discovery.com', 'espn.com', 'weather.com',
    
    // Education & Government
    'harvard.edu', 'mit.edu', 'stanford.edu', 'berkeley.edu', 'oxford.ac.uk',
    'cambridge.org', 'coursera.org', 'edx.org', 'khanacademy.org',
    'wikipedia.org', 'archive.org', 'mozilla.org', 'apache.org',
    'gov.sg', 'irs.gov', 'cdc.gov', 'fda.gov', 'nasa.gov', 'whitehouse.gov',
    
    // Financial services
    'chase.com', 'bankofamerica.com', 'wellsfargo.com', 'citibank.com',
    'americanexpress.com', 'discover.com', 'capitalone.com', 'fidelity.com',
    'schwab.com', 'vanguard.com', 'tdameritrade.com', 'robinhood.com',
    
    // Health & Wellness
    'mayoclinic.org', 'webmd.com', 'healthline.com', 'nih.gov', 'who.int',
    'medlineplus.gov', 'clevelandclinic.org', 'johnshopkins.edu',
    
    // Cloud & Developer Tools
    'aws.amazon.com', 'cloud.google.com', 'azure.microsoft.com', 'heroku.com',
    'digitalocean.com', 'cloudflare.com', 'netlify.com', 'vercel.com',
    
    // Additional legitimate sites to reach 300
    ...Array.from({length: 150}, (_, i) => `legitimate-site-${i + 1}.com`),
    ...Array.from({length: 50}, (_, i) => `company${i + 1}.org`),
    ...Array.from({length: 50}, (_, i) => `university${i + 1}.edu`)
  ],
  
  // SUSPICIOUS (31-50%) - 250 websites
  SUSPICIOUS: [
    // Unusual TLDs but not necessarily malicious
    'example.co', 'startup.io', 'app.ly', 'service.me', 'business.cc',
    'portfolio.tv', 'company.ws', 'startup.biz', 'mobile.mobi', 'professional.name',
    'telecom.tel', 'travel.travel', 'jobs.jobs', 'cats.cat', 'asia.asia',
    
    // Long domains
    'very-long-domain-name-that-might-be-suspicious.com',
    'extremely-long-business-name-with-many-words.net',
    'super-duper-long-website-address-example.org',
    'ridiculously-long-domain-name-for-testing-purposes.com',
    
    // Numeric patterns
    'site123.com', 'business456.com', 'company789.net', 'service2023.org',
    'website2024.com', 'portal365.net', 'system247.com', 'platform24x7.com',
    
    // Multiple hyphens/underscores
    'best-deals-online.com', 'top-quality-products.net', 'super-fast-delivery.org',
    'high-end-services.com', 'premium-solutions.net', 'expert-consulting.org',
    
    // Marketing-style domains
    'best-crypto-trading.com', 'top-investment-tips.net', 'ultimate-guide.org',
    'exclusive-offers.com', 'limited-time-deals.net', 'special-promotion.org',
    
    // Generic business terms
    'global-solutions.com', 'worldwide-services.net', 'international-group.org',
    'universal-systems.com', 'premier-consulting.net', 'elite-management.org',
    
    // Additional suspicious patterns to reach 250
    ...Array.from({length: 50}, (_, i) => `suspicious-domain-${i + 1}.xyz`),
    ...Array.from({length: 50}, (_, i) => `unusual-site${i + 1}.click`),
    ...Array.from({length: 50}, (_, i) => `weird-name-${i + 1}.download`),
    ...Array.from({length: 30}, (_, i) => `test-site-${i + 1}.work`),
    ...Array.from({length: 30}, (_, i) => `random-business${i + 1}.review`)
  ],
  
  // DANGEROUS/PHISHING (51-100%) - 300 websites
  PHISHING: [
    // Brand impersonation - Google
    'google-account-verify.tk', 'secure-google-login.ml', 'google-security-check.ga',
    'accounts-google-verification.cf', 'gmail-secure-access.tk', 'google-password-reset.ml',
    
    // Brand impersonation - PayPal
    'paypal-secure-login.tk', 'paypal-account-verification.ml', 'secure-paypal-access.ga',
    'paypal-payment-confirmation.cf', 'paypal-dispute-resolution.tk',
    
    // Brand impersonation - Apple
    'apple-id-verification.tk', 'secure-apple-login.ml', 'icloud-account-access.ga',
    'apple-support-verification.cf', 'itunes-billing-update.tk',
    
    // Brand impersonation - Microsoft
    'microsoft-account-security.tk', 'outlook-login-verification.ml', 'office365-access.ga',
    'microsoft-security-alert.cf', 'windows-activation-required.tk',
    
    // Brand impersonation - Amazon
    'amazon-account-suspended.tk', 'prime-membership-renewal.ml', 'aws-billing-alert.ga',
    'amazon-order-confirmation.cf', 'kindle-subscription-expired.tk',
    
    // Brand impersonation - Banking
    'chase-security-alert.tk', 'bankofamerica-verification.ml', 'wells-fargo-notice.ga',
    'citibank-account-locked.cf', 'paypal-billing-issue.tk',
    
    // Government impersonation
    'irs-tax-refund.tk', 'social-security-benefits.ml', 'medicare-enrollment.ga',
    'unemployment-benefits.cf', 'stimulus-check-claim.tk', 'gov-benefits-portal.ml',
    
    // Crypto scams
    'bitcoin-investment-opportunity.tk', 'crypto-trading-profits.ml', 'ethereum-mining-pool.ga',
    'binance-trading-bot.cf', 'cryptocurrency-exchange.tk', 'nft-marketplace-launch.ml',
    
    // Romance scams
    'international-dating-site.tk', 'military-singles-online.ml', 'mature-dating-network.ga',
    'christian-singles-meet.cf', 'elite-matchmaking-service.tk',
    
    // Job scams
    'work-from-home-jobs.tk', 'remote-data-entry.ml', 'easy-online-income.ga',
    'part-time-opportunity.cf', 'freelance-writing-jobs.tk',
    
    // Tech support scams
    'microsoft-support-center.tk', 'apple-technical-support.ml', 'windows-security-warning.ga',
    'computer-virus-removal.cf', 'antivirus-software-update.tk',
    
    // Phishing with security terms
    'secure-login-portal.tk', 'account-verification-center.ml', 'identity-confirmation.ga',
    'security-checkpoint.cf', 'authentication-required.tk', 'verify-account-now.ml',
    
    // IP address phishing
    '192.168.1.100', '10.0.0.1', '172.16.0.1', '203.0.113.1', '198.51.100.1',
    '192.0.2.1', '233.252.0.1', '224.0.0.1', '239.255.255.250',
    
    // Character substitution attacks
    'g00gle.com', 'fac3book.com', 'tw1tter.com', 'app1e.com', 'micr0soft.com',
    'amaz0n.com', 'payp4l.com', 'netf1ix.com', 'sp0tify.com', 'disc0rd.com',
    
    // Additional dangerous sites to reach 300
    ...Array.from({length: 50}, (_, i) => `phishing-site-${i + 1}.tk`),
    ...Array.from({length: 50}, (_, i) => `malicious-domain${i + 1}.ml`),
    ...Array.from({length: 40}, (_, i) => `dangerous-website-${i + 1}.ga`),
    ...Array.from({length: 30}, (_, i) => `scam-portal${i + 1}.cf`)
  ],
  
  // NON-EXISTENT (Website not found) - 150 websites
  NONEXISTENT: [
    // Random invalid domains
    'ajdkelcnxmwoeirut.com', 'qpwoeirutyalskdjfh.net', 'mnbvcxzlkjhgfdsa.org',
    'plokijuhygtfrdeswaq.com', 'zmxncbvalskdjfhgqwerty.net',
    
    // Invalid TLDs
    'example.invalidtld', 'website.fake', 'domain.notreal', 'site.imaginary',
    'page.nonexistent', 'portal.unreal', 'service.fake', 'business.invalid',
    
    // Illegal characters in domains
    'website$.com', 'domain#.net', 'site@.org', 'portal%.com', 'service*.net',
    
    // Extremely long invalid domains
    'verylongandcompletelyinvaliddomainnamethatdoesnotexistandneverwill.fake',
    'anothersuperlongfakedomainthatiscompletlymadeupandwontwork.invalid',
    
    // Mixed invalid patterns
    'random123!@#.fake', 'website_with_underscores.invalid', 'domain--.notreal',
    
    // Additional non-existent domains to reach 150
    ...Array.from({length: 50}, (_, i) => `nonexistent-${i + 1}.fake`),
    ...Array.from({length: 50}, (_, i) => `invalid-domain${i + 1}.notreal`),
    ...Array.from({length: 30}, (_, i) => `fake-website-${i + 1}.invalid`)
  ]
};

// Flatten all websites into a single array for testing
const ALL_WEBSITES = [
  ...TEST_WEBSITES.TRUSTED,
  ...TEST_WEBSITES.SUSPICIOUS,
  ...TEST_WEBSITES.PHISHING,
  ...TEST_WEBSITES.NONEXISTENT
];

console.log(`🔍 Total websites to test: ${ALL_WEBSITES.length}`);

async function runComprehensiveTest() {
  const results = {
    tested: 0,
    safe: [],
    suspicious: [],
    dangerous: [],
    notFound: [],
    errors: [],
    riskScoreDistribution: {},
    averageScores: {
      trusted: [],
      suspicious: [],
      phishing: [],
      nonexistent: []
    }
  };

  console.log('🚀 Starting comprehensive website analysis...\n');

  // Test TRUSTED websites
  console.log('📊 Testing TRUSTED websites (Expected: 0-30% risk)...');
  for (let i = 0; i < TEST_WEBSITES.TRUSTED.length; i++) {
    const website = TEST_WEBSITES.TRUSTED[i];
    try {
      const analysis = await ScamDetector.analyzeURL(website);
      results.tested++;
      results.averageScores.trusted.push(analysis.riskScore || analysis.confidence);
      
      const score = analysis.riskScore || analysis.confidence;
      results.riskScoreDistribution[score] = (results.riskScoreDistribution[score] || 0) + 1;
      
      if (analysis.result === 'Not Phishing' || score <= 30) {
        results.safe.push({ website, score, details: analysis.details });
      } else if (score <= 50) {
        results.suspicious.push({ website, score, details: analysis.details });
      } else {
        results.dangerous.push({ website, score, details: analysis.details });
      }
      
      if (i % 25 === 0) {
        console.log(`   Processed ${i + 1}/${TEST_WEBSITES.TRUSTED.length} trusted sites...`);
      }
    } catch (error) {
      results.errors.push({ website, error: error.message });
    }
  }

  // Test SUSPICIOUS websites
  console.log('\n📊 Testing SUSPICIOUS websites (Expected: 31-50% risk)...');
  for (let i = 0; i < TEST_WEBSITES.SUSPICIOUS.length; i++) {
    const website = TEST_WEBSITES.SUSPICIOUS[i];
    try {
      const analysis = await ScamDetector.analyzeURL(website);
      results.tested++;
      results.averageScores.suspicious.push(analysis.riskScore || analysis.confidence);
      
      const score = analysis.riskScore || analysis.confidence;
      results.riskScoreDistribution[score] = (results.riskScoreDistribution[score] || 0) + 1;
      
      if (analysis.result === 'Not Phishing' || score <= 30) {
        results.safe.push({ website, score, details: analysis.details });
      } else if (score <= 50) {
        results.suspicious.push({ website, score, details: analysis.details });
      } else {
        results.dangerous.push({ website, score, details: analysis.details });
      }
      
      if (i % 25 === 0) {
        console.log(`   Processed ${i + 1}/${TEST_WEBSITES.SUSPICIOUS.length} suspicious sites...`);
      }
    } catch (error) {
      results.errors.push({ website, error: error.message });
    }
  }

  // Test PHISHING websites
  console.log('\n📊 Testing PHISHING websites (Expected: 51-100% risk)...');
  for (let i = 0; i < TEST_WEBSITES.PHISHING.length; i++) {
    const website = TEST_WEBSITES.PHISHING[i];
    try {
      const analysis = await ScamDetector.analyzeURL(website);
      results.tested++;
      results.averageScores.phishing.push(analysis.riskScore || analysis.confidence);
      
      const score = analysis.riskScore || analysis.confidence;
      results.riskScoreDistribution[score] = (results.riskScoreDistribution[score] || 0) + 1;
      
      if (analysis.result === 'Not Phishing' || score <= 30) {
        results.safe.push({ website, score, details: analysis.details });
      } else if (score <= 50) {
        results.suspicious.push({ website, score, details: analysis.details });
      } else {
        results.dangerous.push({ website, score, details: analysis.details });
      }
      
      if (i % 25 === 0) {
        console.log(`   Processed ${i + 1}/${TEST_WEBSITES.PHISHING.length} phishing sites...`);
      }
    } catch (error) {
      results.errors.push({ website, error: error.message });
    }
  }

  // Test NON-EXISTENT websites
  console.log('\n📊 Testing NON-EXISTENT websites (Expected: Website not found)...');
  for (let i = 0; i < TEST_WEBSITES.NONEXISTENT.length; i++) {
    const website = TEST_WEBSITES.NONEXISTENT[i];
    try {
      const analysis = await ScamDetector.analyzeURL(website);
      results.tested++;
      
      if (analysis.result === 'Error') {
        results.notFound.push({ website, reason: analysis.details[0] || 'Website not found' });
        results.averageScores.nonexistent.push(analysis.riskScore || analysis.confidence);
      } else {
        const score = analysis.riskScore || analysis.confidence;
        results.riskScoreDistribution[score] = (results.riskScoreDistribution[score] || 0) + 1;
        results.averageScores.nonexistent.push(score);
        
        if (score <= 30) {
          results.safe.push({ website, score, details: analysis.details });
        } else if (score <= 50) {
          results.suspicious.push({ website, score, details: analysis.details });
        } else {
          results.dangerous.push({ website, score, details: analysis.details });
        }
      }
      
      if (i % 25 === 0) {
        console.log(`   Processed ${i + 1}/${TEST_WEBSITES.NONEXISTENT.length} non-existent sites...`);
      }
    } catch (error) {
      results.errors.push({ website, error: error.message });
    }
  }

  return results;
}

function analyzeResults(results) {
  console.log('\n' + '='.repeat(80));
  console.log('📈 COMPREHENSIVE ANALYSIS RESULTS');
  console.log('='.repeat(80));

  console.log(`\n📊 TOTAL STATISTICS:`);
  console.log(`   Total websites tested: ${results.tested}`);
  console.log(`   Safe (0-30%): ${results.safe.length} websites`);
  console.log(`   Suspicious (31-50%): ${results.suspicious.length} websites`);
  console.log(`   Dangerous (51-100%): ${results.dangerous.length} websites`);
  console.log(`   Not Found: ${results.notFound.length} websites`);
  console.log(`   Errors: ${results.errors.length} websites`);

  // Calculate average scores by category
  const avgTrusted = results.averageScores.trusted.length > 0 
    ? results.averageScores.trusted.reduce((a, b) => a + b, 0) / results.averageScores.trusted.length 
    : 0;
  const avgSuspicious = results.averageScores.suspicious.length > 0
    ? results.averageScores.suspicious.reduce((a, b) => a + b, 0) / results.averageScores.suspicious.length
    : 0;
  const avgPhishing = results.averageScores.phishing.length > 0
    ? results.averageScores.phishing.reduce((a, b) => a + b, 0) / results.averageScores.phishing.length
    : 0;
  const avgNonExistent = results.averageScores.nonexistent.length > 0
    ? results.averageScores.nonexistent.reduce((a, b) => a + b, 0) / results.averageScores.nonexistent.length
    : 0;

  console.log(`\n📊 AVERAGE RISK SCORES BY CATEGORY:`);
  console.log(`   Trusted websites: ${avgTrusted.toFixed(1)}% (Expected: 0-30%)`);
  console.log(`   Suspicious websites: ${avgSuspicious.toFixed(1)}% (Expected: 31-50%)`);
  console.log(`   Phishing websites: ${avgPhishing.toFixed(1)}% (Expected: 51-100%)`);
  console.log(`   Non-existent websites: ${avgNonExistent.toFixed(1)}%`);

  // Risk score distribution
  console.log(`\n📊 RISK SCORE DISTRIBUTION:`);
  const sortedScores = Object.keys(results.riskScoreDistribution)
    .map(Number)
    .sort((a, b) => a - b);
  
  const scoreBuckets = {
    '0-10%': 0, '11-20%': 0, '21-30%': 0, '31-40%': 0, '41-50%': 0,
    '51-60%': 0, '61-70%': 0, '71-80%': 0, '81-90%': 0, '91-100%': 0
  };

  sortedScores.forEach(score => {
    const count = results.riskScoreDistribution[score];
    if (score <= 10) scoreBuckets['0-10%'] += count;
    else if (score <= 20) scoreBuckets['11-20%'] += count;
    else if (score <= 30) scoreBuckets['21-30%'] += count;
    else if (score <= 40) scoreBuckets['31-40%'] += count;
    else if (score <= 50) scoreBuckets['41-50%'] += count;
    else if (score <= 60) scoreBuckets['51-60%'] += count;
    else if (score <= 70) scoreBuckets['61-70%'] += count;
    else if (score <= 80) scoreBuckets['71-80%'] += count;
    else if (score <= 90) scoreBuckets['81-90%'] += count;
    else scoreBuckets['91-100%'] += count;
  });

  Object.entries(scoreBuckets).forEach(([range, count]) => {
    const percentage = ((count / results.tested) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(count / 10));
    console.log(`   ${range.padEnd(8)}: ${count.toString().padStart(3)} websites (${percentage}%) ${bar}`);
  });

  // Unique score analysis
  const uniqueScores = new Set(sortedScores);
  console.log(`\n📊 SCORE UNIQUENESS:`);
  console.log(`   Total unique risk scores: ${uniqueScores.size} out of ${results.tested} websites`);
  console.log(`   Uniqueness percentage: ${((uniqueScores.size / results.tested) * 100).toFixed(1)}%`);

  // Show some examples
  console.log(`\n📝 EXAMPLES BY CATEGORY:`);
  
  if (results.safe.length > 0) {
    console.log(`\n   ✅ SAFE WEBSITES (samples):`);
    results.safe.slice(0, 5).forEach(site => {
      console.log(`      ${site.website} - ${site.score}% risk`);
    });
  }

  if (results.suspicious.length > 0) {
    console.log(`\n   ⚠️  SUSPICIOUS WEBSITES (samples):`);
    results.suspicious.slice(0, 5).forEach(site => {
      console.log(`      ${site.website} - ${site.score}% risk`);
    });
  }

  if (results.dangerous.length > 0) {
    console.log(`\n   🚨 DANGEROUS WEBSITES (samples):`);
    results.dangerous.slice(0, 5).forEach(site => {
      console.log(`      ${site.website} - ${site.score}% risk`);
    });
  }

  if (results.notFound.length > 0) {
    console.log(`\n   🔍 NOT FOUND WEBSITES (samples):`);
    results.notFound.slice(0, 3).forEach(site => {
      console.log(`      ${site.website} - ${site.reason}`);
    });
  }

  // Performance analysis
  console.log(`\n📊 DETECTION PERFORMANCE:`);
  const trustedCorrect = results.averageScores.trusted.filter(score => score <= 30).length;
  const suspiciousCorrect = results.averageScores.suspicious.filter(score => score > 30 && score <= 50).length;
  const phishingCorrect = results.averageScores.phishing.filter(score => score > 50).length;

  console.log(`   Trusted sites correctly classified: ${trustedCorrect}/${results.averageScores.trusted.length} (${((trustedCorrect/results.averageScores.trusted.length)*100).toFixed(1)}%)`);
  console.log(`   Suspicious sites correctly classified: ${suspiciousCorrect}/${results.averageScores.suspicious.length} (${((suspiciousCorrect/results.averageScores.suspicious.length)*100).toFixed(1)}%)`);
  console.log(`   Phishing sites correctly classified: ${phishingCorrect}/${results.averageScores.phishing.length} (${((phishingCorrect/results.averageScores.phishing.length)*100).toFixed(1)}%)`);

  const overallAccuracy = (trustedCorrect + suspiciousCorrect + phishingCorrect) / 
    (results.averageScores.trusted.length + results.averageScores.suspicious.length + results.averageScores.phishing.length);
  console.log(`   Overall classification accuracy: ${(overallAccuracy * 100).toFixed(1)}%`);

  return {
    totalTested: results.tested,
    uniqueScores: uniqueScores.size,
    uniquenessPercentage: (uniqueScores.size / results.tested) * 100,
    avgScores: { avgTrusted, avgSuspicious, avgPhishing, avgNonExistent },
    accuracy: overallAccuracy * 100,
    distribution: scoreBuckets
  };
}

function saveDetailedResults(results, analysis) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `comprehensive-test-results-${timestamp}.json`;
  const filepath = path.join(__dirname, '..', 'test-results', filename);

  // Ensure directory exists
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const detailedReport = {
    timestamp: new Date().toISOString(),
    summary: analysis,
    rawResults: results,
    recommendations: {
      scoreDistribution: analysis.uniquenessPercentage > 85 ? 'EXCELLENT' : 
                        analysis.uniquenessPercentage > 70 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
      accuracy: analysis.accuracy > 80 ? 'EXCELLENT' : 
                analysis.accuracy > 65 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
      suggestions: []
    }
  };

  // Add specific recommendations
  if (analysis.uniquenessPercentage < 70) {
    detailedReport.recommendations.suggestions.push(
      'Consider adding more randomization factors to increase score uniqueness'
    );
  }

  if (analysis.avgScores.avgTrusted > 25) {
    detailedReport.recommendations.suggestions.push(
      'Trusted website scores are too high - reduce base scores for known legitimate domains'
    );
  }

  if (analysis.avgScores.avgSuspicious < 35 || analysis.avgScores.avgSuspicious > 45) {
    detailedReport.recommendations.suggestions.push(
      'Suspicious website scores should average closer to 40% - adjust medium-risk TLD scoring'
    );
  }

  if (analysis.avgScores.avgPhishing < 60) {
    detailedReport.recommendations.suggestions.push(
      'Phishing website scores are too low - increase penalties for high-risk patterns'
    );
  }

  fs.writeFileSync(filepath, JSON.stringify(detailedReport, null, 2));
  console.log(`\n💾 Detailed results saved to: ${filepath}`);

  return detailedReport;
}

async function main() {
  try {
    console.log('🔍 Starting comprehensive scam detection test...');
    console.log(`📊 Testing ${ALL_WEBSITES.length} websites across 4 categories\n`);

    const startTime = Date.now();
    const results = await runComprehensiveTest();
    const endTime = Date.now();

    console.log(`\n⏱️  Testing completed in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);

    const analysis = analyzeResults(results);
    const detailedReport = saveDetailedResults(results, analysis);

    console.log('\n' + '='.repeat(80));
    console.log('🎯 FINAL ASSESSMENT');
    console.log('='.repeat(80));

    if (analysis.uniquenessPercentage > 80 && analysis.accuracy > 75) {
      console.log('✅ EXCELLENT: Detection system is working well with good score variety and accuracy!');
    } else if (analysis.uniquenessPercentage > 60 && analysis.accuracy > 60) {
      console.log('⚠️  GOOD: Detection system is decent but could use some improvements.');
    } else {
      console.log('❌ NEEDS WORK: Detection system requires significant improvements.');
    }

    console.log(`\n📊 Key Metrics:`);
    console.log(`   Score Uniqueness: ${analysis.uniquenessPercentage.toFixed(1)}%`);
    console.log(`   Classification Accuracy: ${analysis.accuracy.toFixed(1)}%`);
    console.log(`   Websites with Yellow (31-50%) scores: ${results.suspicious.length}`);

    console.log('\n🚀 Test completed successfully!');
    return detailedReport;

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  runComprehensiveTest,
  analyzeResults,
  TEST_WEBSITES,
  ALL_WEBSITES
}; 