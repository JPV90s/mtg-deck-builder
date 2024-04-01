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
      console.log(data.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Error fetching cards. Please try again later.");
    })
    .finally(() => {
      setTimeout(() => {}, 100);
    });
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

  cardElement.innerHTML = `
    <td>${card.colors}</td>
    <td>${card.name}</td>
    <td>${card.mana_cost}</td>
    <td>${card.cmc}</td>
    <td>${card.type_line}</td>
    <td>${card.oracle_text}</td>
    <td>${card.power}</td>
    <td>${card.toughness}</td>
    <td>${card.rarity}</td>
  `;

  container.appendChild(cardElement);
}

// Get all the headers
let headers = Array.from(document.querySelectorAll("th"));
let sortAscending = Array(headers.length).fill(true); // Keep track of the sort direction for each column

// Add a click event listener to each header
headers.forEach((header, index) => {
  header.addEventListener("click", () => {
    sortTable(index, sortAscending[index]);
    sortAscending[index] = !sortAscending[index]; // Reverse the sort direction for the next click
  });
});

function sortTable(columnIndex, ascending) {
  let table = document.getElementById("table-cards");
  let rows = Array.from(table.rows).slice(1); // Get all the rows, except the header

  // Sort the rows based on the content of the specified column
  rows.sort((rowA, rowB) => {
    let a = rowA.cells[columnIndex].innerText;
    let b = rowB.cells[columnIndex].innerText;

    // If the data is numeric, convert it to a number before comparing
    if (!isNaN(a) && !isNaN(b)) {
      return ascending ? a - b : b - a;
    }

    // If the data is a string, compare it alphabetically
    return ascending ? a.localeCompare(b) : b.localeCompare(a);
  });

  // Remove all rows from the table
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  // Add the sorted rows back to the table
  rows.forEach((row) => {
    table.appendChild(row);
  });
}
