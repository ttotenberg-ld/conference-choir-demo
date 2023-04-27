import {v4 as uuidv4} from 'uuid';
import ls from 'local-storage';

function getDeviceKey() {
  let id;
  if (ls.get('LD_Device_Key')) {
    id = ls.get('LD_Device_Key');
  } else {
    id = uuidv4();
    ls.set('LD_Device_Key', id)
  }
  return id;
}

export default getDeviceKey;