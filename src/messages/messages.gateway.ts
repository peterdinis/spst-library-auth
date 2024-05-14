import {
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class MessagesGateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    private readonly logger = new Logger(MessagesGateway.name);

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
        client.emit('connected', 'Connected to WebSocket server');
    }

    @SubscribeMessage('adminRightsMessage')
    handleAdminRightsMessage(client: any, _: unknown): void {
        const clientId = client.id;
        this.server
            .to(clientId)
            .emit('adminRightsMessage', 'Váš účet má prístupové práva');
    }

    @SubscribeMessage('adminRemoveRights')
    handleAdminRemoveRights(client: any, _: unknown): void {
        const clientId = client.id;
        this.server
            .to(clientId)
            .emit(
                'adminRemoveRights',
                'Vašmu účtu boli odobrané prístupové práva',
            );
    }

    @SubscribeMessage('deactivateAccount')
    deactivateAccount(client: any, _: unknown): void {
        const clientId = client.id;
        this.server
            .to(clientId)
            .emit('deactivateAccount', 'Váš účet bol deaktivovaný');
    }

    @SubscribeMessage('removeAccount')
    removeAccount(client: any, _: unknown): void {
        const clientId = client.id;
        this.server.to(clientId).emit('removeAccount', 'Váš účet bol zmazaný');
    }
}
