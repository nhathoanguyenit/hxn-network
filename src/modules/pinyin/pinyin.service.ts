import { Injectable } from '@nestjs/common';

interface Player {
  id: string;
  userId: string;
  room: string;
  x: number;
  y: number;
  alive: boolean;
}

interface Bomb {
  id: string;
  ownerId: string;
  room: string;
  x: number;
  y: number;
  timestamp: number;
}

@Injectable()
export class PinyinService {
  private players: Map<string, Player> = new Map();
  private bombs: Bomb[] = [];
  private gridSize = 50;

  getPlayer(id: string) {
    return this.players.get(id);
  }

  addPlayer(clientId: string, userId: string, room: string) {
    const player: Player = {
      id: clientId,
      userId,
      room,
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize),
      alive: true,
    };
    this.players.set(clientId, player);
    return player;
  }

  removePlayer(clientId: string) {
    this.players.delete(clientId);
  }

  getPlayers(room: string) {
    return Array.from(this.players.values()).filter(p => p.room === room);
  }

  movePlayer(clientId: string, direction: 'up' | 'down' | 'left' | 'right') {
    const player = this.players.get(clientId);
    if (!player || !player.alive) return null;


    switch (direction) {
      case 'up': player.y = Math.max(0, player.y - 1); break;
      case 'down': player.y = Math.min(this.gridSize - 1, player.y + 1); break;
      case 'left': player.x = Math.max(0, player.x - 1); break;
      case 'right': player.x = Math.min(this.gridSize - 1, player.x + 1); break;
    }

    return player;
  }

  dropBomb(clientId: string): Bomb | null {
    const player = this.players.get(clientId);
    if (!player || !player.alive) return null;

    const bomb: Bomb = {
      id: `${Date.now()}-${player.userId}`,
      ownerId: player.userId,
      room: player.room,
      x: player.x,
      y: player.y,
      timestamp: Date.now(),
    };

    this.bombs.push(bomb);
    return bomb;
  }

  explodeBomb(bomb: Bomb) {
    const radius = 1;
    const area = [{ x: bomb.x, y: bomb.y }];

    for (let i = 1; i <= radius; i++) {
      if (bomb.x + i < this.gridSize) area.push({ x: bomb.x + i, y: bomb.y });
      if (bomb.x - i >= 0) area.push({ x: bomb.x - i, y: bomb.y });
      if (bomb.y + i < this.gridSize) area.push({ x: bomb.x, y: bomb.y + i });
      if (bomb.y - i >= 0) area.push({ x: bomb.x, y: bomb.y - i });
    }

    const players = Array.from(this.players.values()).filter(p => p.room === bomb.room);
    for (const p of players) {
      if (!p.alive) continue;
      const hit = area.some(pos => pos.x === p.x && pos.y === p.y);
      if (hit) p.alive = false;
    }

    this.bombs = this.bombs.filter(b => b.id !== bomb.id);

    return {
      area,
      players: this.getPlayers(bomb.room),
    };
  }

  respawnPlayer(clientId: string) {
    const player = this.players.get(clientId);
    if (!player) return null;

    player.alive = true;
    player.x = Math.floor(Math.random() * 50);
    player.y = Math.floor(Math.random() * 50);

    return player;
  }
}
