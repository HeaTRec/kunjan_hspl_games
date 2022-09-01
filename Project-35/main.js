"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MemoryGame extends React.Component {
  constructor() {
    super();

    _defineProperty(this, "testSelectedCards", () => {
      let cardsMatch = false;

      if (this.state.selectedCards[0].color === this.state.selectedCards[1].color && this.state.selectedCards[0].index !== this.state.selectedCards[1].index) {
        cardsMatch = true;
      }

      if (cardsMatch) {
        this.setState(prevState => {
          prevState.matchedCards.push(prevState.selectedCards[0].color);
          prevState.selectedCards = [];
          prevState.canPickCard = true;

          if (prevState.matchedCards.length >= prevState.playingCards.length / 2) {
            if (prevState.bestGame === null) {
              prevState.bestGame = prevState.clicks;
              prevState.newHighScore = true;
            } else if (prevState.bestGame > prevState.clicks) {
              prevState.newHighScore = true;
              prevState.bestGame = prevState.clicks;
            }

            window.scrollTo(0, 0);
            prevState.hasWonGame = true;
          }

          return prevState;
        });
      } else {
        this.setState(prevState => {
          prevState.selectedCards = [];
          prevState.canPickCard = true;
          return prevState;
        });
      }
    });

    _defineProperty(this, "changeNumberOfCards", newNumberofCards => {
      if (newNumberofCards !== this.state.numberOfCards) {
        this.setState(function (prevState) {
          prevState.numberOfCards = newNumberofCards;
          prevState.bestGame = null;
          return prevState;
        }, this.startGame);
      }
    });

    this.onCardClick = this.onCardClick.bind(this);
    this.startGame = this.startGame.bind(this);
    this.goToStartScreen = this.goToStartScreen.bind(this);
    this.state = {
      allCards: ['#DE3C4B', '#87F5FB', '#C09BD8', '#EBC3DB', '#F6FEAA', '#C7DFC5', '#EE964B', '#718F94', '#545775', '#72B01D', '#283845', '#ABA361', '#F84AA7', '#B0CA87', '#27FB6B', '#51291E'],
      startingCards: [],
      numberOfCards: 12,
      playingCards: [],
      selectedCards: [],
      matchedCards: [],
      playing: false,
      canPickCard: false,
      clicks: 0,
      bestGame: null,
      perfectGame: null,
      hasWonGame: false,
      newHighScore: false
    };
  }

  startGame() {
    this.setState(function (prevState) {
      function Shuffle(o) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i, 10), x = o[--i], o[i] = o[j], o[j] = x);

        return o;
      }

      ;
      prevState.startingCards = [...prevState.allCards, ...prevState.allCards].slice(0, prevState.numberOfCards);
      prevState.numberOfCards = prevState.startingCards.length;
      prevState.playing = true;
      prevState.canPickCard = true;
      prevState.numberOfCards = prevState.startingCards.length;
      prevState.playingCards = [...prevState.startingCards, ...prevState.startingCards];
      prevState.matchedCards = [];
      prevState.clicks = 0;
      prevState.perfectGame = prevState.playingCards.length;
      prevState.hasWonGame = false;
      prevState.newHighScore = false;
      Shuffle(prevState.playingCards);
      return prevState;
    });
  }

  goToStartScreen() {
    this.setState(function (prevState) {
      prevState.playing = false;
      prevState.canPickCard = false;
      return prevState;
    });
  }

  onCardClick(color, index) {
    let cardHasAlreadyBeenMatched = this.state.matchedCards.includes(color);

    if (!cardHasAlreadyBeenMatched && this.state.canPickCard) {
      this.setState(function (prevState) {
        const selectedCard = {
          color: color,
          index: index
        };
        prevState.selectedCards.push(selectedCard);

        if (prevState.selectedCards.length === 2) {
          prevState.canPickCard = false;
        }

        prevState.clicks++;
        return prevState;
      }, () => {
        if (this.state.selectedCards.length === 2) {
          setTimeout(this.testSelectedCards, 1000);
        }
      });
    }
  }

  render() {
    if (!this.state.playing) {
      return /*#__PURE__*/React.createElement(StartScreen, {
        startGame: this.startGame
      });
    } else {
      return /*#__PURE__*/React.createElement(GameBoard, {
        playingCards: this.state.playingCards,
        selectedCards: this.state.selectedCards,
        matchedCards: this.state.matchedCards,
        goToStartScreen: this.goToStartScreen,
        handleCardClick: this.onCardClick,
        restartGame: this.startGame,
        clicks: this.state.clicks,
        bestGame: this.state.bestGame,
        perfectGame: this.state.perfectGame,
        handleNumberOfCardsChange: this.changeNumberOfCards,
        numberOfCards: this.state.numberOfCards,
        maxCards: this.state.allCards.length,
        hasWonGame: this.state.hasWonGame,
        newHighScore: this.state.newHighScore
      });
    }
  }

}

function StartScreen(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "start-screen"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "start-screen__heading"
  }, "Color Memory"), /*#__PURE__*/React.createElement(Button, {
    handleClick: props.startGame,
    text: "Start Game",
    classNames: ['button', 'tempt-user']
  }));
}

function GameBoard(props) {
  let {
    playingCards,
    selectedCards,
    matchedCards,
    handleCardClick,
    bestGame,
    perfectGame,
    restartGame,
    handleNumberOfCardsChange,
    numberOfCards,
    maxCards,
    hasWonGame,
    newHighScore
  } = props;
  let bestGameText = null;

  if (bestGame !== null) {
    bestGameText = `Best Game: ${bestGame}`;
  }

  let hasWonGameText = hasWonGame ? /*#__PURE__*/React.createElement("h2", {
    className: "center-text won-game-text"
  }, "You Won!") : null;
  let newHighScoreText = newHighScore ? /*#__PURE__*/React.createElement("h2", {
    className: "center-text new-high-score-text"
  }, "New High Score!") : null;
  let cards = playingCards.map((color, index) => {
    let flipped = false;

    if (matchedCards.includes(color)) {
      flipped = true;
    }

    selectedCards.forEach(item => {
      if (item.index === index) {
        flipped = true;
      }
    });
    return /*#__PURE__*/React.createElement(Card, {
      flipped: flipped,
      clickHandler: handleCardClick,
      color: color,
      key: color + index,
      index: index
    });
  });

  function changeCardNumber(e) {
    handleNumberOfCardsChange(e.target.value);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "game-board"
  }, /*#__PURE__*/React.createElement("h1", null, "Color Memory"), hasWonGameText, newHighScoreText, /*#__PURE__*/React.createElement("div", {
    className: "header-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header-info__scores"
  }, /*#__PURE__*/React.createElement("h2", null, "Clicks: ", props.clicks), /*#__PURE__*/React.createElement("h2", null, bestGameText)), /*#__PURE__*/React.createElement("div", {
    className: "header-info__options"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header-info__text"
  }, "Number of Cards:", /*#__PURE__*/React.createElement("span", {
    className: "select-container"
  }, /*#__PURE__*/React.createElement("select", {
    onChange: changeCardNumber,
    value: numberOfCards
  }, /*#__PURE__*/React.createElement("option", {
    value: maxCards
  }, maxCards * 2), /*#__PURE__*/React.createElement("option", {
    value: maxCards / 4 * 3
  }, maxCards / 4 * 3 * 2), /*#__PURE__*/React.createElement("option", {
    value: maxCards / 2
  }, maxCards / 2 * 2), /*#__PURE__*/React.createElement("option", {
    value: maxCards / 4
  }, maxCards / 4 * 2)))), /*#__PURE__*/React.createElement(Button, {
    handleClick: restartGame,
    text: "Restart Game",
    classNames: "button"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "game-card-container"
  }, cards), /*#__PURE__*/React.createElement("h3", {
    className: "center-text"
  }, "Perfect Game: ", perfectGame));
}

function Card(props) {
  let shownColor = props.flipped ? props.color : 'white';
  let animated = props.flipped ? null : 'tempt-user--reverse';
  let cardColor = props.color;
  let index = props.index;
  const cardStyle = {
    background: shownColor,
    animationDelay: Math.random() * -1 + 's'
  };

  function testCard() {
    props.clickHandler(cardColor, index);
  }

  return /*#__PURE__*/React.createElement("div", {
    style: cardStyle,
    onClick: testCard,
    className: 'game-card ' + animated
  });
}

function Button(props) {
  let {
    classNames,
    handleClick,
    text
  } = props;

  if (Array.isArray(classNames)) {
    classNames = classNames.join(' ');
  }

  return /*#__PURE__*/React.createElement("button", {
    className: classNames,
    onClick: handleClick
  }, text);
}

ReactDOM.render( /*#__PURE__*/React.createElement(MemoryGame, null), document.getElementById('root'));