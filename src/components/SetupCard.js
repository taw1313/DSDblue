import React from 'react'
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native'
import {Button, Card, CardItem, Container, Content, Footer, Icon, Right} from 'native-base'

import CompanyHeader from './CompanyHeader'
import {connectToBleDevice, scanForDevices} from '../device/Bluetooth'

const lightingFront = {
  grouping: 'lighting',
  description: 'front'
}

const lightingChassis = {
  grouping: 'lighting',
  description: 'chassis'
}

const twoChannelDSDrelay = {
  id: '',
  localName: 'DSD Relay',
  SUUID: "0000ffe0-0000-1000-8000-00805f9b34fb",
  CUUID: "0000ffe1-0000-1000-8000-00805f9b34fb",
  grouping: 'lighting',
  channels: [
    { on: '0xA00101A2', off: '0xA00100A1', ctlFunction: 'front' },
    { on: '0xA00201A3', off: '0xA00200A2', ctlFunction: 'chassis' }
  ]
}


class SetupCard extends React.Component {

  state = {
      devices: []
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  addDevice = (dev) => {
    let currentDevices = this.state.devices

    //
    // only add unique devices that are not either assigned or unassigned
    //
    let likeAssignedDevices = this.props.assignedDevices.filter( d => d.id === dev.id )
    if( !Array.isArray(likeAssignedDevices) || !likeAssignedDevices.length ) {
      let likeDevices = currentDevices.filter( d => d.id === dev.id )
      if( !Array.isArray(likeDevices) || !likeDevices.length ) {
        //
        // ToDo: Need to determine if I can pull SUUID, CUUID, and channels from the device data
        //       For now I am forcing this data
        //
          currentDevices.push({
            id: dev.id,
            localName: dev.localName,
            SUUID: '',
            CUUID: '',
            grouping: '',
            channels: [
              { on: '', off: '', ctlFunction: '' },
              { on: '', off: '', ctlFunction: '' }
            ]
          })
          this.setState({devices: currentDevices})
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  componentWillMount() {
    scanForDevices( this.props.manager, this.addDevice )
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  addBleDevice = (event, id) => {
    let devices = this.state.devices
    let indexOfDev = devices.findIndex( d => d.id === id)
    //
    // ToDo:  Add logic to assign functionality via a Model pop up or add to hamburger
    //        For now if localName === 'DSD Relay'
    //
    if ( devices[indexOfDev].localName === 'DSD Relay') {
      devices[indexOfDev].SUUID= '0000ffe0-0000-1000-8000-00805f9b34fb'
      devices[indexOfDev].CUUID= '0000ffe1-0000-1000-8000-00805f9b34fb'
      devices[indexOfDev].grouping = 'lighting'
      devices[indexOfDev].channels = [
          { on: '0xA00101A2', off: '0xA00100A1', ctlFunction: 'front' },
          { on: '0xA00201A3', off: '0xA00200A2', ctlFunction: 'chassis' }
        ]
    }

    let indexOfPropDevices = this.props.assignedDevices.findIndex( p => p.id === id)
    //
    // only add if does not exist in list from main
    //
    if ( indexOfPropDevices < 0 ) {
        this.props.addToAssignedDevices( devices[indexOfDev] )
        devices = devices.filter( d => d.id !== devices[indexOfDev].id )
        this.setState({ devices })
      // connectToBleDevice( d )
    }
    else console.log('ERROR - failed to added device ', devices[indexOfDev].localName)

  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  remBleDevice = (event, localName) => {
      let deviceToRem = this.props.assignedDevices.filter( d => d.localName === localName )
      if (deviceToRem.length === 1) {
        this.props.remFromAssignedDevices( deviceToRem[0] )
      }
      else console.log('ERROR - failed to added device ', localName)
      // connectToBleDevice( d )
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setBeforeReturnToMain = () => {

    this.props.returnToMain( this.state.devices )

  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render() {
    return(
      <Container>
        <CompanyHeader menuAvailable={true} iconName={'arrow-back'} leftHeaderFunction={this.props.returnToMain} />
        <Content>
          <Card>
            {this.props.assignedDevices.map( (d, i) => (
              <CardItem key={`selIndex${i}`}>
                <Content contentContainerStyle={{ flexGrow: 1 }}>
                  <Text>{d.localName}</Text>
                </Content>
                <Right>
                  <Button small light name={`${i}`} onPress={ (event) => this.remBleDevice(event, d.localName)}>
                    <Icon name='remove'/>
                  </Button>
                </Right>
              </CardItem>
            ))}
          </Card>
          <Card>
            {this.state.devices.map( (d, i) => (
              <CardItem key={`devIndex${i}`}>
                <Content contentContainerStyle={{ flexGrow: 1 }}>
                  <Text>{d.localName}</Text>
                </Content>
                <Right>
                  <Button small light name={`${i}`} onPress={ (event) => this.addBleDevice(event, d.id)}>
                    <Icon name='add'/>
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
              <Text style={styles.introTxt}> Scanning for Bluetooth devices </Text>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
        </Footer>
      </Container>
    )
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
    backgroundColor: '#C3C3C3'
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C3C3C3'
  }
})

export default SetupCard