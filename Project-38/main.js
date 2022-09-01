var c = document.getElementById('c'),
    link = document.createElement('a'),
    ctx = c.getContext('2d'),
    last = {x: null, y: null},
    current = {x: null, y: null},
    drawing = false, isMirror = false,
    cx, cy, r, angle, _2PI = 2*Math.PI,
    s = { 
        'sectors': 10,
        'line width': 3,
        'background': '#000',
        'brush': '#00d1ff',
        'mirror': false,
        'clear': function() {
            resize();
        },
        'save': function() {
            link.click();
        }
        
    };

link.addEventListener('click', function() {
    link.href = c.toDataURL();
    link.download = "mandala.png";
});
document.body.appendChild(link);

function resize() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    cx = c.width/2;
    cy = c.height/2;
    r = Math.min(cx, cy) - 4;
    angle = _2PI/s.sectors;
    drawSectors();  
    ctx.translate(cx, cy);
}
resize();
window.addEventListener("resize", resize);

var gui = new dat.GUI(),
    col = gui.addFolder('Colors');

col.addColor(s, "background").onChange(resize);
col.addColor(s, "brush");
gui.add(s, "sectors", 2, 20, 1).onChange(resize);
gui.add(s, "line width", 1, 10, 1);
gui.add(s, "mirror").onChange(function() {
    isMirror = !isMirror;
});
gui.add(s, "clear");
gui.add(s, "save");

function drawSectors() {
    ctx.fillStyle = s.background;
    ctx.arc(cx, cy, r, 0, _2PI);
    ctx.fill();
    
    for(var i=0; i<_2PI; i+=angle) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, .15)';
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, i, i + angle);
        ctx.lineTo(cx, cy);
        ctx.stroke();
    }
}

function d(x1, y1, x2, y2) {
    return Math.sqrt(
        Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2)
    );
}

function reset() {
    drawing = false;
    last.x = null;
    last.y = null;
}

function draw(e) {
    if(drawing) {
        var x = e.touches ? e.touches[0].clientX : e.clientX,
            y = e.touches ? e.touches[0].clientY : e.clientY;

        x-= c.offsetLeft;
        y-= c.offsetTop;
        
        if(d(x, y, cx, cy) < r) {
            current.x = x - cx;
            current.y = y - cy;
            drawLine();
        } else {
            reset();
        }
    }    
}

c.addEventListener('mousedown', function() {
    drawing = true;
});

c.addEventListener('touchstart', function() {
    drawing = true;
});

c.addEventListener('mousemove', draw);
c.addEventListener('touchmove', draw);

c.addEventListener('mouseup', reset);
c.addEventListener('touchend', reset);

function drawLine() {
    ctx.lineWidth = s['line width'];
    ctx.lineCap = 'round';
    ctx.strokeStyle = s.brush;
    
    for(var i=0; i<_2PI; i+=angle) {
        ctx.rotate(angle);
        if(last.x != null && last.y != null) {
            ctx.beginPath();
            ctx.moveTo(last.x, last.y);
            ctx.lineTo(current.x, current.y);
            if (isMirror) {
                ctx.moveTo(-last.x, last.y);
                ctx.lineTo(-current.x, current.y);          
            }
            ctx.stroke();
        }
    }
    last.x = current.x;
    last.y = current.y;
}