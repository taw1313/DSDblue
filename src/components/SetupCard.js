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
import {connectToBleDevice, scanForDevices} from '../device/Bluetooth';

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
  const [devices, setDevices] = useState([]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const addDevice = (dev) => {
    //
    // only add unique devices that are not either assigned or unassigned
    //
    let likeAssignedDevices = assignedDevices.filter((d) => d.id === dev.id);
    if (!Array.isArray(likeAssignedDevices) || !likeAssignedDevices.length) {
      let likeDevices = devices.filter((d) => d.id === dev.id);
      if (!Array.isArray(likeDevices) || !likeDevices.length) {
        //
        // ToDo: Need to determine if I can pull SUUID, CUUID, and channels from the device data
        //       For now I am forcing this data
        //
        console.log('add to DEVICES ', dev.localName);
        setDevices([
          ...devices,
          {
            id: dev.id,
            localName: dev.localName,
            SUUID: '',
            CUUID: '',
            grouping: '',
            channels: [
              {on: '', off: '', ctlFunction: ''},
              {on: '', off: '', ctlFunction: ''},
            ],
          },
        ]);
      }
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log('Start Scan for Devices!!!!!');
    scanForDevices(manager, addDevice);
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const addBleDevice = (event, id) => {
    let tmpDevices = devices;
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
    //
    // only add if does not exist in list from main
    //
    if (indexOfPropDevices < 0) {
      addToAssignedDevices(tmpDevices[indexOfDev]);
      tmpDevices = devices.filter((d) => d.id !== tmpDevices[indexOfDev].id);
      setDevices(tmpDevices);
      // connectToBleDevice( d )
    } else {
      console.log(
        'ERROR - failed to added device ',
        devices[indexOfDev].localName,
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
    returnToMain(devices);
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
          {devices.map((d, i) => (
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
