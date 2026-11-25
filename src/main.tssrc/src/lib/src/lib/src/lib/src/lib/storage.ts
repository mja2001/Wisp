const KEY = "wisp.garden";

export function loadGarden(): { flowers: number; focusSeconds: number } {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { flowers: 0, focusSeconds: 0 };
    const p = JSON.parse(raw);
    return {
      flowers: Number(p.flowers) || 0,
      focusSeconds: Number(p.focusSeconds) || 0,
    };
  } catch {
    return { flowers: 0, focusSeconds: 0 };
  }
}

export function saveGarden(flowers: number, focusSeconds: number): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ flowers, focusSeconds }));
  } catch {
    /* storage unavailable, ignore */
  }
}
