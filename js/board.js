// 3D Chess Board Builder with Procedural Marble Textures & Square Raycast Targets

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
        // Procedural White Carrara Marble Texture
        const cWhite = document.createElement('canvas');
        cWhite.width = 512;
        cWhite.height = 512;
        const ctxW = cWhite.getContext('2d');
        ctxW.fillStyle = '#f0eee9';
        ctxW.fillRect(0, 0, 512, 512);
        // Draw subtle marble veins
        ctxW.strokeStyle = 'rgba(195, 190, 180, 0.45)';
        ctxW.lineWidth = 3;
        for (let i = 0; i < 7; i++) {
            ctxW.beginPath();
            ctxW.moveTo(Math.random() * 512, 0);
            ctxW.bezierCurveTo(Math.random() * 512, 170, Math.random() * 512, 340, Math.random() * 512, 512);
            ctxW.stroke();
        }
        this.whiteTex = new THREE.CanvasTexture(cWhite);

        // Procedural Black Obsidian Marble Texture
        const cBlack = document.createElement('canvas');
        cBlack.width = 512;
        cBlack.height = 512;
        const ctxB = cBlack.getContext('2d');
        ctxB.fillStyle = '#1c1e22';
        ctxB.fillRect(0, 0, 512, 512);
        ctxB.strokeStyle = 'rgba(75, 85, 95, 0.35)';
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
            roughness: 0.15,
            metalness: 0.05
        });

        this.blackSquareMat = new THREE.MeshStandardMaterial({
            map: this.blackTex,
            roughness: 0.20,
            metalness: 0.15
        });

        this.borderMat = new THREE.MeshStandardMaterial({
            color: 0x0f1115,
            roughness: 0.3,
            metalness: 0.4
        });

        this.goldTrimMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            roughness: 0.25,
            metalness: 0.85
        });

        // Glowing Move Indicator Material (Neon Green)
        this.validMoveMat = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            transparent: true,
            opacity: 0.65
        });

        // Glowing Selected Tile Material (Amber Gold)
        this.selectedMat = new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            transparent: true,
            opacity: 0.6
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

        // 1. Heavy Board Pedestal / Base
        const baseGeo = new THREE.BoxGeometry(9.6, 0.4, 9.6);
        const baseMesh = new THREE.Mesh(baseGeo, this.borderMat);
        baseMesh.position.y = -0.2;
        baseMesh.receiveShadow = true;
        this.boardGroup.add(baseMesh);

        // 2. Gold Inlay Rim around the squares
        const trimOuter = new THREE.BoxGeometry(8.3, 0.02, 8.3);
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

                // Position on board centered at origin
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
        // Create canvas text texture for file letters (a-h) and ranks (1-8)
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

        // Files along bottom and top border
        files.forEach((f, i) => {
            const x = (i - 3.5) * this.squareSize;
            this.addTextSprite(f, x, 0.05, 4.35); // bottom
            this.addTextSprite(f, x, 0.05, -4.35); // top
        });

        // Ranks along left and right border
        ranks.forEach((rn, i) => {
            const z = (3.5 - i) * this.squareSize;
            this.addTextSprite(rn, -4.35, 0.05, z); // left
            this.addTextSprite(rn, 4.35, 0.05, z); // right
        });
    }

    addTextSprite(text, x, y, z) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#a0aec0';
        ctx.font = 'bold 64px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 64, 64);

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.75 });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(0.4, 0.4, 1);
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

        // Glowing border frame around selected square
        const geo = new THREE.RingGeometry(0.32, 0.46, 32);
        geo.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geo, this.selectedMat);
        mesh.position.set(pos.x, pos.y + 0.015, pos.z);
        this.scene.add(mesh);
        this.selectedHighlight = mesh;
    }

    highlightMoves(moves) {
        // moves is array of square names e.g. ['e4', 'e5']
        moves.forEach(sq => {
            const pos = this.getSquarePos(sq);
            if (!pos) return;

            // Sleek glowing disk for legal move
            const geo = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 24);
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
