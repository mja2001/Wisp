// src/lib/wispState.ts
// Pure state logic for Wisp. No UI code, so it can be reused in an Even Hub plugin.

export type Screen = "wisp" | "noise" | "garden";
export type Mood = "sleeping" | "focus" | "loud";

export interface WispState {
  screen: Screen;
  hidden: boolean;
  focusStartedAt: number | null; // ms timestamp
  noiseLevel: number;            // 0 to 100, rough estimate
  loudSince: number | null;      // ms timestamp
  flowers: number;
  focusMinutes: number;
}

export type Gesture = "press" | "doublePress" | "swipeUp" | "swipeDown";

export const LOUD_THRESHOLD = 70;
export const LOUD_SUSTAINED_MS = 5000;
const SCREENS: Screen[] = ["wisp", "noise", "garden"];

export const initialState: WispState = {
  screen: "wisp",
  hidden: false,
  focusStartedAt: null,
  noiseLevel: 0,
  loudSince: null,
  flowers: 0,
  focusMinutes: 0,
};

export function applyGesture(s: WispState, g: Gesture, now: number): WispState {
  switch (g) {
    case "press":
      if (s.focusStartedAt === null) {
        return { ...s, focusStartedAt: now };
      }
      // End the session: plant a flower and add focus time.
      return {
        ...s,
        focusStartedAt: null,
        flowers: s.flowers + 1,
        focusMinutes: s.focusMinutes + Math.round((now - s.focusStartedAt) / 60000),
      };
    case "doublePress":
      return { ...s, hidden: !s.hidden };
    case "swipeDown":
      return { ...s, screen: SCREENS[(SCREENS.indexOf(s.screen) + 1) % SCREENS.length] };
    case "swipeUp":
      return {
        ...s,
        screen: SCREENS[(SCREENS.indexOf(s.screen) + SCREENS.length - 1) % SCREENS.length],
      };
  }
}

export function applyNoise(s: WispState, level: number, now: number): WispState {
  const clamped = Math.max(0, Math.min(100, level));
  const isLoud = clamped >= LOUD_THRESHOLD;
  return {
    ...s,
    noiseLevel: clamped,
    loudSince: isLoud ? (s.loudSince ?? now) : null,
  };
}

export function getMood(s: WispState, now: number): Mood {
  if (s.loudSince !== null && now - s.loudSince >= LOUD_SUSTAINED_MS) return "loud";
  if (s.focusStartedAt !== null) return "focus";
  return "sleeping";
}

export function shouldNudge(s: WispState, now: number): boolean {
  return s.loudSince !== null && now - s.loudSince >= LOUD_SUSTAINED_MS;
}

// Map 0-100 loudness to a block-glyph bar, e.g. "▁▂▃▄▅▆▇█"
export function levelBar(level: number, width = 8): string {
  const glyphs = "▁▂▃▄▅▆▇█";
  const filled = Math.round((Math.max(0, Math.min(100, level)) / 100) * width);
  return glyphs.slice(0, Math.max(0, Math.min(width, filled)));
}
