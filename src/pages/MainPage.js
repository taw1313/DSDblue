import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {Container, Content} from 'native-base';
import {BleManager} from 'react-native-ble-plx';

import CompanyHeader from '../components/CompanyHeader';
import LightingControls from '../components/LightingControls';
import SetupCard from '../components/SetupCard';
import {
  checkStateAndConnect,
  connectToBleDevice,
  scanAndConnect,
  sendOnToBluetooth,
  sendOffToBluetooth,
  disconnectFromBleDevice,
} from '../device/Bluetooth';
import {
  readBleDevicesFromStorage,
  removeBleDevicesFromStorage,
  writeBleDevicesFromStorage,
} from '../device/asyncStorage';

import allOffImg from '../images/classC.png';
import frontOffUnderOnImg from '../images/classCfOffUon.png';
import frontOnUnderOffImg from '../images/classCfOnUoff.png';
import allOnImg from '../images/classCfOnUon.png';

function MainPage({osType, accessBluetooth}) {
  const [aIsOn, setAIsOn] = useState(false);
  const [bIsOn, setBIsOn] = useState(false);
  const [devices, setDevices] = useState([]);
  const [image, setImage] = useState(allOffImg);
  const [manager, setManager] = useState();
  const [userSelectedSetup, setUserSelectedSetup] = useState(false);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (accessBluetooth) {
      setManager(new BleManager());
    }
  }, [accessBluetooth]);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (manager === undefined) {
      return;
    }
    console.log('DEBUG - MainPage.js before checkStateAndConnect() ');
    checkStateAndConnect(manager)
      .then((device) => {
        console.log(
          'DEBUG - MainPage.js after checkStateAndConnect() ',
          device,
        );

        console.log('DEBUG - MainPage.js before readBleDevicesFromStorage() ');
        readBleDevicesFromStorage()
          .then((unconfirmedDevices) => {
            console.log(
              'DEBUG - MainPage.js after readBleDevicesFromStorage() ',
              unconfirmedDevices[0],
            );
            //
            // ToDo: Need support for multiple BLE devices
            //
            unconfirmedDevices.forEach((dev) => {
              scanAndConnect(manager, dev).then(() => {
                setDevices((oldDevices) => [...oldDevices, dev]);
              });
            });
          })
          .catch((err) => console.log('ERROR - ', err));
        console.log(
          'DEBUG - MainPage.js after readBleDevicesFromStorage() outside of promise',
        );
      })
      .catch((err) => console.log('ERROR - ', err));

    /*
    checkStateAndConnect( manager )
      .then( (device) => {
        // need to review let devices = this.state.devices
        console.log('DEBUG - MainPage.js after checkStateAndConnect() ', device)
        // need to review devices.push(device)
        // need to review this.setState({ devices, deviceId: device.id })
      })
      .catch( (err) => console.log('ERROR - ', err))
      */
  }, [manager]);

  /////////////////////////////////////////////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////
  const setSwitchOnA = () => {
    let devLightChannelA = devices.filter((d) => d.grouping === 'lighting');

    sendOnToBluetooth(manager, devLightChannelA[0].id, 0);
    setImage(bIsOn ? allOnImg : frontOnUnderOffImg);
    setAIsOn(true);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setSwitchOffA = () => {
    let devLightChannelA = devices.filter((d) => d.grouping === 'lighting');

    sendOffToBluetooth(manager, devLightChannelA[0].id, 0);
    setImage(bIsOn ? frontOffUnderOnImg : allOffImg);
    setAIsOn(false);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setSwitchOnB = () => {
    let devLightChannelB = devices.filter((d) => d.grouping === 'lighting');

    sendOnToBluetooth(manager, devLightChannelB[0].id, 1);
    setImage(aIsOn ? allOnImg : frontOffUnderOnImg);
    setBIsOn(true);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setSwitchOffB = () => {
    let devLightChannelB = devices.filter((d) => d.grouping === 'lighting');

    sendOffToBluetooth(manager, devLightChannelB[0].id, 1);
    setImage(aIsOn ? frontOnUnderOffImg : allOffImg);
    setBIsOn(false);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setUpDeviceAssignment = () => setUserSelectedSetup(true);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const returnToMain = () => {
    manager.stopDeviceScan();
    setUserSelectedSetup(false);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const addToAssignedDevices = (dev) => {
    // remove addToAssignedDevices = (dev, functionName) => {
    //
    // assign the function to the device
    //
    // remove let functions = this.state.functions
    // remove let indexOfFun = functions.findIndex( f => f.name === functionName)
    // remove functions[indexOfFun].deviceId = dev.id
    //
    // add the device to list of assigned devices
    //
    console.log('DEBUG - MainPage.js addToAssignedDevices() ', dev.localName);
    // TAW was using this -> scanAndConnect(manager, dev)
    connectToBleDevice(dev)
      .then(() => {
        let localDevices = devices;
        localDevices.push(dev);
        console.log(
          'DEBUG - MainPage.js addToAssignedDevices() success devices',
          localDevices[0],
        );
        //
        // clear all devices from storage before writing
        //
        removeBleDevicesFromStorage().then(() => {
          writeBleDevicesFromStorage(localDevices);
          console.log(
            'DEBUG - MainPage.js after writeBleDevicesFromStorage() ',
          );
        });
        setDevices(localDevices);
      })
      .catch(() => {
        // console.log('ERROR - failed to connect to dev ', dev);
      });
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const remFromAssignedDevices = (dev) => {
    // remove remFromAssignedDevices = (dev, functionName) => {
    //
    // remove the device from the function
    //
    // remove let functions = this.state.functions
    // remove let indexOfFun = functions.findIndex( f => f.name === functionName)
    // remove functions[indexOfFun].deviceId = ''
    //
    // remove the device from list of assigned devices
    //
    disconnectFromBleDevice(manager, dev.id).catch((err) =>
      console.log('DEBUG - failed to disconnect ', err),
    );

    let localDevices = devices.filter((d) => d.id !== dev.id);
    //
    // clear all devices from storage before writing
    //
    removeBleDevicesFromStorage().then(() => {
      writeBleDevicesFromStorage(localDevices);
      console.log('DEBUG - MainPage.js after writeBleDevicesFromStorage() ');
    });
    setDevices(localDevices);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  console.log('DEBUG - MainPage.js render() devices', devices);
  if (userSelectedSetup) {
    return (
      <SetupCard
        manager={manager}
        assignedDevices={devices}
        addToAssignedDevices={addToAssignedDevices}
        remFromAssignedDevices={remFromAssignedDevices}
        returnToMain={returnToMain}
      />
    );
  } else {
    return (
      <Container>
        <CompanyHeader
          menuAvailable={true}
          leftHeaderFunction={setUpDeviceAssignment}
        />
        <Content contentContainerStyle={styles.mainBody}>
          <View style={styles.rowContainer}>
            <View style={styles.colContainer}>
              <ImageBackground style={styles.backGrdImage} source={allOffImg}>
                <Image style={styles.image} source={image} />
              </ImageBackground>
            </View>
          </View>

          {devices.map((d, i) => {
            if (d.grouping === 'lighting' && d.id !== '') {
              return (
                <LightingControls
                  key={`lightIndex${i}`}
                  setSwitchOnA={setSwitchOnA}
                  setSwitchOffA={setSwitchOffA}
                  setSwitchOnB={setSwitchOnB}
                  setSwitchOffB={setSwitchOffB}
                />
              );
            }
          })}
        </Content>
      </Container>
    );
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////
const styles = StyleSheet.create({
  colContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#C3C3C3',
  },
  mainBody: {
    flexGrow: 1,
    backgroundColor: '#C3C3C3',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 50,
    backgroundColor: '#C3C3C3',
  },
  backGrdImage: {
    flex: 1,
    resizeMode: 'contain',
    width: 350,
    height: 200,
  },
  image: {
    width: 350,
    height: 200,
  },
});

export default MainPage;
