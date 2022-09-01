window.onload = function(){
    // create the varriable ctx
    var ctx;
    // create the varriable gravity
    var gravity = 4;
    // create the varriable forceFactor
    var forceFactor = 0.3;
    // create the varriable mouseDown and set to false
    var  mouseDown = false;
    //create hte array balls
    var balls = new Array();
    //create hte array mousesPos
    var mousePos = new Array();
    //event handler onMouseDown
    function onMouseDown(event){
        // set the varriable mouse Down to true;
        mouseDown = true;
        // set the varriable downX to the array mousePos
        mousePos['downX'] = event.pageX;
        // set the varriable downY to the array mousePos
        mousePos['downY'] = event.pageY;
    }
    //event handler onMouseUp
    function onMouseUp(event){
        // set the varriable mouse Down to false;
        mouseDown = false;
        // push in the array balls
        balls.push( 
                    //new object ball
                    new ball(
                        //new object ball with the position of the mousedown 
                        //axe X
                        mousePos["downX"],
                        //axe Y
                        mousePos["downY"],
                        // set the vector atribut to the start to the end and multiply by constant forceFactor
                          (event.pageX - mousePos["downX"]) * forceFactor,
                          (event.pageY - mousePos["downY"]) * forceFactor,
                        5 + (Math.random()*10),
                         0.9,
                         // set function ramdom_color
                         random_color() 
                    )
        );
    }
        // set the function onMouseMove to run it on the page when the cursor move
        function onMouseMove(event){
        // take the position of the cursor in the page
        //axe X
        mousePos['currentX'] = event.pageX;
        //axe Y
        mousePos['currentY'] = event.pageY;
        
        
        
    }
        // set the fuction resizeWindow to clear the canvas and reset the canvas height and width
        function resizeWindow(event){
            canvas.height = $(window).height();
            canvas.width = $(window).width();
        }
    // even handeler of the document
    // when the mouse is press load onMouseDown function
    $(document).mousedown(onMouseDown);
    // when the mouse is unpress load onMouseUp function
    $(document).mouseup(onMouseUp);
    // when the mouse is move load onMouseMove function
    $(document).mousemove(onMouseMove);
    // when the page in resize load the resizeWindow function
    $(window).bind("resize", resizeWindow);
    // set the function circle to draw the circle of each ball
    function circle(x, y, r, c){
        // begin the path
        ctx.beginPath();
        //create an arc with is perimetre is = to Math.PI*2;
        ctx.arc(x, y, r, 0, Math.PI*2, true);
        // close the path
        ctx.closePath();
        // set the style of the cercle ( background path line width srtoke color)
        ctx.fillStyle = c;
        // set the background
        ctx.fill();
        // set the lineWidth
        ctx.lineWidth = r * 0.1;
        // set the strokeStyle
        ctx.strokeStyle ="#000";
        // set the stroke
        ctx.stroke();
        
    }
    // set the function random_color
    function random_color(){
        // set a varriable letter and split it with all the carractere of hex number and select one letter of the string
        var letter ="0123456789ABCDEF".split("");
        // set a varriable color with the #
        var color = "#";
        // do it six time to generate de hexa color random
        for (var i = 0; i < 6; i++) {
            // add to the variable color
            color += letter[Math.round(Math.random()*15)]
        }
        // return the variable color at the end of the loop
        return color;	
    }
    // trace of the arrow in 
    function arrow(fromx, fromy, tox, toy, c){
        // begin de path
        ctx.beginPath();
        // set the constant headlen 
        var headlen = 10;
        // get the angle to the start to the end of the path 
        var angle = Math.atan2(toy-fromy, tox-fromx);
        // set the line to the start position
        ctx.moveTo(fromx, fromy);
        // set the line to the end position
        ctx.lineTo(tox, toy);
        // create the arrow head element left
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/6), toy-headlen*Math.sin(angle-Math.PI/6));
        // back to the center 
        ctx.moveTo(tox,toy);
        // create the arrow head element right
        ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/6), toy-headlen*Math.sin(angle+Math.PI/6));
        // set the line width
        ctx.lineWidth = 1;
        // set the stroke Style
        ctx.strokeStyle = c;
        // set the line cap
        ctx.lineCap ="butt";
        // set the stroke
        ctx.stroke(); 
        // close the path
        ctx.closePath();
    }
    // set the function draw_ball
    function draw_ball(){
        // increase the velocity to the element in the axe Y
        // v = a * t
        this.vy += gravity * 0.1;
        // increase the velocity to the element in the axe X
        // s = v * t
        // increase the position X
        this.x += this.vx * 0.1;
        // increase the position Y
        this.y += this.vy * 0.1;
        if(this.x + this.r > canvas.width){
            this.x = canvas.width - this.r;
            this.vx *= -1 * this.b;
        }
        if(this.x - this.r < 0 ){
            this.x = this.r;
            this.vx *= -1 * this.b;
        }
        if(this.y + this.r > canvas.height ){
            this.y = canvas.height - this.r;
            this.vy *= -1 * this.b;
        }
        if(this.y - this.r < 0 ){
            this.y = this.r;
            this.vy *= -1 * this.b;
        }
        circle(this.x, this.y, this.r, this.c);
    }
    //set the object ball
    function ball(positionX, positionY, velosityX, velosityY, radius, bounciness, color){
        //set the position X
        this.x = positionX;
        //set the position Y
        this.y = positionY;
        //set the velosityX
        this.vx = velosityX;
        //set the velosityY
        this.vy = velosityY;
        //set the radius
        this.r = radius;
        //set the bounciness constant
        this.b = bounciness;
        //set the color
        this.c = color;
        //set the attribut to the ball element
        this.draw = draw_ball;
    
    }
    //game loop
    function game_loop(){
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // if the cursor is press
        if (mouseDown === true) {
            // set the arrow to start to end X,Y axes
            arrow(
                mousePos["downX"],
                 mousePos["downY"],
                 mousePos["currentX"],
                 mousePos["currentY"],
                 "red"
            )
            
        }
        // loop which draw a ball for each intance
        for (var i = 0; i < balls.length; i++) {
            balls[i].draw();
        }
        // set the color of the font
        ctx.fillStyle ="#000000";
        // set the style of the font
        ctx.font ="15px Arial";
        // create in the html the text saying how many ball the canvas got
        ctx.fillText("Balls: " + balls.length, 10, canvas.height - 10);
   trace();
    }

function trace() {
              // set the color of the font
              ctx.fillStyle = "#000000";
              // set the style of the font
              ctx.font = "15px layout";
              // create in the html the text saying how many ball the canvas got
              ctx.fillText("appuie", canvas.width - (canvas.width / 2) - 130, canvas.height - (canvas.height / 5));
              ctx.fillText("relâche", canvas.width - (canvas.width / 2) + 90, canvas.height - (canvas.height / 5));
              ctx.strokeStyle = "#000000";
              ctx.beginPath();
              ctx.lineTo(canvas.width - (canvas.width / 2) - 80, canvas.height - (canvas.height / 5));
              ctx.lineTo(canvas.width - (canvas.width / 2) + 80, canvas.height - (canvas.height / 5));
              ctx.lineTo(canvas.width - (canvas.width / 2) + 50, canvas.height - (canvas.height / 5) + 15);
              ctx.moveTo(canvas.width - (canvas.width / 2) + 80, canvas.height - (canvas.height / 5));
              ctx.lineTo(canvas.width - (canvas.width / 2) + 50, canvas.height - (canvas.height / 5) - 15)
              ctx.stroke();
              ctx.closePath();
          }

    //init
    function init(){
        ctx = $('#canvas')[0].getContext("2d");
        canvas.height = $(window).height();
        canvas.width = $(window).width();
        return setInterval(game_loop, 10)
    }
    init();
}