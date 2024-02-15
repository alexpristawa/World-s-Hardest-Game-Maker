class SafeZone {
    //Contains instances
    static safeZones = [];

    constructor(obj) {
        Object.keys(obj).forEach(key => this[key] = obj[key]);

        this.x *= diameter.tile;
        this.y *= diameter.tile;

        //Appends it to the instances array
        SafeZone.safeZones.numericInsert(this, 'x');
    }

    static playerCollisions() {
        let inASafeZone = false;
        for(let i = 0; i < SafeZone.safeZones.length; i++) {
            if(SafeZone.safeZones[i].x + diameter.tile > Player.player.x - Player.player.radius) {
                if(SafeZone.safeZones[i].x > Player.player.x + Player.player.radius) {
                    break;
                } else {
                    if(Math.abs((SafeZone.safeZones[i].y + radius.tile) - Player.player.y) < radius.tile + Player.player.radius) {
                        if(SafeZone.safeZones[i].special == 'Completion') {
                            inASafeZone = true;
                            if(Coin.collectedAllCoins()) {
                                if(settings.twoPlayer == 'Team') {
                                    Player.player.reachedEnd();
                                } else {
                                    location.reload();
                                }
                            }
                        } else if(SafeZone.safeZones[i].special == 'Checkpoint') {
                            Player.player.respawnPoint = {
                                x: SafeZone.safeZones[i].x + radius.tile,
                                y: SafeZone.safeZones[i].y + radius.tile
                            }
                        }
                        
                        //Iterates through the groups the safe zone is in and checks their purposes
                        for(let j = 0; j < SafeZone.safeZones[i].groups.length; j++) {
                            let key = SafeZone.safeZones[i].groups[j];
                            if(Group.groups[key].special == 'Completion') {
                                inASafeZone = true;
                                if(Coin.collectedAllCoins()) {
                                    if(settings.twoPlayer == 'Team') {
                                        Player.player.reachedEnd();
                                    } else {
                                        location.reload();
                                    }
                                }
                            } else if(Group.groups[key].special == 'Checkpoint') {
                                Player.player.respawnPoint = {
                                    x: Group.groups[key].mainSquare.x + radius.tile,
                                    y: Group.groups[key].mainSquare.y + radius.tile
                                };
                            }
                        }
                    }
                }
            }
        }

        if(!inASafeZone) {
            Player.player.inSafeZone = false;
        } else {
            Player.player.inSafeZone = true;
        }
    }
}