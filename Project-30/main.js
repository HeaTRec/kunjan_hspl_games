const scaling = "fit";
const width = 1024;
const height = 768;
const color = darker;
const outerColor = darker;

const frame = new Frame(scaling, width, height, color, outerColor);
frame.on("ready", () => {
  zog("ready from ZIM Frame");

  const stage = frame.stage;
  const stageW = frame.width;
  const stageH = frame.height;

  const colors = [red, green, blue, pink, yellow, purple];

  // a container to hold all the parts we remake 
  // such as the circles and the tabs
  // this will allow us easily to replace them each question
  const parts = new Container(stageW, stageH).addTo();
  let timeout1;
  let timeout2;
  let tabs;
  let times = 0; // the game will go for 10 questions or until 60 seconds
  function makeSkip() {
    timer.pause(false); // pause the timer while showing the question score
    times++;
    if (times > 10) done();
    parts.disposeAllChildren(); // get rid of any old question
    let tot = rand(10, 30); // pick a number of circles
    let num = rand(tot - 1); // pick the skipped circles from 0 to one less than total
    let ang = 360 / tot; // angle for each circle
    let rad = rand(30, 60); // randomize the size of the circles
    let col = Pick.choose(colors); // grab a random color or shuffle(colors)[0]
    new Circle(300, null, Pick.choose(colors), rad * 2 * 1.4).center(parts); // make backing ring
    loop(tot, i => {
      if (i == num) return; // SKIP 
      // change the registration point and rotate
      new Circle(rad, col).reg(0, 300).loc(stageW / 2, stageH / 2, parts).rot(i * ang).ble();
    });

    // create options that are 10 degrees away from answer
    let answer = Math.round(num * ang);
    let position = rand(3);
    let answers = [];
    loop(4, i => {
      if (i == position) answers.push(answer);else
      answers.push((answer + (i - position) * 10 + 360) % 360);
    });

    tabs = new Tabs({
      width: 150,
      tabs: answers,
      selectedIndex: -1,
      vertical: true,
      corner: [50, 0, 50, 0],
      spacing: 10,
      selectedBackgroundColor: green.darken(.3) }).
    sca(1.2).center(parts);
    tabs.on("mousedown", () => {
      tabs.enabled = false; // do not let select twice
      timer.pause();
      if (tabs.text == answer) {
        tabs.selected.backgroundColor = green;
        scorer.score++;
        emitter.spurt(8);
      } else {
        tabs.selected.backgroundColor = red;
        // also show the currect answer
        timeout1 = timeout(1, () => {
          tabs.buttons[position].backgroundColor = green;
          stage.update();
        });
      }
      timeout2 = timeout(2, makeSkip); // go to next question
    });
    stage.update();
  }

  const emitter = new Emitter({
    obj: new Circle(200, null, colors, 30),
    gravity: 0,
    interval: .1,
    life: 1,
    shrink: false,
    animation: { props: { scale: 3 }, time: 2 },
    force: 0,
    startPaused: true,
    layers: BOTTOM }).
  center();


  // first in series gets used on protolabel
  new LabelOnArc("SKIP", 80, "impact", series(blue, blue, green, yellow, pink), 390).rot(-55).center();
  new LabelOnArc("choose missing angle!", 30, "impact", series(blue, green, yellow, pink), 400).rot(60).center();

  const scorer = new Scorer().pos(50, 50, RIGHT, BOTTOM);
  const timer = new Timer().pos(50, 50, LEFT, BOTTOM);
  timer.on("complete", done);

  const pane = new Pane({
    label: "SCORE",
    backdropColor: black.toAlpha(.5),
    backing: new Circle(200, green) });

  pane.label.y = -70;
  const final = new Label({
    align: CENTER,
    size: 100,
    font: "impact",
    text: "0" }).
  center(pane).mov(0, 40);
  pane.on("close", () => {
    timer.start(60);
    scorer.score = 0;
    times = 0;
    makeSkip();
  });

  function done() {
    if (timeout1) timeout1.clear();
    if (timeout2) timeout2.clear();
    tabs.dispose();
    final.text = scorer.score;
    timer.stop();
    pane.show();
  }

  makeSkip();

  stage.update(); // this is needed to show any changes

  // DOCS FOR ITEMS USED
  // https://zimjs.com/docs.html?item=Frame
  // https://zimjs.com/docs.html?item=Container
  // https://zimjs.com/docs.html?item=Circle
  // https://zimjs.com/docs.html?item=Label
  // https://zimjs.com/docs.html?item=LabelOnArc
  // https://zimjs.com/docs.html?item=Pane
  // https://zimjs.com/docs.html?item=Tabs
  // https://zimjs.com/docs.html?item=loop
  // https://zimjs.com/docs.html?item=pos
  // https://zimjs.com/docs.html?item=loc
  // https://zimjs.com/docs.html?item=mov
  // https://zimjs.com/docs.html?item=ble
  // https://zimjs.com/docs.html?item=rot
  // https://zimjs.com/docs.html?item=reg
  // https://zimjs.com/docs.html?item=sca
  // https://zimjs.com/docs.html?item=addTo
  // https://zimjs.com/docs.html?item=center
  // https://zimjs.com/docs.html?item=Emitter
  // https://zimjs.com/docs.html?item=shuffle
  // https://zimjs.com/docs.html?item=rand
  // https://zimjs.com/docs.html?item=timeout
  // https://zimjs.com/docs.html?item=series
  // https://zimjs.com/docs.html?item=darken
  // https://zimjs.com/docs.html?item=toAlpha
  // https://zimjs.com/docs.html?item=zog

  // FOOTER
  // call remote script to make ZIM icon - you will not need this
  createIcon().mov(-20, -100);

}); // end of ready