import { randomBytes } from 'node:crypto';
import { WebSocketServer } from 'ws';
const RATIO = 1.79672131148;
const WIDTH = 1200;
const HEIGHT = Math.round(WIDTH / RATIO);
const PADDLE_WIDTH = HEIGHT / 50.8;
const PADDLE_HEIGHT = (WIDTH * 2) / 17.96;
const PADDLE_GAP = WIDTH / 46;
const PADDLE_SPEED = WIDTH / 92;
const LINE_WIDTH = WIDTH / 92;
// Online top offline ile aynı boyut ve hızda
const BALL_RADIUS = WIDTH / 90;
const BALL_SPEED = (WIDTH * 2) / 90;
const TICK_MS = 1000 / 60;
const rooms = new Map();
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const makeCode = () => randomBytes(2).toString('hex').slice(0, 4).toUpperCase();
const createInitialState = () => ({
    width: WIDTH,
    height: HEIGHT,
    lineWidth: LINE_WIDTH,
    paddleWidth: PADDLE_WIDTH,
    paddleGap: PADDLE_GAP,
    paddleHeight: PADDLE_HEIGHT,
    playerSpeed: PADDLE_SPEED,
    ball: {
        x: WIDTH / 2,
        y: HEIGHT / 2,
        dx: -1,
        dy: 0,
        speed: BALL_SPEED,
        radius: BALL_RADIUS
    },
    active: false,
    players: [
        { y: PADDLE_WIDTH, score: 0 },
        { y: HEIGHT - PADDLE_WIDTH - PADDLE_HEIGHT, score: 0 }
    ]
});
const broadcast = (room, payload) => {
    const data = JSON.stringify(payload);
    for (const client of room.clients) {
        if (client.socket.readyState === client.socket.OPEN) {
            client.socket.send(data);
        }
    }
};
const resetBall = (state) => {
    state.ball.x = WIDTH / 2;
    state.ball.y = HEIGHT / 2;
    state.ball.dx = -1;
    state.ball.dy = 0;
    state.ball.speed = BALL_SPEED;
    state.active = false;
};
const handleGoal = (room, scoringIndex) => {
    const state = room.state;
    state.players[scoringIndex].score += 1;
    resetBall(state);
};
const collideWithPlayer = (playerY, ball) => {
    const dist = (ball.y - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    const angle = dist * (Math.PI / 4);
    const direction = ball.dx < 0 ? 1 : -1;
    ball.dx = Math.cos(angle) * direction;
    ball.dy = Math.sin(angle);
    ball.speed *= 1.05;
};
const tickRoom = (room) => {
    const state = room.state;
    state.players.forEach((player, index) => {
        const client = room.clients.find((c) => c.playerIndex === index);
        if (!client)
            return;
        if (client.dir === 0)
            return;
        player.y = clamp(player.y + client.dir * state.playerSpeed, 0, state.height - state.paddleHeight);
        state.active = true;
    });
    if (state.active) {
        state.ball.x += state.ball.dx * state.ball.speed;
        state.ball.y += state.ball.dy * state.ball.speed;
    }
    if ((state.ball.dy < 0 && state.ball.y < state.lineWidth) ||
        (state.ball.dy > 0 && state.height - state.ball.y < state.lineWidth)) {
        state.ball.dy *= -1;
    }
    if (state.lineWidth / 2 > state.ball.x) {
        handleGoal(room, 1);
    }
    if (state.width - state.ball.x < state.lineWidth / 2) {
        handleGoal(room, 0);
    }
    if (state.ball.dx < 0 &&
        state.ball.x - state.ball.radius <= state.paddleGap + state.paddleWidth &&
        state.ball.y >= state.players[0].y &&
        state.ball.y <= state.players[0].y + state.paddleHeight) {
        state.ball.x = state.paddleGap + state.paddleWidth + state.ball.radius;
        collideWithPlayer(state.players[0].y, state.ball);
    }
    if (state.ball.dx > 0 &&
        state.ball.x + state.ball.radius >= state.width - state.paddleGap - state.paddleWidth &&
        state.ball.y >= state.players[1].y &&
        state.ball.y <= state.players[1].y + state.paddleHeight) {
        state.ball.x = state.width - state.paddleGap - state.paddleWidth - state.ball.radius;
        collideWithPlayer(state.players[1].y, state.ball);
    }
    broadcast(room, { type: 'state', state });
};
const ensureLoop = (room) => {
    if (room.loop)
        return;
    room.loop = setInterval(() => tickRoom(room), TICK_MS);
};
const teardownRoom = (roomCode) => {
    const room = rooms.get(roomCode);
    if (!room)
        return;
    if (room.loop) {
        clearInterval(room.loop);
    }
    rooms.delete(roomCode);
};
const bindClient = (socket, room, playerIndex) => {
    const clientId = randomBytes(8).toString('hex');
    room.clients.push({ id: clientId, socket, playerIndex, dir: 0 });
    socket.on('message', (data) => {
        let parsed = null;
        try {
            parsed = JSON.parse(String(data));
        }
        catch {
            return;
        }
        if (parsed.type === 'input') {
            const client = room.clients.find((c) => c.id === clientId);
            if (!client)
                return;
            client.dir = parsed.dir;
        }
        else if (parsed.type === 'ping') {
            socket.send(JSON.stringify({ type: 'pong' }));
        }
    });
    socket.on('close', () => {
        room.clients = room.clients.filter((c) => c.id !== clientId);
        broadcast(room, { type: 'opponent_left' });
        teardownRoom(room.code);
    });
    broadcast(room, {
        type: 'room_joined',
        roomCode: room.code,
        playerIndex
    });
    if (room.clients.length === 2) {
        ensureLoop(room);
    }
};
export const registerGameWebSocket = (app) => {
    const wss = new WebSocketServer({ noServer: true });
    app.server.on('upgrade', (request, socket, head) => {
        if (!request.url?.startsWith('/ws/game')) {
            return;
        }
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
    wss.on('connection', (socket, request) => {
        const url = new URL(request.url ?? '', `http://${request.headers.host ?? 'localhost'}`);
        const nickname = url.searchParams.get('nickname') ?? undefined;
        let roomCode = url.searchParams.get('room')?.toUpperCase();
        let activeRoom = null;
        const sendError = (message) => {
            socket.send(JSON.stringify({ type: 'error', message }));
            socket.close();
        };
        const assignToRoom = (room) => {
            const playerIndex = room.clients.length === 0 ? 0 : 1;
            room.state.players[playerIndex].nickname = nickname;
            activeRoom = room;
            roomCode = room.code;
            bindClient(socket, room, playerIndex);
            broadcast(room, { type: 'state', state: room.state });
        };
        socket.on('message', (data) => {
            let parsed = null;
            try {
                parsed = JSON.parse(String(data));
            }
            catch {
                return sendError('Geçersiz mesaj');
            }
            if (parsed.type === 'create_room') {
                const code = makeCode();
                const room = {
                    code,
                    state: createInitialState(),
                    clients: []
                };
                rooms.set(code, room);
                assignToRoom(room);
            }
            else if (parsed.type === 'join_room') {
                const requested = parsed.roomCode.toUpperCase();
                const room = rooms.get(requested);
                if (!room)
                    return sendError('Oda bulunamadı');
                if (room.clients.length >= 2)
                    return sendError('Oda dolu');
                assignToRoom(room);
            }
            else if (parsed.type === 'input') {
                // Input handled in bindClient listener.
            }
        });
        socket.on('close', () => {
            if (!roomCode)
                return;
            teardownRoom(roomCode);
            activeRoom = null;
        });
    });
};
