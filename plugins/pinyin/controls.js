export function setupControls(socket) {
    document.addEventListener('keydown', e => {
  
      if (e.code === 'Space') { socket.emit('dropBomb'); return; }
  
      const keyMap = { ArrowUp:38, ArrowDown:40, ArrowLeft:37, ArrowRight:39, w:38, s:40, a:37, d:39 };
      const key = keyMap[e.key];
      if (!key) return;

      socket.emit('move', { key });
    });
  }
  