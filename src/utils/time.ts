export function formatTimeShort(epochMs: number): string {
  const d = new Date(epochMs);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function formatTimeDivider(epochMs: number): string {
  const d = new Date(epochMs);
  const today = new Date();
  const isSameDay = d.toDateString() === today.toDateString();
  if (isSameDay) return 'Today';
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString();
}

export function shouldShowDivider(prevTs: number | undefined, currTs: number): boolean {
  if (prevTs === undefined) return true;
  const prev = new Date(prevTs);
  const curr = new Date(currTs);
  const dayChanged = prev.toDateString() !== curr.toDateString();
  const gapMs = Math.abs(currTs - prevTs);
  return dayChanged || gapMs > 10 * 60 * 1000;
}


