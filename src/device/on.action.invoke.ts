import {ActionOperation, OperationStatus} from 'xiot-core-spec-ts';

export function invokeActions(actions: ActionOperation[]) {
    actions.forEach(o => {
        o.status = OperationStatus.SERVICE_NOT_FOUND;
        o.description = 'service not found';
    });
}
