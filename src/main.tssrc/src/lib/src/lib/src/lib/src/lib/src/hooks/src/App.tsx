import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyGesture,
  applyNoise,
  initialState,
  type Gesture,
  type WispState,
} from "./lib/wispState";
import { buildLayout, countContainers, draw, W, H } from "./lib/render";
import { useMic } from "./hooks/useMic";
import { loadGarden, saveGarden } from "./lib/storage";

const KEYS: Record<string, Gesture> = {
  Enter: "press",
  d: "doublePress",
  D: "doublePress",
  ArrowUp: "swipeUp",
  ArrowDown: "swipeDown",
};

export default function App() {
  const [state, setState] = useState<WispState>(() => ({ ...initialState, ...loadGarden() }));
  const [now, setNow] = useState(() => Date.now());
  const [sim, setSim] = useState(18);
  const [micOn, setMicOn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mic = useMic(micOn);
  const level = micOn && mic.level !== null ? mic.level : sim;
  const levelRef = useRef(level);
  levelRef.current = level;

  // clock for animation
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  // sample noise twice a second
  useEffect(() => {
    const id = setInterval(
      () => setState((s) => applyNoise(s, levelRef.current, Date.now())),
      500
    );
    return () => clearInterval(id);
  }, []);

  // turn the mic back off if permission fails
  useEffect(() => {
    if (mic.error) setMicOn(false);
  }, [mic.error]);

  const gesture = useCallback(
    (g: Gesture) => setState((s) => applyGesture(s, g, Date.now())),
    []
  );

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === "INPUT") return; // let the slider use arrow keys
      const g = KEYS[e.key];
      if (g) {
        e.preventDefault();
        gesture(g);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gesture]);

  // persist garden
  useEffect(() => {
    saveGarden(state.flowers, state.focusSeconds);
  }, [state.flowers, state.focusSeconds]);

  const items = useMemo(() => buildLayout(state, now), [state, now]);
  const counts = countContainers(items);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) draw(ctx, items);
  }, [items]);

  const resetGarden = () => setState((s) => ({ ...s, flowers: 0, focusSeconds: 0 }));
  const mins = Math.floor(state.focusSeconds / 60);

  return (
    <main className="page">
      <header>
        <h1>Wisp.</h1>
        <p className="tagline">A quiet companion for your glasses.</p>
        <span className="badge">EVEN G2 / COMPANION</span>
      </header>

      <section>
        <h2>Glasses preview</h2>
        <p className="muted">576 × 288 px · 16 shades of green</p>
        <canvas ref={canvasRef} width={W} height={H} className="glasses" />
        <p className="muted small">
          Containers: <b>{counts.text}/8</b> text · <b>{counts.image}/4</b> image · 1 input
          container
        </p>
        <p className="muted small">
          Preview text is drawn with the browser font and may look smoother than the real display.
        </p>
      </section>

      <section>
        <h2>Touchpad controls</h2>
        <div className="buttons">
          <button onClick={() => gesture("press")}>Press</button>
          <button onClick={() => gesture("doublePress")}>Double press</button>
          <button onClick={() => gesture("swipeUp")}>Swipe up</button>
          <button onClick={() => gesture("swipeDown")}>Swipe down</button>
        </div>
        <p className="muted small">
          Keyboard: <code>Enter</code> press · <code>D</code> double press · <code>↑</code> swipe
          up · <code>↓</code> swipe down
        </p>
      </section>

      <section>
        <h2>Ambient sound</h2>
        <label className="row">
          <input type="checkbox" checked={micOn} onChange={(e) => setMicOn(e.target.checked)} />
          Enable ambient sound
        </label>
        <p className="muted small">Just loudness. Never recorded, stored, or sent anywhere.</p>
        {mic.error && <p className="error">{mic.error}</p>}
        <label className="row">
          Simulate noise
          <input
            type="range"
            min={0}
            max={100}
            value={sim}
            disabled={micOn}
            onChange={(e) => setSim(Number(e.target.value))}
          />
          <span>{micOn && mic.level !== null ? mic.level : sim} / 100</span>
        </label>
        <p className="muted small">
          Loudness is a rough estimate, not a calibrated measurement.
        </p>
      </section>

      <section>
        <h2>Your garden</h2>
        <p>
          {state.flowers} flowers · {mins} min of focus
        </p>
        <p className="muted small">Saved on this device only. Sessions under 5 seconds don't count.</p>
        <button onClick={resetGarden}>Reset garden</button>
      </section>

      <section>
        <h2>Design rules</h2>
        <ul className="muted small">
          <li>576 × 288 pixels, origin top-left</li>
          <li>16 green shades on pure black</li>
          <li>Hard-edged pixels, no gradients or shadows</li>
          <li>1 px borders, no element backgrounds</li>
          <li>24 × 24 sprites, two frames, one color, shown at 4x</li>
          <li>Only bars, arrows, and selection glyphs</li>
          <li>Max 4 image and 8 text containers, one input container</li>
        </ul>
      </section>

      <footer className="muted small">WISP / A QUIETER KIND OF COMPANY</footer>
    </main>
  );
}
