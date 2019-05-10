import {XcpLTSKGetterImpl} from './xcp.ltsk.getter.impl';
import {Convert} from 'mipher';
import {XcpClient} from 'xiot-core-xcp-ts/dist/xiot/core/xcp/XcpClient';
import {IQQuery} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/IQQuery';
import {XcpFrameCodecType, XcpClientCipherProductImpl} from 'xiot-core-xcp-ts';
import {
  QueryGetProperties,
  QuerySetProperties,
  QueryInvokeAction,
  QueryPing,
  GET_PROPERTIES_METHOD,
  SET_PROPERTIES_METHOD,
  INVOKE_ACTION_METHOD,
  QueryPropertiesChanged,
  ResultPropertiesChanged,
} from 'xiot-core-message-ts';
import {OperationStatus, DeviceCodec, DeviceOperable, PropertyOperation, PID} from 'xiot-core-spec-ts';
import {SimulatorStatus} from './simulator.status';
import {XcpClientImpl} from 'xiot-core-xcp-node-ts/dist/xiot/core/xcp/node/impl/XcpClientImpl';

export class SimulatorService {

  device: DeviceOperable | null = null;
  status: SimulatorStatus = SimulatorStatus.UNINITIALIZED;

  private did = '';
  private client: XcpClient | null = null;
  private timer: any = null;

  constructor() {
  }

  uninitialized(): boolean {
    return (this.status === SimulatorStatus.UNINITIALIZED);
  }

  initialize(serialNumber: string,
             productId: number,
             productVersion: number,
             serviceKey: string,
             deviceLTPK: string,
             deviceLTSK: string) {
    console.log('SimulatorService.initialize');

    if (! this.uninitialized()) {
      this.disconnect();
      this.status = SimulatorStatus.UNINITIALIZED;
    }

    this.status = SimulatorStatus.INITIALIZING;
    const serverLTPK = Convert.base642bin(serviceKey);
    const getter = new XcpLTSKGetterImpl(deviceLTPK, deviceLTSK);
    const cipher = new XcpClientCipherProductImpl(productId, productVersion, getter, serverLTPK);
    const codec = XcpFrameCodecType.NOT_CRYPT;
    this.client = new XcpClientImpl(serialNumber, productId, productVersion, cipher, codec);
    this.client.addQueryHandler(GET_PROPERTIES_METHOD, (query) => this.getProperties(query));
    this.client.addQueryHandler(SET_PROPERTIES_METHOD, (query) => this.setProperties(query));
    this.client.addQueryHandler(INVOKE_ACTION_METHOD, (query) => this.invokeAction(query));
    this.did = this.client.getDeviceId();

    this.loadInstance(productId, productVersion)
      .then(x => {
        this.device = x;
        this.status = SimulatorStatus.INITIALIZED;
        this.status = SimulatorStatus.DISCONNECTED;
      })
      .catch(e => {
        this.status = SimulatorStatus.INITIALIZE_FAILED;
        console.error('loadInstance error: ', e);
      });
  }

  connect(host: string, port: number, uri: string): Promise<void> {
    if (this.client == null) {
      throw new Error('client not create!');
    }

    this.status = SimulatorStatus.CONNECTING;
    return this.client.connect(host, port, uri)
      .then(x => {
        console.log('connect to xcp server ok!');
        this.status = SimulatorStatus.CONNECTED;
        if (this.timer == null) {
          this.timer = setInterval(() => this.doKeepalive(), 1000 * 30);
        }

        return x;
      });
  }

  disconnect(): void {
    if (this.client == null) {
      throw new Error('client not create!');
    }

    this.status = SimulatorStatus.DISCONNECTING;
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.status = SimulatorStatus.DISCONNECTED;

    return this.client.disconnect();
  }

  notifyService(iid: number) {
    if (this.device == null || this.client == null) {
      throw new Error('device or client not create!');
    }

    const service = this.device.services.get(iid);
    if (service == null) {
      throw new Error('service not found!');
    }

    const properties = service.getProperties().filter(x => x.value.isChanged);
    const operations = properties.map(x => {
      const o = new PropertyOperation();
      o.pid = new PID(this.did, iid, x.iid);
      o.value = x.value.currentValue.getObjectValue();
      return o;
    });

    if (operations.length === 0) {
      return;
    }

    this.client.sendQuery(new QueryPropertiesChanged(this.client.getNextId(), '', operations))
      .then(result => {
        if (result instanceof ResultPropertiesChanged) {
          result.properties.forEach(x => {
            console.log(x.pid.toString() + ' => status: ' + x.status);
            const property = service.properties.get(x.pid.iid);
            property.status = x.status;
            property.description = x.description;
          });
        }
      })
      .catch(e => {
        console.log('send properties changed failed: ', e);
      });
  }

  notifyProperty(siid: number, piid: number) {
    if (this.device == null || this.client == null) {
      throw new Error('device or client not create!');
    }

    const service = this.device.services.get(siid);
    if (service == null) {
      throw new Error('service not found!');
    }

    const p = service.properties.get(piid);
    if (p == null) {
      throw new Error('property not found!');
    }

    const properties = [p];
    const operations = properties.map(x => {
      const o = new PropertyOperation();
      o.pid = new PID(this.did, siid, piid);
      o.value = x.value.currentValue.getObjectValue();
      return o;
    });

    this.client.sendQuery(new QueryPropertiesChanged(this.client.getNextId(), '', operations))
      .then(result => {
        if (result instanceof ResultPropertiesChanged) {
          result.properties.forEach(x => {
            console.log(x.pid.toString() + ' => status: ' + x.status);
            const property = service.properties.get(x.pid.iid);
            property.status = x.status;
            property.description = x.description;
          });
        }
      })
      .catch(e => {
        console.log('send properties changed failed: ', e);
      });
  }

  sendEvent(siid: number, eiid: number) {
    if (this.device == null || this.client == null) {
      throw new Error('device or client not create!');
    }


    const service = this.device.services.get(siid);
    if (service == null) {
      throw new Error('service not found!');
    }

    const event = service.events.get(eiid);
    if (event == null) {
      throw new Error('event not found!');
    }

    this.client.sendQuery(new QueryEventOccurred(this.client.getNextId(), '', operations))
      .then(result => {
        if (result instanceof ResultPropertiesChanged) {
          result.properties.forEach(x => {
            console.log(x.pid.toString() + ' => status: ' + x.status);
            const property = service.properties.get(x.pid.iid);
            property.status = x.status;
            property.description = x.description;
          });
        }
      })
      .catch(e => {
        console.log('send properties changed failed: ', e);
      });
  }

  private loadInstance(productId: number, productVersion: number): Promise<DeviceOperable> {
    console.log('loadInstance: ', productId + '/' + productVersion);
    const url = 'http://geekool.cn/dd/instance/product/' + productId + '/version/' + productVersion;
    return this.http.get(url).toPromise().then(x => DeviceCodec.decodeOperable(x));
  }

  private getProperties(query: IQQuery): void {
    if (this.device == null || this.client == null) {
      throw new Error('device or client not create!');
    }

    if (query instanceof QueryGetProperties) {
      this.device.tryRead(query.properties);
      this.client.sendResult(query.result());
    } else {
      this.client.sendError(query.error(OperationStatus.UNDEFINED, 'invalid query'));
    }
  }

  private setProperties(query: IQQuery): void {
    if (this.device == null || this.client == null) {
      throw new Error('device or client not create!');
    }

    if (query instanceof QuerySetProperties) {
      this.device.tryWrite(query.properties, true);
      this.client.sendResult(query.result());
    } else {
      this.client.sendError(query.error(OperationStatus.UNDEFINED, 'invalid query'));
    }
  }

  private invokeAction(query: IQQuery): void {
    if (this.device == null || this.client == null) {
      throw new Error('device or client not create!');
    }

    if (query instanceof QueryInvokeAction) {
      this.device.tryInvoke(query.operation);
      this.client.sendResult(query);
    } else {
      this.client.sendError(query.error(OperationStatus.UNDEFINED, 'invalid query'));
    }
  }

  private doKeepalive(): void {
    if (this.client == null) {
      throw new Error('client not create!');
    }

    this.client.sendQuery(new QueryPing(this.client.getNextId()))
      .then(x => {
        console.log('recv pong: ', x.id);
      })
      .catch(e => {
        console.log('ping failed: ', e);
      });
  }
}
