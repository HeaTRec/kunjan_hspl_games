const bg = document.querySelector('#balloon_game')
const dart = document.querySelector('#dart')
const explode = document.querySelector('#explode_balloon')
const score_box = document.querySelector('#score')
var size = 50
var score = 0
var particles = 25
var balloon_count = 0

for(var i=0;i<particles;i++) {
  var p = document.createElement('div')
  p.className = 'particle'
  explode.appendChild(p)
}
var ps = document.querySelectorAll('.particle')

function blowItUp(e) {
  var color = e.style.background
  ps.forEach(function(elm) {
    elm.style.transition = '.275s'
    elm.style.background = color
    var x = Math.random() < .5 ? -1 : 1;
    var y = Math.random() < .5 ? -1 : 1;
    elm.style.transform = 'translate('+Math.random()*100*x+'px,'+Math.random()*100*y+'px)'
    elm.style.opacity = '0'

    setTimeout(function(){
      elm.style.transition = ''
      elm.style.transform = ''
      elm.style.background = ''
      elm.style.opacity = ''
    }, 300)
  })

  e.remove()
  score++
  score_box.innerHTML = Math.round(score/balloon_count*100) + '%'
}

var b_locations = [0]
function addBalloon() {  
  var b = document.createElement('div')
  b.className = 'balloon'
  b.style.background = 'hsla('+Math.random()*360+'deg,75%,50%,.75)'
  b.style.width = size + 'px'
  b.style.height = size*1.5 + 'px'
  b.style.position = 'absolute'
  var new_loc = Math.ceil(Math.random()*19) * 5
  if(new_loc != b_locations[b_locations.length - 1]) {
    b_locations.push(new_loc)
  } else {
    var new_loc = Math.ceil(Math.random()*19) * 5
    b_locations.push(new_loc)
  }
  b.style.left = b_locations[b_locations.length - 1] + '%'
  b.style.top = '100%'
  var small = Math.random() < .5 ? true : false
  if(small) {
    b.style.transform = 'scale(.75)'
    b.style.animationDuration = '10s'
    b.style.filter = 'blur(1px)'
  } else {
    b.style.transform = 'scale(1.5)'
    b.style.animationDuration = '6s'
  }  

  b.setAttribute('onclick', 'blowItUp(this)')
  bg.appendChild(b)
  document.querySelectorAll('.balloon')[document.querySelectorAll('.balloon').length - 1].classList.add('float')

  balloon_count++
  score_box.innerHTML = Math.round(score/balloon_count*100) + '%'
  // console.log(balloon_count)
}
document.addEventListener('click', () => {
  var let_them_float = setInterval(function(){
    addBalloon()
    if(score > 5) {
      addBalloon()
    }
    if(score >= 10) {
      addBalloon()    
    }
  }, 500)
  setTimeout(() => { 
    clearInterval(let_them_float)
  }, 10000);
}, {once : true});

// clearInterval(let_them_float)
var bg_loc = bg.getBoundingClientRect()
window.addEventListener('click', function(e){
  dart.classList.toggle('throw')
  setTimeout(function(){
    dart.classList.toggle('throw')
  }, 250)   
  var x = e.clientX - bg_loc.left - 25
  var y = e.clientY - bg_loc.top - 25
  dart.style.left = x + 'px'
  dart.style.top = y + 'px'
  explode.style.left = x + 'px'
  explode.style.top = y + 'px'
})