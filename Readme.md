# Wisp

**A quiet pixel-art companion for Even G2 smart glasses.**

Wisp is a tiny creature that lives in the corner of your vision. It never talks. It only changes what it's doing, so you can read its state at a glance and get back to your day.

**Hackathon track:** AI Assistants & Work (a focus companion for working in noisy spaces)

**Live demo:** https://wisp-garden-glasses.lovable.app

![Wisp preview](docs/preview.png)

## The idea

Most apps compete for attention with notifications, feeds, and dashboards. On smart glasses that gets worse, because everything sits in your line of sight. Wisp asks a different question: what if a heads-up display could be calm?

## What it does

- **Wisp screen:** the creature sleeps in a quiet room, lights its lantern during a focus session, and covers its ears when it's loud. After sustained noise it shows a gentle "Step away?" nudge.
- **Noise screen:** a glanceable history of ambient loudness, drawn with block glyphs.
- **Garden screen:** every completed focus session plants a pixel flower, with a running count of flowers and focus minutes.
- **Glasses preview:** renders the 576 x 288 display in 16 shades of green on black.
- **Container counter:** shows how much of the display's container budget the current layout uses.

## Controls

The four touchpad gestures are simulated in the browser with on-screen buttons and keyboard shortcuts:

| Gesture | Key | Action |
|---|---|---|
| Press | `Enter` | Start or end a focus session |
| Double press | `D` | Hide or show Wisp |
| Swipe up | `↑` | Previous screen |
| Swipe down | `↓` | Next screen |

Sessions shorter than 5 seconds don't plant a flower.

## Privacy

- The microphone is used only to estimate loudness. Audio is never recorded, stored, or sent anywhere.
- A "Simulate noise" slider lets you use the app without a microphone.
- Loudness is a rough estimate, not a calibrated measurement.
- The garden is saved locally in your browser. There are no accounts and no backend.

## Designed for the Even G2 display

- 576 x 288 px canvas, origin top-left
- 16 shades of green on pure black
- Hard-edged pixels: no gradients, shadows, textures, or anti-aliasing
- 24 x 24 two-frame sprites in one color, shown at 4x
- Only simple glyphs for bars, arrows, and selection
- Layout kept within the display's container limits (max 4 image and 8 other containers, one input container)

## Project structure

```
src/
├── main.tsx            # entry point
├── App.tsx             # page UI, input handling, timers
├── styles.css
├── hooks/useMic.ts     # microphone loudness (no recording)
└── lib/
    ├── wispState.ts    # pure state logic, no UI code
    ├── sprites.ts      # pixel-art sprites
    ├── render.ts       # layout and canvas drawing
    └── storage.ts      # local garden storage
```

State logic lives in `wispState.ts` and is kept separate from rendering, so it can be reused when porting to an Even Hub plugin.

## Tech stack

- TypeScript, React, and Vite
- Browser microphone API (loudness only)
- Local storage for the garden
- The live demo was prototyped with Lovable. This repo is a clean reimplementation of the same design.

## Run locally

```bash
git clone https://github.com/mja2001/Wisp.git
cd Wisp
npm install
npm run dev
```

Requires Node.js 20 or newer.

## Status

This is a hackathon prototype.

- The glasses display and touchpad are **simulated in the browser**.
- It does **not yet use the Even Hub SDK** and has not been tested on physical hardware.
- Wisp does not use AI. It is a simple state machine driven by a timer and a loudness reading.

## Roadmap

- Port the state logic to an Even Hub plugin and run it in the official simulator
- Test on real Even G2 hardware
- Time-of-day personality (sleepy at night, bright in the morning)
- Flower variety based on session length
- Optional weekly reflection generated from garden history

## License

MIT. See [LICENSE](LICENSE).

## Team

mja2001, developer and designer
