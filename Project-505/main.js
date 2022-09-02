let state = {
    chosenCards: [],
    score: 0
  }
  function scoreBoardValue(val) {
    let scoreBoard = document.getElementById('score-field')
    scoreBoard.innerHTML = val ? val : state.score
  }
  function createGame() {
    state.score = 0
    scoreBoardValue()
    let cardsContainer = document.getElementById('container')
    let cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]
    cardsContainer.innerHTML = ''
    cardValues = cardValues.sort(() => Math.random() - 0.5)
    
    for (let i=0; i <= 15; i++) {
        let singleCard = document.createElement('button')
        singleCard.classList.add('box')
        singleCard.innerHTML = cardValues[i]
        singleCard.setAttribute('id', `box-${i+1}`)
        singleCard.setAttribute('value', cardValues[i])
        singleCard.addEventListener("click", () => {
          checkCard(i+1)
        })
        cardsContainer.appendChild(singleCard)
    }
  }
  function checkCard(cardId) {
    let card = document.getElementById(`box-${cardId}`).getAttribute('value')
    state.chosenCards.push({cardValue: card, id: `box-${cardId}`})
    document.getElementById(`box-${cardId}`).style.backgroundColor = '#eee'
    if (state.chosenCards.length == 2) {
      if (state.chosenCards[0].cardValue == state.chosenCards[1].cardValue) {
        document.getElementById(state.chosenCards[0].id).style.backgroundColor = '#eee'
        document.getElementById(state.chosenCards[1].id).style.backgroundColor = '#eee'
        document.getElementById(state.chosenCards[0].id).disabled = true
        document.getElementById(state.chosenCards[1].id).disabled = true
        state.chosenCards = []
        state.score += 10
      } else {
        setTimeout(()=>{
          document.getElementById(state.chosenCards[0].id).style.backgroundColor = 'black'
          document.getElementById(state.chosenCards[1].id).style.backgroundColor = 'black'
          state.chosenCards = []
        }, 500)
        state.score -= 10
      }
      scoreBoardValue(state.score)
    }
  }
  createGame()