const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var uniqid = require('uniqid');
const GameService = require('./services/game.service');
const { create } = require('domain');

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
    !game.isVsBotGame && game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));
}

const updateClientsViewDecks = (game) => {
    setTimeout(() => {
        game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1', game.gameState));
        !game.isVsBotGame && game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2', game.gameState));
    }, 200);
}

const updateClientViewInfos = (game) => {
    setTimeout(() => {
        game.player1Socket.emit('game.infos.view-state', GameService.send.forPlayer.infosViewState('player:1', game.gameState));
        !game.isVsBotGame && game.player2Socket.emit('game.infos.view-state', GameService.send.forPlayer.infosViewState('player:2', game.gameState));
    }, 200);
}

const updateClientsViewChoices = (game) => {
    setTimeout(() => {
        game.player1Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:1', game.gameState));
        !game.isVsBotGame && game.player2Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:2', game.gameState));
    }, 200);
}

const updateClientsViewGrid = (game) => {
    setTimeout(() => {
        game.player1Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:1', game.gameState));
        !game.isVsBotGame && game.player2Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:2', game.gameState));
    }, 200);
}

const updateClientsViewScores = (game) => {
    setTimeout(() => {
        game.player1Socket.emit('game.scores.view-state', GameService.send.forPlayer.scoresViewState('player:1', game.gameState));
        !game.isVsBotGame && game.player2Socket.emit('game.scores.view-state', GameService.send.forPlayer.scoresViewState('player:2', game.gameState));
    }, 200);
}

const updateClientsViewEndGame = (game) => {
    game.player1Socket.emit('game.end', GameService.send.forPlayer.gameEndState('player:1', game));
    !game.isVsBotGame && game.player2Socket.emit('game.end', GameService.send.forPlayer.gameEndState('player:2', game));
}

const newPlayerInQueue = (socket) => {
    queue.push(socket);

    // Queue management
    if (queue.length >= 2) {
        const player1Socket = queue.shift();
        const player2Socket = queue.shift();
        createOnlineGame(player1Socket, player2Socket);
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

const createOnlineGame = (player1Socket, player2Socket) => {
    const newGame = GameService.init.gameState();
    newGame['idGame'] = uniqid();
    newGame['player1Socket'] = player1Socket;
    newGame['player2Socket'] = player2Socket;

    createGame(newGame);
};

const createVsBotGame = (player1Socket) => {
    const newGame = GameService.init.gameState();
    newGame['idGame'] = uniqid();
    newGame['player1Socket'] = player1Socket;
    newGame['isVsBotGame'] = true;

    createGame(newGame);
}

const createGame = (newGame) => {
    games.push(newGame);

    // Récupération de l'index de la partie
    const gameIndex = GameService.utils.findGameIndexById(games, newGame.idGame);
    const game = games[gameIndex];

    // Lancement de l'horloge
    game.gameInterval = setInterval(() => {
        console.log(uniqid());
        if (game.gameState.winnerPlayer !== null) {
            clearInterval(game.gameInterval);
            return updateClientsViewEndGame(game);
        }

        game.gameState.timer--;

        // Réinitialisation du timer car fin de tour
        if (game.gameState.timer === 0) {
            resetTurn(game);
        }

        // Envoi des données de l'horloge aux joueurs
        updateClientsViewTimers(game);
    }, 1000);

    // Envoi des données de la partie aux joueurs
    game.player1Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:1', game));
    !game.isVsBotGame && game.player2Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:1', game));

    updateClientViewInfos(game);
    updateClientsViewGrid(game);
    updateClientsViewDecks(game);

    // Arrêt de l'horloge si un des joueurs quitte la partie
    game.player1Socket.on('disconnect', () => {
        clearInterval(game.gameInterval);
    });

    !game.isVsBotGame && game.player2Socket.on('disconnect', () => {
        clearInterval(game.gameInterval);
    });
}

const endGame = (game, winnerPlayerKey) => {
    game.gameState.winnerPlayer = 'player:1';
    updateClientsViewEndGame(game);
    
    const gameIndex = GameService.utils.findGameIndexById(games, game.idGame);
    games.splice(gameIndex, 1);
}

const vsBotTurn = (game) => {
    setTimeout(() => {
        rollDices(game);

        setTimeout(() => {
            lockDice(game, 2);

            setTimeout(() => {
                rollDices(game);

                setTimeout(() => {
                    lockDice(game, 1);

                    setTimeout(() => {
                        rollDices(game);

                        setTimeout(() => {
                            if(typeof game.gameState.choices.availableChoices[0] !== "undefined") {
                                selectChoice(game, {
                                    choiceId: game.gameState.choices.availableChoices[0].id
                                });

                                // setTimeout(() => {
                                //     for(let i = 0; i < )
                                //     selectGrid(game, {

                                //     })
                                // }, 1000);
                            }
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

const resetTurn = (game) => {
    game.gameState.currentTurn = game.gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
    game.gameState.timer = GameService.timer.getTurnDuration();
    game.gameState.deck = GameService.init.deck();
    game.gameState.choices = GameService.init.choices();
    game.gameState.grid = GameService.grid.resetcanBeCheckedCells(game.gameState.grid);

    updateClientViewInfos(game);
    updateClientsViewGrid(game);
    updateClientsViewDecks(game);
    updateClientsViewChoices(game);

    game.isVsBotGame && game.gameState.currentTurn === 'player:2' && vsBotTurn(game);
}

const rollDices = (game) => {
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
        if (combinations.length === 0) {
            game.gameState.timer = 5;
        }
    }

    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
}

const lockDice = (game, idDice) => {
    const diceIndex = GameService.utils.findDiceIndexByDiceId(game.gameState.deck.dices, idDice);

    game.gameState.deck.dices[diceIndex].locked = !game.gameState.deck.dices[diceIndex].locked;

    updateClientsViewDecks(game);
}

const selectChoice = (game, data) => {
    game.gameState.choices.idSelectedChoice = data.choiceId;
    game.gameState.grid = GameService.grid.resetcanBeCheckedCells(game.gameState.grid);
    game.gameState.grid = GameService.grid.updateGridAfterSelectingChoice(game.gameState.choices.idSelectedChoice, game.gameState.grid);

    updateClientsViewGrid(game);
    updateClientsViewChoices(game);
}

const selectGrid = (game, data) => {
    game.gameState.grid = GameService.grid.selectCell(data.cellId, data.rowIndex, data.cellIndex, game.gameState.currentTurn, game.gameState.grid);

    game.gameState = GameService.gameTokens.updateGameTokensAfterUsedOne(game.gameState);

    const { player1Score, player2Score, endGamePlayerKey } = GameService.score.checkAndUpdateScore(game.gameState.grid);
    const playerHasUsedAllTheirTokens = GameService.gameTokens.playerHasUsedAllTheirTokens(game.gameState);

    game.gameState.player1Score = player1Score;
    game.gameState.player2Score = player2Score;

    if (playerHasUsedAllTheirTokens) {
        game.gameState.winnerPlayer = playerHasUsedAllTheirTokens;
        return;
    }
    if (endGamePlayerKey) {
        game.gameState.winnerPlayer = endGamePlayerKey;
        return;
    }

    // Sinon on finit le tour
    resetTurn(game);

    // et on remet à jour la vue
    updateClientsViewScores(game);
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

    socket.on('game.end', () => {
        const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
        const winnerPlayerKey = GameService.utils.findGamePlayerKeyBySocketId(games[gameIndex], socket.id);
        endGame(games[gameIndex], winnerPlayerKey === 'player:1' ? 'player:2' : 'player:1');
    })

    socket.on('game.vsbot.start', () => {
        createVsBotGame(socket);
    })

    socket.on('game.dices.roll', () => {
        const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
        rollDices(games[gameIndex]);
    });

    socket.on('game.dices.lock', (idDice) => {
        const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
        lockDice(games[gameIndex], idDice);
    });

    socket.on('game.choices.selected', (data) => {
        const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
        selectChoice(games[gameIndex], data);
    });

    socket.on('game.grid.selected', (data) => {
        const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
        selectGrid(games[gameIndex], data);
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