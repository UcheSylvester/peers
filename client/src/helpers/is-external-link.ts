export const isExternalLink = (link: string): boolean =>
  !!link && link.startsWith('http');
