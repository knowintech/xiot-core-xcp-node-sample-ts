import {Convert} from 'mipher';
import {XcpLTSKGetter} from 'xiot-core-xcp-ts/dist/xiot/core/xcp/XcpLTSKGetter';
import {KeyPair} from 'xiot-core-xcp-ts/dist/xiot/core/xcp/KeyPair';

export class XcpLTSKGetterImpl implements XcpLTSKGetter {

  private k: KeyPair;

  constructor(private pk: string,
              private sk: string) {
    this.k = new KeyPair(Convert.base642bin(pk), Convert.base642bin(sk));
  }

  getDeviceKeypair(deviceId: string): KeyPair {
    return this.k;
  }

  getProductKeyPair(productId: number, productVersion: number): KeyPair {
    return this.k;
  }
}
