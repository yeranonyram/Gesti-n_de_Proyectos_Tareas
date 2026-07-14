import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: any;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, userId: string) {
    client.join(`user_${userId}`);
    console.log(`Cliente ${client.id} unido a sala user_${userId}`);
  }

  // Notificar a todos los clientes
  sendNotification(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Notificar a un usuario específico (por sala)
  notifyUser(userId: number, event: string, data: any) {
    this.server.to(`user_${userId}`).emit(event, data);
  }
}