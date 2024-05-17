# MTG Deck Builder - Build Your Magic the Gathering Deck

#### Video Demo: [Link to video]

#### Description:

This web application allows users to build a deck for a Trading Card Game (TCG) called Magic the Gathering. It provides functionalities for browsing cards from a chosen set, viewing detailed information about each card, and constructing a deck adhering to Magic the Gathering Standard deck building rules.

**Features:**

- **Comprehensive Card Browsing**: Users can select a specific set from the menu bar at the top, triggering the application to fetch card data from the Scryfall API. The application then displays a list of cards from the chosen set, including information of each card's color, name, mana value, mana cost, type, oracle text, power, toughness and rarity. There is also an advanced search function that allows users to filter cards by various attributes. This advanced search function lets you also search by set but can add other filter options, like which colors of cards do you want to search, or the card type, power, toughness, mana value or the card rarity. In the advanced section the set selection is required, but the cards color, type, power, toughness, mana value and rarity can be optional. You can choose how many of those filters you want to use.

- **Detailed Card View**: Clicking on a card name showcases additional information about the selected card. This detailed view typically includes the card's name, type line (e.g., Creature, Sorcery), oracle text (the functional description of the card's effect), flavor text (text that appears italicized at the base of a card and provides a window into the lore of Magic’s world), the expansion set, rarity, artist (the artist who drew the card’s art) and a larger image of the card for better clarity. Some cards have a transform ability, in this detailed card view display, users can use the “Transform card” button to see the second face of the card.

- **Streamlined Deck Building**: Users can effortlessly add cards to their deck by clicking the "Add to Deck" button at the bottom of the detailed card view display. The application keeps track of the quantity of each card added to the deck, ensuring users stay within deck size limitations, no more than 4 copies of any card with the same name except for basic lands. Also, if the user wants to remove a card from their deck there is a "Remove card from deck" button in the detailed card view display. A dedicated deck view allows users to see the composition of their deck at a glance. In this dedicated deck view users can see how many cards are in the deck, the deck’s color composition, how many cards of each type are there and a list of each card with its associated mana cost. In this dedicated deck view users can also click on each card and see the dedicated card view display. The app utilizes the localStorage feature to persistently save their decks. Additionally, the ‘Reset Deck’ button provides an option to clear the current deck, allowing users to start afresh.

- **Enforced Deck Building Rules**: To prevent invalid deck construction, the application enforces Magic the Gathering Standard deck building ruleset. Standard is a rotating format, meaning only cards from the most recent sets are legal for play. This ruleset typically restricts the number of non-land cards (cards that don't generate mana) to a maximum of 4 copies per card name. When a user attempts to add a card that would violate this rule, the application displays a clear error message, preventing invalid deck configurations. This limitation doesn’t apply to land cards. You can have as many land cards as you want.

**Project Breakdown:**

This Magic the Gathering Deck Builder is comprised of several core components:

- index.html: This file forms the backbone of the user interface, utilizing HTML elements to structure the layout of the app. It incorporates elements like the card browsing section, detailed card view , deck view, and buttons for interacting with the application.
- script.js: This JavaScript file serves as the engine powering the application's functionalities. It handles:
  - Fetching card data from the Scryfall API based on user-selected sets.
  - Parsing the fetched JSON data to extract relevant card information.
  - Populating the user interface with card details and managing the display of different UI elements.
  - Implementing the deck building logic, including adding, removing, and tracking card quantities within the deck.
  - Enforcing deck building rules to ensure valid deck construction.
- style.css: This file defines the visual styling of the application. It uses CSS properties to control the appearance of elements like buttons, text, table and images, etc... crafting a visually appealing and user-friendly interface. It also makes the app responsive to different screen sizes.
