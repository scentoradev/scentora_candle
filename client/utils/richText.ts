const HTML_TAG_REGEX = /<[^>]+>/;
const SCRIPT_TAG_REGEX = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;

function escapeHtml(raw: string) {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function toRichHtml(input?: string | null) {
  if (!input) return '';

  const trimmed = input.trim();
  if (!trimmed) return '';

  if (HTML_TAG_REGEX.test(trimmed)) {
    return trimmed.replace(SCRIPT_TAG_REGEX, '');
  }

  const normalized = trimmed
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+–\s/g, '\n– ');

  return escapeHtml(normalized).replace(/\n/g, '<br/>');
}
