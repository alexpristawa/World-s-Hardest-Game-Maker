let randomNumber = (min, max) => {
    return Math.floor(Math.random()*(max-min)+min);
}

Array.prototype.numericInsert = function(element, key = false) {
    // Find the correct position for the new element
    let i = 0;
    if(!key) { //Array of numbers
        while (i < this.length && this[i] < element) {
            i++;
        }
    } else { //Array of objects
        while (i < this.length && this[i][key] < element[key]) {
            i++;
        }
    }

    // Insert the element at the found position
    this.splice(i, 0, element);
};

Array.prototype.indexOfObjectValue = function(key, value, obj = false) {
    if(obj !== false) {
        for(let i = 0; i < this.length; i++) {
            if(this[i][key] == value) {
                let allTrue = true;
                Object.keys(obj).forEach(newKey => {
                    if(this[i][newKey] != obj[newKey]) {
                        allTrue = false;
                    }
                });
                if(allTrue) {
                    return i;
                }
            }
        }
    } else {
        for(let i = 0; i < this.length; i++) {
            if(this[i][key] == value) {
                return i;
            }
        }
    }
    return -1;
}

Array.prototype.numericSort = function (key = false) {
    if (key !== false) {
        // If key is provided, sort an array of objects based on the key
        return this.sort((a, b) => {
            return Number(a[key]) - Number(b[key]);
        });
    } else {
        // If no key is provided, sort an array of numbers
        return this.sort((a, b) => {
            return Number(a) - Number(b);
        });
    }
};

Array.prototype.binarySearch = function(value, key = false) {
    let low = 0;
    let high = this.length - 1;
    let mid;
    
    if(!key) {
        while (low <= high) {
            mid = Math.floor((low + high) / 2);

            if (this[mid] < value) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
    } else {
        while (low <= high) {
            mid = Math.floor((low + high) / 2);

            if (this[mid][key] < value) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
    }

    return low < this.length ? low : -1;
};
