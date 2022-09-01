//How to print to console: console.log(JSON.stringify(13));

// http://paulirish.com/2011/requestanimationframe-for-smart-animating
//shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame || 
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(callback){
             window.setTimeout(callback, 1000 / 60);
           };
  })();
  
  
  //namespace the game
  var SHOOT ={
  
    //setting up the values
    WIDTH: 400,
    HEIGHT: 400,
    entities: [], //Targets and bullet entities
    score: {
      shot: 0,
      hit: 0,
      escaped: 0,
      accuracy: 0
    },
    canvas: null,
    ctx: null,
    nextTarget: 100,
    offset: {
      top: 0,
      left: 0
    },
    cannon: {
      w: function(){return SHOOT.WIDTH / 5;},
      h: function(){return SHOOT.HEIGHT / 5;},
      x_loc: function(){return SHOOT.WIDTH * 0.4;},
      y_loc: function(){return SHOOT.HEIGHT * 0.8;}
    },
  
    
    init: function(){
      SHOOT.canvas = document.getElementsByTagName('canvas')[0];//Setting up canvas element
      //Must set canvas width otherwise browser automatically defaults 320 x 200
      SHOOT.canvas.width = SHOOT.WIDTH;
      SHOOT.canvas.height = SHOOT.HEIGHT;
      SHOOT.ctx = SHOOT.canvas.getContext('2d');//Setting up canvas context
      
      
      
      
      //Need something to listen for clicks
      window.addEventListener('click',function(e){
        e.preventDefault();
        SHOOT.Input.set(e);
      },false);
      
      
      //call the loop
      SHOOT.loop();
  
    },
    
      //Need something to update the entity values
      update: function(){
        SHOOT.nextTarget -= 1;// Decreases the counter for the next target to come out
        
        //Releases a new target if the counter is less than 0
        if (SHOOT.nextTarget < 0){
          //Put new instance of bubble into our entities array
          SHOOT.entities.push(new SHOOT.Target());
          //Reset the counter with a random value
          SHOOT.nextTarget = (Math.random()*100) + 100;
          
        }
        
        var i, j, checkCollision = false;
        //Start a new instance if the user has tapped the screen
        if (SHOOT.Input.clicked){
          SHOOT.score.shot += 1; //keeping track of shots made
          
          
          SHOOT.entities.push(new SHOOT.Click(SHOOT.Input.x,SHOOT.Input.y));
          SHOOT.entities.push(new SHOOT.Proj(SHOOT.Input.x,SHOOT.Input.y));
          //set clicked back to false and avoid spawning new click icon in next cycle
          SHOOT.Input.clicked = false;
          checkCollision = true;
          
          
          
        }
        
        
        //cycle through all the entities
        for (i=0; i < SHOOT.entities.length;i++){
          SHOOT.entities[i].update();
          
          if(SHOOT.entities[i].type === 'target' /*&& checkCollision*/){        
            for (j = 0; j < SHOOT.entities.length; j++){
              if (SHOOT.entities[j].type === 'projectile'){
                hit = SHOOT.collides(SHOOT.entities[i],SHOOT.entities[j]);
                if (hit){
                  for (var n = 0; n < 20; n++){
                    SHOOT.entities.push(new SHOOT.Particle(
                    SHOOT.entities[i].x,
                    SHOOT.entities[i].y,
                    2,'rgba(255,255,255,' +Math.random()*1 +')'));
                  }
                  SHOOT.score.hit ++;
                }
                SHOOT.entities[i].remove = hit;
                SHOOT.entities[j].remove = hit;
                if (SHOOT.entities[j].remove){
                  SHOOT.entities.splice(j,1);
                  break;
                }
                console.log(JSON.stringify(hit));
                //Spawning explosion particle babies
                
                
              }
            }
            
            
          }
          
         //delete from array if remove property flag is set to true
         // for (i=0; i < SHOOT.entities.length, i++){
              if (SHOOT.entities[i].remove){
                SHOOT.entities.splice(i,1);
              }
         // }
          
        }
        SHOOT.score.accuracy = (SHOOT.score.hit/SHOOT.score.shot)*100;
        SHOOT.score.accuracy = isNaN(SHOOT.score.accuracy) ? 0 : ~~(SHOOT.score.accuracy);
        
        
      },
      
      //Need soemthing to render or draw the entities
      render: function(){
        var i;
        SHOOT.Draw.rect(0,0,SHOOT.WIDTH, SHOOT.HEIGHT,'blue');
        //Drawing the cannon
      SHOOT.Draw.rect(SHOOT.cannon.x_loc(), SHOOT.cannon.y_loc(), SHOOT.cannon.w(), SHOOT.cannon.h(), 'red');
        //Drawing the Text
        //SHOOT.Draw.text('Escaped: ' +SHOOT.score.escaped, 10, SHOOT.HEIGHT - 80, 10, 'white')
        SHOOT.Draw.text('Shot: ' +SHOOT.score.shot, 20, SHOOT.HEIGHT - 20, 10, 'white')
        SHOOT.Draw.text('Hit: ' +SHOOT.score.hit, 20, SHOOT.HEIGHT - 60, 10, 'white')
        SHOOT.Draw.text('Accuracy: ' +SHOOT.score.accuracy, 20, SHOOT.HEIGHT - 40, 10, 'white')
        
        //cycle through all the entities and render to canvas
        for (i=0; i<SHOOT.entities.length;i++){
          SHOOT.entities[i].render();
        }
        
      },
      
      //Need something to loop the animation
    loop: function(){
      requestAnimFrame(SHOOT.loop);
      SHOOT.update();
      SHOOT.render();
    }
    
  };
  
  //Create class to draw stuff
  SHOOT.Draw = {
    //function to clear the entire canvas
    clear: function(){
      SHOOT.ctx.clearRect(0,0,SHOOT.WIDTH, SHOOT.HEIGHT);   
    },
    
    //create a rectangle
    rect: function (x, y, w, h, col){
      SHOOT.ctx.fillStyle = col;
      SHOOT.ctx.fillRect(x, y, w, h);
    },
    
    //create a cirlce
    circle: function(x, y, r, col){
      SHOOT.ctx.fillStyle = col;
      SHOOT.ctx.beginPath();
      SHOOT.ctx.arc(x, y, r, 0, 2 * Math.PI);
      SHOOT.ctx.closePath();
      SHOOT.ctx.fill();
    },
    
    //creating text
    text: function(string, x, y, size, col){
      SHOOT.ctx.font = 'bold' + size + 'px Monospace';
      SHOOT.ctx.fillStyle = col;
      SHOOT.ctx.fillText(string, x, y);
    }
    
  };
  
  SHOOT.Input = {
    
    x: 0,
    y: 0,
    clicked: false,
    
    set: function(data){
      this.x = data.pageX - SHOOT.canvas.offsetLeft;
      this.y = data.pageY - SHOOT.canvas.offsetTop;
      this.clicked = true;
    }
    
  };
  
  SHOOT.Target = function(){
    this.type = 'target';
    this.speed = 1;
    this.r = 10;
    this.x = -this.r *3;
    this.y = (Math.random()*220) + this.r *3;
    
    this.remove = false; //This is a flag to indicate if a target has been hit or has left the screen
    this.update = function(){
      this.x++; 
      if (this.x > SHOOT.WIDTH + this.r*3){
        SHOOT.score.escaped ++;
        this.remove = true;
      }
    };
    
    this.render = function(){
      SHOOT.Draw.circle(this.x,this.y,this.r*3, 'red');
      SHOOT.Draw.circle(this.x,this.y,this.r*2, 'white');
      SHOOT.Draw.circle(this.x,this.y,this.r, 'red');
    };
    
  };
  
  SHOOT.Click = function(x,y){
    this.type = 'click';
    this.x = x;
    this.y = y;
    this.r = 5;
    this.opacity = 1;
    this.fade = 0.05;
    this.remove = false;//flag for removing this entity
    
    this.update = function(){
      //reduce the opacity
      this.opacity -= this.fade;
      //if opacity is less than zero change the flag for removal
      if (this.opacity < 0){
        this.remove = true;
      }
    };
    this.render = function(){
      SHOOT.Draw.circle(this.x,this.y,this.r,'rgba(0,225,0,' +this.opacity+')');
    };
  };
  
  SHOOT.Proj = function(xf,yf){
    this.type = 'projectile';
    this.x = 200;//SHOOT.cannon.x_loc + SHOOT.cannon.w/2;
    this.y = 300;//SHOOT.cannon.y_loc;
    this.r = 5;
    this.speed = 1;
    this.angle = Math.atan((this.y-yf)/(xf-this.x));
  
    if( xf < 200){
      this.angle += Math.PI;    
    }
      
    this.remove = false;
    this.update = function(){
      this.x += Math.cos(this.angle)*4;
      this.y -= Math.sin(this.angle)*4;
      
      if (this.y < 0 || this.y > SHOOT.HEIGHT || this.x < 0 || this.x > SHOOT.WIDTH){
        this.remove = true;
      }
    };
    this.render = function(){
      SHOOT.Draw.circle(this.x,this.y,this.r,'yellow');
    };
  };
  
  SHOOT.collides = function (a,b){
    var distance_squared = (((a.x - b.x)*(a.x - b.x))+((a.y - b.y)*(a.y - b.y)));
    var radii_squared = (a.r + b.r) * (a.r + b.r);
    
    if (distance_squared < radii_squared){
      return true;
    } else{
      return false;
    }
  };
  
  SHOOT.Particle = function (x, y, r, col){
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = col;
    
    //determines whether particle will trafel to the right or left
    this.dir = (Math.random() * 2 > 1) ? 1 : -1;
    
    //random value so particles do now travel at the same speeds
    this.vx = ~~(Math.random()* 4) * this.dir;
    this.vy = ~~(Math.random()* 7);
    
    this.remove = false;
    
    this.update = function(){
      //update corrdinates
      this.x += this.vx;
      this.y -= this.vy;
      
      //increase the velocity so the particle accellerates off screen
      this.vx *= 0.99;
      this.vy *= 0.99;
      //adding a positive amount to the y velocity exerts and downward pull on the particle like gravity
      this.vy -= 0.25;
      
      if (this.y > SHOOT.HEIGHT){
        this.remove = true
      }
    
    
    };
    
    this.render = function(){
      SHOOT.Draw.circle(this.x, this.y, this.r, this.col);
    };
    
  }
  
  window.addEventListener('load', SHOOT.init, false);
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  