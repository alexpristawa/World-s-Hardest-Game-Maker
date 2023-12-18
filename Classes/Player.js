class Player {
    static deaths = 0;
    
    //Array in case you're on 2 player mode
    static players = [];

    //Currently changing player (Changes based on `players` arr)
    static player;

    constructor(obj) {
        Object.keys(obj).forEach(key => this[key] = obj[key]);
        let div = document.createElement('div');
        div.classList.add('player');
        div.classList.add('entities');
        innerBoard.appendChild(div);
        this.element = div;
        this.opacity = 1;

        Player.players.push(this);
        Player.player = this;
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
}