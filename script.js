const root = document.querySelector(':root');
let rootStyles = getComputedStyle(document.documentElement);
const body = document.querySelector('body');

let rootVariables = {
    backgroundColor: 'rgb(180,181,254)',
    lightTileColor: 'rgb(247,247,255)',
    darkTileColor: 'rgb(230,230,255)',
    safeZoneColor: 'rgb(182,254,180)',
    playerColor: 'rgb(255,0,0)',
    playerBorderColor: 'rgb(0,0,0)',
    enemyColor: 'rgb(0,0,255)',
    enemyBorderColor: 'rgb(0,0,0)',
    coinColor: 'rgb(255,255,0)',
    coinBorderColor: 'rgb(0,0,0)'
}

let keyboard = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false,
    G: false,
    g: false,
    Shift: false
}

let keyboardCorrections = {
    
}

let resetEntitiesObj = () => {
    entities = {
        safeZones: [],
        noTiles: [],
        enemies: [],
        coins: []
    }
}
let entities;

let groups = {};

let playerHitboxes = [
    [],
    [],
    [],
    [],
    []
]

{
    let keys = Object.keys(rootVariables);
    for(let i = 0; i < keys.length; i++) {
        root.style.setProperty(`--${keys[i]}`, rootVariables[keys[i]]);
    }
}

const board = document.querySelector('.board');
const innerBoard = document.querySelector('.innerBoard');
const boardBackground = document.querySelector('.boardBackground');
const visionGridColumn = document.querySelector('.visionGridColumn');
const visionGridRow = document.querySelector('.visionGridRow');
const visionGridNoOverflow = document.getElementById('visionGridNoOverflow');
const itemsHolder = document.getElementById('itemsHolder');
const goButton = document.querySelector('.goButton');

const canvas = document.getElementById('gameCanvas');
let canvasParent = canvas.parentElement;
canvas.width = canvasParent.clientWidth;
canvas.height = canvasParent.clientHeight;
const ctx = canvas.getContext('2d');

const optionsHolders = {
    safeZone: document.getElementById('optionsHolderSafeZone'),
    enemy: document.getElementById('optionsHolderEnemy')
}
const editGroupsList = document.querySelector('#editGroups > div:nth-child(1)');
const editGroupsDiv = document.getElementById('editGroups');
let deltaTime;
let previousTime = undefined;
let clickQuery = false;
let editTarget = [];
let radius = {};
let diameter = {};
let dimensions = {};
let tiles = [];
let boardOffset;
let boardColumns = 30;
let boardRows = 18;
let activeClick = 'none';
let defaultBallSpeed = 1;
let gameSpeed = 1;
let editing = true;
boardBackground.style.gridTemplateColumns = `repeat(${boardColumns}, 1fr)`;
boardBackground.style.gridTemplateRows = `repeat(${boardRows}, 1fr)`;
let clickButtons = {
    edit: {
        element: document.querySelector("#editButton"),
        defaultColor: "blue"
    },
    tile: {
        element: document.querySelector('.itemsHolder > .tile')
    },
    noTile: {
        element: document.querySelector('.itemsHolder > .noTile')
    }, 
    safeZone: {
        element: document.querySelector('.itemsHolder > .safeZone')
    },
    enemy: {
        element: document.querySelector('.itemsHolder > .enemy')
    },
    coin: {
        element: document.querySelector('.itemsHolder > .coin')
    }
};

/*
    Creates the board, filling it with tiles
    To change the size of the board, change boardColumns and boardRows and call recreateBoard();
*/
let recreateBoard = () => {
    for(let i = 0; i < boardColumns; i++) {
        for(let j = 0; j < boardRows; j++) {
            let div = document.createElement('div');
            div.classList.add('tile');
            div.style.gridColumn = `${i+1} / ${i+2}`;
            div.style.gridRow = `${j+1} / ${j+2}`;
            div.dataset.type = 'tile';
            if(i == 0) {
                div.style.borderLeft = '4px solid black';
            } else if(i == boardColumns-1) {
                div.style.borderRight = '4px solid black';
            }
            if(j == 0) {
                div.style.borderTop = '4px solid black';
            } else if(j == boardRows-1) {
                div.style.borderBottom = '4px solid black';
            }
            if((i%2 + j)%2 == 1) {
                div.style.backgroundColor = rootVariables.lightTileColor;
            } else {
                div.style.backgroundColor = rootVariables.darkTileColor;
            }
            boardBackground.appendChild(div);
        }
    }
}

/*
    Resets the `tiles` array (which contains either "tile", "noTile", "safeZone")
*/
let resetTilesArray = () => {
    tiles = [];
    for(let i = 0; i < boardRows; i++) {
        let newArr = [];
        for(let j = 0; j < boardColumns; j++) {
            newArr.push('tile');
        }
        tiles.push(newArr);
    }
}

/*
    Makes the grid based on boardColumns and boardRows
*/
let makeGrid = () => {
    visionGridColumn.style.gridTemplateColumns = `repeat(${boardColumns * 2 + 1}, 1fr)`;
    visionGridRow.style.gridTemplateRows = `repeat(${boardRows * 2 + 1}, 1fr)`;

    for(let i = 0; i < boardColumns*2; i++) {
        let div = document.createElement('div');
        div.classList.add('gridLines');
        div.classList.add('grid');
        div.style.gridColumn = `${i+1} / ${i+2}`;
        div.style.gridRow = '1 / 2';
        visionGridColumn.appendChild(div);
    }

    for(let i = 0; i < boardRows*2; i++) {
        let div = document.createElement('div');
        div.classList.add('gridLines');
        div.classList.add('grid');
        div.style.gridRow = `${i+1} / ${i+2}`;
        div.style.gridColumn = '1 / 2';
        visionGridRow.appendChild(div);
    }
}

window.onload = () => {
    let width = window.innerWidth/50 * boardColumns;
    let height = window.innerWidth/50 * boardRows;
    let tileSize = width/boardColumns;
    board.style.width = `${width}px`;
    board.style.height = `${height}px`;
    root.style.setProperty('--tileSize', `${tileSize}px`);

    radius = {
        tile: tileSize/2,
        entityBorder: tileSize/8,
        player: tileSize/2*0.7,
        enemy: tileSize/4,
        coin: tileSize/4,
        gridSquare: tileSize/4
    };

    diameter = {
        tile: tileSize,
        player: tileSize * 0.7,
        enemy: tileSize/2,
        coin: tileSize/2,
        boardHeight: board.offsetHeight,
        boardWidth: board.offsetWidth,
        gridSquare: tileSize/2
    };

    const rect = board.getBoundingClientRect();
    boardOffset = {
        x: rect.left, 
        y: rect.top
    };

    resetEntitiesObj();
    resetTilesArray();
    recreateBoard();
    makeGrid();
}