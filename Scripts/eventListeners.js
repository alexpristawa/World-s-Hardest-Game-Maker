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

document.addEventListener('keydown', (event) => {
    let key = event.key;
    if(keyboardCorrections[key] != undefined) {
        key = keyboardCorrections[key];
    }
    if(keyboard[key] != undefined) {
        keyboard[key] = true;
        if(key == 'g' && (event.metaKey || event.ctrlKey) && editing) {

            //Prevents the default anyways so people don't think there is an error when a group doesn't work
            event.preventDefault();
            if(editTarget.length > 0) {
                if(['enemy', 'safeZone'].indexOf(editTarget[0].dataset.type) != -1) {
                    newGroup();
                }
            }
        }
        if(key == 'G') {
            if(visionGridNoOverflow.style.display == 'none') {
                visionGridNoOverflow.style.display = 'block';
            } else {
                visionGridNoOverflow.style.display = 'none';
            }
        }
        if(key == 's' && (event.metaKey || event.ctrlKey) && editing) {
            if(editTarget[0].dataset.type == 'enemy') {
                event.preventDefault();
                setSpeed();
            }
        }
        if(key == 'd' && (event.metaKey || event.ctrlKey) && editing) {
            if(editTarget[0].dataset.type == 'enemy') {
                event.preventDefault()
                setDirection();
            }
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

board.addEventListener('click', boardClickHandler);