import {IotService} from './iot/iot.service';

/**
 * init device information
 */
const serialNumber = 'abc';
const productId = 30;
const productVersion = 1;
const deviceType = 'urn:homekit-spec:device:switch:00000008:seed:switch2:1';
const deviceLTPK = 'CQRl5z815XMKJgk4PmWTs8GFXAI+PI2N0YXzZuf7yc8=';
const deviceLTSK = 'qVFb/qMWt4Vx5pEkNr7TMfgK8FmG0ClWnXOLVswryQw=';
const serverKey = '/8meBcfecxNl7pMIO0Zxbhx70A4DSGio7C2H7VzZLB8=';

/**
 * init iot service
 */
console.log('initialize iot.service ...');
const iot = new IotService(serialNumber, productId, deviceType, deviceLTPK, deviceLTSK, serverKey);

/**
 * connect to service
 */
const host = 'accesspoint.geekool.cn';
const port = 80;
const uri = '/endpoint';
iot.connect(host, port, uri)
    .then(() => {
        console.log('connect ok');
        iot.getAccessKey().then(key => {
            console.log('getAccessKey: ', key);
        });
    })
    .catch(e => console.log('connect failed!'));

// iot.sendEvent(siid, eiid);
// iot.notifyProperty(siid, piid);
// iot.notifyService(siid);
