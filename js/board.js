// 3D Chess Board Builder with Procedural High-Contrast Marble Textures

class ChessBoard3D {
    constructor(scene) {
        this.scene = scene;
        this.squareSize = 1.0;
        this.boardWidth = 8 * this.squareSize;
        this.squares = {}; // Map 'e4' -> { mesh, x, z, col, row }
        this.highlights = [];
        this.checkHighlight = null;
        this.selectedHighlight = null;

        this.initTextures();
        this.createBoard();
        this.createCoordinateLabels();
    }

    initTextures() {
        // High Contrast White Marble Texture (Warm Ivory Carrara)
        const cWhite = document.createElement('canvas');
        cWhite.width = 512;
        cWhite.height = 512;
        const ctxW = cWhite.getContext('2d');
        ctxW.fillStyle = '#f7f2e7';
        ctxW.fillRect(0, 0, 512, 512);
        ctxW.strokeStyle = 'rgba(180, 168, 150, 0.35)';
        ctxW.lineWidth = 2.5;
        for (let i = 0; i < 6; i++) {
            ctxW.beginPath();
            ctxW.moveTo(Math.random() * 512, 0);
            ctxW.bezierCurveTo(Math.random() * 512, 170, Math.random() * 512, 340, Math.random() * 512, 512);
            ctxW.stroke();
        }
        this.whiteTex = new THREE.CanvasTexture(cWhite);

        // High Contrast Black Marble Texture (Rich Charcoal Obsidian)
        const cBlack = document.createElement('canvas');
        cBlack.width = 512;
        cBlack.height = 512;
        const ctxB = cBlack.getContext('2d');
        ctxB.fillStyle = '#1e2229';
        ctxB.fillRect(0, 0, 512, 512);
        ctxB.strokeStyle = 'rgba(70, 80, 95, 0.45)';
        ctxB.lineWidth = 2.5;
        for (let i = 0; i < 6; i++) {
            ctxB.beginPath();
            ctxB.moveTo(0, Math.random() * 512);
            ctxB.bezierCurveTo(170, Math.random() * 512, 340, Math.random() * 512, 512, Math.random() * 512);
            ctxB.stroke();
        }
        this.blackTex = new THREE.CanvasTexture(cBlack);

        // Materials
        this.whiteSquareMat = new THREE.MeshStandardMaterial({
            map: this.whiteTex,
            roughness: 0.18,
            metalness: 0.04
        });

        this.blackSquareMat = new THREE.MeshStandardMaterial({
            map: this.blackTex,
            roughness: 0.22,
            metalness: 0.12
        });

        this.borderMat = new THREE.MeshStandardMaterial({
            color: 0x141820,
            roughness: 0.28,
            metalness: 0.35
        });

        this.goldTrimMat = new THREE.MeshStandardMaterial({
            color: 0xe0b246,
            roughness: 0.22,
            metalness: 0.88
        });

        // Glowing Move Indicator Material (Neon Emerald)
        this.validMoveMat = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            transparent: true,
            opacity: 0.70
        });

        // Glowing Selected Tile Material (Warm Gold Ring)
        this.selectedMat = new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            transparent: true,
            opacity: 0.65
        });

        // In Check Danger Material (Crimson)
        this.checkMat = new THREE.MeshBasicMaterial({
            color: 0xef4444,
            transparent: true,
            opacity: 0.75
        });
    }

    createBoard() {
        this.boardGroup = new THREE.Group();

        // 1. Board Frame / Pedestal
        const baseGeo = new THREE.BoxGeometry(9.6, 0.35, 9.6);
        const baseMesh = new THREE.Mesh(baseGeo, this.borderMat);
        baseMesh.position.y = -0.18;
        baseMesh.receiveShadow = true;
        this.boardGroup.add(baseMesh);

        // 2. Gold Trim Inlay
        const trimOuter = new THREE.BoxGeometry(8.26, 0.02, 8.26);
        const trimMesh = new THREE.Mesh(trimOuter, this.goldTrimMat);
        trimMesh.position.y = 0.005;
        this.boardGroup.add(trimMesh);

        // 3. 64 Checkered Square Tiles
        const sqGeo = new THREE.BoxGeometry(this.squareSize, 0.06, this.squareSize);

        for (let r = 0; r < 8; r++) { // rows 0..7 => rank 8..1
            for (let c = 0; c < 8; c++) { // cols 0..7 => files a..h
                const isLight = (r + c) % 2 === 0;
                const mat = isLight ? this.whiteSquareMat : this.blackSquareMat;
                const sqMesh = new THREE.Mesh(sqGeo, mat);

                const x = (c - 3.5) * this.squareSize;
                const z = (r - 3.5) * this.squareSize;
                sqMesh.position.set(x, 0.03, z);
                sqMesh.receiveShadow = true;

                const file = String.fromCharCode('a'.charCodeAt(0) + c);
                const rank = 8 - r;
                const squareName = `${file}${rank}`;

                sqMesh.userData = {
                    isSquare: true,
                    square: squareName,
                    col: c,
                    row: r
                };

                this.boardGroup.add(sqMesh);
                this.squares[squareName] = {
                    mesh: sqMesh,
                    x: x,
                    z: z,
                    col: c,
                    row: r
                };
            }
        }

        this.scene.add(this.boardGroup);
    }

    createCoordinateLabels() {
        const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

        files.forEach((f, i) => {
            const x = (i - 3.5) * this.squareSize;
            this.addTextSprite(f, x, 0.05, 4.35);
            this.addTextSprite(f, x, 0.05, -4.35);
        });

        ranks.forEach((rn, i) => {
            const z = (3.5 - i) * this.squareSize;
            this.addTextSprite(rn, -4.35, 0.05, z);
            this.addTextSprite(rn, 4.35, 0.05, z);
        });
    }

    addTextSprite(text, x, y, z) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 68px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 64, 64);

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.85 });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(0.42, 0.42, 1);
        sprite.position.set(x, y, z);
        this.boardGroup.add(sprite);
    }

    getSquarePos(squareName) {
        if (!this.squares[squareName]) return null;
        return {
            x: this.squares[squareName].x,
            y: 0.06,
            z: this.squares[squareName].z
        };
    }

    clearHighlights() {
        this.highlights.forEach(h => this.scene.remove(h));
        this.highlights = [];

        if (this.selectedHighlight) {
            this.scene.remove(this.selectedHighlight);
            this.selectedHighlight = null;
        }
    }

    highlightSelected(squareName) {
        if (this.selectedHighlight) {
            this.scene.remove(this.selectedHighlight);
            this.selectedHighlight = null;
        }

        const pos = this.getSquarePos(squareName);
        if (!pos) return;

        const geo = new THREE.RingGeometry(0.32, 0.46, 32);
        geo.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geo, this.selectedMat);
        mesh.position.set(pos.x, pos.y + 0.015, pos.z);
        this.scene.add(mesh);
        this.selectedHighlight = mesh;
    }

    highlightMoves(moves) {
        moves.forEach(sq => {
            const pos = this.getSquarePos(sq);
            if (!pos) return;

            const geo = new THREE.CylinderGeometry(0.24, 0.24, 0.02, 28);
            const mesh = new THREE.Mesh(geo, this.validMoveMat);
            mesh.position.set(pos.x, pos.y + 0.02, pos.z);
            mesh.userData = { isMoveTarget: true, targetSquare: sq };
            this.scene.add(mesh);
            this.highlights.push(mesh);
        });
    }

    setCheckHighlight(kingSquare) {
        if (this.checkHighlight) {
            this.scene.remove(this.checkHighlight);
            this.checkHighlight = null;
        }

        if (!kingSquare) return;

        const pos = this.getSquarePos(kingSquare);
        if (!pos) return;

        const geo = new THREE.RingGeometry(0.20, 0.48, 32);
        geo.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geo, this.checkMat);
        mesh.position.set(pos.x, pos.y + 0.025, pos.z);
        this.scene.add(mesh);
        this.checkHighlight = mesh;
    }
}

window.ChessBoard3D = ChessBoard3D;
