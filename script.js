

// ========================= script.js =========================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const tileSize = 20;
const rows = 21;
const cols = 21;

let score = 0;
let frameCount = 0;
const PACMAN_SPEED = 10; // slower pacman
const GHOST_SPEED = 20;

let map = [
 "111111111111111111111",
 "100000000000000000001",
 "101111011111011111101",
 "101000010000010000101",
 "101011110111110111101",
 "101000000100000000101",
 "101111110101111110101",
 "100000000000000000001",
 "111011111011111011111",
 "100010000010000010001",
 "101110111110111110101",
 "101000100000100000101",
 "101011101111101110101",
 "101000001000001000101",
 "101111101011101011101",
 "100000001000001000001",
 "111011111111111110111",
 "100010000000000010001",
 "101110111111111110101",
 "100000000000000000001",
 "111111111111111111111"
];

let pacman = { x:1, y:1, dx:0, dy:0, angle:0 };

let ghosts = [
 {x:10, y:10, color:'#ff006e'},
 {x:9, y:10, color:'#00f5d4'},
 {x:11, y:10, color:'#f15bb5'}
];

function drawMap(){
    for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
            if(map[y][x]==='1'){
                ctx.fillStyle="#003566";
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            } else {
                ctx.fillStyle="#000";
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
                if(map[y][x]==='0'){
                    ctx.fillStyle="#ffd60a";
                    ctx.beginPath();
                    ctx.arc(x*tileSize+10, y*tileSize+10, 3, 0, Math.PI*2);
                    ctx.fill();
                }
            }
        }
    }
}

function drawPacman(){
    ctx.fillStyle="#ffd60a";
    ctx.beginPath();
    ctx.moveTo(pacman.x*tileSize+10, pacman.y*tileSize+10);
    ctx.arc(pacman.x*tileSize+10, pacman.y*tileSize+10, 9,
        pacman.angle+0.25*Math.PI,
        pacman.angle+1.75*Math.PI);
    ctx.fill();
}

function drawGhost(g){
    ctx.fillStyle=g.color;
    ctx.beginPath();
    ctx.arc(g.x*tileSize+10, g.y*tileSize+10, 9, 0, Math.PI*2);
    ctx.fill();
}

function updatePacman(){
    if(frameCount % PACMAN_SPEED !== 0) return;
    const nx = pacman.x + pacman.dx;
    const ny = pacman.y + pacman.dy;
    if(map[ny][nx] !== '1'){
        pacman.x = nx;
        pacman.y = ny;
        if(map[ny][nx] === '0'){
            map[ny] = map[ny].substring(0,nx)+' '+map[ny].substring(nx+1);
            score += 10;
            scoreEl.textContent = score;
        }
    }
}

function updateGhosts(){
    if(frameCount % GHOST_SPEED !== 0) return;
    ghosts.forEach(g=>{
        const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
        const [dx,dy] = dirs[Math.floor(Math.random()*4)];
        if(map[g.y+dy][g.x+dx] !== '1'){
            g.x += dx;
            g.y += dy;
        }
        if(g.x === pacman.x && g.y === pacman.y){
            alert('Game Over! Score: ' + score);
            location.reload();
        }
    });
}

function loop(){
    frameCount++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawMap();
    updatePacman();
    updateGhosts();
    drawPacman();
    ghosts.forEach(drawGhost);
    requestAnimationFrame(loop);
}

window.addEventListener("keydown", e=>{
    if(e.key === "ArrowUp"){ pacman.dx=0; pacman.dy=-1; pacman.angle=1.5*Math.PI; }
    if(e.key === "ArrowDown"){ pacman.dx=0; pacman.dy=1; pacman.angle=0.5*Math.PI; }
    if(e.key === "ArrowLeft"){ pacman.dx=-1; pacman.dy=0; pacman.angle=Math.PI; }
    if(e.key === "ArrowRight"){ pacman.dx=1; pacman.dy=0; pacman.angle=0; }
});

loop();
