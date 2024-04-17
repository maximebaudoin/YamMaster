const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var uniqid = require('uniqid');
const GameService = require('./services/game.service');

// ---------------------------------------------------
// -------- CONSTANTS AND GLOBAL VARIABLES -----------
// ---------------------------------------------------

let games = [];
let queue = [];

// ---------------------------------
// -------- GAME METHODS -----------
// ---------------------------------

const updateClientsViewTimers = (game) => {
    game.player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));
    game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));
}

const updateClientsViewDecks = (game) => {
    game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1', game.gameState));
    game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2', game.gameState));
}

const newPlayerInQueue = (socket) => {

    queue.push(socket);

    // Queue management
    if (queue.length >= 2) {
        const player1Socket = queue.shift();
        const player2Socket = queue.shift();
        createGame(player1Socket, player2Socket);
    } else {
        socket.emit('queue.added', GameService.send.forPlayer.viewQueueState());
    }
};

const playerLeaveQueue = (socket) => {
    const indexOfPlayerInQueue = GameService.utils.findPlayerIndexInQueueBySocketId(queue, socket.id);
    if (indexOfPlayerInQueue > -1) {
        queue.splice(indexOfPlayerInQueue, 1);
    }
    socket.emit('queue.removed', GameService.send.forPlayer.leaveQueueState());
};

const createGame = (player1Socket, player2Socket) => {

    // Initialisation des valeurs par défaut
    const newGame = GameService.init.gameState();
    newGame['idGame'] = uniqid();
    newGame['player1Socket'] = player1Socket;
    newGame['player2Socket'] = player2Socket;

    games.push(newGame);

    // Récupération de l'index de la partie
    const gameIndex = GameService.utils.findGameIndexById(games, newGame.idGame);
    const game = games[gameIndex];

    // Envoi des données de la partie aux joueurs
    game.player1Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:1', game));
    game.player2Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:2', game));

    // Lancement de l'horloge
    const gameInterval = setInterval(() => {
        game.gameState.timer--;

        // Réinitialisation du timer car fin de tour
        if (game.gameState.timer === 0) {
            game.gameState.currentTurn = game.gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
            game.gameState.timer = GameService.timer.getTurnDuration();
            game.gameState.deck = GameService.init.deck();
            updateClientsViewDecks(game);
        }

        // Envoi des données de l'horloge aux joueurs
        updateClientsViewTimers(game);
    }, 1000);

    updateClientsViewDecks(game);

    // Arrêt de l'horloge si un des joueurs quitte la partie
    player1Socket.on('disconnect', () => {
        clearInterval(gameInterval);
    });

    player2Socket.on('disconnect', () => {
        clearInterval(gameInterval);
    });
};

const rollDicesInGame = (socketId) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socketId);
    const game = games[gameIndex];

    // Lancement des dés
    const rolledDices = GameService.dices.roll(game.gameState.deck.dices);
    game.gameState.deck.dices = rolledDices;

    if(game.gameState.deck.rollsCounter >= game.gameState.deck.rollsMaximum) {
        GameService.dices.lockEveryDice(game.gameState.deck.dices);
        game.gameState.timer = 5;
    }

    game.gameState.deck.rollsCounter++;

    updateClientsViewDecks(game);
}

const lockDiceInGame = (socketId, idDice) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socketId);
    const game = games[gameIndex];

    const diceIndex = GameService.utils.findDiceIndexByDiceId(game.gameState.deck.dices, idDice);
    game.gameState.deck.dices[diceIndex].locked = !game.gameState.deck.dices[diceIndex].locked;

    updateClientsViewDecks(game);
}

// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------

io.on('connection', socket => {
    console.log(`[${socket.id}] socket connected`);

    socket.on('queue.join', () => {
        console.log(`[${socket.id}] new player in queue`);
        newPlayerInQueue(socket);
    });

    socket.on('queue.leave', () => {
        console.log(`[${socket.id}] player leave queue`);
        playerLeaveQueue(socket);
    });

    socket.on('game.dices.roll', () => {
        console.log(`[${socket.id}] roll dices of game`);
        rollDicesInGame(socket.id);
    });

    socket.on('game.dices.lock', (idDice) => {
        console.log(`[${socket.id}] lock dice (${idDice}) of game`);
        lockDiceInGame(socket.id, idDice);
    });

    socket.on('disconnect', reason => {
        console.log(`[${socket.id}] socket disconnected - ${reason}`);
    });
});

// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------

app.get('/', (req, res) => res.sendFile('index.html'));

http.listen(3000, function () {
    console.log('listening on *:3000');
});