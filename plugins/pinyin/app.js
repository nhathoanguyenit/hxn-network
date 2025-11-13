import { createScene } from './scene.js';
import { updatePlayers } from './players.js';
import { loadBombTemplate, updateBombs, animateBombs } from './bombs.js';
import { setupControls } from './controls.js';

const socket = io('/pinyin', { withCredentials: true, query: { room: 'default' } });
const respawnBtn = document.getElementById('respawnBtn');
const gameEl = document.getElementById('game');
const gridSize = 50;

let players = [];
let bombs = [];

const { scene, camera, renderer, controls } = createScene(gridSize, gameEl);

// Load bomb template
await loadBombTemplate('/plugins/pinyin/models/player.obj');

// --- Animate loop ---
function animate() {
  requestAnimationFrame(animate);
  controls.target.set(0, 0, 0);
  controls.update();
  animateBombs();
  renderer.render(scene, camera);
}
animate();

// --- Render everything ---
function render() {
  updatePlayers(scene, players);
  updateBombs(scene, bombs);
}

// --- Socket Events ---
socket.on('players', list => {
  console.log(list)
  players = list.map(p => ({ ...p, isSelf: p.id === socket.id }));
  render();
});

socket.on('bombDropped', bomb => { bombs.push(bomb); render(); });
socket.on('bombExploded', bomb => { bombs = bombs.filter(b => b.id !== bomb.id); render(); });

// --- Respawn button ---
respawnBtn.addEventListener('click', () => socket.emit('respawn'));

// --- Keyboard controls ---
setupControls(socket);
