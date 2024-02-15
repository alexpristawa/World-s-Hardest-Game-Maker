class Enemy {
    //Contains instances
    static enemies = [];

    constructor(obj) {
        Object.keys(obj).forEach(key => this[key] = obj[key]);

        //Creates the element
        let div = document.createElement('div');
        div.classList.add('enemies');
        div.classList.add('entities');
        innerBoard.appendChild(div);
        this.element = div;
        this.x *= diameter.gridSquare;
        this.y *= diameter.gridSquare;
        div.style.left = `${this.x}px`;
        div.style.top = `${this.y}px`;

        Object.keys(this.behavior).forEach(key => {
            if(key != 'type' && this.behavior[key] != 'none') {
                this.behavior[key] = this.behavior[key] * diameter.gridSquare - radius.gridSquare;
                
                if(!isNaN(this.behavior[key])) {
                    this.behavior[key] = parseFloat(this.behavior[key].toFixed(2));
                }
            }
        });

        for(let i = 0; i < obj.groups.length; i++) {
            Group.groups[obj.groups[i]].elements.push(div);
        }

        //Appends it to the instances array
        Enemy.enemies.numericInsert(this, 'x');
    }

    /*
        Moves the enemies
        Checks if a ball exceeded its group's borders and the borders of the board
        Has an exception that it doesn't run if the ball is part of a circlular group
    */
    static exceedsBorders() {
        for(let i = 0; i < Enemy.enemies.length; i++) {
            let hasCircleGroup = false;
            for(let j = 0; j < Enemy.enemies[i].groups.length; j++) {
                let group = Group.groups[Enemy.enemies[i].groups[j]];
                if(group.circularMotion) {
                    hasCircleGroup = true;
                } else {
                    //Nested group logic
                    Enemy.enemies[i].checkBorder({
                        t: group.y - group.yRadius,
                        b: group.y + group.yRadius,
                        l: group.x - group.xRadius,
                        r: group.x + group.xRadius
                    });
                }
            }
        
            if(!hasCircleGroup) {
                Enemy.enemies[i].checkBorder({
                    t: 0,
                    l: 0,
                    r: diameter.boardWidth,
                    b: diameter.boardHeight
                }, true);

                for(let j = 0; j < Enemy.enemies[i].groups.length; j++) {
                    let group = Enemy.enemies[i].groups[j];
                    Enemy.enemies[i].checkBorder({
                        t: group.y - group.yRadius,
                        b: group.y + group.yRadius,
                        l: group.x - group.xRadius,
                        r: group.x + group.xRadius
                    });
                }
            }

            //Custom boundaries
            Enemy.enemies[i].checkBorder({
                t: Enemy.enemies[i].behavior.boundVMin,
                b: Enemy.enemies[i].behavior.boundVMax,
                l: Enemy.enemies[i].behavior.boundHMin,
                r: Enemy.enemies[i].behavior.boundHMax
            });
        }
        Enemy.enemies.numericSort('x');
    }

    checkBorder(obj, move = false) {
        if(this.movement == 'v') {
            if(move) this.y += 103.68 * this.speed * this.direction * (deltaTime/1000);
            if(this.direction == 1) {
                if(this.y > obj.b-radius.enemy) {
                    let minCollision = obj.b - radius.enemy;
                    this.y = minCollision - (this.y - minCollision);
                    this.direction *= -1;
                }
            } else if(this.direction == -1 ) {
                if(this.y < obj.t + radius.enemy) {
                    let minCollision = obj.t + radius.enemy
                    this.y = minCollision + (minCollision-this.y);
                    this.direction *= -1;
                }
            }
        } else if(this.movement == 'h') {
            if(move) this.x += 103.68 * this.speed * this.direction * (deltaTime/1000);
            if(this.direction == 1) {
                if(this.x > obj.r - radius.enemy) {
                    let minCollision = obj.r - radius.enemy;
                    this.x = minCollision - (this.x - minCollision);
                    this.direction *= -1;
                }
            } else if(this.direction == -1) {
                if(this.x < obj.l + radius.enemy) {
                    let minCollision = obj.l + radius.enemy
                    this.x = minCollision + (minCollision-this.x);
                    this.direction *= -1;
                }
            }
        }
    }

    /*
        Checks every noTile based on enemy coordinates to check for a collision
        Calls functions in the Scripts/collisions.js file for collisions
        Uses a binary search through noTiles because it is nested
    */
    static noTileCollisions() {
        for(let i = 0; i < Enemy.enemies.length; i++) {
            let skipIndex = false;
            for(let j = 0; j < Enemy.enemies[i].groups.length; j++) {
                if(Group.groups[Enemy.enemies[i].groups[j]].circularMotion) {
                    skipIndex = true;
                    break;
                }
            }
            if(!Enemy.enemies[i].collisions) {
                skipIndex = true;
            }
            if(!skipIndex) {
                let index = NoTile.noTiles.binarySearch(Enemy.enemies[i].x - radius.enemy - diameter.tile, 'x');
                if(index != -1) {
                    for(let j = index; j < NoTile.noTiles.length; j++) {
                        if(NoTile.noTiles[j].x > Enemy.enemies[i].x + radius.enemy) {
                            break;
                        } else {
                            if(Math.abs(NoTile.noTiles[j].y + radius.tile - Enemy.enemies[i].y) < radius.enemy + radius.tile) {
                                Enemy.enemies[i].noTileCollision(j);
                            }
                        }
                    }
                }
            }
        }
    }

    noTileCollision(j) {
        if(this.movement == 'v') {

            //Not affected by collision
            this.element.style.left = `${this.x}px`;
        
            if(this.direction == 1) {
                this.direction = -1;
        
                let minCollision = NoTile.noTiles[j].y - radius.enemy;
        
                //Take the minimum collision position, and subtract how much you are past it
                this.y = minCollision - (this.y - minCollision);
                
                //Display min collision but don't store it
                this.element.style.top = `${minCollision}px`;
            } else {
                this.direction = 1;
        
                let minCollision = NoTile.noTiles[j].y + diameter.tile + radius.enemy;
        
                //Take the minimum collision possible, and add how much you are past it
                this.y = minCollision + (minCollision - this.y);
        
                //Display min collision but don't store it
                this.element.style.top = `${minCollision}px`;
            }
            this.updated = true;
        } else {
        
            //Not affected by collision
            this.element.style.top = `${this.y}px`;
        
            if(NoTile.noTiles[j].x > this.x) {
                this.direction = -1;
        
                let minCollision = NoTile.noTiles[j].x - radius.enemy;
        
                //Take the minimum collision possible, and subtract how much you are past it
                this.x = minCollision - (this.x - minCollision);
        
                //Display min collision but don't store it
                this.element.style.left = `${minCollision}px`;
            } else {
                this.direction = 1;
        
                let minCollision = NoTile.noTiles[j].x + diameter.tile + radius.enemy;
        
                //Take the minimum collision possible, and add how much you are past it
                this.x = minCollision + (minCollision - this.x);
        
                //Display min collision but don't store it
                this.element.style.left = `${minCollision}px`;
            }
            this.updated = true;
        }
    }

    /* 
        Iterates through the balls array to check collisions with the player.
        The array is in numerical order, and it terminates when a ball's leftmost point's x-coordinate is greater than 
        the player's rightmost x-coordinate
        Binary search could be beneficial (but not necessary since loops are not nested)
    */
    static playerCollisions() {
        for(let i = 0; i < Enemy.enemies.length; i++) {
            if(Enemy.enemies[i].x + radius.enemy > Player.player.x - radius.player) {
                if(Enemy.enemies[i].x - radius.enemy > Player.player.x + radius.player) {
                    break;
                } else {
                    if(Math.abs(Enemy.enemies[i].y - Player.player.y) < radius.enemy + radius.player) { //Lousy collision
                        if(Enemy.enemies[i].checkPlayerCollision()) {
                            Player.player.killed = true;
                        }
                    }
                }
            }
        }
    }

    checkPlayerCollision() {
        let points = [
            {
                x: Player.player.x - Player.player.radius,
                y: Player.player.y
            },
            {
                x: Player.player.x,
                y: Player.player.y - Player.player.radius
            },
            {
                x: Player.player.x,
                y: Player.player.y
            },
            {
                x: Player.player.x,
                y: Player.player.y + Player.player.radius
            },
            {
                x: Player.player.x + Player.player.radius,
                y: Player.player.y
            }
        ];
        for(let i = 0; i < points.length; i++) {
            if((points[i].x - this.x)**2 + (points[i].y - this.y)**2 < radius.enemy**2) {
                return true;
            }
        }
        return false;
    }

    static updateAll() {
        for(let i = 0; i < Enemy.enemies.length; i++) {
            if(!Enemy.enemies[i].updated) {
                Enemy.enemies[i].update();
            } else {
                Enemy.enemies[i].updated = false;
            }
        }
    }

    update() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}