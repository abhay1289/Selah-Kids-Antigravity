/**
 * Local-calendar "today" helpers.
 *
 * Problem this solves: `new Date().toISOString().slice(0, 10)` produces a UTC
 * date string. Pairing that with `new Date().getDay()` (local weekday) can
 * flip the Today's-Pick to a different day than the weekday label displayed
 * alongside it — e.g. a U.S. evening visitor sees "Sunday Starter" wrapped
 * around Monday's pick because UTC has already rolled over.
 */

export function localDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
