import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server} from 'socket.io'

@WebSocketGateway()
export class MessagesGateway {
    @WebSocketServer() server: Server;

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
