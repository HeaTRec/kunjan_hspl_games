gsap.registerPlugin(CustomEase, CustomBounce);

CustomBounce.create("myBounce", {
  strength: 0.6,
  squash: 3,
  squashID: "myBounce-squash"
});

gsap.fromTo(".ball", {y: -250}, {
  duration: 2,
  scaleX: 1.4,
  scaleY: 0.5,
  ease: "myBounce-squash",
  transformOrigin: "center bottom"
});

/* [imprvs upcoming ◠‿◠] */
gsap.to(".ball", {
  keyframes: [
    {
      y: 200,
      scaleX: 1,
      scaleY: 1,
      duration: .2
    },
    {
      y: 200,
      scaleX: 1.2,
      scaleY: .8,
      duration: .2,
      transformOrigin: "center bottom"
    },
    {
      y: 200,
      scaleX: .8,
      scaleY: 1.2,
      duration: .2,
      transformOrigin: "center bottom"
    },
    { 
      y: -250,
      scaleY: 1,
      scaleX: 1,
      duration: .2
    },
  ],
  ease: "power2.inOut",
  repeat: -1
});

document.addEventListener("mousemove", getMouse)

function getMouse(e){
  mouse.x = e.pageX
}

/* may vary [WIP] */
var mouse = { x: window.innerWidth/2, y: 0 };
var paddlePos = { x: window.innerWidth/2, y: 0 };

var paddle = document.getElementById("paddleBox");

function followMouse(){
  var disX = mouse.x - paddlePos.x;
  paddlePos.x += disX/3;
  paddle.style.left = paddlePos.x-100 + "px";
  ballFall()
}
setInterval(followMouse, 50);

var score = 0;
var count = 0;

function ballFall(){
  var ball = document.getElementById("ballBox");
  var range = window.innerWidth/2;
  if(mouse.x>range-100 && mouse.x<range+100){
   ball.style.minHeight = "350" + "px"
   count+=0.5
   if(count%8===0){
   score++
   }
   document.querySelector(".score").innerText = score
  } else {
  ball.style.minHeight = "250" + "px";
  }
}

/* Beginner's disclaimer (ツ): whole code is (aaalways) improvable, of course! */