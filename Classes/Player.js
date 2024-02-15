class Player {
    //Array in case you're on 2 player mode
    static players = [];

    //Currently changing player (Changes based on `players` arr)
    static player;

    constructor(obj) {

        //Passes in parameters like player.x and player.y
        Object.keys(obj).forEach(key => this[key] = obj[key]);
        let div = document.createElement('div');
        div.classList.add('player');
        div.classList.add('entities');
        innerBoard.appendChild(div);
        div.style.backgroundColor = `var(--player${obj.playerNumber}Color)`;
        this.element = div;
        this.opacity = 1;
        this.deaths = 0;
        this.collectedCoins = [];

        Player.players.push(this);
        Player.player = this;
    }

    static makePlayers() {
        if(settings.twoPlayer != false) {
            new Player({
                x: radius.tile,
                y: radius.tile,
                killed: false,
                respawnPoint: {
                    x: radius.tile,
                    y: radius.tile
                },
                spawnPointFound: false,
                moveKeys: {
                    up: ['w'],
                    left: ['a'],
                    down: ['s'],
                    right: ['d']
                },
                radius: radius.player,
                playerNumber: 1,
                inSafeZone: false
            });
    
            new Player({
                x: radius.tile,
                y: radius.tile,
                killed: false,
                respawnPoint: {
                    x: radius.tile,
                    y: radius.tile
                },
                spawnPointFound: false,
                moveKeys: {
                    up: ['ArrowUp'],
                    left: ['ArrowLeft'],
                    down: ['ArrowDown'],
                    right: ['ArrowRight']
                },
                radius: radius.player,
                playerNumber: 2,
                inSafeZone: false
            });
        } else {
            new Player({
                x: radius.tile,
                y: radius.tile,
                killed: false,
                respawnPoint: {
                    x: radius.tile,
                    y: radius.tile
                },
                spawnPointFound: false,
                moveKeys: {
                    up: ['ArrowUp', 'w'],
                    left: ['ArrowLeft', 'a'],
                    down: ['ArrowDown', 's'],
                    right: ['ArrowRight', 'd']
                },
                radius: radius.player,
                playerNumber: 1
            });
        }
    }

    static update() {
        for(let i = 0; i < Player.players.length; i++) {
            Player.players[i].update();
        }
    }

    movePlayer() {
        //Doesn't take player movement into account if the player is dead
        if(!this.killed) {

            //Updates if you can move based on the keys the player uses to move
            let movePermission = {
                up: false,
                left: false,
                down: false,
                right: false
            };

            Object.keys(movePermission).forEach(key => {
                let arr = this.moveKeys[key];
                for(let i = 0; i < arr.length; i++) {
                    if(keyboard[arr[i]]) {
                        movePermission[key] = true;
                    }
                }
            });

            //Moves the player
            if(movePermission.up) {
                this.y -= 103.68*(deltaTime/1000);
            }
            if(movePermission.down) {
                this.y += 103.68*(deltaTime/1000);
            }
            if(movePermission.left) {
                this.x -= 103.68*(deltaTime/1000);
            }
            if(movePermission.right) {
                this.x += 103.68*(deltaTime/1000);
            }

            //Checks player boundaries with the outside of the board
            if(this.y < this.radius) {
                this.y = this.radius;
            } else if(this.y > diameter.boardHeight - this.radius) {
                this.y = diameter.boardHeight - this.radius;
            }
            if(this.x < this.radius) {
                this.x = this.radius;
            } else if(this.x > diameter.boardWidth - this.radius) {
                this.x = diameter.boardWidth - this.radius;
            }
        
            /*
                Checks if the player has interacted with any tile
            */
            for(let i = 0; i < NoTile.noTiles.length; i++) {
                if(NoTile.noTiles[i].x + diameter.tile > this.x - this.radius + 4) {
                    if(NoTile.noTiles[i].x > this.x + this.radius - 4) {
                        break;
                    } else {
                        if(Math.abs(NoTile.noTiles[i].y + radius.tile - this.y) < this.radius + radius.tile - 4) {
                            let lengthY = NoTile.noTiles[i].y + radius.tile - this.y;
                            let lengthX = NoTile.noTiles[i].x + radius.tile - this.x;
        
                            if(Math.abs(lengthX) < radius.tile) {
                                if(lengthY < 0) {
                                    this.y += 103.68*(deltaTime/1000);
                                } else {
                                    this.y -= 103.68*(deltaTime/1000);
                                }
                            } else if(Math.abs(lengthY) < radius.tile) {
                                if(lengthX < 0) {
                                    this.x += 103.68*(deltaTime/1000);
                                } else {
                                    this.x -= 103.68*(deltaTime/1000);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    update() {
        if(!this.killed) {
            //Updates player's position
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        } else { //Fade out animation for the player
            this.opacity -= deltaTime/500;

            //Checks if the player faded out completely
            if(this.opacity <= 0) {
                this.opacity = 1;
                this.x = this.respawnPoint.x;
                this.y = this.respawnPoint.y;
                this.killed = false;
                Coin.restoreCoins();
            }

            //Updates player's position
            this.element.style.opacity = this.opacity.toFixed(3);
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
    }

    reachedEnd() {
        this.inSafeZone = true;
        let allTrue = true;
        for(let i = 0; i < Player.players.length; i++) {
            if(!Player.players[i].inSafeZone) {
                allTrue = false;
            }
        }
        if(allTrue) {
            location.reload();
        }
    }
}