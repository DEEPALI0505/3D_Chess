// Authentic Staunton 3D Chess Pieces matching Reference Images
// Warm natural Boxwood (White) & Polished Ebony Walnut (Black)

class ChessPieceFactory {
    constructor() {
        this.initMaterials();
    }

    initMaterials() {
        // Natural Boxwood / Warm Ivory (matching user reference image)
        this.whiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xdecbb2,
            roughness: 0.42,
            metalness: 0.02
        });

        // Polished Dark Ebony / Walnut (matching user reference image)
        this.blackMaterial = new THREE.MeshStandardMaterial({
            color: 0x221f1d,
            roughness: 0.40,
            metalness: 0.04
        });
    }

    createPieceMesh(type, color) {
        const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
        const group = new THREE.Group();

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

        // Enable shadows
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
        // Classic Staunton Pawn (as seen in reference)
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.36, 0),
            new THREE.Vector2(0.36, 0.06),
            new THREE.Vector2(0.32, 0.12),
            new THREE.Vector2(0.24, 0.18),
            new THREE.Vector2(0.18, 0.35),
            new THREE.Vector2(0.14, 0.55),
            new THREE.Vector2(0.22, 0.62),
            new THREE.Vector2(0.18, 0.66),
            new THREE.Vector2(0.10, 0.70)
        ];
        const body = this.createLathePiece(pts, mat);

        // Spherical Head
        const headGeo = new THREE.SphereGeometry(0.17, 28, 28);
        const head = new THREE.Mesh(headGeo, mat);
        head.position.y = 0.85;

        const group = new THREE.Group();
        group.add(body);
        group.add(head);
        return group;
    }

    createRook(mat) {
        // Classic Staunton Rook Tower (as seen in reference)
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.38, 0),
            new THREE.Vector2(0.38, 0.08),
            new THREE.Vector2(0.34, 0.14),
            new THREE.Vector2(0.26, 0.22),
            new THREE.Vector2(0.23, 0.62),
            new THREE.Vector2(0.28, 0.82),
            new THREE.Vector2(0.34, 0.90),
            new THREE.Vector2(0.34, 1.10),
            new THREE.Vector2(0.26, 1.10),
            new THREE.Vector2(0.26, 0.96)
        ];
        const body = this.createLathePiece(pts, mat);
        const group = new THREE.Group();
        group.add(body);

        // 4 Castle Crenellations
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const bGeo = new THREE.BoxGeometry(0.12, 0.14, 0.12);
            const bMesh = new THREE.Mesh(bGeo, mat);
            bMesh.position.x = Math.cos(angle) * 0.28;
            bMesh.position.z = Math.sin(angle) * 0.28;
            bMesh.position.y = 1.13;
            group.add(bMesh);
        }

        return group;
    }

    createKnight(mat, color) {
        // Classic Staunton Carved Horse Knight (as seen in reference)
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.38, 0),
            new THREE.Vector2(0.38, 0.08),
            new THREE.Vector2(0.34, 0.14),
            new THREE.Vector2(0.28, 0.22),
            new THREE.Vector2(0.24, 0.32),
            new THREE.Vector2(0, 0.32)
        ];
        const base = this.createLathePiece(pts, mat);

        const headGroup = new THREE.Group();

        // Curved Neck
        const neckGeo = new THREE.CylinderGeometry(0.17, 0.25, 0.58, 20);
        neckGeo.rotateZ(0.26);
        neckGeo.scale(1, 1, 0.68);
        const neck = new THREE.Mesh(neckGeo, mat);
        neck.position.set(0.04, 0.58, 0);
        headGroup.add(neck);

        // Horse Muzzle / Snout
        const snoutGeo = new THREE.ConeGeometry(0.19, 0.46, 20);
        snoutGeo.rotateZ(-Math.PI / 2.35);
        snoutGeo.scale(0.85, 1, 0.65);
        const snout = new THREE.Mesh(snoutGeo, mat);
        snout.position.set(0.23, 0.78, 0);
        headGroup.add(snout);

        // Flowing Mane
        const maneGeo = new THREE.BoxGeometry(0.09, 0.50, 0.12);
        maneGeo.rotateZ(0.30);
        const mane = new THREE.Mesh(maneGeo, mat);
        mane.position.set(-0.10, 0.68, 0);
        headGroup.add(mane);

        // Alert Ears
        const earGeo = new THREE.ConeGeometry(0.06, 0.17, 12);
        const ear1 = new THREE.Mesh(earGeo, mat);
        ear1.position.set(0.02, 0.98, 0.08);
        ear1.rotation.set(0.1, 0, -0.2);
        const ear2 = new THREE.Mesh(earGeo, mat);
        ear2.position.set(0.02, 0.98, -0.08);
        ear2.rotation.set(-0.1, 0, -0.2);
        headGroup.add(ear1, ear2);

        // Point knight toward opponent
        headGroup.rotation.y = color === 'w' ? -Math.PI / 2 : Math.PI / 2;

        const group = new THREE.Group();
        group.add(base);
        group.add(headGroup);
        return group;
    }

    createBishop(mat) {
        // Classic Staunton Bishop with Mitre and Cutout Slit
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.38, 0),
            new THREE.Vector2(0.38, 0.08),
            new THREE.Vector2(0.33, 0.14),
            new THREE.Vector2(0.26, 0.22),
            new THREE.Vector2(0.19, 0.58),
            new THREE.Vector2(0.24, 0.78),
            new THREE.Vector2(0.20, 0.84),
            new THREE.Vector2(0.12, 0.88)
        ];
        const body = this.createLathePiece(pts, mat);

        // Mitre Head
        const mitreGeo = new THREE.SphereGeometry(0.20, 24, 24);
        mitreGeo.scale(0.85, 1.45, 0.85);
        const mitre = new THREE.Mesh(mitreGeo, mat);
        mitre.position.y = 1.08;

        // Distinct Slit cut
        const slitGeo = new THREE.BoxGeometry(0.06, 0.22, 0.24);
        slitGeo.rotateZ(0.35);
        const slitMat = new THREE.MeshBasicMaterial({ color: 0x181512 });
        const slit = new THREE.Mesh(slitGeo, slitMat);
        slit.position.set(0.10, 1.15, 0);

        // Top Ball Finial
        const ballGeo = new THREE.SphereGeometry(0.065, 18, 18);
        const ball = new THREE.Mesh(ballGeo, mat);
        ball.position.y = 1.38;

        const group = new THREE.Group();
        group.add(body);
        group.add(mitre);
        group.add(slit);
        group.add(ball);
        return group;
    }

    createQueen(mat) {
        // Classic Staunton Queen with Elegant Scalloped Coronet
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.42, 0),
            new THREE.Vector2(0.42, 0.09),
            new THREE.Vector2(0.35, 0.16),
            new THREE.Vector2(0.28, 0.24),
            new THREE.Vector2(0.22, 0.72),
            new THREE.Vector2(0.28, 0.98),
            new THREE.Vector2(0.24, 1.06),
            new THREE.Vector2(0.16, 1.10)
        ];
        const body = this.createLathePiece(pts, mat);

        // Flared Coronet Rim
        const crownPts = [
            new THREE.Vector2(0.16, 1.10),
            new THREE.Vector2(0.30, 1.30),
            new THREE.Vector2(0.26, 1.32),
            new THREE.Vector2(0.18, 1.25),
            new THREE.Vector2(0, 1.20)
        ];
        const crown = this.createLathePiece(crownPts, mat);

        // Center Pearl
        const centerPearlGeo = new THREE.SphereGeometry(0.08, 18, 18);
        const centerPearl = new THREE.Mesh(centerPearlGeo, mat);
        centerPearl.position.y = 1.30;

        const group = new THREE.Group();
        group.add(body);
        group.add(crown);
        group.add(centerPearl);
        return group;
    }

    createKing(mat) {
        // Classic Staunton King with Regal Double-Collar and Cross Finial
        const pts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.44, 0),
            new THREE.Vector2(0.44, 0.09),
            new THREE.Vector2(0.37, 0.16),
            new THREE.Vector2(0.30, 0.25),
            new THREE.Vector2(0.24, 0.80),
            new THREE.Vector2(0.32, 1.12),
            new THREE.Vector2(0.27, 1.22),
            new THREE.Vector2(0.18, 1.26)
        ];
        const body = this.createLathePiece(pts, mat);

        // Crown Arch
        const crownGeo = new THREE.SphereGeometry(0.26, 24, 24);
        crownGeo.scale(1, 0.82, 1);
        const crown = new THREE.Mesh(crownGeo, mat);
        crown.position.y = 1.38;

        // Traditional Carved Cross Finial
        const crossGroup = new THREE.Group();
        const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.06), mat);
        const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.06), mat);
        vBar.position.y = 1.64;
        hBar.position.y = 1.68;
        crossGroup.add(vBar, hBar);

        const group = new THREE.Group();
        group.add(body);
        group.add(crown);
        group.add(crossGroup);
        return group;
    }
}

window.ChessPieceFactory = ChessPieceFactory;
