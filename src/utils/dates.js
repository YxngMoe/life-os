export function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function formatDate(d = new Date()) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function formatShortDate(d = new Date()) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning, Mohamed.';
  if (h < 17) return 'Good afternoon, Mohamed.';
  return 'Good evening, Mohamed.';
}

export function getDayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function daysInMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export function getMonthGrid(d) {
  const first = startOfMonth(d);
  const startPad = (first.getDay() + 6) % 7;
  const total = daysInMonth(d);
  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let i = 1; i <= total; i++) cells.push(new Date(d.getFullYear(), d.getMonth(), i));
  return cells;
}
