import {PropertyOperation, Status} from 'xiot-core-spec-ts';

function P3_Manufacturer_doGet(o: PropertyOperation) {
    o.value = 'ouyang';
    console.log('P3_Manufacturer_doGet: ', o.value);
}

function P4_Model_doGet(o: PropertyOperation) {
    o.value = 's2019';
    console.log('P4_Model_doGet: ', o.value);
}

function P5_Name_doGet(o: PropertyOperation) {
    o.value = 'switch';
    console.log('P5_Name_doGet: ', o.value);
}

function P6_SerialNumber_doGet(o: PropertyOperation) {
    o.value = 'abc';
    console.log('P6_SerialNumber_doGet: ', o.value);
}

function P7_FirmwareRevision_doGet(o: PropertyOperation) {
    o.value = '0.0.9';
    console.log('P7_FirmwareRevision_doGet: ', o.value);
}

function P8_HardwareRevision_doGet(o: PropertyOperation) {
    o.value = '0.0.1';
    console.log('P8_HardwareRevision_doGet: ', o.value);
}

export function S1_AccessoryInformation_doGet(o: PropertyOperation) {
    if (o.pid == null) {
        return;
    }

    switch (o.pid.iid) {
        case 3:
            P3_Manufacturer_doGet(o);
            break;

        case 4:
            P4_Model_doGet(o);
            break;

        case 5:
            P5_Name_doGet(o);
            break;

        case 6:
            P6_SerialNumber_doGet(o);
            break;

        case 7:
            P7_FirmwareRevision_doGet(o);
            break;

        case 8:
            P8_HardwareRevision_doGet(o);
            break;

        default:
            o.status = Status.PROPERTY_NOT_FOUND;
            break;
    }
}
