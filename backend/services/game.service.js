const TURN_DURATION = 60;
const TOTAL_TOKENS_PER_PLAYER = 12;

const GRID_INIT = [
    [
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: 'Yam', id: 'yam', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
    ]
];

const DECK_INIT = {
    dices: [
        { id: 1, value: '', locked: true },
        { id: 2, value: '', locked: true },
        { id: 3, value: '', locked: true },
        { id: 4, value: '', locked: true },
        { id: 5, value: '', locked: true },
    ],
    rollsCounter: 0,
    rollsMaximum: 3
};

const CHOICES_INIT = {
    isDefi: false,
    isSec: false,
    idSelectedChoice: null,
    availableChoices: [],
};

const ALL_COMBINATIONS = [
    { value: 'Yam', id: 'yam' },
    { value: 'Sec', id: 'sec' },
    { value: 'Défi', id: 'defi' },
    { value: 'Full', id: 'full' },
    { value: 'Carré', id: 'carre' },
    { value: 'Suite', id: 'suite' },
    { value: 'Brelan1', id: 'brelan1' },
    { value: 'Brelan2', id: 'brelan2' },
    { value: 'Brelan3', id: 'brelan3' },
    { value: 'Brelan4', id: 'brelan4' },
    { value: 'Brelan5', id: 'brelan5' },
    { value: 'Brelan6', id: 'brelan6' },
    { value: '≤8', id: 'moinshuit' },
];

const GAME_INIT = {
    idGame: null,
    isVsBotGame: false
};

const GAME_STATE_INIT = {
    currentTurn: 'player:1',
    timer: null,
    player1Score: 0,
    player2Score: 0,
    player1UsedTokens: 0,
    player2UsedTokens: 0,
    winnerPlayer: null,
    choices: {},
    deck: {}
};

const GameService = {

    init: {
        // Init first level of structure of 'gameState' object
        gameState: () => {
            const game = { ...GAME_INIT };
            game['gameState'] = { ...GAME_STATE_INIT };
            game['gameState']['timer'] = TURN_DURATION;
            game['gameState']['deck'] = { ...DECK_INIT };
            game['gameState']['choices'] = { ...CHOICES_INIT };
            game['gameState']['grid'] = [...GRID_INIT];
            return game;
        },
        deck: () => {
            return { ...DECK_INIT };
        },
        choices: () => {
            return { ...CHOICES_INIT };
        },
        grid: () => {
            return [...GRID_INIT];
        },
        combinations: () => {
            return [...ALL_COMBINATIONS];
        }
    },
    send: {
        forPlayer: {
            viewGameState: (playerKey, game) => {
                return {
                    inQueue: false,
                    inGame: true,
                    inEndGame: false,
                    idPlayer:
                        (playerKey === 'player:1')
                            ? game.player1Socket.id
                            : game.isVsBotGame ? 'bot' : game.player2Socket.id,
                    idOpponent:
                        (playerKey === 'player:1')
                            ? game.isVsBotGame ? 'bot' : game.player2Socket.id
                            : game.player1Socket.id
                };
            },
            gameTimer: (player, gameState) => {
                return {
                    playerTimer: player === gameState.currentTurn ? gameState.timer : 0,
                    opponentTimer: player === gameState.currentTurn ? 0 : gameState.timer
                }
            },
            deckViewState: (playerKey, gameState) => {
                const deckViewState = {
                    displayPlayerDeck: gameState.currentTurn === playerKey,
                    displayOpponentDeck: gameState.currentTurn !== playerKey,
                    displayRollButton: gameState.deck.rollsCounter < gameState.deck.rollsMaximum,
                    rollsCounter: gameState.deck.rollsCounter,
                    rollsMaximum: gameState.deck.rollsMaximum,
                    dices: gameState.deck.dices
                };
                return deckViewState;
            },
            choicesViewState: (playerKey, gameState) => {
                const choicesViewState = {
                    displayChoices: true,
                    canMakeChoice: playerKey === gameState.currentTurn,
                    idSelectedChoice: gameState.choices.idSelectedChoice,
                    availableChoices: gameState.choices.availableChoices
                }
                return choicesViewState;
            },
            gridViewState: (playerKey, gameState) => {
                return {
                    displayGrid: true,
                    canSelectCells: (playerKey === gameState.currentTurn) && (gameState.choices.availableChoices.length > 0),
                    grid: gameState.grid
                };
            },
            scoresViewState: (playerKey, gameState) => {
                return playerKey === 'player:1' ? {
                    playerScore: gameState.player1Score,
                    opponentScore: gameState.player2Score
                } : {
                    playerScore: gameState.player2Score,
                    opponentScore: gameState.player1Score
                };
            },
            infosViewState: (playerKey, gameState) => {
                return {
                    playerIsCurrentTurn: gameState.currentTurn === playerKey,
                    opponentIsCurrentTurn: gameState.currentTurn !== playerKey,
                };
            },
            viewQueueState: () => {
                return {
                    inQueue: true,
                    inGame: false,
                };
            },
            leaveQueueState: () => {
                return {
                    inQueue: false,
                    inGame: false,
                };
            },
            gameEndState: (playerKey, gameState) => {
                return {
                    inQueue: false,
                    inGame: true,
                    inEndGame: true,
                    win: playerKey === gameState.winnerPlayer,
                    loose: playerKey !== gameState.winnerPlayer,
                    endScore: GameService.send.forPlayer.scoresViewState(playerKey, gameState)
                }
            }
        }
    },
    timer: {
        getTurnDuration: () => {
            return TURN_DURATION;
        }
    },
    dices: {
        roll: (dicesToRoll) => {
            const rolledDices = dicesToRoll.map(dice => {
                if (dice.value === "") {
                    // Si la valeur du dé est vide, alors on le lance en mettant le flag locked à false
                    const newValue = String(Math.floor(Math.random() * 6) + 1);
                    return {
                        id: dice.id,
                        value: newValue,
                        locked: false
                    };
                } else if (!dice.locked) {
                    // Si le dé n'est pas verrouillé et possède déjà une valeur, alors on le relance
                    const newValue = String(Math.floor(Math.random() * 6) + 1);
                    return {
                        ...dice,
                        value: newValue
                    };
                } else {
                    // Si le dé est verrouillé ou a déjà une valeur mais le flag locked est true, on le laisse tel quel
                    return dice;
                }
            });
            return rolledDices;
        },
        lockEveryDice: (dicesToLock) => {
            const lockedDices = dicesToLock.map(dice => ({
                ...dice,
                locked: true
            }));
            return lockedDices;
        },
        lockOneDice: (idDice) => {

        }
    },
    choices: {
        findCombinations: (dices, isDefi, isSec) => {

            const allCombinations = ALL_COMBINATIONS;

            // Tableau des objets 'combinations' disponibles parmi 'ALL_COMBINATIONS'
            const availableCombinations = [];

            // Tableau pour compter le nombre de dés de chaque valeur (de 1 à 6)
            const counts = Array(7).fill(0);

            let hasPair = false; // check: paire
            let threeOfAKindValue = null; // check: valeur brelan
            let hasThreeOfAKind = false; // check: brelan
            let hasFourOfAKind = false; // check: carré
            let hasFiveOfAKind = false; // check: yam
            let hasStraight = false; // check: suite
            let isLessThanEqual8 = false;
            let sum = 0; // sum of dices

            for (let i = 0; i < dices.length; i++) {
                counts[dices[i].value]++;
                sum += dices[i].value;
            }

            if (counts.includes(0) === 1) {
                hasStraight = true;
            }

            for (let i = 1; i < counts.length; i++) {
                if (counts[i] === 2) {
                    hasPair = true;
                }
                if (counts[i] >= 3) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                }
                if (counts[i] >= 4) {
                    hasFourOfAKind = true;
                }
                if (counts[i] === 5) {
                    hasFiveOfAKind = true;
                }
            }

            isLessThanEqual8 = sum <= 8;

            const sortedValues = dices.map(dice => parseInt(dice.value)).sort((a, b) => a - b);
            hasStraight = sortedValues.every((value, index) => index === 0 || value === sortedValues[index - 1] + 1);

            // return available combinations
            allCombinations.forEach(combination => {
                if (
                    (combination.id.includes('brelan') && hasThreeOfAKind && parseInt(combination.id.slice(-1)) === threeOfAKindValue) ||
                    (combination.id === 'full' && hasPair && hasThreeOfAKind) ||
                    (combination.id === 'carre' && hasFourOfAKind) ||
                    (combination.id === 'yam' && hasFiveOfAKind) ||
                    (combination.id === 'suite' && hasStraight) ||
                    (combination.id === 'moinshuit' && isLessThanEqual8) ||
                    (combination.id === 'defi' && isDefi)
                ) {
                    availableCombinations.push(combination);
                }
            });

            const notOnlyBrelan = availableCombinations.some(combination => !combination.id.includes('brelan'));

            if (isSec && availableCombinations.length > 0 && notOnlyBrelan) {
                availableCombinations.push(allCombinations.find(combination => combination.id === 'sec'));
            }

            return availableCombinations;
        }
    },
    grid: {
        resetcanBeCheckedCells: (grid) => {
            const updatedGrid = grid.map(row =>
                row.map(cell => ({
                    ...cell,
                    canBeChecked: false
                }))
            );
            return updatedGrid;
        },
        updateGridAfterSelectingChoice: (idSelectedChoice, grid) => {
            const updatedGrid = grid.map(row =>
                row.map(cell => ({
                    ...cell,
                    canBeChecked: cell.id === idSelectedChoice && cell.owner === null
                }))
            );
            return updatedGrid;
        },
        selectCell: (idCell, rowIndex, cellIndex, currentTurn, grid) => {
            const updatedGrid = grid.map((row, _rowIndex) =>
                row.map((cell, _cellIndex) => ({
                    ...cell,
                    owner: _rowIndex === rowIndex && _cellIndex === cellIndex && cell.id === idCell ? currentTurn : cell.owner
                }))
            );
            return updatedGrid;
        }
    },
    score: {
        checkAndUpdateScore: (grid) => {
            const rows = grid.length;
            const cols = grid[0].length;

            let points = {
                player1Score: 0,
                player2Score: 0
            };
            let endGamePlayerKey = null;

            const checkPoints = (array, unique = false) => {
                const maxValue = unique ? array.length - 2 : Math.min(3, array.length)
                for (let z = 0; z < maxValue; z++) {
                    let current = array[z];
                    if (current === 0 || current === null) {
                        continue;
                    }

                    if (unique) {
                        for (let index = 0; index < array.length - z - 2; index++) {
                            const tmpArray = array.slice(z, array.length - index);
                            if (GameService.utils.allEquals(tmpArray)) countPoints(tmpArray.length, current);
                        }
                    } else {
                        const tmpArray = array.slice(0, array.length - z);
                        if (GameService.utils.allEquals(tmpArray)) countPoints(tmpArray.length, current);
                    }
                }
            }

            const countPoints = (count, player) => {
                const playerPointsKey = player === 'player:1' ? 'player1Score' : 'player2Score';
                if (count === 3) {
                    points[playerPointsKey]++;
                }
                if (count === 5) {
                    endGamePlayerKey = player;
                }
            }

            for (let row = 0; row < rows; row++) {
                let pions = [];
                for (let col = 0; col < cols; col++) {
                    pions.push(grid[row][col].owner);
                }
                checkPoints(pions, true);
            }

            for (let col = 0; col < cols; col++) {
                let pions = [];
                for (let row = 0; row < rows; row++) {
                    pions.push(grid[row][col].owner);
                }
                checkPoints(pions, true);
            }

            for (let row = 0; row <= rows - 3; row++) {
                for (let col = 0; col <= cols - 3; col++) {
                    let pions = [];
                    for (let i = 0; i < Math.min(5, cols - col, rows - row); i++) {
                        pions.push(grid[row + i][col + i].owner);
                    }
                    checkPoints(pions);
                }
            }

            for (let row = 0; row <= rows - 3; row++) {
                for (let col = 2; col < cols; col++) {
                    let pions = [];
                    for (let i = 0; i < Math.min(5, col, rows - row); i++) {
                        pions.push(grid[row + i][col - i].owner);
                    }
                    checkPoints(pions);
                }
            }

            return {
                ...points,
                endGamePlayerKey
            };
        }
    },
    gameTokens: {
        updateGameTokensAfterUsedOne: (gameState) => {
            if (gameState.currentTurn == 'player:1') {
                gameState.player1UsedTokens++;
            } else {
                gameState.player2UsedTokens++;
            }
            return gameState;
        },
        playerHasUsedAllTheirTokens: (gameState) => {
            if (gameState.player1UsedTokens >= TOTAL_TOKENS_PER_PLAYER) {
                return 'player:1';
            }
            if (gameState.player1UsedTokens >= TOTAL_TOKENS_PER_PLAYER) {
                return 'player:2';
            }
            return false;
        }
    },
    utils: {
        findGameIndexById: (games, idGame) => {
            for (let i = 0; i < games.length; i++) {
                if (games[i].idGame === idGame) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },
        findPlayerIndexInQueueBySocketId: (queue, idSocket) => {
            for (let i = 0; i < queue.length; i++) {
                if (queue[i].id === idSocket) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },
        findGameIndexBySocketId: (games, socketId) => {
            for (let i = 0; i < games.length; i++) {
                if (games[i].player1Socket.id === socketId || (!games[i].isVsBotGame && games[i].player2Socket.id === socketId)) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },
        findGamePlayerKeyBySocketId: (game, socketId) => {
            if (game.player1Socket.id === socketId) {
                return 'player:1';
            } else if (game.player2Socket.id === socketId) {
                return 'player:2';
            }
            return false;
        },
        findDiceIndexByDiceId: (dices, idDice) => {
            for (let i = 0; i < dices.length; i++) {
                if (dices[i].id === idDice) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },
        allEquals: (array) => {
            return array.every(val => val === array[0]);
        },
        getFreeCombinations: (game) => {
            const freeCases = [];
            for (let i = 0; i < game.gameState.grid.length; i++) {
                for (let j = 0; j < game.gameState.grid[i].length; j++) {
                    if (game.gameState.grid[i][j].owner === null) {
                        freeCases.push(game.gameState.grid[i][j].id);
                    }
                }
            }
            return [...ALL_COMBINATIONS].filter(combination => freeCases.includes(combination.id));
        }
    }
}

module.exports = GameService;