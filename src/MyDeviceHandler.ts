import {QueryGetProperties} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/basic/GetProperties';
import {QuerySetProperties} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/basic/SetProperties';
import {QueryInvokeAction} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/basic/InvokeAction';
import {XcpClient} from 'xiot-core-xcp-ts/src/xiot/core/xcp/XcpClient';
import {PropertyOperation} from 'xiot-core-spec-ts/dist/xiot/core/spec/typedef/operation/PropertyOperation';
import {ActionOperation} from 'xiot-core-spec-ts/dist/xiot/core/spec/typedef/operation/ActionOperation';
import {OperationStatus} from 'xiot-core-spec-ts/dist/xiot/core/spec/typedef/status/OperationStatus';

function getDeviceInformation(o: PropertyOperation) {
    if (o.pid == null) {
        return;
    }

    switch (o.pid.iid) {
        case 1:
            o.value = 'xiot';
            break;

        case 2:
            o.value = 'hub2018';
            break;

        case 3:
            o.value = '1';
            break;

        case 4:
            o.value = '0.0.1';
            break;

        default:
            o.status = OperationStatus.PROPERTY_NOT_FOUND;
            break;
    }
}

function getModbusController(o: PropertyOperation) {
    if (o.pid == null) {
        return;
    }

    switch (o.pid.iid) {
        case 1:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        case 2:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        case 3:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        case 4:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        default:
            o.status = OperationStatus.PROPERTY_NOT_FOUND;
            break;
    }
}

function getModbusUnitDefinitionManagement(o: PropertyOperation) {
    if (o.pid == null) {
        return;
    }

    switch (o.pid.iid) {
        case 1:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        case 2:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        case 3:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        case 4:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        case 5:
            o.value = 0;
            break;

        case 6:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        default:
            o.status = OperationStatus.PROPERTY_NOT_FOUND;
            break;
    }
}

function getModbusUnitManagement(o: PropertyOperation) {
    if (o.pid == null) {
        return;
    }

    switch (o.pid.iid) {
        case 1:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        case 2:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        case 3:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        case 4:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        case 5:
            o.value = 0;
            break;

        case 6:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        default:
            o.status = OperationStatus.PROPERTY_NOT_FOUND;
            break;
    }
}

function getModbusCollector(o: PropertyOperation) {
    if (o.pid == null) {
        return;
    }

    switch (o.pid.iid) {
        case 1:
            o.status = OperationStatus.PROPERTY_CANNOT_READ;
            break;

        case 2:
            o.value = 0;
            break;

        default:
            o.status = OperationStatus.PROPERTY_NOT_FOUND;
            break;
    }
}

function getProperty(o: PropertyOperation) {
    if (o.pid == null) {
        return;
    }

    switch (o.pid.siid) {
        case 1:
            getDeviceInformation(o);
            break;

        case 2:
            getModbusController(o);
            break;

        case 3:
            getModbusUnitDefinitionManagement(o);
            break;

        case 4:
            getModbusUnitManagement(o);
            break;

        case 5:
            getModbusCollector(o);
            break;

        default:
            o.status = OperationStatus.SERVICE_NOT_FOUND;
            break;
    }
}

function setProperty(o: PropertyOperation) {
    o.status = OperationStatus.COMPLETED;
}

function invoke(o: ActionOperation) {
    o.status = OperationStatus.COMPLETED;
}

export function getProperties(client: XcpClient, query: QueryGetProperties): void {
    query.properties.forEach(x => getProperty(x));
    client.sendResult(query.result());
}

export function setProperties(client: XcpClient, query: QuerySetProperties): void {
    query.properties.forEach(x => setProperty(x));
    client.sendResult(query.result());
}

export function invokeAction(client: XcpClient, query: QueryInvokeAction): void {
    invoke(query.operation);
    client.sendResult(query);
}

