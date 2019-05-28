import {PropertyOperation, OperationStatus} from 'xiot-core-spec-ts';

function P10_On_doSet(o: PropertyOperation) {
    console.log('P10_On_doSet: ', o.value);
}

export function S9_Switch_doSet(o: PropertyOperation) {
    if (o.pid == null) {
        return;
    }

    switch (o.pid.iid) {
        case 10:
            P10_On_doSet(o);
            break;

        default:
            o.status = OperationStatus.PROPERTY_NOT_FOUND;
            break;
    }
}
