
const assets = ["woohoo.mp3", "mantis.jpg", "mantis2.jpg", { font: "Reuben", src: "Reuben.otf" }];
const path = "https://assets.codepen.io/2104200/";

const frame = new Frame("fit", 1024, 768, darker, darker, assets, path);
frame.on("ready", () => {// ES6 Arrow Function - similar to function(){}
  zog("ready from ZIM Frame"); // logs in console (F12 - choose console)

  // often need below - so consider it part of the template
  const stage = frame.stage;
  const stageW = frame.width;
  const stageH = frame.height;

  // REFERENCES for ZIM at https://zimjs.com
  // see https://zimjs.com/intro.html for an intro example
  // see https://zimjs.com/learn.html for video and code tutorials
  // see https://zimjs.com/docs.html for documentation
  // see https://codepen.io/topic/zim/ for ZIM on CodePen

  // *** NOTE: ZIM Cat defaults to time in seconds
  // All previous versions, examples, videos, etc. have time in milliseconds
  // This can be set back with TIME = "milliseconds" but we suggest you give it a try!
  // There will be a warning in the conslole if your animation is not moving ;-)

  // CODE HERE

  // This example is an excerpt from https://zimjs.com/elearning/quiz.html

  // Here we show two pictures with differences
  // In a Container, we created a circle for each difference in a loop with a .place()
  // We then placed the circles at the different places
  // and recorded the locations from the console - that is what place() does
  // We then decided the size of the circles and set the data
  // We then made the loop read from the data
  // We cloned the container for the second picture and moved it over the distance
  // We set it up so clicking an circle brings up its matching circle
  // There is some trickery with containers to get it to work - see the code

  // We have used an Indicator as it clearly shows how many to find
  // ZIM works fine with text and a Label could be used
  // or import game.js for Scorer() and Timer()

  const page = new Page(stageW, stageH, pink.lighten(.2), red.lighten(.1)).addTo();
  page.backing.noMouse();

  STYLE = {
    font: "reuben",
    size: 55,
    variant: true,
    color: darker,
    align: CENTER };


  new Label("Spot the Difference").pos(0, 90, CENTER);

  const pic1 = asset("mantis.jpg").sca(1.3).center(page).mov(-220, 100).ble("multiply").noMouse();
  const pic2 = asset("mantis2.jpg").clone().sca(1.3).center(page).mov(220, 100).ble("multiply").noMouse();

  const indicator = page.indicator = new Indicator({
    indicatorType: "square",
    num: 5,
    fill: true,
    foregroundColor: green,
    backgroundColor: purple,
    selectedIndex: -1 }).
  sca(1.5).centerReg(page).mov(0, -120);

  // we will make circles that can be pressed to reveal the spots
  // on the canvas, invisible things will not reveive a mouse interaction
  // so a Circle with a color of clear - or "rgba(0,0,0,0)" cannot be clicked
  // We can use expand() which uses the CreateJS hitArea - but that is a full bounding rectangle
  // We could use a hitTestPoint() or getObjectUnderPoint()
  // but placing the circles behind the backing also works
  // if we make the pictures and backing not receive the mouse...
  // but then we can't swipe - so we have added a swiper Rectangle under everything
  // sounds like a lot - but it takes less than a minute
  // When we press on a circle we will use the addTo() to add to containers on top
  // this has the handy feature that it will keep the visible location across containers

  const circles = new Container(stageW, stageH).addTo(page).bot();
  const circlesTop = new Container(stageW, stageH).addTo(page);
  const spots = [
  { x: 433, y: 509, r: 40, n: "butt" }, // name not used but just to help keep track
  { x: 427, y: 574, r: 20, n: "foot" },
  { x: 300, y: 514, r: 30, n: "middle" },
  { x: 196, y: 504, r: 30, n: "arm" },
  { x: 172, y: 429, r: 26, n: "eyes" }];
  loop(5, i => {
    new Circle(spots[i].r, "rgba(255,255,255,.2)", white, 2).loc(spots[i], null, circles); // .place();
  });
  const circles2 = circles.clone().addTo(page).bot().mov(pic2.x - pic1.x);
  const circles2Top = new Container(stageW, stageH).addTo(page);
  circles2.getChildAt(0).mov(3, 5);
  circles2.getChildAt(1).mov(-15);

  // pair up circles
  circles.loop((c, i) => {
    var pair = circles2.getChildAt(i);
    c.pair = pair;
    pair.pair = c;
  });

  circles.on("mousedown", showCircle);
  circles2.on("mousedown", showCircle);

  function showCircle(e) {
    let circle = e.target;
    let parent = circle.parent;
    circle.addTo(parent == circles ? circlesTop : circles2Top);
    circle.pair.addTo(parent == circles ? circles2Top : circlesTop);
    asset("woohoo.mp3").play();
    indicator.selectedIndex++;
    if (indicator.selectedIndex == indicator.num - 1) {
      emitter.spurt(130);
      page.replay.loc(749, 234, page).alp(0).animate({
        props: { alpha: 1 },
        wait: 1.5 });
      //.place();
    }
    stage.update();
  }

  const emitter = new Emitter({
    obj: new Rectangle(10, 10, [purple, green, dark, white, green]),
    random: { scale: { min: 1, max: 3 }, rotation: { min: 0, max: 360 } },
    horizontal: true,
    width: indicator.width,
    force: { min: 4, max: 8 },
    life: 1.7,
    gravity: 16,
    height: 10,
    num: 2,
    angle: { min: -90 - 40, max: -90 + 40 },
    startPaused: true }).
  loc(indicator, null, page).mov(0, -10);

  page.replay = new Button({
    width: 60,
    height: 60,
    backgroundColor: green,
    rollBackgroundColor: blue,
    icon: pizzazz.makeIcon("rotate", white, .9),
    label: "",
    corner: 30 }).
  tap(() => {
    page.replay.animate({ alpha: 0 }, .3);
    interval(.1, function () {
      indicator.selectedIndex--;
    }, indicator.num, true);

    circlesTop.animate({
      props: { alpha: 0 },
      time: .7 });

    circles2Top.animate({
      props: { alpha: 0 },
      time: .7,
      call: function () {
        page.reset();
      } });

  });

  page.reset = function () {
    // loop all trans
    circlesTop.loop(function (c) {
      c.addTo(circles);
    }, true); // loop backwards when removing
    circlesTop.alp(1);
    circles2Top.loop(function (c) {
      c.addTo(circles2);
    }, true);
    circles2Top.alp(1);
    indicator.selectedIndex = -1;
  };


  stage.update(); // needed to view changes

  // DOCS FOR ITEMS USED
  // https://zimjs.com/docs.html?item=Frame
  // https://zimjs.com/docs.html?item=Container
  // https://zimjs.com/docs.html?item=Circle
  // https://zimjs.com/docs.html?item=Rectangle
  // https://zimjs.com/docs.html?item=Label
  // https://zimjs.com/docs.html?item=Button
  // https://zimjs.com/docs.html?item=Page
  // https://zimjs.com/docs.html?item=Indicator
  // https://zimjs.com/docs.html?item=tap
  // https://zimjs.com/docs.html?item=noMouse
  // https://zimjs.com/docs.html?item=hitTestPoint
  // https://zimjs.com/docs.html?item=animate
  // https://zimjs.com/docs.html?item=loop
  // https://zimjs.com/docs.html?item=pos
  // https://zimjs.com/docs.html?item=loc
  // https://zimjs.com/docs.html?item=mov
  // https://zimjs.com/docs.html?item=bot
  // https://zimjs.com/docs.html?item=alp
  // https://zimjs.com/docs.html?item=ble
  // https://zimjs.com/docs.html?item=sca
  // https://zimjs.com/docs.html?item=addTo
  // https://zimjs.com/docs.html?item=centerReg
  // https://zimjs.com/docs.html?item=center
  // https://zimjs.com/docs.html?item=place
  // https://zimjs.com/docs.html?item=expand
  // https://zimjs.com/docs.html?item=Emitter
  // https://zimjs.com/docs.html?item=interval
  // https://zimjs.com/docs.html?item=lighten
  // https://zimjs.com/docs.html?item=zog
  // https://zimjs.com/docs.html?item=STYLE

  // FOOTER
  // call remote script to make ZIM icon - you will not need this
  createIcon();
  STYLE = {};
  createGreet();

}); // end of ready