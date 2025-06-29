import { useState, useEffect } from "react";
import cardData from "./data.json";
import type { CategoryType } from "./types";
import "./index.css";

function App() {
  const [category, setCategory] = useState<CategoryType>("conversation");
  const [usedCards, setUsedCards] = useState<Set<number>>(new Set());
  const [currentCard, setCurrentCard] = useState<string>("");

  const getRandomCard = (): string => {
    const categoryCards = cardData[category];

    let availableCards = usedCards;
    if (usedCards.size >= categoryCards.length) {
      availableCards = new Set();
      setUsedCards(new Set());
    }

    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * categoryCards.length);
    } while (availableCards.has(randomIndex));

    setUsedCards((prev) => new Set([...prev, randomIndex]));
    return categoryCards[randomIndex];
  };

  const switchCategory = (category: CategoryType) => {
    setCategory(category);
    setUsedCards(new Set());
  };

  const drawCard = () => {
    const card = getRandomCard();
    setCurrentCard(card);
  };

  useEffect(() => {
    setCurrentCard(getRandomCard());
  }, [category]);

  return (
    <div id="curiosity-cards">
      <div className="category-container">
        <button
          className={`category-btn ${
            category === "conversation" ? "active" : ""
          }`}
          onClick={() => switchCategory("conversation")}
        >
          {category === "conversation"
            ? "< CONVERSATION >"
            : "( CONVERSATION )"}
        </button>
        <button
          className={`category-btn ${
            category === "connection" ? "active" : ""
          }`}
          onClick={() => switchCategory("connection")}
        >
          {category === "connection" ? "< CONNECTION >" : "( CONNECTION )"}
        </button>
        <button
          className={`category-btn ${category === "creation" ? "active" : ""}`}
          onClick={() => switchCategory("creation")}
        >
          {category === "creation" ? "< CREATION >" : "( CREATION )"}
        </button>
      </div>
      <div id="card">{currentCard}</div>
      <button onClick={() => drawCard()}>( NEW CARD )</button>
    </div>
  );
}

export default App;
