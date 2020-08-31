import {PropertyOperation, Status} from 'xiot-core-spec-ts';

function P10_On_doGet(o: PropertyOperation) {
    o.value = false;
    console.log('P10_On_doGet: ', o.value);
}

export function S9_Switch_doGet(o: PropertyOperation) {
    if (o.pid == null) {
        return;
    }

    switch (o.pid.iid) {
        case 10:
            P10_On_doGet(o);
            break;

        default:
            o.status = Status.PROPERTY_NOT_FOUND;
            break;
    }
}
