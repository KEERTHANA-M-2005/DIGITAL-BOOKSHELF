// Basic HTML sanitizer to render limited markup safely
// Removes script/style/iframe and strips event handlers
export function sanitizeHtml(input) {
  if (!input || typeof input !== 'string') return '';

  // Remove script, style, and iframe tags entirely
  let cleaned = input.replace(/<\s*(script|style|iframe)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '');

  // Remove inline event handlers like onclick=, onerror=, etc.
  cleaned = cleaned.replace(/ on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Remove javascript: urls
  cleaned = cleaned.replace(/(href|src)\s*=\s*("|')\s*javascript:[^\2]*\2/gi, '$1="#"');

  return cleaned;
}



