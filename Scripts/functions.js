let clearEveryColor = () => {
    Object.keys(clickButtons).forEach(key => {
        if(clickButtons[key].defaultColor) {
            clickButtons[key].element.style.backgroundColor = clickButtons[key].defaultColor;
        } else {
            clickButtons[key].element.style.backgroundColor = rootVariables.darkTileColor;
        }
    });
}

let editButtonFunction = () => {
    clearEveryColor();
    if(activeClick != 'edit') {
        activeClick = 'edit';
        clickButtons.edit.element.style.backgroundColor = 'red';
    } else {
        activeClick = 'none';
    }
}

Array.prototype.allSameType = function(type) {
    for(let i = 0; i < this.length; i++) {
        if(this[i].element.dataset.type != type) {
            return false;
        }
    }
    return true;
}

let overwriteTileInArray = (x, y, type) => {
    for(let i = 0; i < entities.noTiles.length; i++) {
        if(entities.noTiles[i].x == x && entities.noTiles[i].y == y) {
            if(type != 'noTile') {
                entities.noTiles.splice(i, 1);
                return;
            }
        }
    }
    for(let i = 0; i < entities.safeZones.length; i++) {
        if(entities.safeZones[i].x == x && entities.safeZones[i].y == y) {
            if(type != 'safeZone') {
                entities.safeZones.splice(i,1);
                return;
            }
        }
    }
}

let setEditColor = (element) => {
    if(Object.values(groups).includes(element)) {
        for(let i = 0; i < element.objects.length; i++) {
            setEditColor(element.objects[i].element);
        }
    } else if(!(element instanceof HTMLElement)) {
        element.element.style.backgroundColor = `var(--${element.element.dataset.type}EditColor)`;
        element.element.style.zIndex = 11;
    } else if(['safeZone', 'coin', 'enemy'].indexOf(element.dataset.type) != -1) {
        element.style.backgroundColor = `var(--${element.dataset.type}EditColor)`;
        element.style.zIndex = 11;
    }
}

let setOriginalColor = (element) => {
    if(Object.values(groups).includes(element)) {
        for(let i = 0; i < element.objects.length; i++) {
            setOriginalColor(element.objects[i].element);
        }
    } else if(!(element instanceof HTMLElement)) {
        element.element.style.backgroundColor = `var(--${element.element.dataset.type}EditColor)`;
        element.element.style.zIndex = defaultElementProperties[element.dataset.type].zIndex;
    } else if(['safeZone', 'coin', 'enemy'].indexOf(element.dataset.type) != -1) {
        element.style.backgroundColor = `var(--${element.dataset.type}Color)`;
        element.style.zIndex = defaultElementProperties[element.dataset.type].zIndex;
    }
}

let structureEditOptions = (element) => {
    if(element.dataset.type == 'enemy') {
        removeOtherOptions('enemy');
        if(entities.enemies.indexOfObjectValue('element', element) != -1) { //If it is in the entities array
            if(entities.enemies[entities.enemies.indexOfObjectValue('element', element)].collisions) {
                document.getElementById('handleEnableCollisions').innerHTML = "Disable Collisions";
            } else {
                document.getElementById('handleEnableCollisions').innerHTML = "Enable Collisions";
            }
            if(entities.enemies[entities.enemies.indexOfObjectValue('element', element)].showCustomBoundaries) {
                document.getElementById('showCustomBoundaries').innerHTML = 'Hide Custom Boundaries';
            } else {
                document.getElementById('showCustomBoundaries').innerHTML = 'Show Custom Boundaries';
            }
        } else {
            document.getElementById('handleEnableCollisions').innerHTML = "Disable Collisions";
            document.getElementById('showCustomBoundaries').innerHTML = 'Show Custom Boundaries';
        }
    } else if(element.dataset.type == 'coin') {
        removeOtherOptions('coin');
    } else if(element.dataset.type == 'safeZone') {
        removeOtherOptions('safeZone');
    }
}

let removeOtherOptions = (type) => {
    Object.keys(optionsHolders).forEach(key => {
        if(key != type) {
            optionsHolders[key].style.display = 'none';
            optionsHolders[key].style.position = 'absolute';
        } else {
            optionsHolders[key].style.display = 'flex';
            optionsHolders[key].style.position = 'relative';
        }
    });
}

let addToEditTarget = (obj, forceAdd = false, skipGroup = false) => {
    if(keyboard.Shift || forceAdd) {
        if(!obj.element.classList.contains('grid')) {
            if(!Object.values(groups).includes(obj)) {

                //Simple - If editTarget includes the object, it splices it from the target
                if(editTarget.includes(obj)) {
                    setOriginalColor(obj.element);
                    editTarget.splice(editTarget.indexOf(obj), 1);
                    return false;
                } else {
                    //If it is not in editTarget and you don't want it to highlight the group, it adds the element
                    if(obj.groups.length == 0 || skipGroup) {
                        setEditColor(obj.element);
                        editTarget.push(obj);

                    //If you shift-clicked on an object whose group was already in editTarget
                    } else if(editTarget.includes(groups[obj.groups[0]])) {
                        let group = groups[obj.groups[0]];
                        for(let i = 0; i < group.objects.length; i++) {
                            if(!editTarget.includes(group.objects[i])) {
                                setOriginalColor(group.objects[i].element);
                            }
                        }
                        setEditColor(groups[obj.groups[0]]);
                        editTarget.push(obj);

                    //If you shift-clicked on an object whose group was not in editTarget (Has 2 cases)
                    } else {
                        let group = groups[obj.groups[0]];
                        let noneInEditTarget = true;
                        for(let i = 0; i < group.objects.length; i++) {
                            if(editTarget.includes(group.objects[i])) {
                                noneInEditTarget = false;
                                break;
                            }
                        }
                        
                        //If none of the objects in the group are in editTarget, add the group
                        if(noneInEditTarget) {
                            editTarget.push(group);
                            setEditColor(group);
                        //If at least one of the objects of the group are in editTarget, add just `obj`
                        } else {
                            editTarget.push(obj);
                            setEditColor(obj.element);
                        }
                    }
                    return true;
                }
            }
        }
    } else {
        if(!Object.values(groups).includes(obj)) {
            if(editTarget.includes(obj)) {
                setOriginalColor(obj.element);
                editTarget = [];
            } else {
                if(obj.groups.length == 0 || skipGroup) {
                    clearEditTarget();
                    setEditColor(obj.element);
                    editTarget = [obj];
                } else if(editTarget.includes(groups[obj.groups[0]])) {
                    clearEditTarget();
                    setEditColor(obj.element);
                    editTarget = [obj];
                } else {
                    let group = groups[obj.groups[0]];
                    clearEditTarget();
                    setEditColor(group);
                    editTarget = [group];
                }
            }
        }
    }
}

let clearEditTarget = () => {
    for(let i = 0; i < editTarget.length; i++) {
        if(Object.values(groups).includes(editTarget[i])) {
            let group = editTarget[i];
            for(let j = 0; j < group.objects.length; j++) {
                setOriginalColor(group.objects[j].element);
            }
        } else {
            setOriginalColor(editTarget[i].element);
        }
    }
    editTarget = [];
}

let blurTextboxes = () => {
    // Get the currently focused element
    var focusedElement = document.activeElement;

    // Check if there's an element focused and it's not the body (to avoid unfocusing the document itself)
    if (focusedElement && focusedElement !== document.body) {
        focusedElement.blur(); // Unfocus the element
    }
}

let restoreBoard = (newEntities = JSON.parse(JSON.stringify(entities)), newGroups = JSON.parse(JSON.stringify(groups))) => {

    makeGrid();
    recreateBoard();

    resetTilesArray();
    resetEntitiesObj();
    editGroupsList.innerHTML = '';
    const oldActiveClick = activeClick;
    Coin.coins = [];
    Enemy.enemies = [];
    Player.players = [];
    Group.groups = [];
    NoTile.noTiles = [];
    SafeZone.safeZones = [];
    groups = JSON.parse(JSON.stringify(newGroups));
    Object.keys(groups).forEach(key => {
        groups[key].elements = [];
        groups[key].objects = [];
        addGroupToList(key);
    });
    document.querySelectorAll('.innerBoard > *').forEach(child => {
        if(!(child.classList.contains('boardBackground') || child.classList.contains('noOverflow'))) {
            child.remove();
        }
    });
    activeClick = 'enemy';
    for(let i = 0; i < newEntities.enemies.length; i++) {
        boardClickHandler({
            clientX: boardOffset.x + newEntities.enemies[i].x * diameter.gridSquare,
            clientY: boardOffset.y + newEntities.enemies[i].y * diameter.gridSquare,
            dummy: true,
            dummyType: 'reconstruction',
            obj: JSON.parse(JSON.stringify(newEntities.enemies[i]))
        });
    }
    activeClick = 'coin';
    for(let i = 0; i < newEntities.coins.length; i++) {
        boardClickHandler({
            clientX: boardOffset.x + newEntities.coins[i].x * diameter.gridSquare,
            clientY: boardOffset.y + newEntities.coins[i].y * diameter.gridSquare,
            dummy: true,
            dummyType: 'reconstruction',
            obj: JSON.parse(JSON.stringify(newEntities.coins[i]))
        });
    }

    activeClick = 'safeZone';
    for(let i = 0; i < newEntities.safeZones.length; i++) {
        let obj = JSON.parse(JSON.stringify(newEntities.safeZones[i]));
        let mainSquares = [];
        for(let i = 0; i < obj.groups.length; i++) {
            if(groups[obj.groups[i]].special != 'Completion') {
                if(groups[obj.groups[i]].mainSquare.x == obj.x && groups[obj.groups[i]].mainSquare.y == obj.y) {
                    mainSquares.push(obj.groups[i]);
                }
            }
        }
        boardClickHandler({
            clientX: boardOffset.x + newEntities.safeZones[i].x * diameter.tile + radius.tile,
            clientY: boardOffset.y + newEntities.safeZones[i].y * diameter.tile + radius.tile,
            dummy: true,
            dummyType: 'reconstruction',
            mainSquares: mainSquares,
            obj: obj
        });
    }
    activeClick = 'noTile';
    for(let i = 0; i < newEntities.noTiles.length; i++) {
        boardClickHandler({
            clientX: boardOffset.x + newEntities.noTiles[i].x * diameter.tile + radius.tile,
            clientY: boardOffset.y + newEntities.noTiles[i].y * diameter.tile + radius.tile,
            dummy: true,
            dummyType: 'reconstruction',
            obj: JSON.parse(JSON.stringify(newEntities.noTiles[i]))
        });
    }

    activeClick = oldActiveClick;
}

async function getUsersBoard() {
    let info = await readClipboard();
    info = JSON.parse(info);
    let newGroups = info.groups;
    delete info.groups;
    let newEntities = info;
    restoreBoard(newEntities, newGroups);
}

async function readClipboard() {
    try {
      // Check if the browser supports the Clipboard API
      if (!navigator.clipboard) {
        console.log('Clipboard API not supported');
        return;
      }
  
      // Read text from the clipboard
      const text = await navigator.clipboard.readText();
      return text;
    } catch (err) {
      console.error('Failed to read from clipboard: ', err);
    }
  }

let deleteGroup = (key) => {
    if(groups[key].type == 'enemy') {
        for(let j = 0; j < entities.enemies.length; j++) {
            if(entities.enemies[j].groups.includes(key)) {
                entities.enemies[j].groups.splice(entities.enemies[j].groups.indexOf(key), 1);
            }
        }
    } else {
        for(let j = 0; j < entities.safeZones.length; j++) {
            if(entities.safeZones[j].groups.includes(key)) {
                entities.safeZones[j].groups.splice(entities.safeZones[j].groups.indexOf(key), 1);
            }
        }
    }
    delete groups[key];
    removeGroupFromList(key);
}

let deleteObject = (obj) => {
    if(Object.values(groups).includes(obj)) {
        while(obj.objects.length > 0) {
            deleteObject(obj.objects[0]);
        }
    } else {
        for(let i = 0; i < obj.groups.length; i++) {
            const groupName = obj.groups[i];
            if(groups[groupName].mainSquare !== undefined) {
                if(groups[groupName].mainSquare.obj == obj) {
                    deleteGroup(groupName);
                }
            } else if(groups[groupName].objects.length > 0) {
                groups[groupName].objects.splice(groups[groupName].objects.indexOf(obj), 1);
            }
        }
        if(obj.type == 'safeZone') {
            activeClick = 'tile';
            boardClickHandler({
                clientX: boardOffset.x + obj.x * diameter.tile + radius.tile,
                clientY: boardOffset.y + obj.y * diameter.tile + radius.tile,
                dummy: true,
                dummyType: 'reconstruction',
                obj: obj
            });
        } else {
            obj.element.remove();
            entities[activeClickTranslations[obj.type]].splice(entities[activeClickTranslations[obj.type]].indexOf(obj), 1);
        }
    }
}

HTMLElement.prototype.turnIntoHitbox = function(keysToSave) {
    let style = window.getComputedStyle(this);
    let obj = {};
    keysToSave.forEach(key => obj[key] = style.getPropertyValue(key));
    this.style.left = '-50vw';
    this.style.width = '200vw';
    this.style.top = '-50vh';
    this.style.height = '200vh';
    this.style.zIndex = 1000;
    return obj;
}

HTMLElement.prototype.applyStyles = function(obj) {
    Object.keys(obj).forEach(key => {
        this.style[key] = obj[key];
    });
}