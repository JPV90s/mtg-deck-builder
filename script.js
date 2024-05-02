const setSelectElement = document.getElementById("set-select");
const exploreSetBtn = document.getElementById("explore-set");
const displayDeckBtn = document.getElementById("display-deck-btn");
const filterTableBtn = document.getElementById("filter-btn");
const cancelFilterBtn = document.getElementById("cancel-btn");
const filterTableDialog = document.getElementById("filter");
const loaderImage = document.getElementById("loader-image");
const tableContainer = document.getElementById("table-container");
const cardListTable = document.getElementById("card-list-table");
const expandedInfoCard = document.querySelector(".expanded-info-card");
const deckDisplayArea = document.getElementById("deck-display-area");
const cardName = document.querySelectorAll(".card-name");
const cardSetTitle = document.getElementById("set-name");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

let deck = [];

const manaSymbolImages = {
  "{W}": "images/manaColors/manaWhite.png",
  "{U}": "images/manaColors/manaBlue.png",
  "{B}": "images/manaColors/manaBlack.png",
  "{R}": "images/manaColors/manaRed.png",
  "{G}": "images/manaColors/manaGreen.png",
  "{C}": "images/manaColors/manaColorless.png",
  "{W/U}": "images/manaColors/manaWhiteBlue.png",
  "{W/B}": "images/manaColors/manaWhiteBlack.png",
  "{U/B}": "images/manaColors/manaBlueBlack.png",
  "{U/R}": "images/manaColors/manaBlueRed.png",
  "{B/R}": "images/manaColors/manaBlackRed.png",
  "{B/G}": "images/manaColors/manaBlackGreen.png",
  "{R/W}": "images/manaColors/manaRedWhite.png",
  "{R/G}": "images/manaColors/manaRedGreen.png",
  "{G/W}": "images/manaColors/manaGreenWhite.png",
  "{G/U}": "images/manaColors/manaGreenBlue.png",
  "{W/P}": "images/manaColors/manaWhitePhyrexian.png",
  "{U/P}": "images/manaColors/manaBluePhyrexian.png",
  "{B/P}": "images/manaColors/manaBlackPhyrexian.png",
  "{R/P}": "images/manaColors/manaRedPhyrexian.png",
  "{G/P}": "images/manaColors/manaGreenPhyrexian.png",
  "{R/G/P}": "images/manaColors/manaRedPhyrexianGreenPhyrexian.png",
  "{R/W/P}": "images/manaColors/manaRedPhyrexianWhitePhyrexian.png",
  "{G/U/P}": "images/manaColors/manaGreenPhyrexianBluePhyrexian.png",
  "{G/W/P}": "images/manaColors/manaGreenPhyrexianWhitePhyrexian.png",
  "{X}": "images/manaNumbers/manaX.png",
  "{0}": "images/manaNumbers/mana0.png",
  "{1}": "images/manaNumbers/mana1.png",
  "{2}": "images/manaNumbers/mana2.png",
  "{3}": "images/manaNumbers/mana3.png",
  "{4}": "images/manaNumbers/mana4.png",
  "{5}": "images/manaNumbers/mana5.png",
  "{6}": "images/manaNumbers/mana6.png",
  "{7}": "images/manaNumbers/mana7.png",
  "{8}": "images/manaNumbers/mana8.png",
  "{9}": "images/manaNumbers/mana9.png",
  "{10}": "images/manaNumbers/mana10.png",
  "{13}": "images/manaNumbers/mana13.png",
  "{T}": "images/others/tap.png",
  "A-": "images/others/Alchemy.png",
};

const setImages = document.querySelectorAll(".set-image");

setImages.forEach((image) => {
  image.addEventListener("click", function (event) {
    const clickedSetId = event.target.dataset.setId;
    const scryfallUrl = `https://api.scryfall.com/cards/search?q=set:${clickedSetId}`;

    displayElement(loaderImage);
    hideElement(deckDisplayArea);
    hideElement(cardListTable);
    hideElement(cardSetTitle);
    hideElement(expandedInfoCard);

    fetchCards(scryfallUrl)
      .then((page1Data) => {
        if (page1Data.has_more) {
          const nextPageUrl = `https://api.scryfall.com/cards/search?q=set:${clickedSetId}&page=2`;
          return fetchCards(nextPageUrl).then((page2Data) => {
            return page1Data.data.concat(page2Data.data);
          });
        } else {
          return page1Data.data;
        }
      })
      .then((allCards) => {
        const allCardsFromSet = allCards;
        displayCards(allCardsFromSet);
        displayElement(cardListTable);
        hideElement(loaderImage);
        displayElement(cardSetTitle);
        displayElement(nextBtn);
      })
      .catch((error) => {
        console.error("Error in fetching cards:", error);
      });
  });
});

filterTableBtn.addEventListener("click", () => filterTableDialog.showModal());
cancelFilterBtn.addEventListener("click", () => filterTableDialog.close());

function fetchCards(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.getElementById("loader-image").style.display = "none";
      alert("Error fetching cards. Please try again later.");
      return Promise.reject(error);
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

function displayCards(cardsFromSet) {
  const cardDisplayArea = document.getElementById("card-display-table");
  if (cardDisplayArea) {
    cardDisplayArea.innerHTML = "";
    cardSetTitle.innerText = "";
  }
  cardSetTitle.innerText = `${cardsFromSet[0].set_name}`;
  cardsFromSet.forEach((card) => {
    createCardElement(card, cardDisplayArea);
  });

  showCardInfo();
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
  hideElement(nextBtn);
  hideElement(prevBtn);
  hideElement(deckDisplayArea);

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
      if (deck[cardIndex].quantity === 1) {
        deck.splice(cardIndex, 1);
        alert("Card removed from deck");
      } else {
        deck[cardIndex].quantity--;
        alert("Card removed from deck");
      }
    } else {
      alert("Card not in deck");
    }
  });
}

function showDeck(deckData) {
  hideElement(cardListTable);
  hideElement(nextBtn);
  hideElement(prevBtn);
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

displayDeckBtn.addEventListener("click", () => showDeck(deck));

document
  .getElementById("filterForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedSet = setSelectElement.value;
    const scryfallUrl = `https://api.scryfall.com/cards/search?q=set:${selectedSet}`;

    let selectedColors = [];

    const checkboxColor = document.querySelectorAll(
      '#colors input[type="checkbox"]'
    );

    let anySelectedColor = false;
    for (const checkbox of checkboxColor) {
      if (checkbox.checked) {
        anySelectedColor = true;
        selectedColors.push(checkbox.value);
      }
    }

    if (!anySelectedColor) {
      selectedColors = ["W", "U", "B", "R", "G", ""];
    }

    const manaValue = document.getElementById("mana-value-number").value;

    const cardType = document.getElementById("card-type-select").value;

    const powerValue = document.getElementById("power-value-number").value;
    const toughnessValue = document.getElementById(
      "toughness-value-number"
    ).value;

    let selectedRarities = [];

    const checkboxRarity = document.querySelectorAll(
      '#rarity input[type="checkbox"]'
    );

    let anySelectedRarities = false;
    for (const checkbox of checkboxRarity) {
      if (checkbox.checked) {
        anySelectedRarities = true;
        selectedRarities.push(checkbox.value);
      }
    }

    if (!anySelectedRarities) {
      selectedRarities = ["mythic", "rare", "uncommon", "common"];
    }

    const dialog = document.getElementById("filter");
    dialog.close();

    const filterForm = document.getElementById("filterForm");
    filterForm.reset();

    fetchCards(scryfallUrl)
      .then((page1Data) => {
        if (page1Data.has_more) {
          const nextPageUrl = `https://api.scryfall.com/cards/search?q=set:${selectedSet}&page=2`;
          return fetchCards(nextPageUrl).then((page2Data) => {
            return page1Data.data.concat(page2Data.data);
          });
        } else {
          return page1Data.data;
        }
      })
      .then((allCards) => {
        const allCardsFromSet = allCards;
        const filteredCards = filterCards(
          allCardsFromSet,
          selectedColors,
          manaValue,
          cardType,
          powerValue,
          toughnessValue,
          selectedRarities
        );
        displayCards(filteredCards);
        displayElement(cardListTable);
        hideElement(loaderImage);
        displayElement(cardSetTitle);
        displayElement(nextBtn);
        hideElement(deckDisplayArea);
      })
      .catch((error) => {
        console.error("Error in fetching cards:", error);
      });
  });

function filterCards(
  cards,
  selectedColors,
  manaValue,
  cardType,
  powerValue,
  toughnessValue,
  selectedRarities
) {
  const filteredCards = cards.filter((card) => {
    const colorMatches = selectedColors.some(
      (color) =>
        card.colors.includes(color) ||
        (color === "" && card.colors.length === 0)
    );

    const manaValueMatches =
      !manaValue || parseInt(card.cmc) === parseInt(manaValue);

    const typeMatches = !cardType || cardType === card.type_line;

    const powerMatches =
      !powerValue || parseInt(card.power) === parseInt(powerValue);

    const toughnessMatches =
      !toughnessValue || parseInt(card.toughness) === parseInt(toughnessValue);

    const rarityMatches = selectedRarities.some(
      (rarity) => card.rarity === rarity
    );

    return (
      colorMatches &&
      manaValueMatches &&
      typeMatches &&
      powerMatches &&
      toughnessMatches &&
      rarityMatches
    );
  });

  return filteredCards;
}

let headers = Array.from(document.querySelectorAll("th"));
let sortAscending = Array(headers.length).fill(true);

headers.forEach((header, index) => {
  header.addEventListener("click", () => {
    sortTable(index, sortAscending[index]);
    sortAscending[index] = !sortAscending[index];
  });
});

function sortTable(columnIndex, ascending) {
  let table = document.getElementById("card-list-table");
  let rows = Array.from(table.rows).slice(1);

  rows.sort((rowA, rowB) => {
    let a = rowA.cells[columnIndex].innerText;
    let b = rowB.cells[columnIndex].innerText;

    if (!isNaN(a) && !isNaN(b)) {
      return ascending ? a - b : b - a;
    }

    return ascending ? a.localeCompare(b) : b.localeCompare(a);
  });

  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  rows.forEach((row) => {
    table.appendChild(row);
  });
}
