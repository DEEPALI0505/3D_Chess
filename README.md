# 🎮 Game Code Vault

> A curated collection of luxury **3D WebGL / Three.js games** created by [@DEEPALI0505](https://github.com/DEEPALI0505).  
> These standalone browser games are built for arcade web applications (such as [After_Party](https://github.com/Ashesh88/After_Party)) and preserved here for future development and reference.

---

## 🕹️ Games in this Repository

| Game | Folder | Tech Stack | Highlights |
| :--- | :--- | :--- | :--- |
| **♟️ Zen 3D Chess Studio** | [`/chess`](./chess) | Three.js, Chess.js, PeerJS | Realistic wood/marble board, AI opponent, P2P WebRTC video & audio call, in-game match chat, blitz/rapid timers. |
| **🎲 Classic 3D Ludo Deluxe** | [`/ludo`](./ludo) | Three.js, Web Audio API | Iconic 4-color board, animated rolling 3D dice, lacquered pawns, 2P/4P/AI bot modes, victory celebration modal. |
| **🎱 Luxury 3D Pool Deluxe** | [`/pool`](./pool) | Three.js, Billiards Physics | Regulation 8-ball table, continuous collision detection, 3D cue stick, laser aiming guide, leather drop pockets, AI bot. |
| **🏎️ Turbo 3D Racer** | [`/racer`](./racer) | Three.js, Web Audio API | Cyberpunk neon highway, 3D luxury supercars, F1 starting gantry, 2-player head-to-head duel, and nitro flame jets. |
| **♠️ Royal 3D Cards Studio** | [`/cards`](./cards) | Three.js, Web Audio API | Luxury emerald velvet casino table, animated 3D card dealing, card flips, chip betting tray, and Blackjack 21 duel. |
| **🎳 Cosmic 3D Bowling** | [`/bowling`](./bowling) | Three.js, Web Audio API | Lacquered hardwood bowling alley, neon gutters, 10-pin triangle collision chain reactions, and tournament scorecard. |

---

## 📁 Repository Structure

```
game_code/
├── index.html            # Master Arcade Hub & Game Selector Portal
├── README.md             # Repository Documentation
│
├── chess/                # ♟️ Zen 3D Chess Studio
├── ludo/                 # 🎲 Classic 3D Ludo Deluxe
├── pool/                 # 🎱 Luxury 3D Pool Deluxe
├── racer/                # 🏎️ Turbo 3D Racer
├── cards/                # ♠️ Royal 3D Cards Studio
└── bowling/              # 🎳 Cosmic 3D Bowling
```

---

## 🚀 How to Run Locally

Because all libraries (Three.js, Chess.js, PeerJS, OrbitControls) are self-contained and bundled locally:

1. Clone this repository:
   ```bash
   git clone https://github.com/DEEPALI0505/game_code.git
   cd game_code
   ```
2. Open with any static HTTP server (or VS Code Live Server):
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using npx serve
   npx serve .
   ```
3. Open `http://localhost:8000` to view the **Arcade Hub** and launch any game!

---

## 🔗 Integration with After_Party

All games in this repository are designed to be drop-in ready for the [After_Party](https://github.com/Ashesh88/After_Party) Next.js app inside `client/public/games/` and mapped to React components in `client/src/components/games/`.
