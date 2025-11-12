import { Logger, Injectable, UseGuards, UnauthorizedException } from "@nestjs/common";
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import * as cookie from "cookie";
import { JwtService } from "@nestjs/jwt";
import { WsJwtGuard } from "@common/guards/ws-jwt.guard";
import { Ack } from "@common/utils/ack.helper";
import { PinyinService } from "./pinyin.service";

@WebSocketGateway({
  namespace: "pinyin",
  cors: {
    origin: true,
    credentials: true,
  },
})
@Injectable()
export class PinyinSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PinyinSocketGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly pinyinService: PinyinService,
  ) { }

  afterInit() {
    this.logger.log("✅ Pinyin Gateway initialized.");
  }

  async handleConnection(client: Socket) {
    try {
      const cookies = client.handshake.headers.cookie;
      if (!cookies) throw new UnauthorizedException("Missing cookie");

      const parsed = cookie.parse(cookies);
      const { jwt } = parsed;
      if (!jwt) throw new UnauthorizedException("Missing token");

      const payload = this.jwtService.verify(jwt);
      const room = (client.handshake.query.room as string) || "default";

      const player = this.pinyinService.addPlayer(client.id, payload.sub, room);
      client.join(room);

      this.logger.log(`🎮 Player connected: ${payload.sub} (room: ${room})`);
      this.server.to(room).emit("players", this.pinyinService.getPlayers(room));
    } catch (err) {
      this.logger.warn(`❌ Unauthorized connection: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const player = this.pinyinService.getPlayer(client.id);
    if (!player) return;

    this.pinyinService.removePlayer(client.id);
    this.server.to(player.room).emit("players", this.pinyinService.getPlayers(player.room));

    this.logger.log(`🔌 Player disconnected: ${player.userId}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("move")
  async handleMove(
    @ConnectedSocket() client: Socket & { user: any },
    @MessageBody() data: { key: number },
  ) {
    try {
      const player = this.pinyinService.getPlayer(client.id);
      if (!player) throw new Error("Player not found");

      // Convert key to direction
      // (e.g., arrow keys from browser: 37=left, 38=up, 39=right, 40=down)
      const keyMap: Record<number, "up" | "down" | "left" | "right"> = {
        37: "left",
        38: "up",
        39: "right",
        40: "down",
      };

      const direction = keyMap[data.key];
      if (!direction) throw new Error("Invalid key");

      this.pinyinService.movePlayer(client.id, direction);

      // Notify players in same room
      this.server.to(player.room).emit("players", this.pinyinService.getPlayers(player.room));

      return Ack.ok();
    } catch (err) {
      this.logger.warn(`❌ Move error: ${err.message}`);
      return Ack.error(err.message);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('dropBomb')
  handleBomb(@ConnectedSocket() client: Socket & { user: any }) {
    try {
      const bomb = this.pinyinService.dropBomb(client.id);
      if (!bomb) throw new Error("Unable to drop bomb");

      // Broadcast bomb drop
      this.server.to(bomb.room).emit("bombDropped", bomb);

      // Schedule explosion after 3s
      setTimeout(() => {
        this.pinyinService.explodeBomb(bomb);
        this.server.to(bomb.room).emit("bombExploded", {
          id: bomb.id,
          x: bomb.x,
          y: bomb.y,
        });
        this.server.to(bomb.room).emit("players", this.pinyinService.getPlayers(bomb.room));
      }, 3000);

      return Ack.ok();
    } catch (err) {
      this.logger.warn(`❌ Drop bomb error: ${err.message}`);
      return Ack.error(err.message);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('respawn')
  handleRespawn(@ConnectedSocket() client: Socket & { user: any }) {
    const player = this.pinyinService.respawnPlayer(client.id);
    if (!player) return Ack.error("Unable to respawn");

    this.server.to(player.room).emit('players', this.pinyinService.getPlayers(player.room));
    return Ack.ok();
  }
}
