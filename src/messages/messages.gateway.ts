import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class MessagesGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('adminRightsMessage')
  handleAdminRightsMessage(client: any, payload: any): void {
    const clientId = client.id;
    this.server.to(clientId).emit('adminRightsMessage', 'Váš učet má pristupové práva');
  }

  @SubscribeMessage('adminRemoveRights')
  handleAdminRemoveRights(client: any, payload: any): void {
    const clientId = client.id;
    this.server.to(clientId).emit('adminRemoveRights', 'Vášmú účtu boli zobrazené prístupové práva');
  }
}