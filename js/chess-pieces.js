// Procedural 3D Chess Pieces with Elegant High-Contrast Ivory & Obsidian Materials
// Designed for clear visibility, sharp silhouettes, and realistic marble luster

class ChessPieceFactory {
    constructor() {
        this.initMaterials();
    }

    initMaterials() {
        // High visibility Ivory / Cream Alabaster for White pieces (matching reference)
        this.whiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4ebdb,
            roughness: 0.20,
            metalness: 0.06
        });

        // High visibility Polished Obsidian / Ebony for Black pieces (crisp specular highlights)
        this.blackMaterial = new THREE.MeshStandardMaterial({
            color: 0x22262d,
            roughness: 0.24,
            metalness: 0.32
        });

        // Polished Gold accent for finials and trims
        this.goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xe0b246,
            roughness: 0.22,
            metalness: 0.88
        });
    }

    createPieceMesh(type, color) {
        const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
        const group = new THREE.Group();
        group.castShadow = true;
        group.receiveShadow = true;

        let pieceObj;
        switch (type.toLowerCase()) {
            case 'p':
                pieceObj = this.createPawn(mat);
                break;
            case 'r':
                pieceObj = this.createRook(mat);
                break;
            case 'n':
                pieceObj = this.createKnight(mat, color);
                break;
            case 'b':
                pieceObj = this.createBishop(mat);
                break;
            case 'q':
                pieceObj = this.createQueen(mat);
                break;
            case 'k':
                pieceObj = this.createKing(mat);
                break;
            default:
                pieceObj = this.createPawn(mat);
        }

        group.add(pieceObj);

        // Elegant Double-Ring Weighted Base
        const ringGeo1 = new THREE.TorusGeometry(0.35, 0.022, 16, 36);
        ringGeo1.rotateX(Math.PI / 2);
        const ring1 = new THREE.Mesh(ringGeo1, mat);
        ring1.position.y = 0.04;
        group.add(ring1);

        const ringGeo2 = new THREE.TorusGeometry(0.32, 0.016, 16, 36);
        ringGeo2.rotateX(Math.PI / 2);
        const ring2 = new THREE.Mesh(ringGeo2, this.goldMaterial);
        ring2.position.y = 0.08;
        group.add(ring2);

        // Enable shadow on all meshes
        group.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return group;
    }

    createLathePiece(points, material, segments = 36) {
        const geometry = new THREE.LatheGeometry(points, segments);
        return new THREE.Mesh(geometry, material);
    }

    createPawn(mat) {
        // Graceful curved pawn profile
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.36, 0),
            new THREE.Vector2(0.36, 0.07),
            new THREE.Vector2(0.30, 0.12),
            new THREE.Vector2(0.24, 0.18),
            new THREE.Vector2(0.18, 0.36),
            new THREE.Vector2(0.14, 0.58),
            new THREE.Vector2(0.20, 0.66),
            new THREE.Vector2(0.18, 0.70),
            new THREE.Vector2(0.10, 0.73)
        ];
        const body = this.createLathePiece(pts, mat);

        // Prominent Head Sphere
        const headGeo = new THREE.SphereGeometry(0.18, 28, 28);
        const head = new THREE.Mesh(headGeo, mat);
        head.position.y = 0.88;
        head.scale.set(1.02, 1.05, 1.02);

        const group = new THREE.Group();
        group.add(body);
        group.add(head);
        return group;
    }

    createRook(mat) {
        // Solid castle rook with beveled battlement rim
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.38, 0),
            new THREE.Vector2(0.38, 0.08),
            new THREE.Vector2(0.32, 0.14),
            new THREE.Vector2(0.26, 0.22),
            new THREE.Vector2(0.22, 0.65),
            new THREE.Vector2(0.27, 0.85),
            new THREE.Vector2(0.35, 0.94),
            new THREE.Vector2(0.35, 1.14),
            new THREE.Vector2(0.25, 1.14),
            new THREE.Vector2(0.25, 1.00)
        ];
        const body = this.createLathePiece(pts, mat);
        const group = new THREE.Group();
        group.add(body);

        // 4 Castle Crenellations
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const bGeo = new THREE.BoxGeometry(0.13, 0.16, 0.13);
            const bMesh = new THREE.Mesh(bGeo, mat);
            bMesh.position.x = Math.cos(angle) * 0.28;
            bMesh.position.z = Math.sin(angle) * 0.28;
            bMesh.position.y = 1.17;
            group.add(bMesh);
        }

        return group;
    }

    createKnight(mat, color) {
        // Base
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.38, 0),
            new THREE.Vector2(0.38, 0.08),
            new THREE.Vector2(0.32, 0.14),
            new THREE.Vector2(0.27, 0.22),
            new THREE.Vector2(0.23, 0.34),
            new THREE.Vector2(0, 0.34)
        ];
        const base = this.createLathePiece(pts, mat);

        const headGroup = new THREE.Group();

        // Arched Neck
        const neckGeo = new THREE.CylinderGeometry(0.18, 0.26, 0.58, 20);
        neckGeo.rotateZ(0.28);
        neckGeo.scale(1, 1, 0.7);
        const neck = new THREE.Mesh(neckGeo, mat);
        neck.position.set(0.04, 0.60, 0);
        headGroup.add(neck);

        // Sculpted Head / Muzzle
        const snoutGeo = new THREE.ConeGeometry(0.20, 0.48, 20);
        snoutGeo.rotateZ(-Math.PI / 2.4);
        snoutGeo.scale(0.85, 1, 0.65);
        const snout = new THREE.Mesh(snoutGeo, mat);
        snout.position.set(0.24, 0.80, 0);
        headGroup.add(snout);

        // Stylized Mane
        const maneGeo = new THREE.BoxGeometry(0.10, 0.52, 0.14);
        maneGeo.rotateZ(0.32);
        const mane = new THREE.Mesh(maneGeo, mat);
        mane.position.set(-0.11, 0.70, 0);
        headGroup.add(mane);

        // Pointed Ears
        const earGeo = new THREE.ConeGeometry(0.065, 0.18, 12);
        const ear1 = new THREE.Mesh(earGeo, mat);
        ear1.position.set(0.02, 1.02, 0.09);
        ear1.rotation.set(0.12, 0, -0.2);
        const ear2 = new THREE.Mesh(earGeo, mat);
        ear2.position.set(0.02, 1.02, -0.09);
        ear2.rotation.set(-0.12, 0, -0.2);
        headGroup.add(ear1, ear2);

        // Turn Knight towards opposite side
        headGroup.rotation.y = color === 'w' ? -Math.PI / 2 : Math.PI / 2;

        const group = new THREE.Group();
        group.add(base);
        group.add(headGroup);
        return group;
    }

    createBishop(mat) {
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.38, 0),
            new THREE.Vector2(0.38, 0.08),
            new THREE.Vector2(0.31, 0.14),
            new THREE.Vector2(0.25, 0.22),
            new THREE.Vector2(0.18, 0.58),
            new THREE.Vector2(0.24, 0.78),
            new THREE.Vector2(0.21, 0.84),
            new THREE.Vector2(0.12, 0.88)
        ];
        const body = this.createLathePiece(pts, mat);

        // Mitre Head (pointed oval)
        const mitreGeo = new THREE.SphereGeometry(0.20, 28, 28);
        mitreGeo.scale(0.85, 1.48, 0.85);
        const mitre = new THREE.Mesh(mitreGeo, mat);
        mitre.position.y = 1.08;

        // Slit Cut-out visual (dark angled inset)
        const slitGeo = new THREE.BoxGeometry(0.06, 0.22, 0.22);
        slitGeo.rotateZ(0.35);
        const slitMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
        const slit = new THREE.Mesh(slitGeo, slitMat);
        slit.position.set(0.10, 1.15, 0);

        // Top Gold Pearl Finial
        const pearlGeo = new THREE.SphereGeometry(0.065, 20, 20);
        const pearl = new THREE.Mesh(pearlGeo, this.goldMaterial);
        pearl.position.y = 1.38;

        const group = new THREE.Group();
        group.add(body);
        group.add(mitre);
        group.add(slit);
        group.add(pearl);
        return group;
    }

    createQueen(mat) {
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.42, 0),
            new THREE.Vector2(0.42, 0.10),
            new THREE.Vector2(0.34, 0.16),
            new THREE.Vector2(0.27, 0.24),
            new THREE.Vector2(0.21, 0.72),
            new THREE.Vector2(0.27, 0.96),
            new THREE.Vector2(0.23, 1.05),
            new THREE.Vector2(0.15, 1.08)
        ];
        const body = this.createLathePiece(pts, mat);

        // Flared Coronet Crown
        const crownPts = [
            new THREE.Vector2(0.15, 1.08),
            new THREE.Vector2(0.32, 1.32),
            new THREE.Vector2(0.28, 1.34),
            new THREE.Vector2(0.19, 1.27),
            new THREE.Vector2(0, 1.22)
        ];
        const crown = this.createLathePiece(crownPts, mat);

        // Gold Pearls on coronet tips
        const crownRims = new THREE.Group();
        const petals = 8;
        for (let i = 0; i < petals; i++) {
            const angle = (i / petals) * Math.PI * 2;
            const pGeo = new THREE.SphereGeometry(0.045, 16, 16);
            const pMesh = new THREE.Mesh(pGeo, this.goldMaterial);
            pMesh.position.set(Math.cos(angle) * 0.30, 1.35, Math.sin(angle) * 0.30);
            crownRims.add(pMesh);
        }

        // Center Pearl
        const centerPearlGeo = new THREE.SphereGeometry(0.095, 20, 20);
        const centerPearl = new THREE.Mesh(centerPearlGeo, this.goldMaterial);
        centerPearl.position.y = 1.35;

        const group = new THREE.Group();
        group.add(body);
        group.add(crown);
        group.add(crownRims);
        group.add(centerPearl);
        return group;
    }

    createKing(mat) {
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.44, 0),
            new THREE.Vector2(0.44, 0.10),
            new THREE.Vector2(0.36, 0.17),
            new THREE.Vector2(0.29, 0.26),
            new THREE.Vector2(0.23, 0.82),
            new THREE.Vector2(0.31, 1.12),
            new THREE.Vector2(0.27, 1.22),
            new THREE.Vector2(0.17, 1.26)
        ];
        const body = this.createLathePiece(pts, mat);

        // Arch Crown
        const crownGeo = new THREE.SphereGeometry(0.26, 28, 28);
        crownGeo.scale(1, 0.85, 1);
        const crown = new THREE.Mesh(crownGeo, mat);
        crown.position.y = 1.38;

        // Royal Maltese Cross Finial in Solid Gold
        const crossGroup = new THREE.Group();
        const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.06), this.goldMaterial);
        const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.06), this.goldMaterial);
        vBar.position.y = 1.66;
        hBar.position.y = 1.70;
        crossGroup.add(vBar, hBar);

        const group = new THREE.Group();
        group.add(body);
        group.add(crown);
        group.add(crossGroup);
        return group;
    }
}

window.ChessPieceFactory = ChessPieceFactory;
