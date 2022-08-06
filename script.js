// Ensures indicating hits/misses on the board
let view = {
    displayHit: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMessage: function(message) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = message;
    },
    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");

    }
};

// Generates our fleet
let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{ locations: ["0", "0", "0"], hits: ["", "", ""] },
    { locations: ["0", "0", "0"], hits: ["", "", ""] },
    { locations: ["0", "0", "0"], hits: ["", "", ""] }],

    fire: function(guess) {
        for (let i = 0; i < this.numShips; ++i) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);

            if (index >= 0) {
                //We have a hit!
                console.log(index + "__" + ship.hits[index]);

                if (ship.hits[index] !== "hit") {
                    ship.hits[index] = "hit";
                    view.displayHit(guess);
                    
                    if (this.isSunk(ship)) {
                        view.displayMessage("You sank my battleship!");
                        ++this.shipsSunk;
                    } else {
                        view.displayMessage("HIT!");
                    }
                } else {
                    view.displayMessage("You've already hit it.");
                }
                
                return true;
            }
        }
        
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        
        return false;
        
    },
    generateShip: function() {
        let column;
        let direction = Math.floor(Math.random() * 2);
        let row;
        let newShipLocations = [];

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            column = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
            column = Math.floor(Math.random() * this.boardSize);
        }

        for (let i = 0; i < this.shipLength; ++i) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (column + i));
            } else {
                newShipLocations.push((row + i) + "" + column);
            }
        }

        return newShipLocations;
    },
    generateShipLocations: function() {
        let locations;

        for (let i = 0; i < this.numShips; ++i) {
            do {
                locations = this.generateShip();
            } while (this.isCollision(locations));
            this.ships[i].locations = locations;
        }
    },
    isCollision: function(locations) {
        for (let i = 0; i < this.numShips; ++i) {
            let ship = this.ships[i];

            for (let j = 0; j < locations.length; ++j) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }

        return false;
    },
    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }

        return true;
    }
}

// Just a controller...
let controller = {
    guesses: 0,
    isEnd: false,
    parseGuess: function(guess) {
        let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        
        if (guess === null || guess.length < 2) {
            alert("Oops, please enter a letter (from A to G) and a number (from 0 to 6).");
        } else if (guess.length > 2) {
            alert("Wow, Your guess is way long...");
        } else if (typeof(guess.charAt(0)) !== "string" && typeof(column) !== "number") {
            alert("Oh no!\nLetter first and than a number.");
        } else {
            let row = alphabet.indexOf(guess.charAt(0).toUpperCase());
            let column = guess.charAt(1);

            if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
                alert("Oops, that's off the board!");
            } else {
                return row + column;
            }
        }

        return null;
    },
    processGuess: function(guess) {
        let hit = false;
        let location = this.parseGuess(guess);

        if (location) {
            ++this.guesses;

            if (!this.isEnd) {
                hit = model.fire(location);

                if (hit && model.shipsSunk === model.numShips) {
                    this.isEnd = true;
                    
                    view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses.");
                }
            } else {
                view.displayMessage("You've already destroyed the whole fleet!");
            }
        }
    }
};

// Some preps, when web is downloaded
function init() {
    let fireButton = document.getElementById("fireButton");
    let guessInput = document.getElementById("guessInput")
    
    fireButton.onclick = handleFireButton;
    guessInput.focus();
    guessInput.onkeypress = handleKeyPress;
    
    model.generateShipLocations();    
}

function handleFireButton() {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;

    controller.processGuess(guess);
    guessInput.value = "";
}

function handleKeyPress(event) {
    let fireButton = document.getElementById("fireButton");

    if (event.keyCode === 13) {
        fireButton.click();

        return false;
    }
}

window.onload = init;