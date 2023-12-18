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
        if(this[i].dataset.type != type) {
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
    if(['safeZone', 'coin', 'enemy'].indexOf(element.dataset.type) != -1) {
        element.style.backgroundColor = `var(--${element.dataset.type}EditColor)`;
    }
}

let setOriginalColor = (element) => {
    if(['safeZone', 'coin', 'enemy'].indexOf(element.dataset.type) != -1) {
        element.style.backgroundColor = `var(--${element.dataset.type}Color)`;
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
            if(entities.enemies[entities.enemies.indexOfObjectValue('element', element)].customBoundaries) {
                document.getElementById('enableCustomBoundaries').innerHTML = 'Disable Custom Boundaries';
            } else {
                document.getElementById('enableCustomBoundaries').innerHTML = 'Enable Custom Boundaries';
            }
        } else {
            document.getElementById('handleEnableCollisions').innerHTML = "Disable Collisions";
            document.getElementById('enableCustomBoundaries').innerHTML = 'Enable Custom Boundaries';
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

let addToEditTarget = (element) => {
    if(keyboard.Shift) {
        if(!element.classList.contains('grid')) {
            if(editTarget.allSameType(element.dataset.type)) {
                editTarget.push(element);
            } else {
                for(let i = 0; i < editTarget.length; i++) {
                    setOriginalColor(editTarget[i]);
                }
                editTarget = [element];
            }
        }
    } else {
        for(let i = 0; i < editTarget.length; i++) {
            setOriginalColor(editTarget[i]);
        }
        editTarget = [element];
    }
}

let blurTextboxes = () => {
    // Get the currently focused element
    var focusedElement = document.activeElement;

    // Check if there's an element focused and it's not the body (to avoid unfocusing the document itself)
    if (focusedElement && focusedElement !== document.body) {
        focusedElement.blur(); // Unfocus the element
    }
}

let collectedAllCoins = () => {
    for(let i = 0; i < entities.coins.length; i++) {
        if(!entities.coins[i].collected) {
            return false;
        }
    }
    return true;
}