import {XcpClient} from 'xiot-core-xcp-node-ts/src/xiot/core/xcp/XcpClient';
import {QueryPing} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/basic/Ping';

function ping(client: XcpClient) {

    client.sendQuery(new QueryPing(client.getNextId()))
        .then(x => {
            console.log('recv pong: ', x.id);
        })
        .catch(e => {
            console.log('ping failed: ', e);
        });
}

export function doKeepalive(client: XcpClient): void {
    ping(client);
}
