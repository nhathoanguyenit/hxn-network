import { createScene } from './scene.js';
import { loadPlayerTemplate, updatePlayers, animatePlayers } from './players.js';
import { loadBombTemplate, updateBombs, animateBombs } from './bombs.js';
import { setupControls } from './controls.js';

const socket = io('/pinyin', { withCredentials: true, query: { room: 'default' } });
const respawnBtn = document.getElementById('respawnBtn');
const gameEl = document.getElementById('game');
const gridSize = 50;

let players = [];
let bombs = [];

const { scene, camera, renderer, controls } = createScene(gridSize, gameEl);

await loadPlayerTemplate('/plugins/pinyin/models/player.gltf');
await loadBombTemplate('/plugins/pinyin/models/player.gltf');

function animate() {
  requestAnimationFrame(animate);
  controls.target.set(0, 0, 0);
  controls.update();
  animateBombs();
  animatePlayers();
  renderer.render(scene, camera);
}
animate();

function render() {
  updatePlayers(scene, players);
  updateBombs(scene, bombs);
}

socket.on('players', list => {
  players = list.map(p => ({ ...p, isSelf: p.id === socket.id }));
  render();
});

socket.on('bombDropped', bomb => { bombs.push(bomb); render(); });
socket.on('bombExploded', bomb => { bombs = bombs.filter(b => b.id !== bomb.id); render(); });

respawnBtn.addEventListener('click', () => socket.emit('respawn'));

setupControls(socket);
