import {PropertyOperation, OperationStatus} from 'xiot-core-spec-ts';

function P10_On_doSet(o: PropertyOperation) {
    console.log('P10_On_doSet: ', o.value);
}

export function S1_AccessoryInformation_doSet(o: PropertyOperation) {
    if (o.pid == null) {
        return;
    }

    switch (o.pid.iid) {
        case 2:
            break;

        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
            o.status = OperationStatus.PROPERTY_CANNOT_WRITE;
            break;

        default:
            o.status = OperationStatus.PROPERTY_NOT_FOUND;
            break;
    }
}
