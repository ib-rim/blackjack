class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
}

class Deck {
    constructor() {
        this.cards = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 13; j++) {
                let suit = numToSuit(i + 1);
                let rank = numToRank(j + 1);
                this.cards.push(new Card(suit, rank));
            }
        }
        this.size = this.cards.length;
    }

    getRandomCard() {
        let index = Math.floor(Math.random() * (this.size - 2));
        let card = this.cards.splice(index, 1)[0];
        this.size -= 1;
        return card;
    }
}

const hand = document.getElementById("hand1");
const optionsElem = document.getElementById("options");
const valueElem = document.getElementById("value");
const hitButton = document.getElementById("hit-btn");
const standButton = document.getElementById("stand-btn");
const resetButton = document.getElementById("reset-btn");

hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
resetButton.addEventListener("click", reset);
let deck;
reset();

// Reset deck and hand
function reset() {
    valueElem.style.display = "none";
    valueElem.classList.remove("bust");
    optionsElem.style.display = "flex";

    deck = new Deck();
    let card1 = deck.getRandomCard();
    let card2 = deck.getRandomCard();

    hand.innerHTML = `
    <div class="card">
        <div class="rank">${card1.rank}</div>
        <div class="suit">${card1.suit}</div>
    </div>
    <div class="card">
        <div class="rank">${card2.rank}</div>
        <div class="suit">${card2.suit}</div>
    </div>
    `;

    updateSuitColor(hand.children[0].children[1]);
    updateSuitColor(hand.children[1].children[1]);
}

// Add new card to hand then evaluate
function hit() {
    let card = deck.getRandomCard();
    const cardElem = document.createElement("div");

    cardElem.classList.add("card");
    cardElem.innerHTML = `
    <div class='rank'>${card.rank}</div>
    <div class='suit'>${card.suit}</div>
    `;

    updateSuitColor(cardElem.children[1]);
    hand.appendChild(cardElem);
    let [value1, value2] = evaluateHand();

    if (value1 > 21) {
        endGame(value1, value2);
    }
}

// Evaluate hand and end game
function stand() {
    let [value1, value2] = evaluateHand();

    endGame(value1, value2);
}

// Evaluate value of hand 
function evaluateHand() {
    let totalValue1 = 0; // All Aces are 1s
    let totalValue2 = 0; // 1 Ace is 11

    // Add values of each card in hand
    for (let i = 0; i < hand.children.length; i++) {
        let rank = hand.children[i].children[0].textContent;
        if (rank === "A") {
            totalValue1 += 1;
            // Limit of one 11 value Ace per hand
            totalValue2 = totalValue1 + 10;
        }
        else {
            totalValue1 += rankToValue(rank);
            totalValue2 += rankToValue(rank);
        }
    }

    return [totalValue1, totalValue2];
}

// Num: Integer between 1 and 4 inclusive
// Suit: ♠, ♥, ♦, ♣
function numToSuit(num) {
    if (num == 1) {
        return "♠";
    }
    else if (num == 2) {
        return "♥";
    }
    else if (num == 3) {
        return "♦";
    }
    else if (num == 4) {
        return "♣";
    }
}

// Num: Integer between 1 and 13 inclusive
// Rank: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K
function numToRank(num) {
    if (num == 1) {
        return "A";
    }
    else if (num >= 2 && num <= 10) {
        return num;
    }
    else if (num == 11) {
        return "J";
    }
    else if (num == 12) {
        return "Q";
    }
    else if (num == 13) {
        return "K";
    }
}

// Rank: 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K
// Value: Integer between 2 and 10 inclusive
function rankToValue(rank) {
    if (rank >= 2 && rank <= 10) {
        return parseInt(rank);
    }
    else if (rank === "J" || rank === "Q" || rank === "K") {
        return 10;
    }
}

// Change text color to red if suit is heart or diamonds
function updateSuitColor(cardElem) {
    if (cardElem.textContent === "♥" || cardElem.textContent === "♦") {
        cardElem.style.color = "red";
    }
}

// Show evaluated value of hand and bust if over 21
function displayValue(value) {
    if (value > 21) {
        valueElem.classList.add("bust");
        valueElem.textContent = `BUST: ${value}`;
    }
    else {
        valueElem.textContent = `Value: ${value}`;
    }
    valueElem.style.display = "block";
}

// Display value of hand and remove ability to hit or stand
function endGame(value1, value2) {
    //1: If both over or if <21 and 2 > 21
    //2: If both under
    if (value1 <= 21 && value2 <= 21) {
        displayValue(value2);
    }
    else {
        displayValue(value1);
    }

    optionsElem.style.display = "none";
}