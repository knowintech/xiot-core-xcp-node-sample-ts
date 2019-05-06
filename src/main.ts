import {XcpClientImpl} from 'xiot-core-xcp-node-ts/dist/xiot/core/xcp/impl/XcpClientImpl';
import {XcpClientCipherProductImpl} from 'xiot-core-xcp-node-ts/dist/xiot/core/xcp/impl/XcpClientCipherProductImpl';
import {XcpFrameCodecType} from 'xiot-core-xcp-node-ts/dist/xiot/core/xcp/common/XcpFrameCodecType';
import {XcpLTSKGetterImpl} from './XcpLTSKGetterImpl';
import {Convert} from 'mipher';

console.log('hello');

const deviceId = '10001';
const productId = 10006;
const productVersion = 1;
const k = '/8meBcfecxNl7pMIO0Zxbhx70A4DSGio7C2H7VzZLB8=';
const serverLTPK = Convert.base642bin(k);
const getter = new XcpLTSKGetterImpl();
const cipher = new XcpClientCipherProductImpl(productId, productVersion, getter, serverLTPK);
const codec = XcpFrameCodecType.NOT_CRYPT;
const client = new XcpClientImpl(deviceId, productId, productVersion, cipher, codec);

const host = 'accesspoint.geekool.cn';
const port = 80;
const uri = '/endpoint';
client.connect(host, port, uri).then(x => {
    console.log('connect to xcp server ok!');
}).catch(e => {
    console.log('connect to xcp server error: ', e);
});
