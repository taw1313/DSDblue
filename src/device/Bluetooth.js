import {encode as btoa} from 'base-64';

const SUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
const CUUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

const DEBUGMODE = false;

const hexToBase64 = (h) => {
  return btoa(
    h
      .replace(/0x/gi, '')
      .match(/\w{2}/g)
      .map(function (a) {
        return String.fromCharCode(parseInt(a, 16));
      })
      .join(''),
  );
};

let self = (module.exports = {
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  checkStateAndConnect: (manager) => {
    return new Promise((resolve, reject) => {
      if (DEBUGMODE) {
        let device = {
          id: '0',
        };
        resolve(device.id);
      }
      const subscription = manager.onStateChange((stateOfDev) => {
        console.log(
          'DEBUG - Bluetooth.js checkStateAndConnect() stateOfDev ',
          stateOfDev,
        );
        if (stateOfDev === 'PoweredOn') {
          /*  Moving this... need add logic if the phone's bluetooth stat is not "PoweredOn"
          self.scanAndConnect( manager )
            .then( (device) => resolve( device )  )
            .catch( (err) => reject('ERROR - could not connect ', err) )
          subscription.remove()
          */
          resolve('done');
        }
      }, true);
    });
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  scanAndConnect: (manager, dev) => {
    return new Promise((resolve, reject) => {
      manager.startDeviceScan(null, null, (error, bleDev) => {
        if (error) {
          // Handle error (scanning will be stopped automatically)
          console.log('ERROR - startDeviceScan()', error);
          return;
        }

        console.log(
          'DEBUG - Bluetooth.js scanAndConnect() ',
          bleDev.id,
          dev.id,
        );
        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (bleDev.id === dev.id) {
          // Stop scanning as it's not necessary if you are scanning for one device.
          manager.stopDeviceScan();

          // Proceed with connection.
          self
            .connectToBleDevice(bleDev)
            .then((device) => resolve(device))
            .catch((err) => reject('ERROR - could not connect ', err));
        }
      });
    });
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  connectToBleDevice: (bleDev) => {
    return new Promise((resolve, reject) => {
      bleDev
        .connect()
        .then((d) => {
          return d.discoverAllServicesAndCharacteristics();
        })
        .then((device) => {
          if (device.name === null || device.name.length < 2) {
            device.name = device.id;
          }
          if (device.localName === null || device.name.length < 2) {
            device.localName = device.name;
          }
          resolve(device);
        })
        .catch((err) => reject('ERROR - could not connect ', err));
    });
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  scanForDevices: (manager, addDevice) => {
    manager.startDeviceScan(null, null, (error, bleDev) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        console.log('ERROR - startDeviceScan()', error);
        return;
      }

      if (bleDev.name === null || bleDev.name.length < 2) {
        bleDev.name = bleDev.id;
      }
      if (bleDev.localName === null || bleDev.name.length < 2) {
        bleDev.localName = bleDev.name;
      }
      addDevice(bleDev);
    });
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  sendOnToBluetooth: (manager, devId, channel) => {
    let bV = [
      'oAEBog==', // 0xA00101A2 | oAEBog==
      'oAIBow==', // 0xA00201A3 | oAEBog==
    ];

    console.log(
      'DEBUG - test ',
      devId,
      bV[channel],
      hexToBase64('0xA00101A2'),
      hexToBase64('0xA00101A3'),
    );
    if (DEBUGMODE) {
      return 'Debug';
    }
    manager
      .writeCharacteristicWithoutResponseForDevice(
        devId,
        SUUID,
        CUUID,
        bV[channel],
      )
      .then((res) => {
        console.log('DEBUG - response after ON', res);
      })
      .catch((err) => {
        console.log('ERROR - after ON ', err);
      });
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  sendOffToBluetooth: (manager, devId, channel) => {
    let bV = [
      'oAEAoQ==', // 0xA00100A1 | oAEAoQ==
      'oAIAog==', // 0xA00200A2 | oAEAoQ==
    ];

    if (DEBUGMODE) {
      return 'Debug';
    }
    manager
      .writeCharacteristicWithoutResponseForDevice(
        devId,
        SUUID,
        CUUID,
        bV[channel],
      )
      .then((res) => {
        console.log('DEBUG - response after OFF', res);
      })
      .catch((err) => {
        console.log('ERROR - after OFF ', err);
      });
  },

  disconnectFromBleDevice: (manager, devId) => {
    return new Promise((resolve, reject) => {
      manager
        .cancelDeviceConnection(devId)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
});

//
// DEBUG - walk the device's services and characteristics
//
// DBG  manager.servicesForDevice( devId )
// DBG   .then( (res) => {
// DBG     console.log('DEBUG - services() ', res.length, res)
// DBG     for( let i=0; i<res.length; i++) {
// DBG       manager.characteristicsForDevice( devId, res[i].uuid )
// DBG         .then( (r) => {
// DBG           console.log(`DEBUG - characteristics(${res[i].uuid}) `, r)
// DBG         })
// DBG         .catch( (err) => {
// DBG           console.log(`ERROR - after characteristics(${res[i].uuid}) `, err)
// DBG         })
// DBG     }
// DBG   })
// DBG   .catch( (err) => {
// DBG     console.log('ERROR - after services() ', err)
// DBG   })
