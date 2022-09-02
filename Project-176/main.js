function getRandomIntAsString(max) {
    return "" + Math.ceil(Math.random() * Math.ceil(max)) // rounds up
  }
  
  function repeatWait(n, seconds, fn, finalFn) {
    if (n <= 0) return finalFn()
    fn()
    setTimeout(repeatWait, seconds*1000, n-1, seconds, fn, finalFn)
  }
  
  const game = {
    startButton: null,
    prompts: [], // cells to click
    selections: [], // previously clicked cells
    playersTurn: false,
    gameOver: false,
    currentPrompt: 0,
    getCellSelector(number) {
      query = `.cell[data-number='${number}']`
      cellSelector = document.querySelector(query)
      return cellSelector
    },
    displayCurrentPrompt() {
      cell = this.getCellSelector(this.prompts[this.currentPrompt])
      cell.classList.add('prompted');
      setTimeout(() => {
        cell.classList.remove('prompted');
      }, 800) // 0.8 seconds
    },
    givePrompts() {
      this.playersTurn = false
      this.currentPrompt = 0
      repeatWait(this.prompts.length, 1, () => {
        this.displayCurrentPrompt()
        this.currentPrompt += 1
      }, () => {
        this.playersTurn = true
      })
    },
    correct() {
      console.log('correct')
      if (game.selections.length >= game.prompts.length ) {
        setTimeout(() => {
          this.nextTurn()
        }, 1000) // 1 second
      }
    },
    incorrect() {
      console.log('incorrect')
      this.startButton.classList.remove('displayNone')
      game.stop()
    },
    start() {
      this.startButton.classList.add('displayNone')
      this.selections = []
      this.prompts = [getRandomIntAsString(4)]
      this.givePrompts()
    },
    stop() {
      this.playersTurn = false;
    },
    nextTurn() {
      this.selections = []
      this.prompts.push(getRandomIntAsString(4))
      this.givePrompts()
    }
  
  }
  
  // Event Handlers
  
  var mousedownTarget = null;
  
  function handleCellMousedown(event) {
    if (game.playersTurn == false) return
    mousedownTarget = event.target
    mousedownTarget.classList.add('prompted')
  }
  
  function handleCellMouseup(event) {
    if (game.playersTurn == false) return
    mousedownTarget.classList.remove('prompted')
  }
  
  function handleCellClick(event) {
    if (game.playersTurn == false) return
    const cell = event.target
    game.selections.push(cell.dataset.number)
    if ( game.selections.join('') 
          == game.prompts.slice(0, game.selections.length).join('') ) {
      game.correct()
    } else {
      game.incorrect()
      const startButton = document.querySelector('button.start')
      startButton.textContent = "Retry"
    }
  }
  
  const cells = document.querySelectorAll('.cell')
  for (cell of cells) {
    cell.addEventListener('mousedown', handleCellMousedown)
    cell.addEventListener('mouseup', handleCellMouseup)
    cell.addEventListener('click', handleCellClick)
  }
  const startButton = document.querySelector('button.start')
  startButton.addEventListener('click', (event) => {
    game.startButton = event.target
    game.start()
  })
  
  