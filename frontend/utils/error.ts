export function extractError(e: unknown): string {
  if (e && typeof e === 'object') {
    const err = e as { data?: { message?: string | string[] } };
    const message = err.data?.message;
    if (Array.isArray(message)) return message.join('، ');
    if (typeof message === 'string') return message;
  }
  return '';
}
