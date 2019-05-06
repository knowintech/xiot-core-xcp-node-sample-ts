import {Convert} from 'mipher';
import {XcpLTSKGetter} from 'xiot-core-xcp-node-ts/dist/xiot/core/xcp/XcpLTSKGetter';
import {KeyPair} from 'xiot-core-xcp-node-ts/dist/xiot/core/xcp/KeyPair';

export class XcpLTSKGetterImpl implements XcpLTSKGetter {

  private k: KeyPair;

  constructor() {
    const publicKey = '2DJhApI/GKMsNZ6RR+ttn6TOEz53MPuwsSeFu9YvYu4=';
    const privateKey = 'Cy/HZRcyrCK5h6OhBc6hMFXN1q0x+p8tu+bcYODkSJc=';
    this.k = new KeyPair(Convert.base642bin(publicKey), Convert.base642bin(privateKey));
  }

  getDeviceKeypair(deviceId: string): KeyPair {
    return this.k;
  }

  getProductKeyPair(productId: number, productVersion: number): KeyPair {
    return this.k;
  }
}
