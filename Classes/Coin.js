class Coin {
    //Contains instances
    static coins = [];

    constructor(obj) {
        Object.keys(obj).forEach(key => this[key] = obj[key]);

        //Creates the element
        let div = document.createElement('div');
        div.classList.add('coins');
        div.classList.add('entities');
        innerBoard.appendChild(div);
        this.element = div;
        this.x *= diameter.gridSquare;
        this.y *= diameter.gridSquare;
        div.style.left = `${this.x}px`;
        div.style.top = `${this.y}px`;

        //Appends it to the instances array
        Coin.coins.numericInsert(this, 'x');
    }

    static playerCollisions() {
        let index = Coin.coins.binarySearch(Player.player.x - radius.coin - radius.player, 'x');
        if(index != -1) {
            for(let i = index; i < Coin.coins.length; i++) {
                if(!Coin.coins[i].collected) {
                    if(Coin.coins[i].x > Player.player.x + radius.coin + radius.player) {
                        break;
                    } else {
                        if(Math.abs(Player.player.y - Coin.coins[i].y) < radius.coin + radius.player) {
                            // Coin collisions with player are square on square
                            Coin.coins[i].collected = true;
                            Coin.coins[i].element.style.display = 'none';
                            Player.player.collectedCoins.push(Coin.coins[i]);
                        }
                    }
                }
            }
        }
    }

    static restoreCoins() {
        for(let i = 0; i < Player.player.collectedCoins.length; i++) {
            Player.player.collectedCoins[i].element.style.display = 'block';
            Player.player.collectedCoins[i].collected = false;
        }
    }

    static collectedAllCoins() {
        for(let i = 0; i < Coin.coins.length; i++) {
            if(!Coin.coins[i].collected) {
                return false;
            }
        }
        return true;
    }
}