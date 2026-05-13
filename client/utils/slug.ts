export function normalizeSlug(value: string) {
  return value.toLowerCase().replace(/_/g, '-');
}
