import {PropertyOperation, Status} from 'xiot-core-spec-ts';
import {S1_AccessoryInformation_doGet} from './S1_AccessoryInformation_doGet';
import {S9_Switch_doGet} from './S9_Switch_doGet';
import {S12_Switch_doGet} from './S12_Switch_doGet';

export function getProperty(o: PropertyOperation): void {
    if (o.pid == null) {
        return;
    }

    switch (o.pid.siid) {
        case 1:
            S1_AccessoryInformation_doGet(o);
            break;

        case 9:
            S9_Switch_doGet(o);
            break;

        case 12:
            S12_Switch_doGet(o);
            break;

        default:
            o.status = Status.SERVICE_NOT_FOUND;
            break;
    }
}
