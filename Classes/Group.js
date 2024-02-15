class Group {
    //Contains instances
    static groups = {};

    constructor(obj, groupName) {
        Object.keys(obj).forEach(key => this[key] = obj[key]);
        this.key = groupName;

        if(['Spawn', 'Checkpoint'].includes(this.special)) {
            this.element = entities.safeZones[entities.safeZones.indexOfObjectValue('x', this.mainSquare.x, {'y': this.mainSquare.y})].element;
            this.mainSquare.x = this.mainSquare.obj.x * diameter.tile;
            this.mainSquare.y = this.mainSquare.obj.y * diameter.tile;
            delete this.mainSquare.obj;
            if(this.special == 'Spawn') {
                let x = this.mainSquare.x + radius.tile;
                let y = this.mainSquare.y + radius.tile;

                //Applies spawn coordinates to the players
                for(let i = 0; i < Player.players.length; i++) {
                    Player.players[i].respawnPoint = {
                        x: x,
                        y: y
                    };
                    Player.players[i].x = x;
                    Player.players[i].y = y;
                    Player.players[i].spawnPointFound = true;
                }
            }
        } else if(this.type == 'enemy') {
            let middleCoordinates = findMiddleGroupCoordinates(this.objects);
            this.x = middleCoordinates.x * diameter.gridSquare;
            this.y = middleCoordinates.y * diameter.gridSquare;
            this.xRadius *= diameter.gridSquare;
            this.yRadius *= diameter.gridSquare;
            this.elements = [];
        }

        Group.groups[groupName] = this;
    }

    static moveGroups() {
        Object.keys(Group.groups).forEach(key => {
            if(Group.groups[key].type == 'enemy') {
                Group.groups[key].moveEnemyGroup();
            }
        });
    }

    moveEnemyGroup() {
        let startingX = this.x;
        let startingY = this.y;

        if(this.movement == 'v') {
            this.y += 103.68 * this.speed * this.direction * (deltaTime/1000);
            if(this.direction == 1) {
                if(this.y > diameter.boardHeight - this.yRadius) {
                    let minCollision = diameter.boardHeight - this.yRadius;
                    this.y = minCollision - (this.y - minCollision);
                    this.direction *= -1;
                }
            } else if(this.direction == -1) {
                if(this.y < this.yRadius) {
                    let minCollision = this.yRadius;
                    this.y = minCollision + (minCollision - this.y);
                    this.direction *= -1;
                }
            }
        } else if(this.movement == 'h') {
            this.x += 103.68 * this.speed * this.direction * (deltaTime/1000);
            if(this.direction == 1) {
                if(this.x > diameter.boardWidth - this.xRadius) {
                    let minCollision = diameter.boardWidth - this.xRadius;
                    this.x = minCollision - (this.x - minCollision);
                    this.direction *= -1;
                }
            } else if(this.direction == -1) {
                if(this.x < this.xRadius) {
                    let minCollision = this.xRadius;
                    this.x = minCollision + (minCollision - this.x);
                    this.direction *= -1;
                }
            }
        }

        //Binary search through noZones to check for a collision and then apply startingX and startingY to move each enemy in group
        let binarySearchI = NoTile.noTiles.binarySearch(this.x - this.xRadius - diameter.tile);
        if(binarySearchI != -1) {
            for(let i = binarySearchI; i < NoTile.noTiles.length; i++) {
                if(NoTile.noTiles[i].x > this.x + this.xRadius) {
                    break;
                }
                if(NoTile.noTiles[i].y + diameter.tile > this.y - this.yRadius && NoTile.noTiles[i].y < this.y + this.yRadius) {
                    this.noTileCollision(i);
                }
            }
        }

        let changeX = this.x - startingX;
        let changeY = this.y - startingY;
        this.elements.forEach(element => {
            let index = Enemy.enemies.indexOfObjectValue('element', element);
            Enemy.enemies[index].y += changeY;
            Enemy.enemies[index].x += changeX;
        });

        if(this.circularMotion) {
            this.elements.forEach(element => {
                let i = Enemy.enemies.indexOfObjectValue('element', element);
                let x = Enemy.enemies[i].x;
                let y = Enemy.enemies[i].y;

                let cX = x - this.x;
                let cY = this.y - y;
                let c = (cX**2 + cY**2)**0.5;

                if(!(cX == 0 && cY == 0)) { //Excludes center of circle
                    let currentAngle = Math.atan(cY/cX);
                    if(cX < 0) {
                        currentAngle += Math.PI;
                    }
                    currentAngle += (this.rotationalSpeed/4*(deltaTime/1000) * this.rotationalDirection) * Math.PI * 2;

                    let newCX = c * Math.cos(currentAngle);
                    let newCY = c * Math.sin(currentAngle);

                    let newX = this.x + newCX;
                    let newY = this.y - newCY;

                    Enemy.enemies[i].x = newX;
                    Enemy.enemies[i].y = newY;
                }
            });
        }
    }

    noTileCollision(i) {
        if(this.movement == 'v') {
            if(this.direction == 1) {
                this.direction = -1;
        
                let minCollision = NoTile.noTiles[i].y - this.yRadius;
        
                //Take the minimum collision position, and subtract how much you are past it
                this.y = minCollision - (this.y - minCollision);
            } else {
                this.direction = 1;
        
                let minCollision = NoTile.noTiles[i].y + diameter.tile + this.yRadius;
        
                //Take the minimum collision possible, and add how much you are past it
                this.y = minCollision + (minCollision - this.y);
            }
        } else if(this.movement == 'h') {
            if(NoTile.noTiles[i].x > this.x) {
                this.direction = -1;
        
                let minCollision = NoTile.noTiles[i].x - this.xRadius;
        
                //Take the minimum collision possible, and subtract how much you are past it
                this.x = minCollision - (this.x - minCollision);
        
            } else {
                this.direction = 1;
        
                let minCollision = NoTile.noTiles[i].x + diameter.tile + this.xRadius;
        
                //Take the minimum collision possible, and add how much you are past it
                this.x = minCollision + (minCollision - this.x);
        
            }
        }
    }
}