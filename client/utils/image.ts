export function normalizeImageUrl(rawUrl?: string | null): string {
  const raw = (rawUrl || '').trim();
  if (!raw) return '';

  // Support markdown link format: [label](https://...)
  const markdownMatch = raw.match(/\[[^\]]*]\((https?:\/\/[^)\s]+)\)/i);
  const value = (markdownMatch?.[1] || raw).trim();
  if (!value) return '';

  if (!value.includes('drive.google.com')) return value;

  // file: /file/d/<id>/view
  const fileMatch = value.match(/\/file\/d\/([^/]+)/i);
  if (fileMatch?.[1]) {
    const id = fileMatch[1];
    return `https://drive.google.com/uc?export=view&id=${id}`;
  }

  // open?id=<id> or uc?id=<id>
  const idMatch = value.match(/[?&]id=([^&]+)/i);
  if (idMatch?.[1]) {
    const id = idMatch[1];
    return `https://drive.google.com/uc?export=view&id=${id}`;
  }

  // folder: /drive/folders/<id>
  const folderMatch = value.match(/\/drive\/folders\/([^/?]+)/i);
  if (folderMatch?.[1]) {
    const id = folderMatch[1];
    return `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
  }

  return value;
}

export function getImageCandidates(rawUrl?: string | null): string[] {
  const normalized = normalizeImageUrl(rawUrl);
  if (!normalized) return [];

  const match = normalized.match(/[?&]id=([^&]+)/i);
  if (!match?.[1] || !normalized.includes('drive.google.com')) {
    return [normalized];
  }

  const id = match[1];
  return [
    `https://drive.google.com/uc?export=view&id=${id}`,
    `https://drive.google.com/uc?export=download&id=${id}`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w2000`,
  ];
}
