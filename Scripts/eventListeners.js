clickButtons.tile.element.addEventListener('click', () => {
    clearEveryColor();
    if(activeClick != 'tile') {
        clickButtons.tile.element.style.backgroundColor = rootVariables.lightTileColor;
        activeClick = 'tile';
    } else {
        activeClick = 'none';
    }
});

clickButtons.noTile.element.addEventListener('click', () => {
    clearEveryColor();
    if(activeClick != 'noTile') {
        clickButtons.noTile.element.style.backgroundColor = rootVariables.lightTileColor;
        activeClick = 'noTile';
    } else {
        activeClick = 'none';
    }
});

clickButtons.safeZone.element.addEventListener('click', () => {
    clearEveryColor();
    if(activeClick != 'safeZone') {
        clickButtons.safeZone.element.style.backgroundColor = rootVariables.lightTileColor;
        activeClick = 'safeZone';
    } else {
        activeClick = 'none';
    }
});

clickButtons.enemy.element.addEventListener('click', () => {
    clearEveryColor();
    if(activeClick != 'enemy') {
        clickButtons.enemy.element.style.backgroundColor = rootVariables.lightTileColor;
        activeClick = 'enemy';
    } else {
        activeClick = 'none';
    }
});

clickButtons.coin.element.addEventListener('click', () => {
    clearEveryColor();
    if(activeClick != 'coin') {
        clickButtons.coin.element.style.backgroundColor = rootVariables.lightTileColor;
        activeClick = 'coin';
    } else {
        activeClick = 'none';
    }
});

clickButtons.edit.element.addEventListener('click', editButtonFunction);

boardResize.left.addEventListener('mousedown', () => {
    let leftmostPoint = boardOffset.x;
    let hitboxInfo = boardResize.left.turnIntoHitbox(['left', 'top', 'height', 'width', 'z-index']);

    let mousemoveHandler = (event) => {
        let x = event.clientX;

        if(Math.abs(leftmostPoint - x) > diameter.tile) {
            let direction = 1;
            if(x > leftmostPoint) {
                boardColumns--;
                direction = -1;
            } else {
                boardColumns++;
            }

            Object.keys(entities).forEach(key => {
                for(let i = 0; i < entities[key].length; i++) {
                    if(['enemies', 'coins'].includes(key)) {
                        entities[key][i].x += direction * 2;
                    } else {
                        entities[key][i].x += direction;
                    }
                }
            });
            restoreBoard();
            leftmostPoint = boardOffset.x;
        }
    }

    let mouseupHandler = () => {
        document.removeEventListener('mousemove', mousemoveHandler);
        document.removeEventListener('mouseup', mouseupHandler);
        boardResize.left.applyStyles(hitboxInfo);
    }
    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
});

document.addEventListener('keydown', (event) => {
    let key = event.key;
    if(keyboardCorrections[key] != undefined) {
        key = keyboardCorrections[key];
    }
    if(keyboard[key] != undefined) {
        keyboard[key] = true;
    }
    
    //Checks for these values based on if you're not typing in a text box
    if(!(event.target.tagName === 'INPUT' && event.target.type === 'text') && event.target.tagName !== 'TEXTAREA' && !event.target.isContentEditable) {
        if(key == 't') {
            settings.twoPlayer = 'Team';
        }
        if(key == 'T') {
            settings.twoPlayer = 'Race';
        }
        if(key == 'n') {
            settings.twoPlayer = false;
        }
        if(key == 'G') {
            if(gridIsOn) {
                gridIsOn = false;
                visionGridNoOverflow.style.display = 'none';
            } else {
                gridIsOn = true;
                visionGridNoOverflow.style.display = 'block';
            }
        }
        if(editing) {
            if(key == 'Backspace') {
                if(editGroupsDiv.dataset.active == 'true') {
                    let key = editGroupsDiv.dataset.group;
                    deleteGroup(key);
                } else {
                    let previousActiveClick = activeClick;
                    editTarget.forEach(obj => {
                        deleteObject(obj);
                    });
                    editTarget = [];
                    activeClick = previousActiveClick;
                }
            }
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(key) != -1) {
                let allSmallGrid = true;
                editTarget.forEach(obj => {
                    if(Object.values(groups).includes(obj)) {
                        if(obj.type == 'enemy') {
                            allSmallGrid = false;
                        }
                    } else if(['enemy', 'coin'].indexOf(obj.element.dataset.type) == -1) {
                        allSmallGrid = false;
                    }
                });
                let overwrittenSafeZones = [];
                let editTargetCopy = [...editTarget];
                let previousActiveClick = activeClick;
                
                //Removes safeZones from edit target
                for(let i = 0; i < editTarget.length; i++) {
                    if(editTarget[i].type == 'safeZone') {
                        editTarget.splice(i, 1);
                        i--;
                    }
                }
                let moveObject = (obj) => {
                    if(Object.values(groups).includes(obj)) {
                        for(let i = 0; i < obj.objects.length; i++) {
                            moveObject(obj.objects[i]);
                        }
                        return;
                    }
                    let oldX = obj.x;
                    let oldY = obj.y;
                    if(key == 'ArrowUp') {
                        if(allSmallGrid || obj.type == 'safeZone') {
                            obj.y--;
                        } else {
                            obj.y -= 2;
                        }
                    }
                    if(key == 'ArrowDown') {
                        if(allSmallGrid || obj.type == 'safeZone') {
                            obj.y++;
                        } else {
                            obj.y += 2;
                        }
                    }
                    if(key == 'ArrowLeft') {
                        if(allSmallGrid || obj.type == 'safeZone') {
                            obj.x--;
                        } else {
                            obj.x -= 2;
                        }
                    }
                    if(key == 'ArrowRight') {
                        if(allSmallGrid || obj.type == 'safeZone') {
                            obj.x++;
                        } else {
                            obj.x += 2;
                        }
                    }
                    if(obj.type == 'safeZone') {
                        if(obj.x < 0) {
                            obj.x = 0;
                        } else if(obj.x > boardColumns - 1) {
                            obj.x = boardColumns - 1;
                        }
                        if(obj.y < 0) {
                            obj.y = 0;
                        } else if(obj.y > boardRows - 1) {
                            obj.y = boardRows - 1;
                        }
                    } else {
                        if(obj.x < 1) {
                            obj.x = 1;
                        } else if(obj.x > boardColumns*2 - 1) {
                            obj.x = boardColumns*2 - 1;
                        }
                        if(obj.y < 1) {
                            obj.y = 1;
                        } else if(obj.y > boardRows * 2 - 1) {
                            obj.y = boardRows * 2 - 1;
                        }
                    }
                    if(obj.type == 'safeZone') {
                        //Only clears the current tile if it hasn't already been changed
                        if(overwrittenSafeZones.indexOfObjectValue('x', oldX, {y: oldY}) == -1) {
                            activeClick = 'tile';
                            boardClickHandler({
                                dummy: true,
                                clientX: boardOffset.x + diameter.tile * oldX + radius.tile,
                                clientY: boardOffset.y + diameter.tile * oldY + radius.tile,
                                obj: obj
                            });
                        }
                        //Clears the tile under the tile it is moving to to prevent duplication
                        activeClick = 'tile';
                        boardClickHandler({
                            dummy: true,
                            clientX: boardOffset.x + diameter.tile * obj.x + radius.tile,
                            clientY: boardOffset.y + diameter.tile * obj.y + radius.tile,
                            obj: obj
                        });

                        let mainSquares = []
                        for(let i = 0; i < obj.groups.length; i++) {
                            if(groups[obj.groups[i]].mainSquare.obj == obj) {
                                mainSquares.push(obj.groups[i]);
                            }
                        }
                        //Then adds the safe zone on the tile
                        activeClick = 'safeZone';
                        boardClickHandler({
                            dummy: true,
                            dummyType: 'move',
                            editElement: true,
                            clientX: boardOffset.x + diameter.tile * obj.x + radius.tile,
                            clientY: boardOffset.y + diameter.tile * obj.y + radius.tile,
                            mainSquares: mainSquares,
                            obj: obj
                        });

                        //Adds this safe zone's new coordinates to a tile that has now been overwritten
                        overwrittenSafeZones.push({x: obj.x, y: obj.y});

                        //Resets activeClick since activeClick was used in recreating the board
                        activeClick = previousActiveClick;
                    } else {
                        obj.element.style.top = `${obj.y * diameter.gridSquare}px`;
                        obj.element.style.left = `${obj.x * diameter.gridSquare}px`;
                    }
                }
                requestAnimationFrame(() => {
                    editTargetCopy.forEach(obj => {
                        moveObject(obj);
                    });
                });
            }
        }
    }
    //Only happen if you're editing
    if(editing) {
        if(key == 'g' && (event.metaKey || event.ctrlKey)) {

            //Prevents the default anyways so people don't think there is an error when a group doesn't work
            event.preventDefault();
            if(editTarget.length > 0) {
                if(['enemy', 'safeZone'].indexOf(editTarget[0].element.dataset.type) != -1) {
                    newGroup();
                }
            }
        }
        if(key == 's' && (event.metaKey || event.ctrlKey)) {
            if(editTarget[0].element.dataset.type == 'enemy') {
                event.preventDefault();
                setSpeed();
            }
        }
        if(key == 'd' && (event.metaKey || event.ctrlKey)) {
            if(editTarget[0].element.dataset.type == 'enemy') {
                event.preventDefault()
                setDirection();
            }
        }
        if(key == 'Enter' && (event.metaKey || event.ctrlKey)) {
            getUsersBoard();
        }
        if(key == 'e' && (event.metaKey || event.ctrlKey)) {
            let obj = {...entities, groups: {...groups}};
            navigator.clipboard.writeText(JSON.stringify(obj))
            .then(() => {
              console.log('Text copied to clipboard');
            })
            .catch(err => {
              console.error('Error in copying text: ', err);
            });
        }
    } else { //Only happen in-game
        if(key == '1') {
            gameSpeed = 0.01;
        }
        if(key == '2') {
            gameSpeed = 0.02;
        }
        if(key == '3') {
            gameSpeed = 0.1;
        }
        if(key == '4') {
            gameSpeed = 0.25;
        }
        if(key == '5') {
            gameSpeed = 0.5;
        }
        if(key == '6') {
            gameSpeed = 1;
        }
    }
});

document.addEventListener('keyup', (event) => {
    let key = event.key;
    if(keyboardCorrections[key] != undefined) {
        key = keyboardCorrections[key];
    }
    if(keyboard[key] != undefined) {
        keyboard[key] = false;
    }
});

board.addEventListener('mousedown', (event) => {
    if(editing) {
        if(event.target.parentElement.classList.contains('boundaryEditor')) {
            return;
        }
        if(event.target.classList.contains('boundaryEditor')) {
            return;
        }
        let clickHandlerInformation = boardClickHandler(event);
        if(activeClick == 'none') {
            return;
        }
        if(clickHandlerInformation == undefined) {
            clickHandlerInformation = {};
        }
        let typeOfClick = clickHandlerInformation.type;
        let added = clickHandlerInformation.added;
        let usedArr = [clickHandlerInformation.obj];
        let distanceX = event.clientX - boardOffset.x;
        let distanceY = event.clientY - boardOffset.y;

        let xNum;
        let yNum;
        
        if(['tile', 'noTile', 'safeZone'].indexOf(activeClick) != -1) {
            //Gets the tile coordinates you clicked on
            xNum = Math.floor(distanceX / diameter.tile);
            yNum = Math.floor(distanceY / diameter.tile);
        } else if(gridIsOn) {
            //Gets grid square numbers for the tile that you clicked on
            xNum = Math.floor(distanceX / diameter.gridSquare + 0.5);
            yNum = Math.floor(distanceY / diameter.gridSquare + 0.5);
        } else {
            xNum = Math.floor(distanceX / diameter.tile) * 2 + 1;
            yNum = Math.floor(distanceY / diameter.tile) * 2 + 1;
        }

        let mousemoveHandler = (newEvent) => {
            let newDistanceX = newEvent.clientX - boardOffset.x;
            let newDistanceY = newEvent.clientY - boardOffset.y;

            let newXNum;
            let newYNum;

            if(['tile', 'noTile', 'safeZone'].indexOf(activeClick) != -1) {
                //Gets the tile coordinates you clicked on
                newXNum = Math.floor(newDistanceX / diameter.tile);
                newYNum = Math.floor(newDistanceY / diameter.tile);
            } else if(gridIsOn) {
                //Gets grid square numbers for the tile that you clicked on
                newXNum = Math.floor(newDistanceX / diameter.gridSquare + 0.5);
                newYNum = Math.floor(newDistanceY / diameter.gridSquare + 0.5);
            } else {
                newXNum = Math.floor(newDistanceX / diameter.tile) * 2 + 1;
                newYNum = Math.floor(newDistanceY / diameter.tile) * 2 + 1;
            }
            if(newXNum != xNum || newYNum != yNum) { 
                xNum = newXNum;
                yNum = newYNum;
                //If there isn't already a 
                newEvent.cameFrom = 'mousemove';
                if(activeClick != 'tile') {
                    let index;
                    try {
                        index = entities[activeClickTranslations[activeClick]].indexOfObjectValue('x', xNum, {'y': yNum});
                    } catch {
                        console.log(JSON.parse(JSON.stringify(entities)));
                        console.log(activeClick);
                        console.log(activeClickTranslations[activeClick]);
                        console.log(xNum);
                        console.log(yNum);
                    }
                    let obj = entities[activeClickTranslations[activeClick]][index];

                    let eventParameter = Object.assign({}, newEvent);
                    if(['tile', 'noTile' , 'safeZone'].includes(activeClick)) {
                        eventParameter.clientX = newEvent.clientX;
                        eventParameter.clientY = newEvent.clientY;
                    } else {
                        eventParameter.clientX = newXNum * diameter.gridSquare + boardOffset.x;
                        eventParameter.clientY = newYNum * diameter.gridSquare + boardOffset.y;
                    }
                    eventParameter.target = newEvent.target;
                    if(typeOfClick == 'edit') {
                        if(index != -1) {
                            eventParameter.cameFrom = 'allowEdit';

                            //Allows you to edit the `target` of the event
                            eventParameter.target = obj.element;
                            if(!usedArr.includes(obj) && (added != (editTarget.includes(obj)))) {
                                usedArr.push(obj);
                                boardClickHandler(eventParameter);
                            }
                        }
                    } else {
                        if(index == -1) {
                            boardClickHandler(eventParameter);
                        }
                    }
                } else {
                    boardClickHandler(newEvent);
                }
            }
        }

        let mouseupHandler = () => {
            document.removeEventListener('mousemove', mousemoveHandler);
            document.removeEventListener('mouseup', mouseupHandler);
        }

        document.addEventListener('mousemove', mousemoveHandler);
        document.addEventListener('mouseup', mouseupHandler);
    }
});