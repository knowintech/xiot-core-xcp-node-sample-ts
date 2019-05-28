import {IotService} from './iot/iot.service';

/**
 * init device information
 */
const serialNumber = 'abc';
const productId = 16;
const productVersion = 1;
const deviceLTPK = 'VH8lCVErI4MIJsOaze5QhyWa2hhpp7I8L5gdToxUeeE=';
const deviceLTSK = 'uwh6DtyfcBqs/TLyNkTHXg8yl56rq09943KoyfxltAw=';
const serverKey = '/8meBcfecxNl7pMIO0Zxbhx70A4DSGio7C2H7VzZLB8=';

/**
 * init iot service
 */
console.log('initialize iot.service ...');
const iot = new IotService(serialNumber, productId, productVersion, deviceLTPK, deviceLTSK, serverKey);

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
