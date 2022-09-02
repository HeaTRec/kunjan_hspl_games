let canvas,ctx,w,h,x,y,defender,fireflies,missiles,particles,sound,first = true;
let hp,enemy,boss,level,best = 0,recall = 0;

function Defender(options = {}) {
  this.size = options.size || 50;
  this.width = options.width || 6;
  this.weight = options.weight || 0.15;
  this.basesize = this.size;
  this.direct = Math.PI * 1.2;
  this.x = w * 0.5;
  this.y = h;
  this.delay = 5;
  this.basedelay = this.delay;
  this.color = ['#cacaca', '#969696'];
  this.guns = options.guns || [{ x: this.x, y: this.y, direct: this.direct }];
  this.type = options.type || Ripple;
  this.lifespan = options.lifespan || 500;
  this.maxlife = this.lifespan;
  this.score = 0;
  this.condition = 1000;

  this.update = function (x, y) {
    this.direct = Math.atan2(y - this.y, x - this.x);
    const plus = this.guns.length % 2 == 0 ? this.weight * 0.5 : 0;
    this.guns.forEach((r, i) => {
      const half = Math.floor(this.guns.length * 0.5);
      const change = (i - half) * this.weight;
      const direct = this.direct + change + plus;
      r.x = this.x + Math.cos(direct) * this.size * 2;
      r.y = this.y + Math.sin(direct) * this.size * 2;
      r.direct = direct;
    });
    this.size < this.basesize && this.size++;
    this.delay < this.basedelay && this.delay++;
  };

  this.render = function (ctx) {
    ctx.globalAlpha = 1;
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color[0];
    ctx.fillStyle = this.color[1];
    this.guns.forEach(r => {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(r.x, r.y);
      ctx.stroke();
      ctx.closePath();
    });
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI, true);
    ctx.fill();
    ctx.closePath();
  };

  this.hit = function (damage) {
    if (this.lifespan <= 0) return;
    if ((this.lifespan -= damage) <= 0) {
      const popup = document.querySelector('.wrap-popup');
      const score = document.getElementById('score');
      const bscore = document.getElementById('best');
      const state = document.getElementById('state');
      best = defender.score > best ? defender.score : best;
      score.innerHTML = defender.score;
      bscore.innerHTML = best;
      popup.classList.add('show');

      if (this.score >= this.condition) {
        // game win
        state.innerHTML = 'You won!';
        state.classList.remove('lose');
        state.classList.add('win');
        sound.on && sound.win.play();
      } else
      {
        // game over
        state.innerHTML = 'You lose!';
        state.classList.remove('win');
        state.classList.add('lose');
        sound.on && sound.lose.play();
      }
    }
  };

  this.fire = function (callback) {
    if (this.delay < this.basedelay) return;
    this.size = this.basesize * 0.75;
    this.delay = 0;
    callback && callback();
  };

  this.change = function (type) {
    const gun = {
      thunder: {
        delay: 20,
        type: Thunder },

      laser: {
        delay: 30,
        type: Laser },

      ripple: {
        delay: 5,
        type: Ripple } };



    this.type = gun[type].type;
    this.delay = gun[type].delay;
    this.basedelay = gun[type].delay;
  };

  this.upgrade = function () {
    if (this.guns.length >= 8) return;
    this.guns.push({ x: this.x, y: this.y });
  };

  this.downgrade = function () {
    if (this.guns.length == 1) return;
    this.guns.splice(0, 1);
  };
}

function Bonus(options = {}) {
  const typed = [
  { type: 'gun', action: 'upgrade', context: null },
  { type: 'thunder', action: 'change', context: 'thunder' },
  { type: 'ripple', action: 'change', context: 'ripple' },
  { type: 'laser', action: 'change', context: 'laser' }];

  this.x = options.x || Math.random() * w;
  this.y = options.y || -(Math.random() * 100 + 50);
  this.v = options.v || { direct: Math.PI * 0.5 + (Math.random() * 0.8 - 0.4), weight: Math.random() * 0.5 };
  this.a = options.a || { change: Math.random() * 0.02 - 0.01, min: this.v.direct - Math.PI * 0.4, max: this.v.direct + Math.PI * 0.4 };
  this.size = options.size || 20;
  this.width = options.width || 2;
  this.color = options.color || '#ca22ed';
  this.delay = options.delay || Math.random() * 50 + 150;
  this.lifespan = options.lifespan || 1;
  this.lock = options.lock || 5;
  this.type = typed[Math.floor(Math.random() * typed.length)];

  this.update = function (index, array) {
    this.x += Math.cos(this.v.direct) * this.v.weight;
    this.y += Math.sin(this.v.direct) * this.v.weight;
    this.v.direct += this.a.change;
    (this.v.direct > this.a.max || this.v.direct < this.a.min) && (this.a.change *= -1);
    (this.delay-- <= 0 || this.lifespan <= 0) && this.remove(index, array);
    this.lock--;
  };

  this.render = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = this.width;
    ctx.shadowBlur = 32;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.globalAlpha = 0.2;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    //
    switch (this.type.type) {
      case 'gun':
        ctx.beginPath();
        ctx.lineWidth = this.width * 1.5;
        ctx.strokeStyle = defender.color[0];
        ctx.moveTo(this.x, this.y + this.size * 0.6);
        ctx.lineTo(this.x - this.size * 0.6, this.y - this.size * 0.4);
        ctx.moveTo(this.x, this.y + this.size * 0.6);
        ctx.lineTo(this.x, this.y - this.size * 0.5);
        ctx.moveTo(this.x, this.y + this.size * 0.6);
        ctx.lineTo(this.x + this.size * 0.6, this.y - this.size * 0.4);
        ctx.stroke();
        ctx.closePath();
        break;
      case 'thunder':
        ctx.beginPath();
        ctx.lineWidth = this.width * 1.5;
        ctx.strokeStyle = defender.color[0];
        ctx.moveTo(this.x + (Math.random() * 2 - 1) + this.size * 0.5, this.y + (Math.random() * 2 - 1) + this.size * 0.5);
        ctx.lineTo(this.x + (Math.random() * 4 - 2), this.y + (Math.random() * 2 - 1));
        ctx.lineTo(this.x + (Math.random() * 4 - 2) - this.size * 0.5, this.y + (Math.random() * 8 - 4) - this.size * 0.5);
        ctx.stroke();
        ctx.closePath();
        break;
      case 'ripple':
        ctx.beginPath();
        ctx.lineWidth = this.width * 1.5;
        ctx.strokeStyle = defender.color[0];
        ctx.moveTo(this.x + this.size * 0.5, this.y + this.size * 0.5);
        ctx.lineTo(this.x + 2, this.y + 2);
        ctx.moveTo(this.x - 2, this.y - 2);
        ctx.lineTo(this.x - this.size * 0.5, this.y - this.size * 0.5);
        ctx.stroke();
        ctx.closePath();
        break;
      case 'laser':
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.strokeStyle = '#fd1223';
        ctx.moveTo(this.x + this.size * 0.45, this.y + this.size * 0.45);
        ctx.lineTo(this.x - this.size * 0.45, this.y - this.size * 0.45);
        ctx.stroke();
        ctx.closePath();
        break;
      default:
        break;}

  };

  this.hit = function () {
    return false;
  };

  this.select = function () {
    if (this.lock > 0) return;
    this.lifespan = 0;
    defender[this.type.action](this.type.context);
    if (sound.on) {
      sound.bonus.currentTime = 0;
      sound.bonus.play();
    }
  };

  this.remove = function (index, array) {
    array.splice(index, 1);
  };
}

function FireFly(options = {}) {
  this.level = options.level || level;
  this.x = options.x || Math.random() * w;
  this.y = options.y || -(Math.random() * 20 + 20);
  this.v = options.v || { direct: Math.PI * 0.5 + (Math.random() * 0.4 - 0.2), weight: Math.random() * 2 + 2 };
  this.a = options.a || { change: Math.random() * 0.06 - 0.03, min: this.v.direct - Math.PI * 0.4, max: this.v.direct + Math.PI * 0.4 };
  this.size = options.size || Math.random() * 4 + 4;
  this.color = options.color || '#caed22';
  this.delay = options.delay || Math.random() * 180;
  this.lifespan = (options.lifespan || 10) + this.level;
  this.speed = Math.min((options.speed || 0.8) + this.level * 0.05, 1.5);

  this.update = function (index, array) {
    if (this.delay > 0) {
      this.delay--;
      return;
    }
    // detect out of bound
    if (this.y > h || this.lifespan <= 0) {
      if (this.y > h && this.x >= 0 && this.x <= w) {
        particles.push(new Particles({
          x: this.x,
          y: this.y,
          direct: this.v.direct + Math.PI }));

        defender.hit(this.lifespan);
        if (sound.on) {
          sound.hit.currentTime = 0;
          sound.hit.play();
        }
      }
      if (this.lifespan <= 0) {
        Math.random() > 0.925 && array.push(new Bonus({ x: this.x, y: this.y }));
        if (defender.score++ % 50 == 0 && !boss) {
          boss = new Boss();
          array.push(boss);
        }
        if (sound.on) {
          sound.die.currentTime = 0;
          sound.die.play();
        }
      }
      this.remove(index, array);
      array.push(new FireFly());
    }
    // move
    this.x += Math.cos(this.v.direct) * this.v.weight * this.speed;
    this.y += Math.sin(this.v.direct) * this.v.weight * this.speed;
    this.v.direct += this.a.change;
    (this.v.direct > this.a.max || this.v.direct < this.a.min) && (this.a.change *= -1);
  };

  this.render = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = Math.random() * 5 + 5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = Math.random();
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.closePath();
  };

  this.hit = function (damage, direct) {
    this.lifespan -= damage;
    particles.push(new Particles({
      x: this.x,
      y: this.y,
      direct: direct,
      max: this.lifespan <= 0 ? 0 : Math.round(Math.random() * 3 + 3),
      nolight: this.lifespan > 0 }));

  };

  this.remove = function (index, array) {
    array.splice(index, 1);
  };
}

function Boss(options = {}) {
  this.level = options.level || level;
  this.x = options.x || Math.random() * w * 0.5 + w * 0.25;
  this.y = options.y || -(Math.random() * 20 + 20);
  this.v = options.v || { direct: Math.PI * 0.5 + (Math.random() * 0.4 - 0.2), weight: Math.random() + 2 };
  this.a = options.a || { change: Math.random() * 0.06 - 0.03, min: -0.1, max: Math.PI + 0.1 };
  this.size = options.size || 16;
  this.color = options.color || '#33fd22';
  this.delay = options.delay || Math.random() * 60;
  this.lifespan = (options.lifespan || defender.maxlife) + this.level * 50;
  this.maxlife = this.lifespan;
  this.speed = Math.min((options.speed || 1) + this.level * 0.05, 1.25);

  this.update = function (index, array) {
    if (this.delay > 0) {
      this.delay--;
      return;
    }
    // detect out of bound
    if (this.y > h || this.lifespan <= 0) {
      if (this.y > h && this.x >= 0 && this.x <= w) {
        [...new Array(3)].forEach(() => {
          particles.push(new Particles({
            x: this.x,
            y: this.y,
            direct: this.v.direct + Math.PI }));

        });
        defender.hit(this.lifespan);
        if (sound.on) {
          sound.hit.currentTime = 0;
          sound.hit.play();
        }
      }
      if (this.lifespan <= 0) {
        array.push(new Bonus({ x: this.x, y: this.y }));
        if (sound.on) {
          sound.die.currentTime = 0;
          sound.die.play();
        }
      }
      this.remove(index, array);
    }
    // move
    this.x += Math.cos(this.v.direct) * this.v.weight * this.speed;
    this.y += Math.sin(this.v.direct) * this.v.weight * this.speed;
    this.v.direct += this.a.change;
    (this.v.direct > this.a.max || this.v.direct < this.a.min) && (this.a.change *= -1);
  };

  this.render = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = Math.random() * 5 + 5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = Math.random();
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.closePath();
  };

  this.hit = function (damage, direct) {
    this.lifespan -= damage;
    particles.push(new Particles({
      x: this.x,
      y: this.y,
      direct: direct,
      max: this.lifespan <= 0 ? 0 : Math.round(Math.random() * 3 + 3),
      nolight: this.lifespan > 0 }));

  };

  this.remove = function (index, array) {
    array.splice(index, 1);
    boss = null;
    level++;
  };
}

function Ripple(options = {}) {
  this.color = options.color || '#fefefe';
  this.glow = options.glow || '#fd2423';
  this.x = options.x || Math.random() * w;
  this.y = options.y || Math.random() * h;
  this.base = { x: this.x, y: this.y };
  this.weight = options.weight || 80;
  this.friction = options.friction || 0.94;
  this.width = options.width || 2;
  this.damage = options.damage || 12;
  this.direct = options.ref.direct || Math.random() * Math.PI * 2;
  this.prev = { x: this.x, y: this.y };
  this.segments = options.segments || [...new Array(5)].map(() => {return { x: this.x, y: this.y };});
  if (sound.on) {
    sound.ripple.currentTime = 0;
    sound.ripple.play();
  }

  this.update = function (index, array, targets) {
    this.prev = { x: this.x, y: this.y };
    this.x += Math.cos(this.direct) * this.weight;
    this.y += Math.sin(this.direct) * this.weight;
    this.segments.forEach((s, i) => {
      s.x = this.prev.x + Math.cos(this.direct) * (this.weight * (i + 1) / this.segments.length);
      s.y = this.prev.y + Math.sin(this.direct) * (this.weight * (i + 1) / this.segments.length);
    });
    const hitted = targets.filter(t => {
      const hit = this.segments.find(s => {
        const dx = s.x > t.x - t.size * 2 && s.x < t.x + t.size * 2;
        const dy = s.y > t.y - t.size * 2 && s.y < t.y + t.size * 2;
        return dx && dy;
      });
      return hit;
    });
    hitted.forEach(h => h.hit(this.damage, this.direct));
    //
    this.weight *= this.friction;
    (this.weight < 1 || this.y < 0) && this.remove(index, array);
  };

  this.render = function (ctx) {
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.shadowBlur = 32;
    ctx.shadowColor = this.glow;
    this.segments.forEach(s => {
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    });
    ctx.closePath();
    ctx.shadowBlur = 0;
    this.prev.x == this.base.x && this.prev.y == this.base.y && LightFlare(ctx, this.base.x, this.base.y);
  };

  this.remove = function (index, array) {
    array.splice(index, 1);
  };
}

function Laser(options = {}) {
  this.lifespan = options.lifespan || Math.round(Math.random() * 10 + 20);
  this.maxlife = this.lifespan;
  this.color = options.color || '#2323fe';
  this.glow = options.glow || '#fd1223';
  this.x = options.x || Math.random() * w;
  this.y = options.y || Math.random() * h;
  this.width = options.width || Math.random() * 8 + 4;
  this.area = options.area || 0.05;
  this.damage = options.damage || 6;
  this.direct = options.direct || Math.random() * Math.PI * 2;
  this.tail = { x: this.x, y: this.y };
  this.length = options.length || 1500;
  this.ref = options.ref || this;
  if (sound.on) {
    sound.laser.currentTime = 0;
    sound.laser.play();
  }

  this.update = function (index, array, targets) {
    this.direct = defender.direct;
    this.x = this.ref.x;
    this.y = this.ref.y;
    this.tail.x = this.x + Math.cos(this.direct) * this.length;
    this.tail.y = this.y + Math.sin(this.direct) * this.length;
    if (this.lifespan % 5 == 0) {
      const hitted = targets.filter(t => {
        if (t.lifespan <= 0) return false;
        const direct = Math.atan2(t.y - defender.y, t.x - defender.x);
        return Math.abs(this.direct - direct) < this.area;
      });
      hitted.forEach(h => h.hit(this.damage, this.direct));
    }
    //
    this.lifespan > 0 && this.lifespan-- || this.remove(index, array);
  };

  this.render = function (ctx) {
    if (this.lifespan <= 0) return;
    ctx.beginPath();
    ctx.globalAlpha = this.lifespan / this.maxlife + 0.2;
    ctx.strokeStyle = this.glow;
    ctx.lineWidth = this.width;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.tail.x, this.tail.y);
    ctx.stroke();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width * 0.4;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.tail.x, this.tail.y);
    ctx.stroke();
    ctx.closePath();
    LightFlare(ctx, this.x, this.y);
  };

  this.remove = function (index, array) {
    array.splice(index, 1);
  };
}

function Thunder(options = {}) {
  this.lifespan = options.lifespan || Math.round(Math.random() * 10 + 10);
  this.maxlife = this.lifespan;
  this.color = options.color || '#fefefe';
  this.glow = options.glow || '#2323fe';
  this.x = options.x || Math.random() * w;
  this.y = options.y || Math.random() * h;
  this.width = options.width || 2;
  this.area = options.area || 0.1;
  this.damage = options.damage || 20;
  this.direct = options.direct || Math.random() * Math.PI * 2;
  this.max = options.max || 16;
  this.tail = { x: this.x, y: this.y };
  this.ref = options.ref || this;
  this.segments = [...new Array(this.max)].map(() => {
    return {
      x: this.x,
      y: this.y,
      direct: this.direct + (Math.random() * 0.2 - 0.1),
      length: Math.random() * 20 + 80,
      change: Math.random() * 0.04 - 0.02 };

  });
  if (sound.on) {
    sound.thunder.currentTime = 0;
    sound.thunder.play();
  }

  this.update = function (index, array, targets) {
    this.x = this.ref.x;
    this.y = this.ref.y;
    let prev = { x: this.x, y: this.y };
    this.segments.forEach(s => {
      (s.direct += s.change) && Math.random() > 0.96 && (s.change *= -1);
      s.x = prev.x + Math.cos(s.direct) * s.length;
      s.y = prev.y + Math.sin(s.direct) * s.length;
      prev = { x: s.x, y: s.y };
    });
    this.tail = prev;
    if (this.lifespan == this.maxlife) {
      const hitted = targets.filter(t => {
        if (t.lifespan <= 0) return false;
        const direct = Math.atan2(t.y - defender.y, t.x - defender.x);
        return Math.abs(this.direct - direct) < this.area;
      });
      hitted.forEach(h => h.hit(this.damage, this.direct));
    }
    //
    this.lifespan > 0 && this.lifespan-- || this.remove(index, array);
  };

  this.render = function (ctx) {
    if (this.lifespan <= 0) return;
    ctx.beginPath();
    ctx.globalAlpha = this.lifespan / this.maxlife;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.shadowBlur = 32;
    ctx.shadowColor = this.glow;
    ctx.moveTo(this.x, this.y);
    this.segments.forEach(s => ctx.lineTo(s.x, s.y));
    ctx.stroke();
    ctx.closePath();
    ctx.shadowBlur = 0;
    LightFlare(ctx, this.x, this.y);
  };

  this.remove = function (index, array) {
    array.splice(index, 1);
  };
}

function LightFlare(ctx, x, y) {
  const strength = Math.random() * 80 + 40;
  const light = ctx.createRadialGradient(x, y, 0, x, y, strength);
  light.addColorStop(0, 'rgba(250, 200, 50, 0.6)');
  light.addColorStop(0.1, 'rgba(250, 200, 50, 0.2)');
  light.addColorStop(0.4, 'rgba(250, 200, 50, 0.06)');
  light.addColorStop(0.65, 'rgba(250, 200, 50, 0.01)');
  light.addColorStop(0.8, 'rgba(250, 200, 50, 0)');
  ctx.beginPath();
  ctx.fillStyle = light;
  ctx.arc(x, y, strength, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function Spark(options = {}) {
  this.x = options.x || w * 0.5;
  this.y = options.y || h * 0.5;
  this.v = options.v || { direct: options.direct + (Math.random() * Math.PI * 0.4 - Math.PI * 0.2), weight: Math.random() * 26 + 4, friction: 0.88 };
  this.a = options.a || { change: Math.random() * 0.4 - 0.2, min: this.v.direct - Math.PI * 0.4, max: this.v.direct + Math.PI * 0.4 };
  this.g = options.g || { direct: Math.PI * 0.5 + (Math.random() * 0.4 - 0.2), weight: Math.random() * 0.25 + 0.25 };
  this.width = options.width || Math.random() * 3;
  this.lifespan = options.lifespan || Math.round(Math.random() * 40 + 20);
  this.maxlife = this.lifespan;
  this.color = options.color || '#feca32';
  this.prev = { x: this.x, y: this.y };

  this.update = function (index, array) {
    this.prev = { x: this.x, y: this.y };
    this.x += Math.cos(this.v.direct) * this.v.weight;
    this.x += Math.cos(this.g.direct) * this.g.weight;
    this.y += Math.sin(this.v.direct) * this.v.weight;
    this.y += Math.sin(this.g.direct) * this.g.weight;
    this.v.weight > 0.2 && (this.v.weight *= this.v.friction);
    this.v.direct += this.a.change;
    (this.v.direct > this.a.max || this.v.direct < this.a.min) && (this.a.change *= -1);
    this.lifespan > 0 && this.lifespan--;
    this.lifespan <= 0 && this.remove(index, array);
  };

  this.render = function (ctx) {
    if (this.lifespan <= 0) return;
    ctx.beginPath();
    ctx.globalAlpha = this.lifespan / this.maxlife;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.prev.x, this.prev.y);
    ctx.stroke();
    ctx.closePath();
  };

  this.remove = function (index, array) {
    array.splice(index, 1);
  };
}

function Particles(options = {}) {
  options = options || {};
  this.nolight = options.nolight || false;
  this.max = options.max || Math.round(Math.random() * 10 + 6);
  this.sparks = [...new Array(this.max)].map(() => new Spark(options));

  this.update = function (index, array) {
    this.sparks.length == 0 && this.remove(index, array);
    this.sparks.forEach((s, i) => s.update(i, this.sparks));
  };

  this.render = function (ctx) {
    this.sparks.length > this.max * 0.75 && !this.nolight && LightFlare(ctx, options.x, options.y);
    this.sparks.forEach(s => s.render(ctx));
  };

  this.remove = function (index, array) {
    array.splice(index, 1);
  };
}

function loop() {
  update();
  render();
  recall = requestAnimationFrame(loop);
}

function update() {
  defender.update(x, y);
  missiles.forEach((l, i) => l.update(i, missiles, fireflies));
  fireflies.forEach((f, i) => f.update(i, fireflies));
  particles.forEach((p, i) => p.update(i, particles));
  //
  hp.style.width = `${Math.max(defender.lifespan / defender.maxlife * 100, 0)}%`;
  enemy.style.width = `${boss ? Math.max(boss.lifespan / boss.maxlife * 100, 0) : 0}%`;
}

function render() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);
  //
  defender.render(ctx);
  fireflies.forEach(f => f.render(ctx));
  ctx.globalCompositeOperation = 'screen';
  missiles.forEach(l => l.render(ctx));
  particles.forEach(p => p.render(ctx));
}

function register() {
  first = false;
  //
  canvas.addEventListener('mousemove', e => {
    x = e.clientX / window.innerWidth * w;
    y = e.clientY / window.innerHeight * h;
  });
  canvas.addEventListener('mousedown', e => {
    e.preventDefault();
    fireflies.forEach(f => {
      if (f.select) {
        const dx = x > f.x - f.size && x < f.x + f.size;
        const dy = y > f.y - f.size && y < f.y + f.size;
        dx && dy && f.select();
      }
    });
    //
    defender.fire(() => {
      defender.guns.forEach(g => missiles.push(new defender.type({
        x: g.x,
        y: g.y,
        ref: g,
        direct: defender.direct })));

    });
  });
  window.addEventListener('resize', () => {
    const ratio = window.innerHeight / window.innerWidth;
    w = 1920;
    h = w * ratio;
    canvas.width = w;
    canvas.height = h;
    defender.x = w * 0.5;
    defender.y = h;
  });
}

function init() {
  //
  const ratio = window.innerHeight / window.innerWidth;
  hp = document.querySelector('.player-hp-bar .bar');
  enemy = document.querySelector('.enemy-hp-bar .bar');
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  w = 1920;
  h = w * ratio;
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  defender = new Defender();
  fireflies = [];
  missiles = [];
  particles = [];
  level = 0;
  //
  sound = {
    on: true,
    thunder: document.getElementById('thunder'),
    ripple: document.getElementById('ripple'),
    laser: document.getElementById('laser'),
    bonus: document.getElementById('bonus'),
    lose: document.getElementById('lose'),
    win: document.getElementById('win'),
    hit: document.getElementById('hit'),
    die: document.getElementById('die'),
    bg: document.getElementById('bg') };

  sound.thunder.volume = 0.4;
  sound.ripple.volume = 0.1;
  sound.laser.volume = 0.5;
  sound.bonus.volume = 0.8;
  sound.lose.volume = 1.0;
  sound.win.volume = 1.0;
  sound.hit.volume = 0.2;
  sound.die.volume = 0.2;
  sound.bg.volume = 0.4;
  [...new Array(16)].forEach(f => fireflies.push(new FireFly()));
  first && register();
  sound.on && sound.bg.play();
  //
  cancelAnimationFrame(recall);
  loop();
}

window.addEventListener('load', () => {
  const btn = document.getElementById('btn');
  const popup = document.querySelector('.wrap-popup');
  btn.addEventListener('click', () => {
    btn.innerHTML = 'Play again';
    popup.classList.remove('show');
    init();
  });
});