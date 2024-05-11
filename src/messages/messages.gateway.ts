import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface CustomWebSocketClient extends Socket {}

@WebSocketGateway()
export class MessagesGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('adminRightsMessage')
  handleAdminRightsMessage(client: CustomWebSocketClient, _: unknown): void {
    const clientId = client.id;
    this.server.to(clientId).emit('adminRightsMessage', 'Váš účet má prístupové práva');
  }

  @SubscribeMessage('adminRemoveRights')
  handleAdminRemoveRights(client: CustomWebSocketClient, _: unknown): void {
    const clientId = client.id;
    this.server.to(clientId).emit('adminRemoveRights', 'Vašmu účtu boli odobrané prístupové práva');
  }
}