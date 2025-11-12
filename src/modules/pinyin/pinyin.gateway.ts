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
  ) {}

  afterInit() {
    this.logger.log("✅ Chat Gateway initialized.");
  }

  async handleConnection(client: Socket) {
    try {

      const cookies = client.handshake.headers.cookie;
      if (!cookies) throw new UnauthorizedException("Missing cookie");
      console.log(cookie.parse(cookies));
      const { jwt } = cookie.parse(cookies);
      if (!jwt) throw new UnauthorizedException("Missing token");

      const payload = this.jwtService.verify(jwt);
      const room = client.handshake.query.room as string || "default";

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
    const player = this.pinyinService["players"].get(client.id);
    if (!player) return;
    this.pinyinService.removePlayer(client.id);
    this.server.to(player.room).emit("players", this.pinyinService.getPlayers(player.room));
    this.logger.log(`🔌 Player disconnected: ${player.userId}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("move")
  async handleMove(@ConnectedSocket() client: Socket & {user: any}, @MessageBody() data: { x: number; y: number }) {
    const user = client.user;
    this.logger.debug(`📍 ${user.sub} moved to (${data.x}, ${data.y})`);
    this.server.emit("playerMoved", { userId: user.sub, x: data.x, y: data.y });
    return Ack.ok();
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('dropBomb')
  handleBomb(@ConnectedSocket() client: Socket & { user: any }) {
    const user = client.user;
    const player = this.pinyinService['players'].get(client.id);
  
    if (!player) {
      this.logger.warn(`❌ Drop bomb failed — player not found for ${user.sub}`);
      return Ack.error('Player not found');
    }
  
    const bomb = this.pinyinService.dropBomb(client.id);
    if (!bomb) {
      return Ack.error('Failed to drop bomb');
    }
  
    this.server.to(player.room).emit('bombDropped', bomb);
  
    this.logger.debug(`💣 ${user.sub} dropped a bomb at (${bomb.x}, ${bomb.y})`);
    return Ack.ok(bomb);
  }
  
}
