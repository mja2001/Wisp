# Wisp

**A quiet pixel-art companion for Even G2 smart glasses.**

Wisp is a tiny creature that lives in the corner of your vision. It never talks. It only changes what it's doing, so you can read its state at a glance and get back to your day.

**Live demo:** https://wisp-garden-glasses.lovable.app

## What it does

- **Wisp screen:** a small pixel creature that sleeps in quiet, lights its lantern during focus, and covers its ears when it's loud
- **Noise screen:** a glanceable level bar for ambient loudness
- **Garden screen:** every completed focus session plants a pixel flower, with a running count of flowers and focus minutes
- **Glasses preview:** renders the 576 x 288 display at its real proportions, in 16 shades of green on black
- **Container counter:** shows how much of the display's container budget the current layout uses

## Controls

The four touchpad gestures are simulated in the preview, with on-screen buttons and keyboard shortcuts:

| Gesture | Key | Action |
|---|---|---|
| Press | `Enter` | Start or end a focus session |
| Double press | `D` | Hide or show Wisp |
| Swipe up | `↑` | Previous screen |
| Swipe down | `↓` | Next screen |

## Privacy

- The mic is used only to estimate loudness. Audio is never recorded, stored, or sent anywhere.
- A "Simulate noise" slider lets you demo the app without a mic.
- Loudness is a rough estimate, not a calibrated measurement.
- The garden is stored locally on your device. No accounts, no backend.

## Designed for the Even G2 display

- 576 x 288 px canvas, origin top-left
- 16 shades of green, pure black background
- Hard-edged pixels: no gradients, shadows, textures, or anti-aliasing
- 24 x 24 two-frame sprites, one color, scaled 4x
- Only simple glyphs for bars, arrows, and selection
- Layout kept within the display's container limits (max 4 image + 8 other containers, one input container)

## Tech stack

- TypeScript and React, built with Lovable
- Browser microphone API (loudness only)
- Local storage for the garden

## Run locally

```bash
git clone https://github.com/YOUR-USERNAME/wisp-even-g2.git
cd wisp-even-g2
npm install
npm run dev
```

## Roadmap

- Port the state logic to an Even Hub plugin and test on real Even G2 hardware
- Time-of-day personality (sleepy at night, bright in the morning)
- Flower variety based on session length

## Status

This is a hackathon prototype. The glasses display and touchpad are simulated in the browser. It has not yet been tested on physical hardware.

## Team

AYM MJ, developer and designer
