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
  private players: Map<string, Player> = new Map(); // key: socket.id
  private bombs: Bomb[] = [];

  addPlayer(id: string, userId: string, room: string) {
    const player: Player = {
      id,
      userId,
      room,
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
      alive: true,
    };
    this.players.set(id, player);
    return player;
  }

  removePlayer(id: string) {
    this.players.delete(id);
  }

  getPlayers(room: string) {
    return Array.from(this.players.values()).filter((p) => p.room === room);
  }

  movePlayer(id: string, { x, y }: { x: number; y: number }) {
    const player = this.players.get(id);
    if (player && player.alive) {
      player.x = x;
      player.y = y;
    }
  }

  dropBomb(id: string): Bomb | null {
    const player = this.players.get(id);
    if (!player) return null;

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
}

