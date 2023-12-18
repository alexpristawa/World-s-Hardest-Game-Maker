let boardClickHandler = (event) => {
    let distanceX = event.clientX - boardOffset.x;
    let distanceY = event.clientY - boardOffset.y;
    let targetTile = tiles[Math.floor(distanceY/diameter.tile)][Math.floor(distanceX/diameter.tile)];

    if(clickQuery !== false) {
        if(event.target.dataset.type == 'safeZone') {
            if(['Spawn', 'Checkpoint'].indexOf(clickQuery.type) != -1) {
                let i = entities.safeZones.indexOfObjectValue('element', event.target);
                groups[clickQuery.group].mainSquare = {
                    x: entities.safeZones[i].x,
                    y: entities.safeZones[i].y
                };
                goButton.innerHTML = 'Go!';
                goButton.style.fontSize = '1.5rem';
                clickQuery = false;
                for(let i = 0; i < editTarget.length; i++) {
                    setOriginalColor(editTarget[i]);
                }
                editTarget = [];
            }
        }
        return;
    }

    if(event.dummy !== true) {
        if(event.target.classList.contains('grid') && activeClick == 'none') {
            return;
        } else if(['safeZone', 'enemy', 'coin'].indexOf(event.target.dataset.type) != -1) {
            structureEditOptions(event.target);
            setEditColor(event.target);
            addToEditTarget(event.target);
        }

        if(!event.target.classList.contains('grid') && ['edit', 'tile'].indexOf(activeClick) == -1) {
            return;
        }
    }

    if(['tile', 'noTile', 'coin'].indexOf(activeClick) != -1) {
        editTarget.forEach(element => setOriginalColor(element));
        editTarget = [];
    }

    if(['tile', 'noTile', 'safeZone'].indexOf(activeClick) != -1) {
        let tileX = Math.floor(distanceX / diameter.tile);
        let tileY = Math.floor(distanceY / diameter.tile);
        
        
        let div = document.querySelector(`.boardBackground > :nth-child(${boardRows*tileX+tileY + 1})`);
        div.dataset.type = activeClick;
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
            entities.noTiles.numericInsert({x: tileX, y: tileY}, 'x');
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
                    special: 'none'
                };
                if(event.dummy === true) {
                    obj = JSON.parse(JSON.stringify(event.obj));
                    obj.element = div;
                }
                entities.safeZones.numericInsert(obj, 'x');
                if(event.dummy !== true) {
                    structureEditOptions(div);
                    setEditColor(div);
                    addToEditTarget(div);
                }
            }
        }
    } else if(['enemy', 'coin'].indexOf(activeClick) != -1) {
        let xNum = Math.floor((distanceX-diameter.tile/8*3 + 4) / diameter.gridSquare) + 1;

        let yNum = Math.floor((distanceY-diameter.tile/8*3 + 4) / diameter.gridSquare) + 1;

    
        let div = document.createElement('div');
        div.classList.add('entities');
        div.style.top = `${yNum * diameter.gridSquare}px`;
        div.style.left = `${xNum * diameter.gridSquare}px`;

        innerBoard.appendChild(div);

        div.dataset.type = activeClick;

        if(activeClick == 'enemy') {
            div.classList.add('enemies');
            if(event.dummy !== true) {
                structureEditOptions(div);
                setEditColor(div);
                addToEditTarget(div);
            }
            let obj = {
                element: div,
                x: xNum,
                y: yNum,
                movement: 'v',
                direction: -1,
                behavior: {
                    bound1: 'none',
                    bound2: 'none'
                },
                speed: defaultBallSpeed,
                groups: [],
                collisions: true,
                customBoundaries: false
            }
            if(event.dummy === true) {
                obj = JSON.parse(JSON.stringify(event.obj));
                obj.element = div;
                for(let i = 0; i < obj.groups.length; i++) {
                    groups[obj.groups[i]].elements.push(div);
                }
            }
            entities.enemies.numericInsert(obj, 'x');
        } else if(activeClick == 'coin') {
            div.classList.add('coins');
            if(event.dummy !== true) {
                structureEditOptions(div);
                setEditColor(div);
                addToEditTarget(div);
            }
            entities.coins.numericInsert({
                element: div,
                x: xNum,
                y: yNum,
                collected: false
            }, 'x');
            editTarget = [div];
        }
    } else if(activeClick == 'edit') {
        structureEditOptions(event.target);
        setEditColor(event.target);
        addToEditTarget(event.target);
    }
};