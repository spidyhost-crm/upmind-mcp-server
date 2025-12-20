/**
 * Utility functions for formatting API documentation responses
 */

export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

export function truncateDescription(description: string, maxLength: number = 200): string {
  const plain = stripHtml(description);
  if (plain.length <= maxLength) {
    return plain;
  }
  return plain.substring(0, maxLength).trim() + '...';
}

export function formatFieldName(field: string): string {
  return field
    .replace(/[[\]]/g, '')
    .split('.')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
