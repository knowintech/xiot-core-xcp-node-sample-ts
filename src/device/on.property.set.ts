import {PropertyOperation, Status} from 'xiot-core-spec-ts';
import {S1_AccessoryInformation_doSet} from './S1_AccessoryInformation_doSet';
import {S9_Switch_doSet} from './S9_Switch_doSet';
import {S12_Switch_doSet} from './S12_Switch_doSet';

export function setProperty(o: PropertyOperation): void {
    if (o.pid == null) {
        return;
    }

    switch (o.pid.siid) {
        case 1:
            S1_AccessoryInformation_doSet(o);
            break;

        case 9:
            S9_Switch_doSet(o);
            break;

        case 12:
            S12_Switch_doSet(o);
            break;

        default:
            o.status = Status.SERVICE_NOT_FOUND;
            break;
    }
}
