const setSelectElement = document.getElementById("set-select");
const exploreSetButton = document.getElementById("explore-set");

exploreSetButton.addEventListener("click", function () {
  const selectedSet = setSelectElement.value;

  if (selectedSet === "") {
    alert("Please select a set to explore!");
    return;
  }
  const scryfallUrl = `https://api.scryfall.com/cards/search?q=set:${selectedSet}`;
  fetchCards(scryfallUrl);
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
      displayCardTable();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Error fetching cards. Please try again later.");
    })
    .finally(() => {
      setTimeout(() => {}, 100);
    });
}

const manaSymbols = {
  W: "images/White_Mana.png",
  U: "images/Blue_Mana.png",
  B: "images/Black_Mana.png",
  R: "images/Red_Mana.png",
  G: "images/Green_Mana.png",
};

function displayCardTable() {
  const tableCards = document.getElementById("table-cards");
  tableCards.style.display = "table";
}

function hideCardTable() {
  const tableCards = document.getElementById("table-cards");
  tableCards.style.display = "none";
}

function displayCards(cards) {
  const cardDisplayArea = document.getElementById("card-display-table");
  const cardSetTitle = document.getElementById("set-name");
  if (cardDisplayArea) {
    cardDisplayArea.innerHTML = "";
    cardSetTitle.innerText = "";
  }
  cardSetTitle.innerText = `${cards[0].set_name}`;
  cards.forEach((card) => createCardElement(card, cardDisplayArea));
}

function createCardElement(card, container) {
  const cardElement = document.createElement("tr");
  cardElement.classList.add("card");

  let manaCost = "";
  if (card.mana_cost) {
    manaCost = card.mana_cost;
  } else if (card.card_faces && card.card_faces[0].mana_cost) {
    manaCost = card.card_faces[0].mana_cost;
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
  }

  cardElement.innerHTML = `
    <td>${
      card.colors
        ? card.colors
        : card.card_faces[0].colors + " // " + card.card_faces[1].colors
    }</td>
    <td id="name"><a id="card-name" onclick=displayInfoCard(${card.id})>${
    card.name
  }</a></td>
    <td>${card.cmc}</td>
    <td>${manaCost}</td>
    <td>${card.type_line}</td>
    <td>${
      card.oracle_text
        ? card.oracle_text
        : card.card_faces[0].oracle_text +
          " // " +
          card.card_faces[1].oracle_text
    }</td>
    <td>${power}</td>
    <td>${toughness}</td>
    <td>${card.rarity}</td>
  `;
  container.appendChild(cardElement);
}

function displayInfoCard(id) {
  hideCardTable();
  console.log(card.id);
}
