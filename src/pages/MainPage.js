import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {Container, Content} from 'native-base';
import {BleManager} from 'react-native-ble-plx';

import CompanyHeader from '../components/CompanyHeader';
import LightingControls from '../components/LightingControls';
import SetupCard from '../components/SetupCard';
import {
  checkStateAndConnect,
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

class MainPage extends React.Component {
  state = {
    devices: [],
    manager: new BleManager(),
    image: allOffImg,
    aIsOn: false,
    bIsOn: false,
    userSelectedSetup: false,
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  componentWillMount() {
    console.log('DEBUG - MainPage.js before checkStateAndConnect() ');
    checkStateAndConnect(this.state.manager)
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
              scanAndConnect(this.state.manager, dev).then(() => {
                let devices = this.state.devices;
                devices.push(dev);
                this.setState({devices});
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
    checkStateAndConnect( this.state.manager )
      .then( (device) => {
        // need to review let devices = this.state.devices
        console.log('DEBUG - MainPage.js after checkStateAndConnect() ', device)
        // need to review devices.push(device)
        // need to review this.setState({ devices, deviceId: device.id })
      })
      .catch( (err) => console.log('ERROR - ', err))
      */
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setSwitchOnA = () => {
    let devLightChannelA = this.state.devices.filter(
      (d) => d.grouping === 'lighting',
    );

    sendOnToBluetooth(this.state.manager, devLightChannelA[0].id, 0);
    let image = frontOnUnderOffImg;
    let aIsOn = true;
    if (this.state.bIsOn) {
      image = allOnImg;
    }
    this.setState({image, aIsOn});
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setSwitchOffA = () => {
    let devLightChannelA = this.state.devices.filter(
      (d) => d.grouping === 'lighting',
    );

    sendOffToBluetooth(this.state.manager, devLightChannelA[0].id, 0);
    let image = allOffImg;
    let aIsOn = false;
    if (this.state.bIsOn) {
      image = frontOffUnderOnImg;
    }
    this.setState({image, aIsOn});
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setSwitchOnB = () => {
    let devLightChannelB = this.state.devices.filter(
      (d) => d.grouping === 'lighting',
    );

    sendOnToBluetooth(this.state.manager, devLightChannelB[0].id, 1);
    let image = frontOffUnderOnImg;
    let bIsOn = true;
    if (this.state.aIsOn) {
      image = allOnImg;
    }
    this.setState({image, bIsOn});
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setSwitchOffB = () => {
    let devLightChannelB = this.state.devices.filter(
      (d) => d.grouping === 'lighting',
    );

    sendOffToBluetooth(this.state.manager, devLightChannelB[0].id, 1);
    let image = allOffImg;
    let bIsOn = false;
    if (this.state.aIsOn) {
      image = frontOnUnderOffImg;
    }
    this.setState({image, bIsOn});
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setUpDeviceAssignment = () => {
    this.setState({userSelectedSetup: true});
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  returnToMain = () => {
    this.state.manager.stopDeviceScan();
    this.setState({userSelectedSetup: false});
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  addToAssignedDevices = (dev) => {
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
    console.log('DEBUG - MainPage.js addToAssignedDevices() ', dev);
    scanAndConnect(this.state.manager, dev)
      .then(() => {
        let devices = this.state.devices;
        devices.push(dev);
        console.log(
          'DEBUG - MainPage.js addToAssignedDevices() succ devices',
          devices[0],
        );
        //
        // clear all devices from storage before writing
        //
        removeBleDevicesFromStorage().then(() => {
          writeBleDevicesFromStorage(devices);
          console.log(
            'DEBUG - MainPage.js after writeBleDevicesFromStorage() ',
          );
        });

        this.setState({devices});
      })
      .catch(() => {
        console.log('ERROR - failed to connect to dev ', dev);
      });
    // remove this.setState({devices, functions})
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  remFromAssignedDevices = (dev) => {
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
    disconnectFromBleDevice(this.state.manager, dev.id).catch((err) =>
      console.log('DEBUG - failed to disconnect ', err),
    );

    let devices = this.state.devices.filter((d) => d.id !== dev.id);
    //
    // clear all devices from storage before writing
    //
    removeBleDevicesFromStorage().then(() => {
      writeBleDevicesFromStorage(devices);
      console.log('DEBUG - MainPage.js after writeBleDevicesFromStorage() ');
    });
    this.setState({devices});
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render() {
    console.log('DEBUG - MainPage.js render() devices', this.state.devices);
    if (this.state.userSelectedSetup) {
      return (
        <SetupCard
          manager={this.state.manager}
          assignedDevices={this.state.devices}
          addToAssignedDevices={this.addToAssignedDevices}
          remFromAssignedDevices={this.remFromAssignedDevices}
          returnToMain={this.returnToMain}
        />
      );
    } else {
      return (
        <Container>
          <CompanyHeader
            menuAvailable={true}
            iconName={'menu'}
            leftHeaderFunction={this.setUpDeviceAssignment}
          />

          <Content
            contentContainerStyle={{flexGrow: 1, backgroundColor: '#C3C3C3'}}>
            <View style={styles.rowContainer}>
              <View style={styles.colContainer}>
                <ImageBackground style={styles.backGrdImage} source={allOffImg}>
                  <Image style={styles.image} source={this.state.image} />
                </ImageBackground>
              </View>
            </View>

            {this.state.devices.map((d, i) => {
              if (d.grouping === 'lighting' && d.id !== '') {
                return (
                  <LightingControls
                    key={`lightIndex${i}`}
                    setSwitchOnA={this.setSwitchOnA}
                    setSwitchOffA={this.setSwitchOffA}
                    setSwitchOnB={this.setSwitchOnB}
                    setSwitchOffB={this.setSwitchOffB}
                  />
                );
              }
            })}
          </Content>
        </Container>
      );
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const styles = StyleSheet.create({
  colContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
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
