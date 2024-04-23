const setSelectElement = document.getElementById("set-select");
const exploreSetButton = document.getElementById("explore-set");
const displayDeckButton = document.getElementById("display-deck-button");
const tableContainer = document.getElementById("table-container");
const cardListTable = document.getElementById("card-list-table");
const expandedInfoCard = document.querySelector(".expanded-info-card");
const deckDisplayArea = document.getElementById("deck-display-area");
const cardName = document.querySelectorAll(".card-name");
const cardSetTitle = document.getElementById("set-name");
const showMoreBtn = document.getElementById("show-more-btn");

let deck = [];

const manaSymbolImages = {
  "{W}": "images/manaWhite.png",
  "{U}": "images/manaBlue.png",
  "{B}": "images/manaBlack.png",
  "{R}": "images/manaRed.png",
  "{G}": "images/manaGreen.png",
  "{C}": "images/manaColorless.png",
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
  "{W/P}": "images/manaWhitePhyrexian.png",
  "{U/P}": "images/manaBluePhyrexian.png",
  "{B/P}": "images/manaBlackPhyrexian.png",
  "{R/P}": "images/manaRedPhyrexian.png",
  "{G/P}": "images/manaGreenPhyrexian.png",
  "{R/G/P}": "images/manaRedPhyrexianGreenPhyrexian.png",
  "{R/W/P}": "images/manaRedPhyrexianWhitePhyrexian.png",
  "{G/U/P}": "images/manaGreenPhyrexianBluePhyrexian.png",
  "{G/W/P}": "images/manaGreenPhyrexianWhitePhyrexian.png",
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
  "{10}": "images/mana10.png",
  "{13}": "images/mana13.png",
  "{T}": "images/tap.png",
  "A-": "images/Alchemy.png",
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
  hideElement(deckDisplayArea);
  displayElement(cardSetTitle);
  displayElement(showMoreBtn);
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
      if (data.has_more) {
        displayCards(data.data, data.next_page);
        displayElement(cardListTable);
      } else {
        displayCards(data.data);
        displayElement(cardListTable);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Error fetching cards. Please try again later.");
    })
    .finally(() => {
      setTimeout(() => {}, 100);
    });
}

function fetchMoreCards() {
  const selectedSet = setSelectElement.value;
  const nextPageUrl = `https://api.scryfall.com/cards/search?q=set:${selectedSet}&page=2`;
  fetchCards(nextPageUrl);
}

showMoreBtn.addEventListener("click", fetchMoreCards);

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
  } else if (el === deckDisplayArea) {
    el.style.display = "flex";
  } else {
    el.style.display = "block";
  }
}

function hideElement(el) {
  el.style.display = "none";
}

function getCardColor(card) {
  if (card.colors && card.colors.length === 0) {
    return "";
  }
  if (card.colors) {
    const manaColors = card.colors.map((color) => "{" + color + "}").join("");
    return manaColors
      .match(/{.*?}/g)
      .map(
        (symbol) =>
          `<img class="mana-symbol" src="${manaSymbolImages[symbol]}" alt="${symbol}">`
      )
      .join(" ");
  } else if (card.card_faces) {
    if (card.card_faces[0].colors.length === 0) {
      return "";
    }
    const manaColors = card.card_faces[0].colors
      .map((color) => "{" + color + "}")
      .join("");
    return manaColors
      .match(/{.*?}/g)
      .map(
        (symbol) =>
          `<img class="mana-symbol" src="${manaSymbolImages[symbol]}" alt="${symbol}">`
      )
      .join(" ");
  }
  return "";
}

function getCardName(card) {
  const regex = /A-/g;
  const processedCardName = card.name.replace(
    regex,
    `<img src="${manaSymbolImages["A-"]}" alt="alchemy-sign" class="alchemy-sign">`
  );
  return processedCardName;
}

function getCardManaCost(card) {
  if (card.mana_cost) {
    const manaCostParts = card.mana_cost.split(" // ");
    return manaCostParts
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
      return "";
    } else {
      const manaCostParts = card.card_faces[0].mana_cost.split(" // ");
      return manaCostParts
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
  return "";
}

function getCardOracleText(card) {
  const symbolRegex = /{[^}]+}/g;

  if (card.oracle_text) {
    return card.oracle_text.replace(
      symbolRegex,
      (match) =>
        `<img class="mana-symbol" src="${manaSymbolImages[match]}" alt="${match}">`
    );
  } else if (card.card_faces) {
    let processedOracleText1 = card.card_faces[0].oracle_text.replace(
      symbolRegex,
      (match) =>
        `<img class="mana-symbol" src="${manaSymbolImages[match]}" alt="${match}">`
    );
    let processedOracleText2 = card.card_faces[1].oracle_text.replace(
      symbolRegex,
      (match) =>
        `<img class="mana-symbol" src="${manaSymbolImages[match]}" alt="${match}">`
    );
    return processedOracleText1 + " // " + processedOracleText2;
  }

  return "";
}

function getCardFlavorText(card) {
  if (card.flavor_text) {
    return card.flavor_text;
  } else if (
    card.card_faces &&
    card.card_faces[0].flavor_text &&
    card.card_faces[1].flavor_text
  ) {
    return (
      card.card_faces[0].flavor_text + " // " + card.card_faces[1].flavor_text
    );
  } else if (card.card_faces && card.card_faces[0].flavor_text) {
    return card.card_faces[0].flavor_text + " // ";
  } else if (card.card_faces && card.card_faces[1].flavor_text) {
    return "// " + card.card_faces[1].flavor_text;
  } else {
    return "No flavor text";
  }
}

function getCardPowerToughness(card) {
  let cardPower = "";
  let cardToughness = "";
  if (card.power) {
    cardPower = card.power;
  } else if (
    card.card_faces &&
    card.card_faces[0].power &&
    card.card_faces[1].power
  ) {
    cardPower = card.card_faces[0].power + " // " + card.card_faces[1].power;
  } else if (card.card_faces && card.card_faces[0].power) {
    cardPower = card.card_faces[0].power;
  }
  if (card.toughness) {
    cardToughness = card.toughness;
  } else if (
    card.card_faces &&
    card.card_faces[0].toughness &&
    card.card_faces[1].toughness
  ) {
    cardToughness =
      card.card_faces[0].toughness + " // " + card.card_faces[1].toughness;
  } else if (card.card_faces && card.card_faces[0].toughness) {
    cardToughness = card.card_faces[0].toughness;
  }
  return { cardPower, cardToughness };
}

function getCardImage(card) {
  let cardImage1 = "";
  let cardImage2 = "";
  if (card.image_uris) {
    cardImage1 = card.image_uris.normal;
  } else if (card.card_faces) {
    cardImage1 = card.card_faces[0].image_uris.normal;
    cardImage2 = card.card_faces[1].image_uris.normal;
  }
  return { cardImage1, cardImage2 };
}

function cardInfo(card) {
  const cardColor = getCardColor(card);
  const cardName = getCardName(card);
  const cardManaValue = card.cmc;
  const cardManaCost = getCardManaCost(card);
  const cardTypeLine = card.type_line;
  const cardOracleText = getCardOracleText(card);
  const cardFlavorText = getCardFlavorText(card);
  const { cardPower, cardToughness } = getCardPowerToughness(card);
  const cardRarity = card.rarity;
  const cardArtist = card.artist;
  const cardSetName = card.set_name;
  const { cardImage1, cardImage2 } = getCardImage(card);

  return {
    cardId: card.id,
    cardColor,
    cardName,
    cardManaValue,
    cardManaCost,
    cardTypeLine,
    cardOracleText,
    cardFlavorText,
    cardPower,
    cardToughness,
    cardRarity,
    cardArtist,
    cardSetName,
    cardImage1,
    cardImage2,
  };
}

function showCardInfo() {
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

function displayCards(initialCards, nextPageCards = null) {
  if (nextPageCards) {
    const cardDisplayArea = document.getElementById("card-display-table");
    if (cardDisplayArea) {
      cardDisplayArea.innerHTML = "";
      cardSetTitle.innerText = "";
    }
    cardSetTitle.innerText = `${initialCards[0].set_name}`;
    initialCards.forEach((card) => {
      createCardElement(card, cardDisplayArea);
    });

    showMoreBtn.addEventListener("click", () => {
      if (cardDisplayArea) {
        cardDisplayArea.innerHTML = "";
        cardSetTitle.innerText = "";
        fetchCards(nextPageCards);
        hideElement(showMoreBtn);
      }
    });
    showCardInfo();
  } else {
    const cardDisplayArea = document.getElementById("card-display-table");
    if (cardDisplayArea) {
      cardDisplayArea.innerHTML = "";
      cardSetTitle.innerText = "";
    }
    cardSetTitle.innerText = `${initialCards[0].set_name}`;
    initialCards.forEach((card) => {
      createCardElement(card, cardDisplayArea);
    });
    showCardInfo();
  }
}

function createCardElement(card, container) {
  const cardData = cardInfo(card);
  const cardElement = document.createElement("tr");
  cardElement.classList.add("card");

  cardElement.innerHTML = `
    <td class="card-color">${cardData.cardColor}</td>
    <td class="name"><a class="card-name" id="${cardData.cardId}">${cardData.cardName}</a></td>
    <td class="table-number">${cardData.cardManaValue}</td>
    <td class="mana-cost">${cardData.cardManaCost}</td>
    <td>${cardData.cardTypeLine}</td>
    <td>${cardData.cardOracleText}</td>
    <td class="table-number">${cardData.cardPower}</td>
    <td class="table-number">${cardData.cardToughness}</td>
    <td style="text-transform: capitalize;">${cardData.cardRarity}</td>
  `;
  container.appendChild(cardElement);
}

function changeImg() {
  const card1 = document.getElementById("card-image1");
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
  const cardData = cardInfo(card);
  const cardLeftInfo = document.createElement("div");
  cardLeftInfo.classList.add("expanded-left");
  const cardRightInfo = document.createElement("div");
  cardRightInfo.classList.add("expanded-right");
  hideElement(cardListTable);
  hideElement(showMoreBtn);

  if (container) {
    container.innerHTML = "";
  }

  if (card.image_uris) {
    cardLeftInfo.innerHTML = `
    <img
    src="${cardData.cardImage1}"
    alt="card-image"
    id="card-image1"
  />
  <button class="add-card-deck" id="add-card-${cardData.cardId}"><b>Add card to deck</b></button>
  <button class="remove-card-deck" id="remove-card-${cardData.cardId}"><b>Remove card from deck</b></button>
`;
  } else if (card.card_faces) {
    cardLeftInfo.innerHTML = `
      <img
      src="${cardData.cardImage1}"
      alt="card-image"
      id="card-image1"
    />
    <img
    src="${cardData.cardImage2}"
    alt="card-image"
    id="card-image2"
  />
    <button class="transform" onclick="changeImg()"><b>Transform card</b></button>
    <button class="add-card-deck" id="add-card-${cardData.cardId}"><b>Add card to deck</b></button>
    <button class="remove-card-deck" id="remove-card-${cardData.cardId}"><b>Remove card from deck</b></button>
  `;
  }

  cardRightInfo.innerHTML = `
      <div>
      <p><b>Card Name: </b></p>
      <p class="card-info-text">${cardData.cardName}</p>
    </div>
    <div>
      <p><b>Mana Cost: </b></p>
      <p class="card-info-text">${cardData.cardManaCost}</p>
    </div>
    <div>
      <p><b>Card Type: </b></p>
      <p class="card-info-text">${cardData.cardTypeLine}</p>
    </div>
    <div>
      <p><b>Card Text: </b></p>
      <p class="card-info-text">${cardData.cardOracleText}</p>
    </div>
    <div>
      <p><b>Flavor Text: </b></p>
      <p class="card-info-text"><i>${cardData.cardFlavorText}</i></p>
    </div>
    <div>
      <p><b>Expansion: </b></p>
      <p class="card-info-text">${cardData.cardSetName}</p>
    </div>
    <div>
      <p><b>Rarity: </b></p>
      <p class="card-info-text" style="text-transform: capitalize;">${cardData.cardRarity}</p>
    </div>
    <div>
      <p><b>Artist: </b></p>
      <p class="card-info-text" style="border-bottom:none" >${cardData.cardArtist}</p>
    </div>
  `;

  container.appendChild(cardLeftInfo);
  container.appendChild(cardRightInfo);
  displayElement(container);
  addCardToDeck(card);
  removeCardFromDeck(card);
}

function addCardToDeck(card) {
  const addCardButton = document.querySelector(`#add-card-${card.id}`);

  addCardButton.addEventListener("click", () => {
    const cardId = card.id;
    const cardColor = card.colors;
    const cardName = card.name;
    const cardManaCost = card.mana_cost
      ? card.mana_cost
      : card.card_faces
      ? card.card_faces[0].mana_cost
      : "";
    const cardType = card.type_line;

    const cardIndex = deck.findIndex((cardObject) => cardObject.id === cardId);
    if (cardIndex !== -1) {
      if (
        cardType.split(" — ")[0] === "Land" ||
        cardType.split(" — ")[0] === "Basic Land"
      ) {
        deck[cardIndex].quantity++;
        alert("Card added to deck: " + card.name);
      } else if (deck[cardIndex].quantity < 4) {
        deck[cardIndex].quantity++;
        alert("Card added to deck: " + card.name);
      } else if (deck[cardIndex].quantity >= 4) {
        alert("Can only add up to four copies");
      }
    } else {
      deck.push({
        id: cardId,
        quantity: 1,
        name: cardName,
        mana_cost: cardManaCost,
        type: cardType,
        color: cardColor,
      });
      alert("Card added to deck: " + card.name);
    }
  });
}

function removeCardFromDeck(card) {
  const removeCardButton = document.querySelector(`#remove-card-${card.id}`);

  removeCardButton.addEventListener("click", () => {
    const cardIndex = deck.findIndex((cardObject) => cardObject.id === card.id);
    if (cardIndex !== -1) {
      deck[cardIndex].quantity--;
      alert("Card removed from deck");
    } else {
      alert("Card not in deck");
    }
  });
}

function showDeck(deckData) {
  hideElement(cardListTable);
  hideElement(showMoreBtn);
  hideElement(expandedInfoCard);
  hideElement(cardSetTitle);
  displayElement(deckDisplayArea);

  console.log(deckData);

  if (deckDisplayArea) {
    deckDisplayArea.innerHTML = `<div id="deck-display-left"></div>
    <div id="deck-display-right"></div>`;
  }

  if (deckData.length === 0) {
    deckDisplayArea.innerText = "Your deck is currently empty!";
    return;
  }

  const deckDisplayLeft = document.getElementById("deck-display-left");
  const deckDisplayRight = document.getElementById("deck-display-right");

  const deckTitle = document.createElement("h2");
  deckTitle.innerText = "Deck";
  deckDisplayLeft.appendChild(deckTitle);

  const initialCardsInDeck = 0;
  const quantityCardsInDeck = deckData.reduce(
    (acc, curr) => acc + curr.quantity,
    initialCardsInDeck
  );

  console.log(quantityCardsInDeck);

  const cardsInDeck = document.createElement("p");
  cardsInDeck.innerText = `Cards in deck: ${quantityCardsInDeck}`;
  deckDisplayLeft.appendChild(cardsInDeck);

  const deckTypeCounts = deck.reduce((acc, card) => {
    const cardType = card.type.split(" — ")[0];
    acc[cardType] = (acc[cardType] || 0) + 1;
    return acc;
  }, {});

  const typeQuantityContainer = document.createElement("div");
  typeQuantityContainer.classList.add("type-quantity-container");
  deckDisplayLeft.appendChild(typeQuantityContainer);

  for (const type in deckTypeCounts) {
    const typeQuantity = document.createElement("p");
    typeQuantity.classList.add("type-quantity");
    typeQuantity.innerText = `${type}: ${deckTypeCounts[type]}`;
    typeQuantityContainer.appendChild(typeQuantity);
  }

  const deckTypesCards = deck.reduce((acc, card) => {
    const cardType = card.type.split(" — ")[0];
    acc[cardType] = acc[cardType] || [];
    acc[cardType].push(card);
    return acc;
  }, {});

  for (const type in deckTypesCards) {
    if (
      deckTypesCards.hasOwnProperty(type) &&
      deckTypesCards[type].length > 0
    ) {
      const typeSection = document.createElement("section");
      typeSection.classList.add("deck-type-section");

      const typeTitle = document.createElement("h3");
      typeTitle.classList.add("deck-card-types");
      typeTitle.textContent = type;

      const cardList = document.createElement("ul");
      cardList.classList.add("deck-card-list");

      for (const card of deckTypesCards[type]) {
        const cardData = cardInfo(card);
        const cardItem = document.createElement("li");
        cardItem.classList.add("deck-card-container");

        cardItem.innerHTML = `<p class="card-deck">${card.quantity} <a class="card-name" id="${cardData.cardId}">${cardData.cardName}</a></p><div>${cardData.cardManaCost}</div>`;

        cardList.appendChild(cardItem);
      }

      typeSection.appendChild(typeTitle);
      typeSection.appendChild(cardList);

      deckDisplayRight.appendChild(typeSection);
      showCardInfo();
    }
  }
}

displayDeckButton.addEventListener("click", () => showDeck(deck));
