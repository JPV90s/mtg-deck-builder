const setSelectElement = document.getElementById("set-select");
const exploreSetButton = document.getElementById("explore-set");
const tableContainer = document.getElementById("table-container");
const cardListTable = document.getElementById("card-list-table");
const expandedInfoCard = document.querySelector(".expanded-info-card");
const cardName = document.querySelectorAll(".card-name");
const cardSetTitle = document.getElementById("set-name");

const deck = [];

const manaSymbolImages = {
  "{W}": "images/manaWhite.png",
  "{U}": "images/manaBlue.png",
  "{B}": "images/manaBlack.png",
  "{R}": "images/manaRed.png",
  "{G}": "images/manaGreen.png",
  "{W/U}": "images/manaWhiteBlue.png",
  "{W/B}": "images/manaWhiteBlack.png",
  "{U/B}": "images/manaBlueBlack.png",
  "{U/R}": "images/manaBlueRed.png",
  "{B/R}": "images/manaBlackRed.png",
  "{B/G}": "images/manaBlackGreen.png",
  "{R/W}": "images/manaRedWhite.png",
  "{R/G}": "images/manaRedGreen.png",
  "{G/W}": "images/manaGreenWhite.png",
  "{G/U}": "images/manaGreenBlue.png",
  "{X}": "images/manaX.png",
  "{0}": "images/mana0.png",
  "{1}": "images/mana1.png",
  "{2}": "images/mana2.png",
  "{3}": "images/mana3.png",
  "{4}": "images/mana4.png",
  "{5}": "images/mana5.png",
  "{6}": "images/mana6.png",
  "{7}": "images/mana7.png",
  "{8}": "images/mana8.png",
  "{9}": "images/mana9.png",
};

exploreSetButton.addEventListener("click", function () {
  const selectedSet = setSelectElement.value;

  if (selectedSet === "") {
    alert("Please select a set to explore!");
    return;
  }
  const scryfallUrl = `https://api.scryfall.com/cards/search?q=set:${selectedSet}`;
  fetchCards(scryfallUrl);
  hideElement(expandedInfoCard);
});

function fetchCards(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      displayCards(data.data);
      displayElement(cardListTable);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Error fetching cards. Please try again later.");
    })
    .finally(() => {
      setTimeout(() => {}, 100);
    });
}

async function fetchCardDetail(id) {
  const url = `https://api.scryfall.com/cards/${id}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Error fetching card details:", response.statusText);
    return null;
  }
  return await response.json();
}

function displayElement(el) {
  if (el === cardListTable) {
    el.style.display = "table";
  } else if (el === expandedInfoCard) {
    el.style.display = "flex";
  } else {
    el.style.display = "block";
  }
}

function hideElement(el) {
  el.style.display = "none";
}

function displayCards(cards) {
  const cardDisplayArea = document.getElementById("card-display-table");
  if (cardDisplayArea) {
    cardDisplayArea.innerHTML = "";
    cardSetTitle.innerText = "";
  }
  cardSetTitle.innerText = `${cards[0].set_name}`;
  cards.forEach((card) => createCardElement(card, cardDisplayArea));

  const cardNames = document.querySelectorAll(".card-name");
  cardNames.forEach(function (card) {
    card.addEventListener("click", function (event) {
      const cardId = event.target.id;
      if (cardId) {
        fetchCardDetail(cardId)
          .then((cardData) => {
            displayCardInfo(cardData, expandedInfoCard);
          })
          .catch((error) => {
            console.error("Error fetching card details:", error);
          })
          .finally(() => {
            setTimeout(() => {}, 100);
          });
      } else {
        console.error("Missing card ID");
      }
    });
  });
}

function createCardElement(card, container) {
  const cardElement = document.createElement("tr");
  cardElement.classList.add("card");

  let manaCost = "";
  if (card.mana_cost) {
    const manaCostParts = card.mana_cost.split(" // ");
    manaCost = manaCostParts
      .map((part) => {
        const manaSymbols = part.match(/{.*?}/g);
        return manaSymbols
          .map(
            (symbol) =>
              `<img class="mana-symbol" src="${manaSymbolImages[symbol]}" alt="${symbol}">`
          )
          .join(" ");
      })
      .join(" // ");
  } else if (card.card_faces) {
    if (card.card_faces[0].mana_cost === "") {
      manaCost = "";
    } else {
      const manaCostParts = card.card_faces[0].mana_cost.split(" // ");
      manaCost = manaCostParts
        .map((part) => {
          const manaSymbols = part.match(/{.*?}/g);
          return manaSymbols
            .map(
              (symbol) =>
                `<img class="mana-symbol" src="${manaSymbolImages[symbol]}" alt="${symbol}">`
            )
            .join(" ");
        })
        .join(" // ");
    }
  }

  let power = "";
  if (card.power) {
    power = card.power;
  } else if (
    card.card_faces &&
    card.card_faces[0].power &&
    card.card_faces[1].power
  ) {
    power = card.card_faces[0].power + " // " + card.card_faces[1].power;
  } else if (card.card_faces && card.card_faces[0].power) {
    power = card.card_faces[0].power;
  }

  let toughness = "";
  if (card.toughness) {
    toughness = card.toughness;
  } else if (
    card.card_faces &&
    card.card_faces[0].toughness &&
    card.card_faces[1].toughness
  ) {
    toughness =
      card.card_faces[0].toughness + " // " + card.card_faces[1].toughness;
  } else if (card.card_faces && card.card_faces[0].toughness) {
    toughness = card.card_faces[0].toughness;
  }

  cardElement.innerHTML = `
    <td>${
      card.colors
        ? card.colors
        : card.card_faces[0].colors + " // " + card.card_faces[1].colors
    }</td>
    <td class="name"><a class="card-name" id="${card.id}">${card.name}</a></td>
    <td class="table-number">${card.cmc}</td>
    <td class="mana-cost">${manaCost}</td>
    <td>${card.type_line}</td>
    <td>${
      card.oracle_text
        ? card.oracle_text
        : card.card_faces[0].oracle_text +
          " // " +
          card.card_faces[1].oracle_text
    }</td>
    <td class="table-number">${power}</td>
    <td class="table-number">${toughness}</td>
    <td style="text-transform: capitalize;">${card.rarity}</td>
    <td><button class="add-card-deck" id="add-card-${
      card.id
    }" onclick=addCardToDeck(${card})><b>+</b></button><button class="remove-card-deck"><b>-</b></button></td>
  `;
  container.appendChild(cardElement);
}

function changeImg() {
  const card1 = document.getElementById("card-image");
  const card2 = document.getElementById("card-image2");
  if (card1.style.display === "none") {
    card1.classList.toggle("rotate");
    card1.style.display = "block";
    card2.style.display = "none";
  } else {
    card1.style.display = "none";
    card2.style.display = "block";
    card2.classList.toggle("rotate");
  }
}

function displayCardInfo(card, container) {
  const cardLeftInfo = document.createElement("div");
  cardLeftInfo.classList.add("expanded-left");
  const cardRightInfo = document.createElement("div");
  cardRightInfo.classList.add("expanded-right");
  hideElement(cardListTable);

  if (container) {
    container.innerHTML = "";
  }

  let manaCost = "";
  if (card.mana_cost) {
    const manaCostParts = card.mana_cost.split(" // ");

    manaCost = manaCostParts
      .map((part) => {
        const manaSymbols = part.match(/{.*?}/g);
        return manaSymbols
          .map(
            (symbol) =>
              `<img class="mana-symbol" src="${manaSymbolImages[symbol]}" alt="${symbol}">`
          )
          .join(" ");
      })
      .join(" // ");
  } else if (card.card_faces) {
    if (card.card_faces[0].mana_cost === "") {
      manaCost = "";
    } else {
      const manaCostParts = card.card_faces[0].mana_cost.split(" // ");
      manaCost = manaCostParts
        .map((part) => {
          const manaSymbols = part.match(/{.*?}/g);
          return manaSymbols
            .map(
              (symbol) =>
                `<img class="mana-symbol" src="${manaSymbolImages[symbol]}" alt="${symbol}">`
            )
            .join(" ");
        })
        .join(" // ");
    }
  }

  let power = "";
  if (card.power) {
    power = card.power;
  } else if (
    card.card_faces &&
    card.card_faces[0].power &&
    card.card_faces[1].power
  ) {
    power = card.card_faces[0].power + " // " + card.card_faces[1].power;
  } else if (card.card_faces && card.card_faces[0].power) {
    power = card.card_faces[0].power;
  }

  let toughness = "";
  if (card.toughness) {
    toughness = card.toughness;
  } else if (
    card.card_faces &&
    card.card_faces[0].toughness &&
    card.card_faces[1].toughness
  ) {
    toughness =
      card.card_faces[0].toughness + " // " + card.card_faces[1].toughness;
  } else if (card.card_faces && card.card_faces[0].toughness) {
    toughness = card.card_faces[0].toughness;
  }

  let cardImage = "";
  let cardImage2 = "";
  if (card.image_uris) {
    cardImage = card.image_uris.normal;
    cardLeftInfo.innerHTML = `
    <img
    src="${cardImage}"
    alt="card-image"
    id="card-image"
  />
  <button class="add-card-deck" id="add-card-${card.id}"><b>Add card to deck</b></button>
  <button class="remove-card-deck"><b>Remove card from deck</b></button>
  <p><b>Quantity in deck: </b>2</p>
`;
  } else if (card.card_faces) {
    cardImage = card.card_faces[0].image_uris.normal;
    cardImage2 = card.card_faces[1].image_uris.normal;

    cardLeftInfo.innerHTML = `
      <img
      src="${cardImage}"
      alt="card-image"
      id="card-image"
    />
    <img
    src="${cardImage2}"
    alt="card-image"
    id="card-image2"
  />
    <button class="transform" onclick="changeImg()"><b>Transform card</b></button>
    <button class="add-card-deck"><b>Add card to deck</b></button>
    <button class="remove-card-deck"><b>Remove card from deck</b></button>
    <p><b>Quantity in deck: </b>2</p>
  `;
  }

  cardRightInfo.innerHTML = `
      <div>
      <p><b>Card Name: </b></p>
      <p class="card-info-text">${card.name}</p>
    </div>
    <div>
      <p><b>Mana Cost: </b></p>
      <p class="card-info-text">${manaCost}</p>
    </div>
    <div>
      <p><b>Card Type: </b></p>
      <p class="card-info-text">${card.type_line}</p>
    </div>
    <div>
      <p><b>Card Text: </b></p>
      <p class="card-info-text">${
        card.oracle_text
          ? card.oracle_text
          : card.card_faces[0].oracle_text +
            " // " +
            card.card_faces[1].oracle_text
      }</p>
    </div>
    <div>
      <p><b>Flavor Text: </b></p>
      <p class="card-info-text"><i>${
        card.flavor_text ? card.flavor_text : "No flavor text"
      }</i></p>
    </div>
    <div>
      <p><b>Expansion: </b></p>
      <p class="card-info-text">${card.set_name}</p>
    </div>
    <div>
      <p><b>Rarity: </b></p>
      <p class="card-info-text" style="text-transform: capitalize;">${
        card.rarity
      }</p>
    </div>
    <div>
      <p><b>Artist: </b></p>
      <p class="card-info-text">${card.artist}</p>
    </div>
  `;

  container.appendChild(cardLeftInfo);
  container.appendChild(cardRightInfo);
  displayElement(container);
}

function addCardToDeck(card) {
  console.log(card);
}

function removeCardFromDeck() {}
