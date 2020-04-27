import {XcpLTSKGetter, KeyPair, Base642Bin} from 'xiot-core-xcp-ts';

export class IotLtskGetterImpl implements XcpLTSKGetter {

  private k: KeyPair;

  constructor(private pk: string,
              private sk: string) {
    this.k = new KeyPair(Base642Bin(pk), Base642Bin(sk));
  }

  getDeviceKeypair(deviceId: string): KeyPair {
    return this.k;
  }

  getProductKeyPair(productId: number, productVersion: number): KeyPair {
    return this.k;
  }

  getTypeKeyPair(deviceType: string): KeyPair {
    return this.k;
  }
}
