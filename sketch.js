// green #32a852
// blue #3543de

var world;
const particleDiameter = 5;
const particleRadius = particleDiameter / 2;

function setup() {
  createCanvas(500, 500);

  let blue = "#4aabff";
  let green = "#4aff5c";
  let white = "#ffffff";
  let pink = "#f830ff";

  world = new Engine();
  world.createGroup(blue, 10);
  world.createGroup(pink, 200);

  world.createForce(blue, blue, -20, 1000);
  world.createForce(blue, blue, 200, 200);
  world.createForce(pink, pink, 10, 10);
  world.createForce(pink, pink, -1, 1000);

  world.createForce(blue, pink, -100, 200);
  world.createForce(blue, pink, 200, 100);
}

function draw() {
  background(0);
  world.update();
}

class Engine {
  constructor() {
    this.forces = [];
    this.groups = new Map();
  }

  createGroup(color, count) {
    if (this.groups.has(color)) {
      console.log(`${color} already exists in group map`);
      return;
    }

    var bucket = [];
    for (let p = 0; p < count; p++) {
      bucket.push(new Particle(color));
    }
    this.groups.set(color, bucket);
  }

  createForce(color1, color2, G, range) {
    this.forces.push([color1, color2, G, range]);
  }

  update() {
    for (let [color1, color2, G, range] of this.forces) {
      for (let p1 of this.groups.get(color1)) {
        for (let p2 of this.groups.get(color2)) {
          if (p1 == p2) {
            continue;
          }

          let dpos = p5.Vector.sub(p2.pos, p1.pos);
          let d = p5.Vector.mag(dpos);
          let du = p5.Vector.normalize(dpos);
          // let ndu = p5.Vector.mult(du, -1);

          if (d < particleDiameter) {
            // separate overlapping particles
            var gap = p5.Vector.sub(dpos, p5.Vector.mult(du, particleDiameter));
            p1.pos.add(gap);
            p2.pos.sub(gap);
          }

          //   // p1.vel.mult(0.8);
          //   // p2.vel.mult(0.8);

          //   // subtract colloding velocity
          //   // var relVel = p5.Vector.mult(du, p5.Vector.dot(p1.vel, du)).mag();

          //   // if(relVel > 10){
          //     p1.vel.sub(p5.Vector.mult(du, p5.Vector.dot(p1.vel, du)));
          //     p2.vel.sub(p5.Vector.mult(ndu, p5.Vector.dot(p2.vel, ndu)));
          //   // }
          //   // else{
          //   //   p1.vel.mult(.5);
          //   //   p2.vel.mult(.5);
          //   // }

          //   // d = incident ray
          //   // r = reflected ray
          //   // 𝑟 = d−2(d⋅𝑛)𝑛
          // }

          if (d > particleDiameter && d < range) {
            d = max(particleDiameter, d);
            let f = p5.Vector.mult(du, G).div(d * d);
            p2.push(f);
          }
        }
      }
    }

    for (let group of this.groups.values()) {
      group.forEach((particle) => {
        particle.update();
        particle.draw();
      });
    }
  }
}

class Particle {
  constructor(color, x = floor(random(width)), y = floor(random(height))) {
    this.color = color;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
  }

  push(forceVector) {
    this.vel.add(forceVector);
  }

  update() {
    if (this.pos.x < particleRadius) {
      this.vel.x += 0.01;
      this.pos.x = particleRadius;
    }
    if (this.pos.x > width - particleRadius) {
      this.vel.x -= 0.01;
      this.pos.x = width - particleRadius;
    }

    if (this.pos.y < particleRadius) {
      this.vel.y += 0.01;
      this.pos.y = particleRadius;
    }
    if (this.pos.y > height - particleRadius) {
      this.vel.y -= 0.01;
      this.pos.y = height - particleRadius;
    }

    this.vel.limit(5);
    this.vel.mult(0.99);
    this.pos.add(this.vel);
  }

  draw() {
    fill(color(this.color));
    noStroke();
    circle(this.pos.x, this.pos.y, particleDiameter);
  }
}
