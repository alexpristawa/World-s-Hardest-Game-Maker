let boardClickHandler = (event) => {
    if(event.dummy !== true) {
        if(event.target == document.documentElement) {
            return;
        }
        if(event.target.parentElement.classList.contains('boundaryEditor')) {
            return;
        }
        if(event.target.classList.contains('boundaryEditor')) {
            return;
        }
        if(event.target.classList.contains('innerBoard')) {
            return;
        }
    }

    if(event.dummy !== true) {
        if(event.target.classList.contains('grid') && ['edit', 'none'].indexOf(activeClick) != -1 || event.target.classList.contains('boundaryEditor')) {
            return;
        }
    }

    //Gets rid of current boundary editors
    document.querySelectorAll('.boundaryEditor').forEach(element => element.fadeOut(200));

    //Finds out what kind of tile you clicked on
    let distanceX = event.clientX - boardOffset.x;
    let distanceY = event.clientY - boardOffset.y;

    if(distanceX < 0 || distanceX > diameter.boardWidth || distanceY < 0 || distanceY > diameter.boardHeight) {
        return;
    }

    //If it is asking for a target tile
    if(clickQuery !== false) {
        if(event.target.dataset.type == 'safeZone') {
            if(['Spawn', 'Checkpoint'].indexOf(clickQuery.type) != -1) {
                let i = entities.safeZones.indexOfObjectValue('element', event.target);
                console.log(clickQuery);
                groups[clickQuery.group].mainSquare = {
                    x: entities.safeZones[i].x,
                    y: entities.safeZones[i].y,
                    obj: entities.safeZones[i]
                };
                goButton.innerHTML = 'Go!';
                goButton.style.fontSize = '1.5rem';
                clickQuery = false;
                for(let i = 0; i < editTarget.length; i++) {
                    setOriginalColor(editTarget[i].element);
                }
                editTarget = [];
            }
        }
        return;
    }

    //If it is not reconstructing the board
    //Editing logic is inside here
    if(event.dummy !== true && event.cameFrom !== 'mousemove' && !(boardTypes.includes(event.target.dataset.type) && boardTypes.includes(activeClick))) {

        //Accidental click?
        if(event.target.classList.contains('grid') && activeClick == 'none') {
            return;
        } else if(['safeZone', 'enemy', 'coin'].indexOf(event.target.dataset.type) != -1) {

            let key = activeClickTranslations[event.target.dataset.type];
            let obj = entities[key][entities[key].indexOfObjectValue('element', event.target)];

            //Changes activeClick to whatever you clicked on
            if(activeClick !== event.target.dataset.type) {
                activeClick = event.target.dataset.type;
                clearEveryColor();
                clickButtons[activeClick].element.style.backgroundColor = rootVariables.lightTileColor;
            }

            let added = addToEditTarget(obj, false, event.cameFrom=='mouseMove');
            structureEditOptions(event.target);
            setEditColor(event.target);

            //Adds the object from entities array to editTarget
            

            if(event.target.dataset.type == 'enemy') {
                if(obj.showCustomBoundaries) {
                    showCustomBoundaries(false, false);
                }
            }
            return {
                type: 'edit',
                added: added,
                obj: obj
            };
        }

        if((!event.target.classList.contains('grid') && !event.target.classList.contains('tile')) && ['edit', 'tile'].indexOf(activeClick) == -1) {
            return;
        }
    }

    //Resets editTarget if you didn't click on something that can be clicked on
    if(['tile', 'noTile'].indexOf(activeClick) != -1) {
        if(!keyboard.Shift && event.dummy !== true) {
            editTarget.forEach(obj => setOriginalColor(obj.element));
            editTarget = [];
        }
    }

    if(['tile', 'noTile', 'safeZone'].indexOf(activeClick) != -1) {
        let targetTile = tiles[Math.floor(distanceY/diameter.tile)][Math.floor(distanceX/diameter.tile)];
        let tileX = Math.floor(distanceX / diameter.tile);
        let tileY = Math.floor(distanceY / diameter.tile);
        
        let div = document.querySelector(`.boardBackground > :nth-child(${boardRows*tileX+tileY + 1})`);
        try {
            div.dataset.type = activeClick;
        } catch {
            console.log(div);
            console.log(distanceX);
            console.log(distanceY);
        }
        overwriteTileInArray(tileX, tileY, activeClick);
        if(activeClick == 'tile') {
            tiles[tileY][tileX] = 'tile';
            if((tileX+tileY)%2 == 0 ) {
                div.style.backgroundColor = rootVariables.darkTileColor;
            } else {
                div.style.backgroundColor = rootVariables.lightTileColor;
            }
            div.style.zIndex = 0;
            div.style.border = '0px';

            try {
                if(!(['tile', 'safeZone'].indexOf(tiles[tileY-1][tileX]) != -1) && tileY-1 >= 0) {
                    document.querySelector(`.boardBackground > :nth-child(${boardRows*tileX+(tileY-1) + 1})`).style.borderBottom = '4px solid black';
                }
            } catch {
                div.style.borderTop = '4px solid black';
            }
            try {
                if(!(['tile', 'safeZone'].indexOf(tiles[tileY+1][tileX]) != -1) && tileY+1 < tiles.length) {
                    document.querySelector(`.boardBackground > :nth-child(${boardRows*tileX+(tileY+1) + 1})`).style.borderTop = '4px solid black';
                }
            } catch {
                div.style.borderBottom = '4px solid black';
            }
            try {
                if(tileX - 1 < 0) {
                    div.style.borderLeft = '4px solid black';
                } else if(!(['tile', 'safeZone'].indexOf(tiles[tileY][tileX - 1]) != -1) && tileX-1 >= 0) {
                    document.querySelector(`.boardBackground > :nth-child(${boardRows*(tileX-1)+tileY + 1})`).style.borderRight = '4px solid black';
                } 
            } catch {
                div.style.borderLeft = '4px solid black';
            }
            try {
                if(tileX+1 >= tiles[0].length) {
                    div.style.borderRight = '4px solid black';
                } else if(!(['tile', 'safeZone'].indexOf(tiles[tileY][tileX + 1]) != -1) && tileX+1 < tiles[0].length) {
                    document.querySelector(`.boardBackground > :nth-child(${boardRows*(tileX+1)+tileY + 1})`).style.borderLeft = '4px solid black';
                }
            } catch {
                div.style.borderRight = '4px solid black';
            } 
        } else if(activeClick == 'noTile') {
            div.style.backgroundColor = rootVariables.backgroundColor;
            div.style.zIndex = 2;
            tiles[tileY][tileX] = 'noTile';
            div.style.border = '4px solid black';
            entities.noTiles.numericInsert({x: tileX, y: tileY, type: 'noTile'}, 'x');
            try {
                if(!(['tile', 'safeZone'].indexOf(tiles[tileY-1][tileX]) != -1) && tileY-1 >= 0) {
                    div.style.borderTop = '0px';
                    document.querySelector(`.boardBackground > :nth-child(${boardRows*tileX+(tileY-1) + 1})`).style.borderBottom = '0px';
                }
            } catch {
                div.style.borderTop = '0px';
            }
            try {
                if(!(['tile', 'safeZone'].indexOf(tiles[tileY+1][tileX]) != -1) && tileY+1 < tiles.length) {
                    div.style.borderBottom = '0px';
                    document.querySelector(`.boardBackground > :nth-child(${boardRows*tileX+(tileY+1) + 1})`).style.borderTop = '0px';
                }
            } catch {
                div.style.borderBottom = '0px';
            }
            try {
                if(tileX - 1 < 0) {
                    div.style.borderLeft = '0px';
                } else if(!(['tile', 'safeZone'].indexOf(tiles[tileY][tileX - 1]) != -1)) {
                    div.style.borderLeft = '0px';
                    document.querySelector(`.boardBackground > :nth-child(${boardRows*(tileX-1)+tileY + 1})`).style.borderRight = '0px';
                }
            } catch {
                div.style.borderLeft = '0px';
            }
            try {
                if(tileX+1 >= tiles[0].length) {
                    div.style.borderRight = '0px';
                } else if(!(['tile', 'safeZone'].indexOf(tiles[tileY][tileX + 1]) != -1)) {
                    div.style.borderRight = '0px';
                    document.querySelector(`.boardBackground > :nth-child(${boardRows*(tileX+1)+tileY + 1})`).style.borderLeft = '0px';
                }
            } catch {
                div.style.borderRight = '0px';
            } 
        } else if(activeClick == 'safeZone') {
            if(targetTile == 'tile') {
                div.style.backgroundColor = rootVariables.safeZoneColor;
                div.style.zIndex = 2;
                tiles[tileY][tileX] = 'safeZone';
                let obj = {
                    x: tileX, 
                    y: tileY, 
                    element: div, 
                    groups: [], 
                    special: 'none',
                    type: 'safeZone'
                };
                if(event.dummy === true) {
                    obj = JSON.parse(JSON.stringify(event.obj));
                    obj.element = div;
                    for(let i = 0; i < event.mainSquares.length; i++) {
                        groups[event.mainSquares[i]].mainSquare.obj = obj;
                    }
                }
                entities.safeZones.numericInsert(obj, 'x');
                if(event.dummy !== true) {
                    structureEditOptions(div);
                    setEditColor(div);
                    addToEditTarget(obj, false, true);
                } else if(event.editElement === true) {
                    addToEditTarget(obj, true);
                    setEditColor(div);
                }
            }
        }
    } else if(['enemy', 'coin'].indexOf(activeClick) != -1) {

        //Gets grid square numbers for the tile that you clicked on
        let xNum = Math.floor(distanceX / diameter.gridSquare + 0.5);
        let yNum = Math.floor(distanceY / diameter.gridSquare + 0.5);

    
        let div = document.createElement('div');
        div.classList.add('entities');
        div.style.top = `${yNum * diameter.gridSquare}px`;
        div.style.left = `${xNum * diameter.gridSquare}px`;

        innerBoard.appendChild(div);

        div.dataset.type = activeClick;

        if(activeClick == 'enemy') {
            div.classList.add('enemies');
            let obj = {
                element: div,
                x: xNum,
                y: yNum,
                movement: 'v',
                direction: -1,
                behavior: {
                    type: 'normal',
                    boundVMin: 'none',
                    boundVMax: 'none',
                    boundHMin: 'none',
                    boundHMax: 'none'
                },
                speed: defaultBallSpeed,
                groups: [],
                collisions: true,
                showCustomBoundaries: false,
                type: 'enemy'
            }
            if(event.dummy !== true) {
                structureEditOptions(div);
                setEditColor(div);
                addToEditTarget(obj, false, true);
            } else if(event.dummy === true) {
                obj = JSON.parse(JSON.stringify(event.obj));
                obj.element = div;
                for(let i = 0; i < obj.groups.length; i++) {
                    groups[obj.groups[i]].elements.push(div);
                    groups[obj.groups[i]].objects.push(obj);
                }
                if(event.editElement === true) {
                    addToEditTarget(obj, true);
                    setEditColor(div);
                }
            }
            entities.enemies.numericInsert(obj, 'x');
        } else if(activeClick == 'coin') {
            div.classList.add('coins');
            let obj = {
                element: div,
                x: xNum,
                y: yNum,
                collected: false,
                type: 'coin',
                groups: [] /* Still includes this so obj.groups.length isn't undefined */
            };
            if(event.dummy !== true) {
                structureEditOptions(div);
                setEditColor(div);
                addToEditTarget(obj, false, true);
            } else if(event.editElement === true) {
                addToEditTarget(obj, true);
                setEditColor(div);
            }
            entities.coins.numericInsert(obj, 'x');
        }
    } else if(activeClick == 'edit') {
        structureEditOptions(event.target);
        setEditColor(event.target);
        addToEditTarget(entities[event.target.dataset.type][entities[event.target.dataset.type].indexOfObjectValue(event.target, 'element')]);
    }
};