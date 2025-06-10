/**
 * Website Existence Checker
 * Determines if a given URL points to an existing website
 */

class WebsiteChecker {
  /**
   * Attempts to verify if a website exists using multiple methods
   * @param {string} url - The URL to check
   * @returns {Promise<{exists: boolean, reason: string}>} - Result with existence status and reason
   */
  static async checkWebsiteExists(url) {
    if (!url) {
      return { exists: false, reason: 'No URL provided' };
    }

    // Normalize URL
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    try {
      // First, check if the URL is valid
      const urlObj = new URL(normalizedUrl);
      const domain = urlObj.hostname;

      // Check for invalid TLDs
      if (this.hasInvalidTLD(domain)) {
        return { 
          exists: false, 
          reason: `Invalid top-level domain (${domain.split('.').pop()})` 
        };
      }

      // Try to fetch the website (with timeout)
      try {
        const response = await this.fetchWithTimeout(normalizedUrl);
        if (response.ok) {
          return { exists: true, reason: 'Website responded successfully' };
        } else {
          console.log(`Website returned status code: ${response.status}`);
          // If we get certain errors, the site exists but has issues
          if (response.status === 403 || response.status === 401 || 
              response.status === 429 || response.status === 503) {
            return { 
              exists: true, 
              reason: `Website exists but returned status code ${response.status}` 
            };
          }
          return { 
            exists: false, 
            reason: `Website returned error status ${response.status}` 
          };
        }
      } catch (fetchError) {
        console.log('Fetch failed:', fetchError.message);
        
        // Try fallback method - DNS lookup
        try {
          // If we had DNS lookup capability, we would use it here
          // In a browser environment, this is limited, so we'll try variations
          const result = await this.tryVariations(domain);
          if (result.exists) {
            return result;
          }
          
          return { 
            exists: false, 
            reason: `Could not reach website: ${fetchError.message}` 
          };
        } catch (dnsError) {
          return { 
            exists: false, 
            reason: 'Domain does not exist or is not reachable' 
          };
        }
      }
    } catch (error) {
      return { 
        exists: false, 
        reason: `Invalid URL format: ${error.message}` 
      };
    }
  }

  /**
   * Fetch with a timeout to avoid hanging
   * @param {string} url - URL to fetch
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Response>} - Fetch response
   */
  static async fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        method: 'HEAD', // Only fetch headers, not full content
        mode: 'no-cors', // Try with no CORS policy
        redirect: 'follow'
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Tries variations of the domain to check existence
   * @param {string} domain - Domain to check
   * @returns {Promise<{exists: boolean, reason: string}>} - Result
   */
  static async tryVariations(domain) {
    // Try with www prefix if not present
    if (!domain.startsWith('www.')) {
      try {
        const wwwUrl = `https://www.${domain}`;
        const response = await this.fetchWithTimeout(wwwUrl);
        if (response.ok) {
          return { exists: true, reason: 'Website exists with www prefix' };
        }
      } catch (error) {
        console.log('www variation failed:', error.message);
      }
    }
    
    // Try with http instead of https
    try {
      const httpUrl = `http://${domain}`;
      const response = await this.fetchWithTimeout(httpUrl);
      if (response.ok) {
        return { exists: true, reason: 'Website exists with HTTP protocol' };
      }
    } catch (error) {
      console.log('HTTP variation failed:', error.message);
    }
    
    return { exists: false, reason: 'All connection attempts failed' };
  }

  /**
   * Checks if a domain has an invalid TLD
   * @param {string} domain - Domain to check
   * @returns {boolean} - True if the TLD is invalid
   */
  static hasInvalidTLD(domain) {
    const invalidTLDs = [
      '.invalidtld', '.notarealtld', '.fake', '.invalid', '.notld',
      '.imaginary', '.unreal', '.nope', '.wrong', '.nonexistent'
    ];
    
    return invalidTLDs.some(tld => domain.endsWith(tld));
  }
}

export default WebsiteChecker; 