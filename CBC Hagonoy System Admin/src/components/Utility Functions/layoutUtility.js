export function groupCards(cards, groupSize = 3) {
    const groupedCards = [];
    for (let i = 0; i < cards.length; i += groupSize) {
      groupedCards.push(cards.slice(i, i + groupSize));
    }
    return groupedCards;
  }
  