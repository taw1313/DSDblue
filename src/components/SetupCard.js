import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Footer,
  Icon,
  Right,
} from 'native-base';

import CompanyHeader from './CompanyHeader';
import {
  connectToBleDevice,
  scanForDevices,
  stopScanForDevices,
} from '../device/Bluetooth';

const lightingFront = {
  grouping: 'lighting',
  description: 'front',
};

const lightingChassis = {
  grouping: 'lighting',
  description: 'chassis',
};

const twoChannelDSDrelay = {
  id: '',
  localName: 'DSD Relay',
  SUUID: '0000ffe0-0000-1000-8000-00805f9b34fb',
  CUUID: '0000ffe1-0000-1000-8000-00805f9b34fb',
  grouping: 'lighting',
  channels: [
    {on: '0xA00101A2', off: '0xA00100A1', ctlFunction: 'front'},
    {on: '0xA00201A3', off: '0xA00200A2', ctlFunction: 'chassis'},
  ],
};

function SetupCard({
  addToAssignedDevices,
  assignedDevices,
  manager,
  remFromAssignedDevices,
  returnToMain,
}) {
  const [dataObj, setDataObj] = useState({key: '', devices: []});

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const addDevice = (dev) => {
    //
    // only add unique devices that are not either assigned or unassigned
    //
    let likeAssignedDevices = assignedDevices.filter((d) => d.id === dev.id);
    if (!Array.isArray(likeAssignedDevices) || !likeAssignedDevices.length) {
      let likeDevices = dataObj.devices.filter((d) => d.id === dev.id);
      if (!Array.isArray(likeDevices) || !likeDevices.length) {
        //
        // ToDo: Need to determine if I can pull SUUID, CUUID, and channels from the device data
        //       For now I am forcing this data
        //
        // due to the device object complexity one can not use a spread operator
        // to set/change the state
        //
        let tmpDevices = dataObj.devices;
        dev.SUUID = '';
        dev.CUUID = '';
        dev.grouping = '';
        dev.channels = [
          {on: '', off: '', ctlFunction: ''},
          {on: '', off: '', ctlFunction: ''},
        ];
        tmpDevices.push(dev);
        const newKey = Date.now();
        setDataObj({key: newKey, devices: tmpDevices});
      }
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    scanForDevices(manager, addDevice);
    return () => {
      stopScanForDevices(manager);
    };
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const addBleDevice = (event, id) => {
    console.log('called addBleDevice()');
    let tmpDevices = dataObj.devices;
    let indexOfDev = tmpDevices.findIndex((d) => d.id === id);
    //
    // ToDo:  Add logic to assign functionality via a Model pop up or add to hamburger
    //        For now if localName === 'DSD Relay'
    //
    if (tmpDevices[indexOfDev].localName === 'DSD Relay') {
      tmpDevices[indexOfDev].SUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
      tmpDevices[indexOfDev].CUUID = '0000ffe1-0000-1000-8000-00805f9b34fb';
      tmpDevices[indexOfDev].grouping = 'lighting';
      tmpDevices[indexOfDev].channels = [
        {on: '0xA00101A2', off: '0xA00100A1', ctlFunction: 'front'},
        {on: '0xA00201A3', off: '0xA00200A2', ctlFunction: 'chassis'},
      ];
    }

    let indexOfPropDevices = assignedDevices.findIndex((p) => p.id === id);
    console.log('addBleDevice() ', indexOfPropDevices);
    //
    // only add if does not exist in list from main
    //
    if (indexOfPropDevices < 0) {
      addToAssignedDevices(tmpDevices[indexOfDev]);
      const newDevices = dataObj.devices.filter(
        (d) => d.id !== tmpDevices[indexOfDev].id,
      );
      const newKey = Date.now();
      setDataObj({key: newKey, devices: newDevices});
      // connectToBleDevice( d )
    } else {
      console.log(
        'ERROR - failed to added device ',
        dataObj.devices[indexOfDev].localName,
      );
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const remBleDevice = (event, localName) => {
    let deviceToRem = assignedDevices.filter((d) => d.localName === localName);
    if (deviceToRem.length === 1) {
      remFromAssignedDevices(deviceToRem[0]);
    } else {
      console.log('ERROR - failed to added device ', localName);
    }
    // connectToBleDevice( d )
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const setBeforeReturnToMain = () => {
    returnToMain(dataObj.devices);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <Container>
      <CompanyHeader
        menuAvailable={true}
        iconName={'arrow-back'}
        leftHeaderFunction={returnToMain}
      />
      <Content>
        <Card>
          {assignedDevices.map((d, i) => (
            <CardItem key={`selIndex${i}`}>
              <Content contentContainerStyle={styles.contentContainer}>
                <Text>{d.localName}</Text>
              </Content>
              <Right>
                <Button
                  small
                  light
                  name={`${i}`}
                  onPress={(event) => remBleDevice(event, d.localName)}>
                  <Icon name="remove" />
                </Button>
              </Right>
            </CardItem>
          ))}
        </Card>
        <Card>
          {dataObj.devices.map((d, i) => (
            <CardItem key={`devIndex${i}`}>
              <Content contentContainerStyle={styles.contentContainer}>
                <Text>{d.localName}</Text>
              </Content>
              <Right>
                <Button
                  small
                  light
                  name={`${i}`}
                  onPress={(event) => addBleDevice(event, d.id)}>
                  <Icon name="add" />
                </Button>
              </Right>
            </CardItem>
          ))}
        </Card>
      </Content>
      <Footer>
        <View style={styles.colContainer}>
          <View style={styles.rowContainer}>
            <View style={styles.introView}>
              <Text style={styles.introTxt}>
                {' '}
                Scanning for Bluetooth devices{' '}
              </Text>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      </Footer>
    </Container>
  );
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
  contentContainer: {
    flexGrow: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C3C3C3',
  },
});

export default SetupCard;
