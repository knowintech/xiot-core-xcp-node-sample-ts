import {IotService} from './iot/iot.service';
import {Md5} from 'ts-md5';
const qrcode = require('qrcode-terminal');

/**
 * init device information
 */
const serialNumber = 'abc';
const productId = 153;
const productVersion = 1;
const deviceType = 'urn:homekit-spec:device:switch:00000008:know:ld01:1';
const deviceLTPK = 'H4Jakw5bGJxShLHOccomMhkQPkPx70yxnCtAWdCl8mM=';
const deviceLTSK = 'MC4zMDU5NjQxMDczOTUwMTYzNA==';
const serverKey = '/8meBcfecxNl7pMIO0Zxbhx70A4DSGio7C2H7VzZLB8=';

/**
 * init iot service
 */
console.log('initialize iot.service ...');
const iot = new IotService(serialNumber, productId, deviceType, deviceLTPK, deviceLTSK, serverKey);

/**
 * connect to service
 */
const host = 'st-iot-ap-2.knowin.com';
const port = 80;
const uri = '/endpoint';
iot.connect(host, port, uri)
    .then(() => {
        console.log('connect ok');
        iot.getAccessKey().then(key => {
            console.log('DID: ', serialNumber + '@' + productId);
            console.log('AccessKey: ', key);

            const code = {
                id: serialNumber + '@' + productId,
                key: Md5.hashStr(key),
            };

            console.log('code: ', code);
            qrcode.generate(JSON.stringify(code));
        });
    })
    .catch(e => console.log('connect failed!', e));

// iot.sendEvent(siid, eiid);
// iot.notifyProperty(siid, piid);
// iot.notifyService(siid);
