let setSpawnLocation = (group = false) => {
    if(group) {
        let groupNumberInput = document.getElementById('groupNumberInput');
        let value = groupNumberInput.value;
        groupNumberInput.value = '';
        for(let i = 0; i < editTarget.length; i++) {
            editTarget[i].groups.push(value);
        }
        groups[value] = {
            type: 'safeZone',
            special: 'Spawn'
        };
        clickQuery = {
            type: 'Spawn'
        };

        goButton.innerHTML = 'Select a main spawn tile';
        goButton.style.fontSize = '1rem';

        //Closes group tab
        newGroup();
        addGroupToList(value);
    } else {
        for(let i = 0; i < editTarget.length; i++) {
            editTarget[i].special = 'Spawn'
        }
    }
}

let setCompletionLocation = (group = false) => {
    if(group) {
        let groupNumberInput = document.getElementById('groupNumberInput');
        let value = groupNumberInput.value;
        groupNumberInput.value = '';
        for(let i = 0; i < editTarget.length; i++) {
            editTarget[i].groups.push(value);
        }
        groups[value] = {
            type: 'safeZone',
            special: 'Completion'
        };

        //Closes group tab
        newGroup();
        addGroupToList(value);
    } else {
        for(let i = 0; i < editTarget.length; i++) {
            editTarget[i].special = 'Completion'
        }
    }
}

let setCheckpointLocation = (group = false) => {
    if(group) {
        let groupNumberInput = document.getElementById('groupNumberInput');
        let value = groupNumberInput.value;
        groupNumberInput.value = '';
        for(let i = 0; i < editTarget.length; i++) {
            editTarget[i].groups.push(value);
        }
        groups[value] = {
            type: 'safeZone',
            special: 'Checkpoint'
        };
        clickQuery = {
            type: 'Checkpoint',
            group: value
        };
        goButton.innerHTML = 'Select a main spawn tile';
        goButton.style.fontSize = '1rem';

        //Closes group tab
        newGroup();
        addGroupToList(value);
    } else {
        for(let i = 0; i < editTarget.length; i++) {
            editTarget[i].special = 'Checkpoint';
        }
    }
}

let setSpeed = () => {
    let div = document.getElementById('setSpeedDiv');
    div.fadeIn(300, 'flex');
    let textbox = document.getElementById('setSpeedTextbox');
    textbox.focus();
    textbox.value = editTarget[0].speed;
    if(editTarget.length > 1) {
        let previousAnswer = editTarget[0].speed;
        for(let i = 1; i < editTarget.length; i++) {
            if(editTarget[i].speed != previousAnswer) {
                textbox.value = '';
                break;
            }
        }
    }

    let keyHandler = (event) => {
        if(event.key == 'Enter') {
            let speed = textbox.value;
            for(let i = 0; i < editTarget.length; i++) {
                editTarget[i].speed = speed;
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
            editTarget[i].movement = 'h';
            editTarget[i].direction = 1;
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
            editTarget[i].movement = 'h';
            editTarget[i].direction = -1;
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
            editTarget[i].movement = 'v';
            editTarget[i].direction = 1;
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
            editTarget[i].movement = 'v';
            editTarget[i].direction = -1;
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

let findMiddleGroupCoordinates = (arr) => {
    let xArr = [];
    let yArr = [];
    for(let i = 0; i < arr.length; i++) {
        xArr.push(arr[i].x);
        yArr.push(arr[i].y);
    }

    let x = Math.min(...xArr) + (Math.max(...xArr)-Math.min(...xArr))/2;
    let y = Math.min(...yArr) + (Math.max(...yArr)-Math.min(...yArr))/2;

    return {
        x: x,
        xRadius: x - Math.min(...xArr) + 0.5, /* Add 0.5 as radius because coordinates (for now) are measured in grid squares */
        y: y,
        yRadius: y - Math.min(...yArr) + 0.5 /* Add 0.5 as radius because coordinates (for now) are measured in grid squares */
    }
}

let closeGroup = () => {
    if(editGroupsDiv.dataset.active == 'false') {
        let div = document.querySelector('#typeOfGroup > div:nth-child(3)');

        let groupNumberInput = document.getElementById('groupNumberInput');
        let value = groupNumberInput.value;
        groupNumberInput.value = '';

        for(let i = 0; i < editTarget.length; i++) {
            editTarget[i].groups.push(value);
        }
        let middleCoordinates = findMiddleGroupCoordinates(editTarget);

        groups[value] = {
            type: 'enemy',
            speed: parseFloat(document.querySelector('#typeOfGroup > div:nth-child(3) > div:nth-child(3) > input').value),
            circularMotion: document.querySelector('#typeOfGroup > div:nth-child(3) > div:nth-child(4) > input').checked,
            rotationalSpeed: parseFloat(document.querySelector('#typeOfGroup > div:nth-child(3) > div:nth-child(5) > input').value),
            x: middleCoordinates.x,
            y: middleCoordinates.y,
            xRadius: middleCoordinates.xRadius,
            yRadius: middleCoordinates.yRadius,
            objects: [...editTarget]
        }
        if(isNaN(groups[value].speed)) {
            groups[value].speed = 0;
        }
        if(isNaN(groups[value].rotationalSpeed)) {
            groups[value].rotationalSpeed = 0;
        }

        Object.keys(div.dataset).forEach(key => {
            groups[value][key] = div.dataset[key];
        });

        //Closes group tab
        newGroup();

        blurTextboxes();
        addGroupToList(value);
    } else {
        let div = document.querySelector('#editGroupsInfoEnemy');

        let value = editGroupsDiv.dataset.group;

        groups[value].type = 'enemy',
        groups[value].speed = parseFloat(document.querySelector('#editGroupsInfoEnemy > div:nth-child(3) > input').value);
        groups[value].circularMotion = document.querySelector('#editGroupsInfoEnemy > div:nth-child(4) > input').checked;
        groups[value].rotationalSpeed = parseFloat(document.querySelector('#editGroupsInfoEnemy > div:nth-child(5) > input').value);
        if(isNaN(groups[value].speed)) {
            groups[value].speed = 0;
        }
        if(isNaN(groups[value].rotationalSpeed)) {
            groups[value].rotationalSpeed = 0;
        }

        Object.keys(div.dataset).forEach(key => {
            if(key != 'group') {
                groups[value][key] = div.dataset[key];
            }
        });
        if(groups[value].direction == undefined) {
            groups[value].direction == 1;
        }
    }
}

let addGroupToList = (value) => {
    let div = document.createElement('div');
    div.innerHTML = value;
    editGroupsList.appendChild(div);
}

let removeGroupFromList = (value) => {
    document.querySelectorAll('#editGroups > div:nth-child(1) > div').forEach(child => {
        if(child.innerHTML == value) {
            child.remove();
            return;
        }
    });
}

let handleEnableCollisions = () => {
    let div = document.getElementById('handleEnableCollisions');
    if(div.innerHTML == 'Enable Collisions') {
        for(let i = 0; i < editTarget.length; i++) {
            editTarget[i].collisions = true;
        }
        div.innerHTML = 'Disable Collisions'
    } else if(div.innerHTML == 'Disable Collisions') {
        for(let i = 0; i < editTarget.length; i++) {
            editTarget[i].collisions = false;
        }
        div.innerHTML = 'Enable Collisions'
    }
}

let newGroup = () => {
    let typeOfGroup = document.getElementById('typeOfGroup');
    if(typeOfGroup.dataset.active != 'true') {
        typeOfGroup.dataset.active = 'true';
        typeOfGroup.fadeIn(200, 'flex');

        if(editTarget[0].element.dataset.type == 'enemy') {
            document.querySelector('#typeOfGroup > div:nth-child(3)').style.display = 'flex';
            document.querySelector('#typeOfGroup > div:nth-child(2)').style.display = 'none';
        } else {
            document.querySelector('#typeOfGroup > div:nth-child(3)').style.display = 'none';
            document.querySelector('#typeOfGroup > div:nth-child(2)').style.display = 'flex';
        }
    } else {
        Object.keys(typeOfGroup.dataset).forEach(key => delete typeOfGroup.dataset[key]);
        typeOfGroup.dataset.active = 'false';
        typeOfGroup.fadeOut(200, false);
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

let showCustomBoundaries = (group = false, switchShow = true) => {
    let button = document.getElementById('showCustomBoundaries');
    if(switchShow) {
        if(!editTarget[0].showCustomBoundaries) {
            button.innerHTML = 'Hide Custom Boundaries';
            for(let i = 0; i < editTarget.length; i++) {
                editTarget[i].showCustomBoundaries = true;
            }
        } else {
            button.innerHTML = 'Show Custom Boundaries';
            for(let i = 0; i < editTarget.length; i++) {
                editTarget[i].showCustomBoundaries = false;
            }
            document.querySelectorAll('.boundaryEditor').forEach(element => element.fadeOut(200));
            return;
        }
    }

    if(group) {

    } else if(editTarget.length > 0){
        let previousMovement = editTarget[0].movement;
        editTarget.forEach(obj => {
            if(obj.behavior.type != 'normal') {
                //Prompt for overwrite
                prompt("Some balls have custom behaviors that would need to be overwritten. Continue?");
                return;
            }
            if(obj.movement !== previousMovement) {
                //Prompt for different directions
                prompt("Cannot create bounds for balls going in different (horizontal/vertical) directions!");
                return;
            }
        });

        let doVertical = () => {
            //Logic for setting the boundaries
            let maxBound = boardRows * 2 + 0.5;
            let minY = editTarget[0].y;
            let minBound = 0.5;
            let maxY = editTarget[0].y;
            let maxX = editTarget[0].x;
            for(let i = 0; i < editTarget.length; i++) {
                if(editTarget[i].y > maxY) {
                    maxY = editTarget[i].y;
                } else if(editTarget[i].y < minY) {
                    minY = editTarget[i].y;
                }
                if(editTarget[i].x > maxX) {
                    maxX = editTarget[i].x;
                }
                if(editTarget[i].behavior.boundVMin != 'none') {
                    if(editTarget[i].behavior.boundVMin > minBound) {
                        minBound = editTarget[i].behavior.boundVMin;
                    }
                }
                if(editTarget[i].behavior.boundVMax != 'none') {
                    if(editTarget[i].behavior.boundVMax < maxBound) {
                        maxBound = editTarget[i].behavior.boundVMax;
                    }
                }
            }
            if(minY < minBound) {
                minBound = minY;
            }
            if(maxY > maxBound) {
                maxBound = maxY;
            }

            let div = document.createElement('div');
            div.classList.add('boundaryEditorV');
            div.classList.add('boundaryEditor');

            // The +8 in height accounts for border in CSS (could be adjusted)
            div.style.left = `${maxX * diameter.gridSquare - radius.gridSquare}px`;
            div.style.top = `${minBound * diameter.gridSquare - radius.gridSquare}px`;
            div.style.height = `${(maxBound - minBound) * diameter.gridSquare + 8}px`;
            innerBoard.appendChild(div);

            let topHitbox = document.createElement('div');
            div.appendChild(topHitbox);

            let bottomHitbox = document.createElement('div');
            div.appendChild(bottomHitbox);

            topHitbox.addEventListener('mousedown', () => {
                topHitbox.style.height = '200vh';
                topHitbox.style.width = '200vw';
                topHitbox.style.left = '50%';
                topHitbox.style.transform = 'translate(-50%, -50%)';
                let height = board.getBoundingClientRect().top;
                
                let mousemoveHandler = (event) => {
                    let newY = event.clientY - height;
                    if(Math.floor(2*(newY/diameter.gridSquare + 1))/2 != minBound) {
                        if(Math.floor(2*(newY/diameter.gridSquare + 1))/2 > minY) {
                            newY = minY * diameter.gridSquare - diameter.gridSquare;
                        }
                        if(newY < 0) {
                            newY = 0;
                        }
                        minBound = Math.floor(2*(newY/diameter.gridSquare + 1))/2;
                        div.style.height = `${(maxBound - minBound) * diameter.gridSquare + 8}px`;
                        div.style.top = `${minBound * diameter.gridSquare - radius.gridSquare}px`;
                    }

                    for(let i = 0; i < editTarget.length; i++) {
                        editTarget[i].behavior.boundVMin = minBound;
                    }
                }

                let mouseupHandler = () => {
                    document.removeEventListener('mousemove', mousemoveHandler);
                    document.removeEventListener('mouseup', mouseupHandler);
                    topHitbox.style.height = '12px';
                    topHitbox.style.width = '100%';
                    topHitbox.style.left = '0px';
                    topHitbox.style.transform = 'translateY(-8px)';
                }

                document.addEventListener('mousemove', mousemoveHandler);
                document.addEventListener('mouseup', mouseupHandler);
            });

            bottomHitbox.addEventListener('mousedown', () => {
                let height = board.getBoundingClientRect().top;
                bottomHitbox.style.width = '200vw';
                bottomHitbox.style.left = '50%';
                bottomHitbox.style.height = '200vh';
                bottomHitbox.style.transform = 'translate(-50%, 52px)';
                
                let mousemoveHandler = (event) => {
                    let newY = event.clientY - height;
                    if(Math.floor(2*(newY/diameter.gridSquare + 1))/2 != maxBound) {
                        if(Math.floor(2*(newY/diameter.gridSquare))/2 < maxY) {
                            newY = maxY * diameter.gridSquare;
                        }
                        if(newY > boardRows * 2 * diameter.gridSquare) {
                            newY = boardRows * 2 * diameter.gridSquare;
                        }
                        maxBound = Math.floor(2*(newY/diameter.gridSquare + 1))/2;
                        div.style.height = `${(maxBound - minBound) * diameter.gridSquare + 8}px`;
                        div.style.top = `${minBound * diameter.gridSquare - radius.gridSquare}px`;
                    }
                    for(let i = 0; i < editTarget.length; i++) {
                        editTarget[i].behavior.boundVMax = maxBound;
                    }
                }

                let mouseupHandler = () => {
                    document.removeEventListener('mousemove', mousemoveHandler);
                    document.removeEventListener('mouseup', mouseupHandler);
                    bottomHitbox.style.height = '12px';
                    bottomHitbox.style.width = '100%';
                    bottomHitbox.style.left = '0px';
                    bottomHitbox.style.transform = 'translateY(8px)';
                }

                document.addEventListener('mousemove', mousemoveHandler);
                document.addEventListener('mouseup', mouseupHandler);
            });
        }

        let doHorizontal = () => {
            let maxBound = boardColumns * 2 + 0.5;
            let maxY = editTarget[0].y;
            let minBound = 0.5;
            let minX = editTarget[0].x;
            let maxX = editTarget[0].x;

            for(let i = 0; i < editTarget.length; i++) {
                if(editTarget[i].x > maxX) {
                    maxX = editTarget[i].x;
                } else if(editTarget[i].x < minX) {
                    minX = editTarget[i].x;
                }
                if(editTarget[i].y > maxY) {
                    maxY = editTarget[i].y;
                }
                if(editTarget[i].behavior.boundHMin != 'none') {
                    if(editTarget[i].behavior.boundHMin > minBound) {
                        minBound = editTarget[i].behavior.boundHMin;
                    }
                }
                if(editTarget[i].behavior.boundHMax != 'none') {
                    if(editTarget[i].behavior.boundHMax < maxBound) {
                        maxBound = editTarget[i].behavior.boundHMax;
                    }
                }
            }
            if(minX < minBound) {
                minBound = minX;
            }
            if(maxX > maxBound) {
                maxBound = maxX;
            }

            let div = document.createElement('div');
            div.classList.add('boundaryEditorH');
            div.classList.add('boundaryEditor');

            // The +8 in height accounts for border in CSS (could be adjusted)
            div.style.top = `${maxY * diameter.gridSquare - radius.gridSquare}px`;
            div.style.left = `${minBound * diameter.gridSquare - radius.gridSquare}px`;
            div.style.width = `${(maxBound - minBound) * diameter.gridSquare + 8}px`;
            innerBoard.appendChild(div);

            let leftHitbox = document.createElement('div');
            div.appendChild(leftHitbox);

            let rightHitbox = document.createElement('div');
            div.appendChild(rightHitbox);

            leftHitbox.addEventListener('mousedown', () => {
                leftHitbox.style.height = '200vh';
                leftHitbox.style.width = '200vw';
                leftHitbox.style.top = '50%';
                leftHitbox.style.transform = 'translate(-50%, -50%)';
                let width = board.getBoundingClientRect().left;
                
                let mousemoveHandler = (event) => {
                    let newX = event.clientX - width;
                    if(Math.floor(2*(newX/diameter.gridSquare + 0.5))/2 != minBound) {
                        if(Math.floor(2*(newX/diameter.gridSquare + 0.5))/2 > minX) {
                            newX = minX * diameter.gridSquare - radius.gridSquare;
                        }
                        if(newX < 0) {
                            newX = 0;
                        }
                        minBound = Math.floor(2*(newX/diameter.gridSquare + 0.5))/2;
                        div.style.width = `${(maxBound - minBound) * diameter.gridSquare + 8}px`;
                        div.style.left = `${minBound * diameter.gridSquare - radius.gridSquare}px`;
                    }

                    for(let i = 0; i < editTarget.length; i++) {
                        editTarget[i].behavior.boundHMin = minBound;
                    }
                }

                let mouseupHandler = () => {
                    document.removeEventListener('mousemove', mousemoveHandler);
                    document.removeEventListener('mouseup', mouseupHandler);
                    leftHitbox.style.width = '12px';
                    leftHitbox.style.height = '100%';
                    leftHitbox.style.top = '0px';
                    leftHitbox.style.transform = 'translateX(-8px)';
                }

                document.addEventListener('mousemove', mousemoveHandler);
                document.addEventListener('mouseup', mouseupHandler);
            });

            rightHitbox.addEventListener('mousedown', () => {
                rightHitbox.style.height = '200vh';
                rightHitbox.style.width = '200vw';
                rightHitbox.style.top = '50%';
                rightHitbox.style.transform = 'translate(-50%, -50%)';
                let width = board.getBoundingClientRect().left;
                
                let mousemoveHandler = (event) => {
                    let newX = event.clientX - width;
                    if(Math.floor(2*(newX /diameter.gridSquare + 0.5))/2 != maxBound) {
                        if(Math.floor(2*(newX/diameter.gridSquare))/2 < maxX + 0.5) {
                            newX = maxX * diameter.gridSquare + radius.gridSquare;
                        }
                        if(newX > boardColumns * 2 * diameter.gridSquare) {
                            newX = boardColumns * 2 * diameter.gridSquare;
                        }
                        maxBound = Math.floor(2*(newX/diameter.gridSquare + 0.5))/2;
                        div.style.width = `${(maxBound - minBound) * diameter.gridSquare + 8}px`;
                        div.style.left = `${minBound * diameter.gridSquare - radius.gridSquare}px`;
                    }

                    for(let i = 0; i < editTarget.length; i++) {
                        editTarget[i].behavior.boundHMax = maxBound;
                    }
                }

                let mouseupHandler = () => {
                    document.removeEventListener('mousemove', mousemoveHandler);
                    document.removeEventListener('mouseup', mouseupHandler);
                    rightHitbox.style.width = '12px';
                    rightHitbox.style.height = '100%';
                    rightHitbox.style.top = '0px';
                    rightHitbox.style.transform = 'translateX(8px)';
                }

                document.addEventListener('mousemove', mousemoveHandler);
                document.addEventListener('mouseup', mouseupHandler);
            });
        }
        doVertical();
        doHorizontal();
    }
}