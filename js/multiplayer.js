// PeerJS P2P WebRTC Multiplayer Manager
// Allows playing with friends anywhere in the world with zero server costs!

class MultiplayerManager {
    constructor(callbacks) {
        this.callbacks = callbacks || {};
        this.peer = null;
        this.conn = null;
        this.isHost = false;
        this.myPeerId = null;
        this.myColor = 'w'; // Host defaults to white
        this.opponentName = 'Opponent';
        this.connected = false;
    }

    generateRoomCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `ZEN-${code}`;
    }

    createRoom(customCode = null) {
        const roomCode = customCode || this.generateRoomCode();
        this.isHost = true;
        this.myColor = 'w';

        if (this.peer) this.peer.destroy();

        // Connect to public PeerJS cloud broker
        this.peer = new Peer(roomCode, {
            debug: 1
        });

        this.peer.on('open', (id) => {
            this.myPeerId = id;
            if (this.callbacks.onRoomCreated) {
                this.callbacks.onRoomCreated(id);
            }
        });

        this.peer.on('connection', (connection) => {
            this.conn = connection;
            this.setupConnectionHandlers();
        });

        this.peer.on('error', (err) => {
            console.error('PeerJS error:', err);
            if (err.type === 'unavailable-id') {
                // If room code taken, retry with new code
                this.createRoom();
            } else if (this.callbacks.onError) {
                this.callbacks.onError(err);
            }
        });
    }

    joinRoom(roomCode) {
        this.isHost = false;
        this.myColor = 'b'; // Joiner plays black

        if (this.peer) this.peer.destroy();

        this.peer = new Peer({
            debug: 1
        });

        this.peer.on('open', (id) => {
            this.myPeerId = id;
            this.conn = this.peer.connect(roomCode, {
                reliable: true
            });
            this.setupConnectionHandlers();
        });

        this.peer.on('error', (err) => {
            console.error('PeerJS join error:', err);
            if (this.callbacks.onError) {
                this.callbacks.onError(err);
            }
        });
    }

    setupConnectionHandlers() {
        if (!this.conn) return;

        this.conn.on('open', () => {
            this.connected = true;
            if (this.callbacks.onConnected) {
                this.callbacks.onConnected({
                    isHost: this.isHost,
                    myColor: this.myColor
                });
            }

            // If host, sync game settings (like time control)
            if (this.isHost && this.callbacks.getHostSettings) {
                const settings = this.callbacks.getHostSettings();
                this.send({
                    type: 'init_match',
                    settings: settings
                });
            }
        });

        this.conn.on('data', (data) => {
            this.handleIncomingData(data);
        });

        this.conn.on('close', () => {
            this.connected = false;
            if (this.callbacks.onDisconnected) {
                this.callbacks.onDisconnected();
            }
        });

        this.conn.on('error', (err) => {
            console.error('Connection data error:', err);
        });
    }

    handleIncomingData(data) {
        if (!data || !data.type) return;

        switch (data.type) {
            case 'init_match':
                if (this.callbacks.onMatchInit) {
                    this.callbacks.onMatchInit(data.settings);
                }
                break;
            case 'move':
                if (this.callbacks.onRemoteMove) {
                    this.callbacks.onRemoteMove(data.move);
                }
                break;
            case 'chat':
                if (this.callbacks.onChatMessage) {
                    this.callbacks.onChatMessage(data.text, data.sender);
                }
                break;
            case 'emoji':
                if (this.callbacks.onEmojiReaction) {
                    this.callbacks.onEmojiReaction(data.emoji, data.sender);
                }
                break;
            case 'resign':
                if (this.callbacks.onOpponentResign) {
                    this.callbacks.onOpponentResign();
                }
                break;
            case 'rematch':
                if (this.callbacks.onRematchRequest) {
                    this.callbacks.onRematchRequest();
                }
                break;
            case 'rematch_accepted':
                if (this.callbacks.onRematchAccepted) {
                    this.callbacks.onRematchAccepted();
                }
                break;
        }
    }

    send(data) {
        if (this.conn && this.conn.open) {
            this.conn.send(data);
        }
    }

    sendMove(move) {
        this.send({ type: 'move', move: move });
    }

    sendChat(text, sender = 'Player') {
        this.send({ type: 'chat', text: text, sender: sender });
    }

    sendEmoji(emoji, sender = 'Player') {
        this.send({ type: 'emoji', emoji: emoji, sender: sender });
    }

    sendResign() {
        this.send({ type: 'resign' });
    }

    sendRematch() {
        this.send({ type: 'rematch' });
    }

    sendRematchAccepted() {
        this.send({ type: 'rematch_accepted' });
    }

    disconnect() {
        if (this.conn) this.conn.close();
        if (this.peer) this.peer.destroy();
        this.connected = false;
    }
}

window.MultiplayerManager = MultiplayerManager;
