let setSpawnLocation = (group = false) => {
    if(group) {
        let groupNumberInput = document.getElementById('groupNumberInput');
        let value = groupNumberInput.value;
        groupNumberInput.value = '';
        editTarget.forEach(element => {entities.safeZones[entities.safeZones.indexOfObjectValue('element', element)].groups.push(value)});
        groups[value] = {
            type: 'Spawn'
        };
        clickQuery = {
            type: 'Spawn',
            group: value
        };

        goButton.innerHTML = 'Select a main spawn tile';
        goButton.style.fontSize = '1rem';

        let typeOfGroup = document.getElementById('typeOfGroup');
        typeOfGroup.fadeOut(200, false);
        addGroupToList(value);
    } else if(editTarget.length > 1) {
        
    } else {
        entities.safeZones[entities.safeZones.indexOfObjectValue('element', editTarget[0])].special = 'Spawn';
    }
}

let setCompletionLocation = (group = false) => {
    if(group) {
        let groupNumberInput = document.getElementById('groupNumberInput');
        let value = groupNumberInput.value;
        groupNumberInput.value = '';
        editTarget.forEach(element => {entities.safeZones[entities.safeZones.indexOfObjectValue('element', element)].groups.push(value)});
        groups[value] = {
            type: 'Completion'
        };

        let typeOfGroup = document.getElementById('typeOfGroup');
        typeOfGroup.fadeOut(200, false);
        addGroupToList(value);
    } else {
        editTarget.forEach(element => {entities.safeZones[entities.safeZones.indexOfObjectValue('element', element)].special = 'Completion'});
    }
}

let setCheckpointLocation = (group = false) => {
    if(group) {
        let groupNumberInput = document.getElementById('groupNumberInput');
        let value = groupNumberInput.value;
        groupNumberInput.value = '';
        editTarget.forEach(element => {entities.safeZones[entities.safeZones.indexOfObjectValue('element', element)].groups.push(value)});
        groups[value] = {
            type: 'Checkpoint'
        };
        clickQuery = {
            type: 'Checkpoint',
            group: value
        };
        goButton.innerHTML = 'Select a main spawn tile';
        goButton.style.fontSize = '1rem';

        let typeOfGroup = document.getElementById('typeOfGroup');
        typeOfGroup.fadeOut(200, false);
        addGroupToList(value);
    } else if(editTarget.length > 1) {
        
    } else {
        entities.safeZones[entities.safeZones.indexOfObjectValue('element', editTarget[0])].special = 'Checkpoint';
    }
}

let setSpeed = () => {
    let div = document.getElementById('setSpeedDiv');
    div.fadeIn(300, 'flex');
    let textbox = document.getElementById('setSpeedTextbox');
    textbox.focus();
    textbox.value = entities.enemies[entities.enemies.indexOfObjectValue('element', editTarget[0])].speed;
    if(editTarget.length > 1) {
        let previousAnswer = editTarget[0].speed;
        for(let i = 1; i < editTarget.length; i++) {
            if(entities.enemies[entities.enemies.indexOfObjectValue('element', editTarget[i])].speed != previousAnswer) {
                textbox.value = '';
                break;
            }
        }
    }

    let keyHandler = (event) => {
        if(event.key == 'Enter') {
            let speed = textbox.value;
            for(let i = 0; i < editTarget.length; i++) {
                entities.enemies[entities.enemies.indexOfObjectValue('element', editTarget[i])].speed = speed;
            }
            div.fadeOut(300, false);
            div.removeEventListener('keydown', keyHandler);
            textbox.blur();
        }
    }

    div.addEventListener('keydown', keyHandler);
}

let setDirection = () => {
    let div = document.getElementById('setDirectionDiv');
    div.fadeIn(300, 'flex');
    let button1 = div.querySelector('#setDirectionHorizontalPositive');
    let button2 = div.querySelector('#setDirectionHorizontalNegative');
    let button3 = div.querySelector('#setDirectionVerticalPositive');
    let button4 = div.querySelector('#setDirectionVerticalNegative');

    let button1ClickHandler = () => {
        for(let i = 0; i < editTarget.length; i++) {
            entities.enemies[entities.enemies.indexOfObjectValue('element', editTarget[i])].movement = 'h';
            entities.enemies[entities.enemies.indexOfObjectValue('element', editTarget[i])].direction = 1;
        }
        div.fadeOut(300, false);
        blurTextboxes();
        
        button1.removeEventListener('click', button1ClickHandler);
        button2.removeEventListener('click', button2ClickHandler);
        button3.removeEventListener('click', button3ClickHandler);
        button4.removeEventListener('click', button4ClickHandler);
    }

    let button2ClickHandler = () => {
        for(let i = 0; i < editTarget.length; i++) {
            entities.enemies[entities.enemies.indexOfObjectValue('element', editTarget[i])].movement = 'h';
            entities.enemies[entities.enemies.indexOfObjectValue('element', editTarget[i])].direction = -1;
        }
        div.fadeOut(300, false);
        blurTextboxes();
        
        button1.removeEventListener('click', button1ClickHandler);
        button2.removeEventListener('click', button2ClickHandler);
        button3.removeEventListener('click', button3ClickHandler);
        button4.removeEventListener('click', button4ClickHandler);
    }

    let button3ClickHandler = () => {
        for(let i = 0; i < editTarget.length; i++) {
            entities.enemies[entities.enemies.indexOfObjectValue('element', editTarget[i])].movement = 'v';
            entities.enemies[entities.enemies.indexOfObjectValue('element', editTarget[i])].direction = 1;
        }
        div.fadeOut(300, false);
        blurTextboxes();
        
        button1.removeEventListener('click', button1ClickHandler);
        button2.removeEventListener('click', button2ClickHandler);
        button3.removeEventListener('click', button3ClickHandler);
        button4.removeEventListener('click', button4ClickHandler);
    }

    let button4ClickHandler = () => {
        for(let i = 0; i < editTarget.length; i++) {
            entities.enemies[entities.enemies.indexOfObjectValue('element', editTarget[i])].movement = 'v';
            entities.enemies[entities.enemies.indexOfObjectValue('element', editTarget[i])].direction = -1;
        }
        div.fadeOut(300, false);
        blurTextboxes();

        button1.removeEventListener('click', button1ClickHandler);
        button2.removeEventListener('click', button2ClickHandler);
        button3.removeEventListener('click', button3ClickHandler);
        button4.removeEventListener('click', button4ClickHandler);
    }

    button1.addEventListener('click', button1ClickHandler);
    button2.addEventListener('click', button2ClickHandler);
    button3.addEventListener('click', button3ClickHandler);
    button4.addEventListener('click', button4ClickHandler);
}

let storeGroupInformation = (key, value) => {
    let numbers = {
        movement: 1,
        direction: 2,
        rotationalDirection: 6
    }

    let corrections =  {
        Horizontal: 'h',
        Vertical: 'v',
        None: 'n',
        Positive: 1,
        Negative: -1,
        Clockwise: -1,
        Counterclockwise: 1
    }

    let div;
    if(editGroupsDiv.dataset.active == 'false') {
        div = document.querySelector('#typeOfGroup > div:nth-child(3)');
    } else {
        div = document.querySelector('#editGroupsInfoEnemy');
    }

    div.querySelectorAll(`div:nth-child(${numbers[key]}) > button`).forEach(child => {
        if(child.innerHTML != value) {
            child.style.backgroundColor = 'white';
        } else {
            child.style.backgroundColor = 'yellow';
        }
    });

    value = corrections[value];
    div.dataset[key] = value;
}

let closeGroup = () => {
    if(editGroupsDiv.dataset.active == 'false') {
        let div = document.querySelector('#typeOfGroup > div:nth-child(3)');

        let groupNumberInput = document.getElementById('groupNumberInput');
        let value = groupNumberInput.value;
        groupNumberInput.value = '';

        editTarget.forEach(element => {entities.enemies[entities.enemies.indexOfObjectValue('element', element)].groups.push(value)});

        let xArr = [];
        let yArr = [];

        editTarget.forEach(element => {
            let arr = entities.enemies[entities.enemies.indexOfObjectValue('element', element)];
            xArr.push(arr.x);
            yArr.push(arr.y);
        });

        groups[value] = {
            type: 'enemy',
            speed: document.querySelector('#typeOfGroup > div:nth-child(3) > div:nth-child(3) > input').value,
            circularMotion: document.querySelector('#typeOfGroup > div:nth-child(3) > div:nth-child(4) > input').checked,
            rotationalSpeed: document.querySelector('#typeOfGroup > div:nth-child(3) > div:nth-child(5) > input').value,
            x: Math.min(...xArr) + (Math.max(...xArr)-Math.min(...xArr))/2,
            y: Math.min(...yArr) + (Math.max(...yArr)-Math.min(...yArr))/2,
            xRadius: (Math.max(...xArr) - Math.min(...xArr))/2 + 0.5, /* Add 0.5 as radius because coordinates (for now) are measured in grid squares */
            yRadius: (Math.max(...yArr) - Math.min(...yArr))/2 + 0.5, /* Add 0.5 as radius because coordinates (for now) are measured in grid squares */
            elements: [...editTarget]
        }

        Object.keys(div.dataset).forEach(key => {
            groups[value][key] = div.dataset[key];
        });

        let typeOfGroup = document.getElementById('typeOfGroup');
        typeOfGroup.fadeOut(200, false);

        blurTextboxes();
        addGroupToList(value);
    } else {
        let div = document.querySelector('#editGroupsInfoEnemy');

        let value = editGroupsDiv.dataset.group;

        groups[value].type = 'enemy',
        groups[value].speed = document.querySelector('#editGroupsInfoEnemy > div:nth-child(3) > input').value;
        groups[value].circularMotion = document.querySelector('#editGroupsInfoEnemy > div:nth-child(4) > input').checked;
        groups[value].rotationalSpeed = document.querySelector('#editGroupsInfoEnemy > div:nth-child(5) > input').value;

        Object.keys(div.dataset).forEach(key => {
            if(key != 'group') {
                groups[value][key] = div.dataset[key];
            }
        });
    }
}

let addGroupToList = (value) => {
    let div = document.createElement('div');
    div.innerHTML = value;
    editGroupsList.appendChild(div);
}

let handleEnableCollisions = () => {
    let div = document.getElementById('handleEnableCollisions');
    if(div.innerHTML == 'Enable Collisions') {
        editTarget.forEach(element => entities.enemies[entities.enemies.indexOfObjectValue('element', element)].collisions = true);
        div.innerHTML = 'Disable Collisions'
    } else if(div.innerHTML == 'Disable Collisions') {
        editTarget.forEach(element => entities.enemies[entities.enemies.indexOfObjectValue('element', element)].collisions = false);
        div.innerHTML = 'Enable Collisions'
    }
}

let newGroup = () => {
    let typeOfGroup = document.getElementById('typeOfGroup');
    typeOfGroup.fadeIn(200, 'flex');

    if(editTarget[0].dataset.type == 'enemy') {
        document.querySelector('#typeOfGroup > div:nth-child(3)').style.display = 'flex';
        document.querySelector('#typeOfGroup > div:nth-child(2)').style.display = 'none';
    } else {
        document.querySelector('#typeOfGroup > div:nth-child(3)').style.display = 'none';
        document.querySelector('#typeOfGroup > div:nth-child(2)').style.display = 'flex';
    }
}

let editGroups = () => {
    if(editGroupsDiv.dataset.active == 'false') {
        editGroupsDiv.fadeIn(300, 'flex');
        editGroupsDiv.dataset.active = 'true';
        if(Object.keys(groups).length > 0) {
            groupNameClickHandler({target: document.querySelector("#editGroups > div:nth-child(1) > div:nth-child(1)")});
        }
    } else {
        editGroupsDiv.fadeOut(300, false);
        editGroupsDiv.dataset.active = 'false';
        blurTextboxes();
    }
}

let groupNameClickHandler = (event) => {
    let key = event.target.innerHTML;
    if(groups[key].type == 'enemy') {
        document.getElementById('editGroupsInfoEnemy').style.display = 'flex';
        document.getElementById('editGroupsInfoSafeZone').style.display = 'none';

        storeGroupInformation('movement', {h: 'Horizontal', v: 'Vertical', n: 'None'}[groups[key].movement]);
        storeGroupInformation('direction', {'-1': 'Negative', '1': 'Positive'}[groups[key].direction]);
        storeGroupInformation('rotationalDirection', {'-1': 'Clockwise', '1': 'Counterclockwise'}[groups[key].rotationalDirection]);
        document.querySelector('#editGroupsInfoEnemy > div:nth-child(3) > input').value = groups[key].speed;
        document.querySelector('#editGroupsInfoEnemy > div:nth-child(4) > input').checked = groups[key].circularMotion;
        document.querySelector('#editGroupsInfoEnemy > div:nth-child(5) > input').value = groups[key].rotationalSpeed;
    } else {
        document.getElementById('editGroupsInfoEnemy').style.display = 'none';
        document.getElementById('editGroupsInfoSafeZone').style.display = 'flex';
    }

    editGroupsDiv.dataset.group = key;
}