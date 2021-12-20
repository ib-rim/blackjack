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
        let index = Math.floor(Math.random() * (this.size - 1) + 1);
        let card = this.cards.splice(index, 1)[0];
        this.size -= 1;
        return card;
    }
}


let d = new Deck();
const hand = document.querySelector("#hand1");
const cardElem1 = hand.children[0];
const cardElem2 = hand.children[1];
let card1 = d.getRandomCard();
let card2 = d.getRandomCard();

cardElem1.children[0].textContent = card1.rank;
cardElem1.children[1].textContent = card1.suit;
updateSuitColor(cardElem1.children[1]);
cardElem2.children[0].textContent = card2.rank;
cardElem2.children[1].textContent = card2.suit;
updateSuitColor(cardElem2.children[1]);

evaluateHand();


function hit() {
    let card = d.getRandomCard();
    const cardElem = document.createElement("div");
    cardElem.classList.add("card");
    cardElem.innerHTML = `<div class='rank'>${card.rank}</div><div class='suit'>${card.suit}</div>`;
    updateSuitColor(cardElem.children[1]);
    hand.appendChild(cardElem);
    evaluateHand();
}

function stand() {

}

function evaluateHand() {
    const valueElem1 = document.querySelector("#value1");
    const valueElem2 = document.querySelector("#value2");
    let totalValue1 = 0;
    let totalValue2 = 0;
    let count = 0;

    for (let i = 0; i < hand.children.length; i++) {
        let rank = hand.children[i].children[0].textContent;
        if (rank === "A") {
            totalValue1 += 1;
            //Limit of one 11 Ace per hand
            if(count == 0) {
                totalValue2 += 11;
                count++;
            }
            else {
                totalValue2 += 1;
            }
        }
        else {
            totalValue1 += rankToValue(rank);
            totalValue2 += rankToValue(rank);
        }
    }

    if (totalValue1 > 21) {
        valueElem1.classList.add("bust");
    }
    if (totalValue2 > 21) {
        valueElem2.classList.add("bust");
    }

    //END GAME/HIDE BUTTONS WHEN OVER 21 - choose value closest to 21?

    valueElem1.textContent = `Value: ${totalValue1}`;
    valueElem2.textContent = `Value: ${totalValue2}`;

    if (valueElem1.textContent == valueElem2.textContent) {
        valueElem2.style.display = "none";
    }
    else {
        valueElem2.style.display = "block";
    }
}

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

function rankToValue(rank) {
    if (rank >= 2 && rank <= 10) {
        return parseInt(rank);
    }
    else if (rank === "J" || rank === "Q" || rank === "K") {
        return 10;
    }
}

function updateSuitColor(cardElem) {
    if (cardElem.textContent === "♥" || cardElem.textContent === "♦") {
        cardElem.style.color = "red";
    }
}