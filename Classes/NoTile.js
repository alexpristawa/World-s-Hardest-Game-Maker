class NoTile {
    //Contains instances
    static noTiles = [];

    constructor(obj) {
        Object.keys(obj).forEach(key => this[key] = obj[key]);

        this.x = parseFloat((this.x * diameter.tile).toFixed(2));
        this.y = parseFloat((this.y * diameter.tile).toFixed(2));

        //Appends it to the instances array
        NoTile.noTiles.numericInsert(this, 'x');
    }
}