document.addEventListener('DOMContentLoaded', () => {
  ;({
    el: {
      janken: document.getElementById('js-janken'),
      enemyHand: document.getElementById('js-enemyHand'),
      myHands: document.querySelectorAll('.js-myHand'),
      btnPlay: document.getElementById('js-btnPlay'),
      result: document.getElementById('js-result'),
      resultChildren: document.getElementById('js-result').children,
      message: document.getElementById('js-message'),
    },

    data: {
      enemyHandTimer: 0,
      messageTimer: 0,
      myHandType: 0,
      enemyHandType: 0,
      messageArray: ['じゃんけん', 'あいこで', 'ぽん'],
      resultArray: ['勝ち', '負け']
    },

    init() {
      const self = this
      self.clickPlay()
      self.clickMyHand()
    },

    // プレイボタンをクリック
    clickPlay() {
      const self = this
      const el = self.el
      el.btnPlay.addEventListener('click', () => {
        self.play()
      })
    },

    // じゃんけんを出すボタンをクリック
    clickMyHand() {
      const self = this
      const el = self.el
      const data = self.data
      for (let i = 0, len = el.myHands.length; i < len; i++) {
        el.myHands[i].addEventListener('click', () => {
          if (el.janken.classList.contains('is-play')) {
            clearInterval(data.enemyHandTimer)
            el.janken.classList.remove('is-play')
            el.myHands[i].parentNode.parentNode.classList.add('is-active')
            data.enemyHandType = Math.floor(Math.random() * 3)
            data.myHandType = el.myHands[i].value
            self.showMessage(data.messageArray[2])
            self.setEnemyHandType(data.enemyHandType)
            self.judge()
          }
        })
      }
    },

    // じゃんけんを開始
    play() {
      const self = this
      const el = self.el
      const data = self.data
      if (!el.janken.classList.contains('is-play')) {
        // じゃんけんが選択済みだったら消す
        for (let i = 0, len = el.myHands.length; i < len; i++) {
          if (
            el.myHands[i].parentNode.parentNode.classList.contains('is-active')
          ) {
            el.myHands[i].parentNode.parentNode.classList.remove('is-active')
          }
        }
        // 勝敗が表示されていたら消す
        if (el.result.classList.contains('is-result')) {
          self.hideResult()
        }
        // じゃんけんの掛け声が表示されていたら消す
        if (el.message.classList.contains('is-show')) {
          self.hideMessage()
        }
        // あいこの場合は掛け声を変える
        if (el.janken.classList.contains('is-aiko')) {
          self.showMessage(data.messageArray[1])
        } else {
          self.showMessage(data.messageArray[0])
        }
        el.janken.classList.add('is-play')
        self.shuffleEnemyHand()
      }
    },

    // 相手のじゃんけんをシャッフル表示
    shuffleEnemyHand() {
      const self = this
      const data = self.data
      data.enemyHandTimer = setInterval(() => {
        const self = this
        if (data.enemyHandType === 2) {
          data.enemyHandType = 0
        } else {
          data.enemyHandType++
        }
        self.setEnemyHandType(data.enemyHandType)
      }, 100)
    },

    // 相手のじゃんけん画像を設定
    setEnemyHandType(type) {
      const self = this
      const el = self.el
      el.enemyHand.style.backgroundPosition = type * 50 + '% 0'
    },

    // 勝敗を判定
    judge() {
      const self = this
      const el = self.el
      const data = self.data
      const result = (data.myHandType - Math.abs(data.enemyHandType) + 3) % 3
      switch (result) {
        case 0:
          el.janken.classList.add('is-aiko')
          setTimeout(self.play.bind(self), 2000)
          break
        case 1:
          self.showResult(data.resultArray[1])
          break
        default:
          self.showResult(data.resultArray[0])
          el.result.classList.add('is-win')
      }
      if (result !== 0) {
        if (el.janken.classList.contains('is-aiko')) {
          el.janken.classList.remove('is-aiko')
        }
      }
    },

    // 勝敗を表示
    showResult(text) {
      const self = this
      const el = self.el
      el.result.classList.add('is-result')
      for (let i = 0, len = el.resultChildren.length; i < len; i++) {
        el.resultChildren[i].textContent = text
      }
    },

    // 勝敗を削除
    hideResult() {
      const self = this
      const el = self.el
      const data = self.data
      el.result.classList.remove('is-result', 'is-win')
      for (let i = 0, len = el.resultChildren.length; i < len; i++) {
        el.resultChildren[i].textContent = data.messageArray[0]
      }
    },

    // じゃんけんの掛け声を表示
    showMessage(text, delay = 1000) {
      const self = this
      const el = self.el
      const data = self.data
      if (el.message.classList.contains('is-show')) {
        self.hideMessage()
      }
      el.message.textContent = text
      el.message.classList.add('is-show')
      data.messageTimer = setTimeout(self.hideMessage.bind(self), delay)
    },

    // じゃんけんの掛け声を削除
    hideMessage() {
      const self = this
      const el = self.el
      const data = self.data
      el.message.classList.remove('is-show')
      clearTimeout(data.messageTimer)
    },
  }.init())
})