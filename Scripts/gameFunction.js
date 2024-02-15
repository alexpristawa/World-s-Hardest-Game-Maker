let running = () => {
    //Removes edit options
    removeOtherOptions("Joe Shmoe");

    //Sets up a few things
    if(goButton.innerHTML == "Go!") {
        goButton.innerHTML = "Stop";
        visionGridNoOverflow.style.display = 'none';
        gridIsOn = true;
        editing = false;
        
        //Resets editing things
        document.querySelectorAll('.boundaryEditor').forEach(element => element.fadeOut(200));
        clearEditTarget();

    } else if(goButton.innerHTML == "Stop") {
        editing = true;
        return;
    }

    //Saves info for recreation later
    let oldEntities = JSON.parse(JSON.stringify(entities));
    let oldGroups = JSON.parse(JSON.stringify(groups));

    //Restores the board when you want to go back to editing
    let goButtonClickHandler = () => {
        if(goButton.innerHTML != 'Go!') {
            goButton.innerHTML = "Go!";
            visionGridNoOverflow.style.display = 'block';
            previousTime = undefined;
            restoreBoard(oldEntities, oldGroups);
        }
        goButton.removeEventListener('click', goButtonClickHandler);
    }
    goButton.addEventListener('click', goButtonClickHandler);

    //Makes players
    Player.makePlayers();

    //Gets center coordinates for the groups
    Object.keys(groups).forEach(key => {
        new Group(groups[key], key);
    });

    //Goes through entities array and instantiates all objects
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
        delete entities.noTiles[i].element;
        new NoTile(entities.noTiles[i]);
    }

    for(let i = 0; i < entities.safeZones.length; i++) {
        delete entities.safeZones[i].element;
        new SafeZone(entities.safeZones[i]);
    }

    //Searches through spawn locations if one wasn't found in a group
    if(!Player.players[0].spawnPointFound) {
        for(let i = 0; i < SafeZone.safeZones.length; i++) {
            if(SafeZone.safeZones[i].special == 'Spawn') {
                let x = SafeZone.safeZones[i].x + radius.tile;
                let y = SafeZone.safeZones[i].y + radius.tile;
                for(let j = 0; j < Player.players.length; j++) {
                    Player.players[j].respawnPoint = {
                        x: x,
                        y: y
                    };
                    Player.players[j].x = x;
                    Player.players[j].y = y;
                }
                break;
            }
        }
    }

    //Gets rid of spawnPointFound variables
    for(let i = 0; i < Player.players.length; i++) {
        delete Player.players[i].spawnPointFound;
    }

    //Sets the initial player position if a safe zone was added
    Player.update();

    //Game running function
    let animationFunction = () => {
        
        //Terminates the function if you're back in edit mode
        if(goButton.innerHTML == "Go!") {
            return;
        }
        
        //Starts the deltaTime cycle if it was previously undefined
        if(previousTime == undefined) {
            previousTime = Date.now();
            requestAnimationFrame(animationFunction);
            return;
        } else { //Updates deltaTime
            deltaTime = Date.now() - previousTime;
            if(settings.lowFPS) {
                if(1000/deltaTime > 40) {
                    requestAnimationFrame(animationFunction);
                    return;
                };
            }
            deltaTime *= gameSpeed; //Allows you to slow down or speed up the game
            previousTime = Date.now();
        }

        //Plays through the game for each player
        for(let playerIndex = 0; playerIndex < Player.players.length; playerIndex++) {
            Player.player = Player.players[playerIndex];

            //Only moves the entities once per animation frame (If it is false, enemies and groups are not moved)
            let moveFrame = playerIndex == 0;

            Player.player.movePlayer();
            
            /*
                Goes through each group and moves it, and applies the final movement to each element in the group
            */
            if(moveFrame) Group.moveGroups();
            
            //Checks if an eenmy collides with the edge of the board or the edge of its group
            if(moveFrame) Enemy.exceedsBorders();

            //Checks enemy collisions with noTiles
            if(moveFrame) Enemy.noTileCollisions();

            //The following lines of code don't run when the player is respawning
            if(!Player.player.killed) {
            
                /*
                    If the player interacted with a single safe zone, it checks the type of safe zone and activates it.
                    Since there won't be many safe zones, no binary search is necessary
                */
                SafeZone.playerCollisions();
            
                //Checks enemy collisions with player
                Enemy.playerCollisions();
            
                //Checks coin collisions with the player
                Coin.playerCollisions();
            }
            
            if(moveFrame) Enemy.updateAll();
            
            Player.player.update();
        }
        
        if(goButton.innerHTML == "Stop") {
            requestAnimationFrame(animationFunction);
        }
    }
    
    requestAnimationFrame(animationFunction);
}