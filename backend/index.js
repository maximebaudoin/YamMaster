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
    setTimeout(() => {
        game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1', game.gameState));
        game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2', game.gameState));
    }, 200);
}

const updateClientsViewChoices = (game) => {
    setTimeout(() => {
        game.player1Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:1', game.gameState));
        game.player2Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:2', game.gameState));
    }, 200);
}

const updateClientsViewGrid = (game) => {
    setTimeout(() => {
        game.player1Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:1', game.gameState));
        game.player2Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:2', game.gameState));
    }, 200);
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

    // Lancement de l'horloge
    const gameInterval = setInterval(() => {
        game.gameState.timer--;

        // Réinitialisation du timer car fin de tour
        if (game.gameState.timer === 0) {
            game.gameState.currentTurn = game.gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
            game.gameState.timer = GameService.timer.getTurnDuration();
            game.gameState.deck = GameService.init.deck();
            game.gameState.choices = GameService.init.choices();
            game.gameState.grid = GameService.grid.resetcanBeCheckedCells(game.gameState.grid);

            updateClientsViewGrid(game);
            updateClientsViewDecks(game);
            updateClientsViewChoices(game);
        }

        // Envoi des données de l'horloge aux joueurs
        updateClientsViewTimers(game);
    }, 1000);

    // Envoi des données de la partie aux joueurs
    game.player1Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:1', game));
    game.player2Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:2', game));

    updateClientsViewGrid(game);
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

    game.gameState.deck.rollsCounter++;

    // Lancement des dés
    const rolledDices = GameService.dices.roll(game.gameState.deck.dices);
    game.gameState.deck.dices = rolledDices;

    const isDefi = false;
    const isSec = game.gameState.deck.rollsCounter === 1;
    const combinations = GameService.choices.findCombinations(rolledDices, isDefi, isSec);

    // we affect changes to gameState
    game.gameState.choices.availableChoices = combinations;

    // Dernier tour, on bloque tout
    if (game.gameState.deck.rollsCounter >= game.gameState.deck.rollsMaximum) {
        GameService.dices.lockEveryDice(game.gameState.deck.dices);
        game.gameState.timer = 5;
    }

    updateClientsViewDecks(game);
    updateClientsViewChoices(games[gameIndex]);
}

const lockDiceInGame = (socketId, idDice) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socketId);
    const game = games[gameIndex];
    const diceIndex = GameService.utils.findDiceIndexByDiceId(game.gameState.deck.dices, idDice);

    game.gameState.deck.dices[diceIndex].locked = !game.gameState.deck.dices[diceIndex].locked;

    updateClientsViewDecks(game);
}

const selectChoiceInGame = (socketId, data) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socketId);
    const game = games[gameIndex];

    game.gameState.choices.idSelectedChoice = data.choiceId;
    game.gameState.grid = GameService.grid.resetcanBeCheckedCells(game.gameState.grid);
    game.gameState.grid = GameService.grid.updateGridAfterSelectingChoice(game.gameState.choices.idSelectedChoice, game.gameState.grid);

    updateClientsViewGrid(game);
    updateClientsViewChoices(game);
}

const selectGridInGame = (socketId, data) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socketId);
    const game = games[gameIndex];

    // La sélection d'une cellule signifie la fin du tour (ou plus tard le check des conditions de victoires)
    // On reset l'état des cases qui étaient précédemment clicables.
    game.gameState.grid = GameService.grid.resetcanBeCheckedCells(game.gameState.grid);
    game.gameState.grid = GameService.grid.selectCell(data.cellId, data.rowIndex, data.cellIndex, game.gameState.currentTurn, game.gameState.grid);

    // TODO: Ici calculer le score
    // TODO: Puis check si la partie s'arrête (lines / diagolales / no-more-gametokens)

    // Sinon on finit le tour
    game.gameState.currentTurn = game.gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
    game.gameState.timer = GameService.timer.getTurnDuration();

    // On remet le deck et les choix à zéro (la grille, elle, ne change pas)
    game.gameState.deck = GameService.init.deck();
    game.gameState.choices = GameService.init.choices();

    // On reset le timer
    game.player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));
    game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));

    // et on remet à jour la vue
    updateClientsViewGrid(game);
    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
}

// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------

io.on('connection', socket => {

    socket.on('queue.join', () => {
        newPlayerInQueue(socket);
    });

    socket.on('queue.leave', () => {
        playerLeaveQueue(socket);
    });

    socket.on('game.dices.roll', () => {
        rollDicesInGame(socket.id);
    });

    socket.on('game.dices.lock', (idDice) => {
        lockDiceInGame(socket.id, idDice);
    });

    socket.on('game.choices.selected', (data) => {
        selectChoiceInGame(socket.id, data);
    });

    socket.on('game.grid.selected', (data) => {
        selectGridInGame(socket.id, data);
    });

    socket.on('disconnect', reason => {
        // console.log(`[${socket.id}] socket disconnected - ${reason}`);
    });
});

// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------

app.get('/', (req, res) => res.sendFile('index.html'));

http.listen(3000, function () {
    console.log('listening on *:3000');
});