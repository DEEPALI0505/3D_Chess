// Procedural 3D Chess Piece Geometries & Materials using Three.js

class ChessPieceFactory {
    constructor() {
        this.cache = {};
        this.initMaterials();
    }

    initMaterials() {
        // High quality marble & obsidian materials
        this.whiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f3ee,
            roughness: 0.18,
            metalness: 0.08,
            envMapIntensity: 1.2
        });

        this.blackMaterial = new THREE.MeshStandardMaterial({
            color: 0x1c1e22,
            roughness: 0.22,
            metalness: 0.35,
            envMapIntensity: 1.5
        });

        // Gold trim accent for bases and crowns
        this.goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            roughness: 0.25,
            metalness: 0.85
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
        
        // Add subtle gold base ring
        const ringGeo = new THREE.TorusGeometry(0.36, 0.025, 12, 32);
        ringGeo.rotateX(Math.PI / 2);
        const ringMesh = new THREE.Mesh(ringGeo, this.goldMaterial);
        ringMesh.position.y = 0.05;
        group.add(ringMesh);

        // Enable shadow on all child meshes
        group.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return group;
    }

    createLathePiece(points, material, segments = 32) {
        const geometry = new THREE.LatheGeometry(points, segments);
        return new THREE.Mesh(geometry, material);
    }

    createPawn(mat) {
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.36, 0),
            new THREE.Vector2(0.36, 0.08),
            new THREE.Vector2(0.28, 0.14),
            new THREE.Vector2(0.24, 0.22),
            new THREE.Vector2(0.18, 0.42),
            new THREE.Vector2(0.15, 0.62),
            new THREE.Vector2(0.22, 0.70),
            new THREE.Vector2(0.20, 0.74),
            new THREE.Vector2(0.10, 0.76)
        ];
        const body = this.createLathePiece(pts, mat);
        
        // Head sphere
        const headGeo = new THREE.SphereGeometry(0.18, 24, 24);
        const head = new THREE.Mesh(headGeo, mat);
        head.position.y = 0.92;
        head.scale.set(1, 1.05, 1);

        const group = new THREE.Group();
        group.add(body);
        group.add(head);
        return group;
    }

    createRook(mat) {
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.38, 0),
            new THREE.Vector2(0.38, 0.10),
            new THREE.Vector2(0.30, 0.16),
            new THREE.Vector2(0.26, 0.24),
            new THREE.Vector2(0.22, 0.60),
            new THREE.Vector2(0.26, 0.85),
            new THREE.Vector2(0.34, 0.95),
            new THREE.Vector2(0.34, 1.15),
            new THREE.Vector2(0.24, 1.15),
            new THREE.Vector2(0.24, 0.98),
            new THREE.Vector2(0, 0.98)
        ];
        const base = this.createLathePiece(pts, mat);
        const group = new THREE.Group();
        group.add(base);

        // Crenellations (Castle parapets)
        const battlements = 4;
        for (let i = 0; i < battlements; i++) {
            const angle = (i / battlements) * Math.PI * 2;
            const bGeo = new THREE.BoxGeometry(0.12, 0.15, 0.12);
            const bMesh = new THREE.Mesh(bGeo, mat);
            bMesh.position.x = Math.cos(angle) * 0.28;
            bMesh.position.z = Math.sin(angle) * 0.28;
            bMesh.position.y = 1.18;
            group.add(bMesh);
        }

        return group;
    }

    createKnight(mat, color) {
        // Base
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.38, 0),
            new THREE.Vector2(0.38, 0.10),
            new THREE.Vector2(0.30, 0.16),
            new THREE.Vector2(0.26, 0.24),
            new THREE.Vector2(0.22, 0.35),
            new THREE.Vector2(0, 0.35)
        ];
        const base = this.createLathePiece(pts, mat);

        // Sculpted stylized horse head using compound curved geometry
        const headGroup = new THREE.Group();
        
        // Torso / Neck angled
        const neckGeo = new THREE.CylinderGeometry(0.16, 0.24, 0.55, 16);
        neckGeo.rotateZ(0.25);
        neckGeo.scale(1, 1, 0.65);
        const neck = new THREE.Mesh(neckGeo, mat);
        neck.position.set(0.04, 0.58, 0);
        headGroup.add(neck);

        // Snout / Head muzzle
        const snoutGeo = new THREE.ConeGeometry(0.18, 0.45, 16);
        snoutGeo.rotateZ(-Math.PI / 2.5);
        snoutGeo.scale(0.8, 1, 0.6);
        const snout = new THREE.Mesh(snoutGeo, mat);
        snout.position.set(0.22, 0.78, 0);
        headGroup.add(snout);

        // Crown / Mane
        const maneGeo = new THREE.BoxGeometry(0.10, 0.48, 0.12);
        maneGeo.rotateZ(0.28);
        const mane = new THREE.Mesh(maneGeo, mat);
        mane.position.set(-0.10, 0.68, 0);
        headGroup.add(mane);

        // Ears
        const earGeo = new THREE.ConeGeometry(0.06, 0.16, 8);
        const ear1 = new THREE.Mesh(earGeo, mat);
        ear1.position.set(0.02, 0.98, 0.08);
        ear1.rotation.set(0.1, 0, -0.2);
        const ear2 = new THREE.Mesh(earGeo, mat);
        ear2.position.set(0.02, 0.98, -0.08);
        ear2.rotation.set(-0.1, 0, -0.2);
        headGroup.add(ear1, ear2);

        // Align Knight facing towards opponent
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
            new THREE.Vector2(0.38, 0.10),
            new THREE.Vector2(0.30, 0.16),
            new THREE.Vector2(0.24, 0.24),
            new THREE.Vector2(0.17, 0.55),
            new THREE.Vector2(0.22, 0.75),
            new THREE.Vector2(0.20, 0.82),
            new THREE.Vector2(0.12, 0.86)
        ];
        const body = this.createLathePiece(pts, mat);

        // Mitre head (Oval egg shape)
        const mitreGeo = new THREE.SphereGeometry(0.19, 24, 24);
        mitreGeo.scale(0.85, 1.45, 0.85);
        const mitre = new THREE.Mesh(mitreGeo, mat);
        mitre.position.y = 1.05;

        // Top pearl tip
        const pearlGeo = new THREE.SphereGeometry(0.06, 16, 16);
        const pearl = new THREE.Mesh(pearlGeo, this.goldMaterial);
        pearl.position.y = 1.34;

        const group = new THREE.Group();
        group.add(body);
        group.add(mitre);
        group.add(pearl);
        return group;
    }

    createQueen(mat) {
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.42, 0),
            new THREE.Vector2(0.42, 0.12),
            new THREE.Vector2(0.33, 0.18),
            new THREE.Vector2(0.26, 0.26),
            new THREE.Vector2(0.20, 0.70),
            new THREE.Vector2(0.26, 0.95),
            new THREE.Vector2(0.22, 1.05),
            new THREE.Vector2(0.14, 1.08)
        ];
        const body = this.createLathePiece(pts, mat);

        // Flared Coronet Crown
        const crownPts = [
            new THREE.Vector2(0.14, 1.08),
            new THREE.Vector2(0.30, 1.30),
            new THREE.Vector2(0.27, 1.32),
            new THREE.Vector2(0.18, 1.25),
            new THREE.Vector2(0, 1.20)
        ];
        const crown = this.createLathePiece(crownPts, mat);

        // Coronet pearls on rim
        const crownRims = new THREE.Group();
        const petals = 8;
        for (let i = 0; i < petals; i++) {
            const angle = (i / petals) * Math.PI * 2;
            const pGeo = new THREE.SphereGeometry(0.04, 12, 12);
            const pMesh = new THREE.Mesh(pGeo, this.goldMaterial);
            pMesh.position.set(Math.cos(angle) * 0.28, 1.33, Math.sin(angle) * 0.28);
            crownRims.add(pMesh);
        }

        // Center Pearl
        const centerPearlGeo = new THREE.SphereGeometry(0.09, 16, 16);
        const centerPearl = new THREE.Mesh(centerPearlGeo, this.goldMaterial);
        centerPearl.position.y = 1.32;

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
            new THREE.Vector2(0.44, 0.12),
            new THREE.Vector2(0.35, 0.18),
            new THREE.Vector2(0.28, 0.28),
            new THREE.Vector2(0.22, 0.80),
            new THREE.Vector2(0.30, 1.10),
            new THREE.Vector2(0.26, 1.22),
            new THREE.Vector2(0.16, 1.25)
        ];
        const body = this.createLathePiece(pts, mat);

        // Regal King's Arch Crown
        const crownGeo = new THREE.SphereGeometry(0.24, 24, 24);
        crownGeo.scale(1, 0.8, 1);
        const crown = new THREE.Mesh(crownGeo, mat);
        crown.position.y = 1.35;

        // Royal Cross Finial (Gold)
        const crossGroup = new THREE.Group();
        const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.05), this.goldMaterial);
        const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.05), this.goldMaterial);
        vBar.position.y = 1.62;
        hBar.position.y = 1.66;
        crossGroup.add(vBar, hBar);

        const group = new THREE.Group();
        group.add(body);
        group.add(crown);
        group.add(crossGroup);
        return group;
    }
}

window.ChessPieceFactory = ChessPieceFactory;
