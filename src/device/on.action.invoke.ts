import {ActionOperation, OperationStatus} from 'xiot-core-spec-ts';

export function invokeAction(o: ActionOperation) {
    o.status = OperationStatus.SERVICE_NOT_FOUND;
    o.description = 'service not found';
}
