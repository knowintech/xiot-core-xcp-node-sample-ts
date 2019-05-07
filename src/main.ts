import {XcpClientImpl} from 'xiot-core-xcp-node-ts/dist/xiot/core/xcp/node/impl/XcpClientImpl';
import {XcpClientCipherProductImpl} from 'xiot-core-xcp-ts/dist/xiot/core/xcp/impl/XcpClientCipherProductImpl';
import {XcpFrameCodecType} from 'xiot-core-xcp-ts/dist/xiot/core/xcp/common/XcpFrameCodecType';
import {XcpLTSKGetterImpl} from './XcpLTSKGetterImpl';
import {Convert} from 'mipher';
import {GET_PROPERTIES_METHOD, QueryGetProperties} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/basic/GetProperties';
import {SET_PROPERTIES_METHOD, QuerySetProperties} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/basic/SetProperties';
import {INVOKE_ACTION_METHOD, QueryInvokeAction} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/basic/InvokeAction';
import {OperationStatus} from 'xiot-core-spec-ts/dist/xiot/core/spec/typedef/status/OperationStatus';
import {getProperties, invokeAction, setProperties} from './MyDeviceHandler';
import {doKeepalive} from './MyDeviceHeartbeat';

console.log('hello');

const deviceId = '1';
const productId = 10006;
const productVersion = 1;
const k = '/8meBcfecxNl7pMIO0Zxbhx70A4DSGio7C2H7VzZLB8=';
const serverLTPK = Convert.base642bin(k);
const getter = new XcpLTSKGetterImpl();
const cipher = new XcpClientCipherProductImpl(productId, productVersion, getter, serverLTPK);
const codec = XcpFrameCodecType.NOT_CRYPT;
const client = new XcpClientImpl(deviceId, productId, productVersion, cipher, codec);

client.addQueryHandler(GET_PROPERTIES_METHOD, (query => {
    console.log('XcpGetProperties: ', query.id);
    if (query instanceof QueryGetProperties) {
        getProperties(client, query);
    } else {
        client.sendError(query.error(OperationStatus.UNDEFINED, 'invalid query'));
    }
}));

client.addQueryHandler(SET_PROPERTIES_METHOD, (query => {
    console.log('XcpSetProperties: ', query.id);
    if (query instanceof QuerySetProperties) {
        setProperties(client, query);
    } else {
        client.sendError(query.error(OperationStatus.UNDEFINED, 'invalid query'));
    }
}));

client.addQueryHandler(INVOKE_ACTION_METHOD, (query => {
    console.log('XcpInvokeAction: ', query.id);
    if (query instanceof QueryInvokeAction) {
        invokeAction(client, query);
    } else {
        client.sendError(query.error(OperationStatus.UNDEFINED, 'invalid query'));
    }
}));

const host = 'accesspoint.geekool.cn';
const port = 80;
const uri = '/endpoint';

client.connect(host, port, uri).then(x => {
    console.log('connect to xcp server ok!');
}).catch(e => {
    console.log('connect to xcp server error: ', e);
});

setInterval(doKeepalive, 1000 * 30, client);
