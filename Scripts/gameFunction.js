let running = () => {
    let oldEntities = JSON.parse(JSON.stringify(entities));
    let oldGroups = JSON.parse(JSON.stringify(groups));
    if(goButton.innerHTML == "Go!") {
        goButton.innerHTML = "Stop";
        visionGridNoOverflow.style.display = 'none';
        editing = false;
    } else if(goButton.innerHTML == "Stop") {
        editing = true;
        return;
    }

    let goButtonClickHandler = () => {
        goButton.innerHTML = "Go!";
        visionGridNoOverflow.style.display = 'block';
        previousTime = undefined;
        resetTilesArray();
        resetEntitiesObj();
        groups = JSON.parse(JSON.stringify(oldGroups));
        Object.keys(groups).forEach(key => groups[key].elements = []);
        document.querySelectorAll('.innerBoard > *').forEach(child => {
            if(!(child.classList.contains('boardBackground') || child.classList.contains('noOverflow'))) {
                child.remove();
            }
        });
        activeClick = 'enemy';
        for(let i = 0; i < oldEntities.enemies.length; i++) {
            boardClickHandler({
                clientX: boardOffset.x + oldEntities.enemies[i].x * diameter.gridSquare,
                clientY: boardOffset.y + oldEntities.enemies[i].y * diameter.gridSquare,
                dummy: true,
                obj: JSON.parse(JSON.stringify(oldEntities.enemies[i]))
            });
        }
        activeClick = 'coin';
        for(let i = 0; i < oldEntities.coins.length; i++) {
            boardClickHandler({
                clientX: boardOffset.x + oldEntities.coins[i].x * diameter.gridSquare,
                clientY: boardOffset.y + oldEntities.coins[i].y * diameter.gridSquare,
                dummy: true,
                obj: JSON.parse(JSON.stringify(oldEntities.coins[i]))
            });
        }
        activeClick = 'safeZone';
        for(let i = 0; i < oldEntities.safeZones.length; i++) {
            boardClickHandler({
                clientX: boardOffset.x + oldEntities.safeZones[i].x * diameter.tile + radius.tile,
                clientY: boardOffset.y + oldEntities.safeZones[i].y * diameter.tile + radius.tile,
                dummy: true,
                obj: JSON.parse(JSON.stringify(oldEntities.safeZones[i]))
            });
        }
        activeClick = 'noTile';
        for(let i = 0; i < oldEntities.noTiles.length; i++) {
            boardClickHandler({
                clientX: boardOffset.x + oldEntities.noTiles[i].x * diameter.tile + radius.tile,
                clientY: boardOffset.y + oldEntities.noTiles[i].y * diameter.tile + radius.tile,
                dummy: true,
                obj: JSON.parse(JSON.stringify(oldEntities.noTiles[i]))
            });
        }

        goButton.removeEventListener('click', goButtonClickHandler);
    }
    goButton.addEventListener('click', goButtonClickHandler);
    
    let player = new Player({
        x: radius.tile,
        y: radius.tile,
        killed: false,
        respawnPoint: {
            x: radius.tile,
            y: radius.tile
        },
        radius: radius.player
    });

    editTarget.forEach(element => setOriginalColor(element));
    editTarget = [];

    let spawnFound = false;
    Object.keys(groups).forEach(key => {
        if(groups[key].type == 'Spawn') {
            groups[key].element = entities.safeZones[entities.safeZones.indexOfObjectValue('x', groups[key].mainSquare.x, {'y': groups[key].mainSquare.y})].element;

            groups[key].mainSquare.x *= diameter.tile;
            groups[key].mainSquare.y *= diameter.tile;

            let x = groups[key].mainSquare.x + radius.tile;
            let y = groups[key].mainSquare.y + radius.tile;
            player.respawnPoint = {
                x: x,
                y: y
            };
            player.x = x;
            player.y = y;
            spawnFound = true;
        } else if(groups[key].type == 'Checkpoint'){
            groups[key].element = entities.safeZones[entities.safeZones.indexOfObjectValue('x', groups[key].mainSquare.x, {'y': groups[key].mainSquare.y})].element;
            groups[key].mainSquare.x *= diameter.tile;
            groups[key].mainSquare.y *= diameter.tile;
        } else if(groups[key].type == 'enemy') {
            groups[key].x *= diameter.gridSquare;
            groups[key].y *= diameter.gridSquare;
            groups[key].xRadius *= diameter.gridSquare;
            groups[key].yRadius *= diameter.gridSquare;
        }
    });

    for(let i = 0; i < entities.enemies.length; i++) {
        entities.enemies[i].element.remove();
        delete entities.enemies[i].element;
        new Enemy(entities.enemies[i]);
    }

    for(let i = 0; i < entities.coins.length; i++) {
        entities.coins[i].element.remove();
        delete entities.coins[i].element;
        new Coin(entities.coins[i]);
    }

    for(let i = 0; i < entities.noTiles.length; i++) {
        entities.noTiles[i].x *= diameter.tile;
        entities.noTiles[i].y *= diameter.tile;
    }

    for(let i = 0; i < entities.safeZones.length; i++) {
        entities.safeZones[i].x *= diameter.tile;
        entities.safeZones[i].y *= diameter.tile;
    }

    if(!spawnFound) {
        for(let i = 0; i < entities.safeZones.length; i++) {
            if(entities.safeZones[i].special == 'Spawn') {
                let x = entities.safeZones[i].x + radius.tile;
                let y = entities.safeZones[i].y + radius.tile;
                player.respawnPoint = {
                    x: x,
                    y: y
                };
                player.x = x;
                player.y = y;
                spawnFound = true;
            }
        }
    }

    //Sets the initial player position if a safe zone was added
    player.update();

    let animationFunction = () => {
        if(goButton.innerHTML == "Go!") {
            return;
        }
        if(previousTime == undefined) {
            previousTime = Date.now();
            requestAnimationFrame(animationFunction);
            return;
        } else {
            deltaTime = Date.now() - previousTime;
            deltaTime *= gameSpeed; //Allows you to slow down or speed up the game
            previousTime = Date.now();
        }
        if(!player.killed) {
            Enemy.enemies.numericSort('x');
            /*let fixer = 1;
            if(((keyboard.w || keyboard.s) && !(keyboard.w && keyboard.s)) && ((keyboard.a || keyboard.d) && !(keyboard.a && keyboard.d))) {
                fixer = (1 / ((Math.sqrt(2)-1)/2+1));
            }*/
            if(keyboard.w || keyboard.ArrowUp) {
                player.y -= 103.68*(deltaTime/1000);
            }
            if(keyboard.s || keyboard.ArrowDown) {
                player.y += 103.68*(deltaTime/1000);
            }
            if(keyboard.a || keyboard.ArrowLeft) {
                player.x -= 103.68*(deltaTime/1000);
            }
            if(keyboard.d || keyboard.ArrowRight) {
                player.x += 103.68*(deltaTime/1000);
            }
            if(player.y < radius.player) {
                player.y = radius.player;
            } else if(player.y > diameter.boardHeight - radius.player) {
                player.y = diameter.boardHeight - radius.player;
            }
            if(player.x < radius.player) {
                player.x = radius.player;
            } else if(player.x > diameter.boardWidth - radius.player) {
                player.x = diameter.boardWidth - radius.player;
            }
        
            /*
                Checks if the player has interacted with any tile
            */
            for(let i = 0; i < entities.noTiles.length; i++) {
                if(entities.noTiles[i].x + diameter.tile > player.x - radius.player + 4) {
                    if(entities.noTiles[i].x > player.x + radius.player - 4) {
                        break;
                    } else {
                        if(Math.abs(entities.noTiles[i].y + radius.tile - player.y) < radius.player + radius.tile - 4) {
                            let lengthY = entities.noTiles[i].y + radius.tile - player.y;
                            let lengthX = entities.noTiles[i].x + radius.tile - player.x;
        
                            if(Math.abs(lengthX) < radius.tile) {
                                if(lengthY < 0) {
                                    player.y += 103.68*(deltaTime/1000);
                                } else {
                                    player.y -= 103.68*(deltaTime/1000);
                                }
                            } else if(Math.abs(lengthY) < radius.tile) {
                                if(lengthX < 0) {
                                    player.x += 103.68*(deltaTime/1000);
                                } else {
                                    player.x -= 103.68*(deltaTime/1000);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        /*
            Goes through each group and moves it, and applies the final movement to each element in the group
        */
        Object.keys(groups).forEach(key => {
            if(groups[key].type == 'enemy') {
                let startingX = groups[key].x;
                let startingY = groups[key].y;
        
                if(groups[key].movement == 'v') {
                    groups[key].y += 103.68 * groups[key].speed * groups[key].direction * (deltaTime/1000);
                    if(groups[key].direction == 1) {
                        if(groups[key].y > diameter.boardHeight - groups[key].yRadius) {
                            let minCollision = diameter.boardHeight - groups[key].yRadius;
                            groups[key].y = minCollision - (groups[key].y - minCollision);
                            groups[key].direction *= -1;
                        }
                    } else if(groups[key].direction == -1) {
                        if(groups[key].y < groups[key].yRadius) {
                            let minCollision = groups[key].yRadius;
                            groups[key].y = minCollision + (minCollision - groups[key].y);
                            groups[key].direction *= -1;
                        }
                    }
                } else if(groups[key].movement == 'h') {
                    groups[key].x += 103.68 * groups[key].speed * groups[key].direction * (deltaTime/1000);
                    if(groups[key].direction == 1) {
                        if(groups[key].x > diameter.boardWidth - groups[key].xRadius) {
                            let minCollision = diameter.boardWidth - groups[key].xRadius;
                            groups[key].x = minCollision - (groups[key].x - minCollision);
                            groups[key].direction *= -1;
                        }
                    } else if(groups[key].direction == -1) {
                        if(groups[key].x < groups[key].xRadius) {
                            let minCollision = groups[key].xRadius;
                            groups[key].x = minCollision + (minCollision - groups[key].x);
                            groups[key].direction *= -1;
                        }
                    }
                }
                //Binary search through noZones to check for a collision and then apply startingX and startingY to move each enemy in group
        
        
                let changeX = groups[key].x - startingX;
                let changeY = groups[key].y - startingY;
                groups[key].elements.forEach(element => {
                    let index = Enemy.enemies.indexOfObjectValue('element', element);
                    Enemy.enemies[index].y += changeY;
                    Enemy.enemies[index].x += changeX;
                });
        
                if(groups[key].circularMotion) {
                    groups[key].elements.forEach(element => {
                        let i = Enemy.enemies.indexOfObjectValue('element', element);
                        let x = Enemy.enemies[i].x;
                        let y = Enemy.enemies[i].y;
        
                        let cX = x - groups[key].x;
                        let cY = groups[key].y - y;
                        let c = (cX**2 + cY**2)**0.5;
        
                        if(!(cX == 0 && cY == 0)) { //Excludes center of circle
                            let currentAngle = Math.atan(cY/cX);
                            if(cX < 0) {
                                currentAngle += Math.PI;
                            }
                            currentAngle += (groups[key].rotationalSpeed/4*(deltaTime/1000) * groups[key].rotationalDirection) * Math.PI * 2;
        
                            let newCX = c * Math.cos(currentAngle);
                            let newCY = c * Math.sin(currentAngle);
        
                            let newX = groups[key].x + newCX;
                            let newY = groups[key].y - newCY;
        
                            Enemy.enemies[i].x = newX;
                            Enemy.enemies[i].y = newY;
                        }
                    });
                }
            }
        });
        
        Enemy.exceedsBorders();

        //The following lines of code don't run when the player is respawning
        if(!player.killed) {
        
            /*
                If the player interacted with a single safe zone, it checks the type of safe zone and activates it.
                Since there won't be many safe zones, no binary search is necessary
            */
            for(let i = 0; i < entities.safeZones.length; i++) {
                if(entities.safeZones[i].x + diameter.tile > player.x - radius.player) {
                    if(entities.safeZones[i].x > player.x + radius.player) {
                        break;
                    } else {
                        if(Math.abs((entities.safeZones[i].y + radius.tile) - player.y) < radius.tile + radius.player) {
                            if(entities.safeZones[i].special == 'Completion') {
                                if(collectedAllCoins()) {
                                    location.reload();
                                }
                            } else if(entities.safeZones[i].special == 'Checkpoint') {
                                player.respawnPoint = {
                                    x: entities.safeZones[i].x + radius.tile,
                                    y: entities.safeZones[i].y + radius.tile
                                }
                            }
                            
                            //Iterates through the groups the safe zone is in and checks their purposes
                            for(let j = 0; j < entities.safeZones[i].groups.length; j++) {
                                let key = entities.safeZones[i].groups[j];
                                if(groups[key].type == 'Completion') {
                                    if(collectedAllCoins()) {
                                        location.reload();
                                    }
                                } else if(groups[key].type == 'Checkpoint') {
                                    player.respawnPoint = {
                                        x: groups[key].mainSquare.x + radius.tile,
                                        y: groups[key].mainSquare.y + radius.tile
                                    };
                                }
                            }
                        }
                    }
                }
            }
        
            //Checks enemy collisions with player
            Enemy.playerCollisions();
        
            //Checks enemy collisions with noZones
            Enemy.noZoneCollisions();
        
            Coin.playerCollisions();
        }
        
        Enemy.updateAll();
        
        player.update();
        
        if(goButton.innerHTML == "Stop") {
            requestAnimationFrame(animationFunction);
        }
    }
    
    requestAnimationFrame(animationFunction);
}