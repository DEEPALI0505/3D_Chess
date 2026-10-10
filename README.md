# 🎮 Game Code Vault

> A curated collection of luxury **3D WebGL / Three.js games** created by [@DEEPALI0505](https://github.com/DEEPALI0505).  
> These standalone browser games are built for arcade web applications (such as [After_Party](https://github.com/Ashesh88/After_Party)) and preserved here for future development and reference.

---

## 🕹️ Games in this Repository

| Game | Folder | Tech Stack | Highlights |
| :--- | :--- | :--- | :--- |
| **♟️ Zen 3D Chess Studio** | [`/chess`](./chess) | Three.js, Chess.js, PeerJS | Realistic wood/marble board, AI opponent, P2P WebRTC video & audio call, in-game match chat, blitz/rapid timers. |
| **🎲 Classic 3D Ludo Deluxe** | [`/ludo`](./ludo) | Three.js, Web Audio API | Iconic 4-color board, animated rolling 3D dice, lacquered pawns, 2P/4P/AI bot modes, victory celebration modal. |

---

## 📁 Repository Structure

```
game_code/
├── index.html            # Master Arcade Hub & Game Selector Portal
├── README.md             # Repository Documentation
│
├── chess/                # ♟️ Zen 3D Chess Studio
│   ├── index.html        # Game Entrypoint
│   ├── style.css         # Dark Glassmorphism & Responsive Mobile Styling
│   ├── js/
│   │   ├── lib/          # Three.js, OrbitControls, Chess.js, PeerJS
│   │   ├── ai.js         # Chess AI Engine
│   │   ├── app.js        # Core Game Controller & Events
│   │   ├── audio.js      # Web Audio Synthesis (zero external audio files)
│   │   ├── board.js      # 3D Board & Coordinate Geometry
│   │   ├── chess-pieces.js # 3D Piece Sculptures
│   │   └── multiplayer.js  # P2P WebRTC Signaling & Video Call
│   └── preview.jpg       # Preview Screenshot
│
└── ludo/                 # 🎲 Classic 3D Ludo Deluxe
    ├── index.html        # Game Entrypoint
    ├── style.css         # Luxury Cyber Romance Theme & Mobile HUD
    ├── audio.js          # Web Audio Sound FX (dice rolls, captures, moves)
    └── js/
        ├── lib/          # Three.js & OrbitControls
        ├── board3d.js    # Iconic 4-Color 15x15 Ludo Board Texture & Mesh
        ├── dice3d.js     # Physics-Inspired Tumbling 3D Rolling Dice
        ├── pieces3d.js   # Sculpted High-Gloss Lacquered Pawns
        └── ludo-game.js  # Rule Engine, Turn Manager & Mobile Camera
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
