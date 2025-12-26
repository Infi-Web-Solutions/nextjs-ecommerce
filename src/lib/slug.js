
export function getSlugFromHostname(hostname) {
  if (!hostname) return null;
  
  // Handle exact localhost or IP (no subdomain)
  if (hostname === 'localhost' || hostname === '127.0.0.1' || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    return 'trendify'; // Default for local testing without subdomain
  }

  const parts = hostname.split('.');
  
  // If we have www.trendify.com, parts are ['www', 'trendify', 'com']
  // If we have trendify.com, parts are ['trendify', 'com']
  // If we have trendify.localhost, parts are ['trendify', 'localhost']
  
  if (parts[0] === 'www' && parts.length > 1) {
    return parts[1];
  }
  
  // For other cases, we assume the first part is the slug
  return parts[0];
}



