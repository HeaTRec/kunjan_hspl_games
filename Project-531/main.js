'use strict';

$(function() {
  
  const icons = {
    mushroom: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1116884/mushroom.svg',
    flower:   'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1116884/flower.svg',
    star:     'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1116884/star.svg',
    chest:    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1116884/chest.svg',
    ten:      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1116884/ten.svg',
    twenty:   'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1116884/twenty.svg'
  }
  
  const game = {
    one: [
      icons.flower, icons.twenty, icons.mushroom, icons.star, icons.chest, icons.flower,
      icons.chest,  icons.flower, icons.ten, icons.mushroom, icons.twenty, icons.star,
      icons.mushroom, icons.ten, icons.star, icons.mushroom, icons.flower, icons.star
    ],
    two: [
      icons.flower, icons.ten, icons.chest, icons.flower, icons.chest, icons.mushroom,
      icons.star, icons.mushroom, icons.twenty, icons.star, icons.mushroom, icons.ten,
      icons.star, icons.flower, icons.twenty, icons.mushroom, icons.flower, icons.star
    ],
    three: [
      icons.mushroom, icons.flower, icons.twenty, icons.mushroom, icons.ten, icons.star,
      icons.flower, icons.chest, icons.mushroom, icons.ten, icons.chest, icons.twenty,
      icons.star, icons.flower, icons.star, icons.mushroom, icons.flower, icons.star
    ],
    four: [
      icons.flower, icons.star, icons.chest, icons.flower, icons.twenty, icons.mushroom,
      icons.ten, icons.mushroom, icons.twenty, icons.chest, icons.mushroom, icons.ten,
      icons.star, icons.flower, icons.star, icons.mushroom, icons.flower, icons.star
    ],
    five: [
      icons.chest, icons.mushroom, icons.ten, icons.mushroom, icons.flower, icons.star,
      icons.mushroom, icons.ten, icons.star, icons.twenty, icons.twenty, icons.flower,
      icons.star, icons.chest, icons.flower, icons.mushroom, icons.flower, icons.star
    ],
    six: [
      icons.mushroom, icons.flower, icons.twenty, icons.flower, icons.ten, icons.star,
      icons.twenty, icons.chest, icons.mushroom, icons.ten, icons.chest, icons.flower,
      icons.star, icons.mushroom, icons.star, icons.mushroom, icons.flower, icons.star
    ],
    seven: [
      icons.flower, icons.star, icons.chest, icons.flower, icons.chest, icons.mushroom,
      icons.ten, icons.mushroom, icons.flower, icons.star, icons.mushroom, icons.ten,
      icons.star, icons.twenty, icons.twenty, icons.mushroom, icons.flower, icons.star
    ],
    eight: [
      icons.mushroom, icons.flower, icons.chest, icons.flower, icons.star, icons.star,
      icons.twenty, icons.star, icons.mushroom, icons.ten, icons.chest, icons.flower,
      icons.twenty, icons.mushroom, icons.ten, icons.mushroom, icons.flower, icons.star
    ]
  };
  
  const games = [
    game.one, game.two, game.three, game.four, 
    game.five, game.six, game.seven, game.eight
  ];
  
  var selectedCards = [];
  var matches = 0;
  
  // click function to flip the cards and determine matches
  $('.card').click(function() {
    //flips cards on click
    $(this).addClass('flip');
    
    // determines when two cards have been chosen
    if(selectedCards.length < 2) {
      selectedCards.push($(this));
      
      // Two cards have been chosen
      if(selectedCards.length === 2) {
        // Matches are determined by matching the url links to their images. It's 4am, give me a break!
        var link1 = selectedCards[0].children(".back").children('img').attr('src'),
            link2 = selectedCards[1].children(".back").children('img').attr('src');
        
        determineMatch(link1, link2);
      }
    }
  });
  
  $('.reset').click(resetGame);
  
  // selects from one of the eight games in the games array
  function setGame( games ) {
    var random = Math.floor(Math.random() * 8);
    var game = games[random];
    console.info(`playing game number ${random}.`);
    $('.back img').each(function(index) { 
      $(this).attr("src", game[index]);
    });   
  };
  
  // Return all cards back to their unflipped state
  function resetGame( ) {
    $('.game-display').children('.card').removeClass('flip');
    setTimeout(setGame.bind(this, games), 1500);
  }
  
  // Determines matches. Match if link1 === link2. If no match, the selected cards are flipped back over
  function determineMatch(link1, link2) {
    if(link1 === link2) {
      console.log('match');
      selectedCards = [];
      this.match++;
      console.log(match);
    } else {
      setTimeout(flipCards.bind(this, selectedCards), 1500);
      console.info('no match');
      selectedCards = [];
    }
  }
  
  // flip cards back over in the event of not finding a match
  function flipCards( selectedCards ) {
    selectedCards[0].removeClass('flip');
    selectedCards[1].removeClass('flip');
    console.info('flipped!');
  }

  setGame(games);
});