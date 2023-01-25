// importing sound
const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");

const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector("#scoreEl");
const startGameBtn = document.querySelector("#startGameBtn");
const modalEl = document.querySelector("#modalEl");
const bigScoreEl = document.querySelector("#bigScore");

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  // j kono function name dewa jabe...primitive typ kichu na
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Superprojectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class HugeWeapon {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    // this.color = color;
  }

  draw() {
    c.beginPath();
    c.fillRect(this.x, this.y, this.width, this.height);
    // c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    console.log("gdgdg");
    // this.x = this.x + this.velocity.x;
    // this.y = this.y + this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const friction = 0.99;
// const friction = 98;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1; // jno partical gula disappear hoye jey certain time pore
  }

  draw() {
    c.save(); // call it global canvas function, only effect code in this block...bujhi nai actly t: 1:22:22
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore(); // finishing state of the global code right between c.save() and c.restore
  }

  update() {
    this.draw();
    this.velocity.x *= friction; //explotion particle gula jno last er dike speed kome jay
    this.velocity.y *= friction; // tym er shathe shathe speed kombe
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01; // jno gradually opacity kome jay
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

// let player = new Player(x, y, 10, "white");
let projectiles = [];
let superprojectiles = [];
let enemies = [];
let particles = [];
let weapons;
let score = 0;

// For restart game
function init() {
  player = new Player(x, y, 10, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreEl.innerHTML = score;
  bigScoreEl.innerHTML = score;
}

// for enemy douradouri
function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4; // this mean we will get value with [4-30] range

    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`; // this is generating different color
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

let animationId;
// let score = 0;
function animation() {
  // return value what frame u currently on
  animationId = requestAnimationFrame(animation);
  c.fillStyle = "rgba(0, 0, 0, 0.1)"; // motion fade effect
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });

  projectiles.forEach((projectile, index) => {
    projectile.update();

    // remove from edges from screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  superprojectiles.forEach((superprojectile, index) => {
    superprojectile.update();

    // remove from edges from screen
    if (
      superprojectile.x + superprojectile.radius < 0 ||
      superprojectile.x - superprojectile.radius > canvas.width ||
      superprojectile.y + superprojectile.radius < 0 ||
      superprojectile.y - superprojectile.radius > canvas.height
    ) {
      setTimeout(() => {
        superprojectiles.splice(index, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, index) => {
    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    // end game
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
      gameOverSound.play();
      modalEl.style.display = "flex";
      bigScoreEl.innerHTML = score;
    }

    ////////////////////////////////////////

    addEventListener("keypress", (e) => {
      if (e.key === " ") {
        //   weapons = new HugeWeapon(0, 0, canvas.width, canvas.height, "green");
        //   weapons.update();
        // enemies.push(new Enemy(x, y, radius, color, velocity));

        // if (enemy.x < canvas.width && enemy.y < canvas.height) {
        //   weapons = new HugeWeapon(0, 0, canvas.width, canvas.height, "red");
        //   enemies.length = 0;
        //   weapons.draw();
        //   console.log("in");
        // }

        /////////////

        if (enemy.x < canvas.width && enemy.y < canvas.height) {
          // create explotioin
          //   for (let i = 0; i < 5; i++) {
          //     particles.push(
          //       new Particle(enemy.x, enemy.y, Math.random(), enemy.color, {
          //         x: (Math.random() - 0.5) * (Math.random() * 2), // we add Math.random() *8 for nice and large explotion particle
          //         y: (Math.random() - 0.5) * (Math.random() * 2),
          //       })
          //     );
          //   }
          // superprojectiles.splice(superprojectileIndex, 1);
          // enemies.splice(index, 1);
          //remove from scene altogather
          //   enemies.splice(index, 1);

          if (score >= 30) {
            const hugeWeaon = new HugeWeapon(0, 0, canvas.width, canvas.height);
            enemies = [];
            hugeWeaponSound.play();
            hugeWeaon.draw();
            score -= 30;
            console.log("times");
            scoreEl.innerHTML = score;
          }

          //   weapons = new HugeWeapon(0, 0, canvas.width, canvas.height);
          //   enemies = [];
          //   weapons.draw();
          //   enemies.length = 0;
          //   superprojectiles.splice(superprojectileIndex, 1);
        }

        ///////
      }
    });

    /////////////////////////////////////

    superprojectiles.forEach((superprojectile, superprojectileIndex) => {
      const dist = Math.hypot(
        superprojectile.x - enemy.x,
        superprojectile.y - enemy.y
      );

      if (dist - enemy.radius - superprojectile.radius < 1) {
        // create explotioin
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              superprojectile.x,
              superprojectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6), // we add Math.random() *8 for nice and large explotion particle
                y: (Math.random() - 0.5) * (Math.random() * 6),
              }
            )
          );
        }
        // superprojectiles.splice(superprojectileIndex, 1);
        // enemies.splice(index, 1);
        setTimeout(() => {
          //remove from scene altogather
          killEnemySound.play();
          enemies.splice(index, 1);
          superprojectiles.splice(superprojectileIndex, 1);
        }, 0);
      }
    });

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // when projectile touch enemy
      if (dist - enemy.radius - projectile.radius < 1) {
        // create explotioin
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6), // we add Math.random() *8 for nice and large explotion particle
                y: (Math.random() - 0.5) * (Math.random() * 6),
              }
            )
          );
        }
        if (enemy.radius - 10 > 10) {
          // increase our Score
          score += 10;
          scoreEl.innerHTML = score;
          // we r using library here to animate shrinking size
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          // jno nicely death hoy enemy er.b8 eta notice kra difficult
          setTimeout(() => {
            killEnemySound.play();
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            // increase our Score
            score += 5;
            scoreEl.innerHTML = score;

            //remove from scene altogather
            enemies.splice(index, 1);
            killEnemySound.play();
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}

// where clicking
addEventListener("click", (event) => {
  //   console.log(event.clientX);

  shootingSound.play();

  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );

  const velocity = {
    x: Math.cos(angle) * 5, // its horizonatal with range -1 to 1
    y: Math.sin(angle) * 5, // its vertical with range -1 to 1
  };

  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});

startGameBtn.addEventListener("click", () => {
  init();
  animation();
  spawnEnemies();
  modalEl.style.display = "none";
});

// Right button click
window.oncontextmenu = (e) => {
  e.preventDefault();

  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );

  const velocity = {
    x: Math.cos(angle) * 2, // its horizonatal with range -1 to 1
    y: Math.sin(angle) * 2, // its vertical with range -1 to 1
  };

  if (score >= 10) {
    heavyWeaponSound.play();

    superprojectiles.push(
      new Superprojectile(
        canvas.width / 2,
        canvas.height / 2,
        20,
        "red",
        velocity
      )
    );
    score -= 10;
    scoreEl.innerHTML = score;
  }
};

// addEventListener("keypress", (e) => {
//   if (e.key === " ") {
//     weapons = new HugeWeapon(0, 0, canvas.width, canvas.height, "green");
//     weapons.update();
//     // enemies.push(new Enemy(x, y, radius, color, velocity));
//     console.log(weapons);
//   }
// });

// addEventListener("keypress", (e) => {
//     if (e.key === " ") {
//       //   weapons = new HugeWeapon(0, 0, canvas.width, canvas.height, "green");
//       //   weapons.update();
//       // enemies.push(new Enemy(x, y, radius, color, velocity));

//       // if (enemy.x < canvas.width && enemy.y < canvas.height) {
//       //   weapons = new HugeWeapon(0, 0, canvas.width, canvas.height, "red");
//       //   enemies.length = 0;
//       //   weapons.draw();
//       //   console.log("in");
//       // }

//       /////////////

//       if (enemy.x < canvas.width && enemy.y < canvas.height) {
//         // create explotioin
//         for (let i = 0; i < enemy.radius * 2; i++) {
//           particles.push(
//             new Particle(enemy.x, enemy.y, Math.random() * 2, enemy.color, {
//               x: (Math.random() - 0.5) * (Math.random() * 6), // we add Math.random() *8 for nice and large explotion particle
//               y: (Math.random() - 0.5) * (Math.random() * 6),
//             })
//           );
//         }
//         // superprojectiles.splice(superprojectileIndex, 1);
//         // enemies.splice(index, 1);
//         //remove from scene altogather
//         enemies.splice(index, 1);
//         //   superprojectiles.splice(superprojectileIndex, 1);
//       }

//       ///////
//     }
//   });
