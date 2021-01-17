import React, {Component} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import {Container, Content} from 'native-base';
import Permissions from 'react-native-permissions';
import CompanyHeader from '../CompanyHeader';

class IOSAuth extends Component {
  state = {
    blePermission: '',
  };

  componentDidMount() {
    console.log('DEBUG - IOSAuth componentDidMount()');
    Permissions.check('bluetooth').then((res) => {
      console.log(
        'DEBUG - IOSAuth componentDidMount() after Permissions.check() ',
        res,
      );
      if (res === 'authorized') {
        this.props.changeState(true);
      } else {
        this.iosAlertForBlePermission(res);
      }
    });
  }

  testFun = (txt) => {
    console.log(`DEBUG - ${txt} - was selected`);
  };

  iosAlertForBlePermission = (blePermission) => {
    console.log(
      'DEBUG - IOSAuth iosAlertForBLEPermission() before Alert() ',
      blePermission,
    );
    Alert.alert(
      'May we access your bluetooth devices?',
      'We need access so we may control external bluetooth devices',
      [
        {
          text: 'No way',
          onPress: () => {
            this.iosRequestPermission('No way');
          },
        },
        blePermission === 'undetermined'
          ? {
              text: 'OK',
              onPress: () => {
                this.iosRequestPermission('OK');
              },
            }
          : {
              text: 'Open Settings',
              onPress: () => {
                this.iosRequestPermission('Open Settings');
              },
            },
      ],
    );
  };

  iosRequestPermission = (txt) => {
    console.log(
      'DEBUG - IOSAuth iosRequestPermission() before Permissions() ',
      txt,
    );
    if (txt === 'OK') {
      console.log('DEBUG - OK - was selected');
      //Permissions.request('bluetooth')
      Permissions.check('bluetooth').then((res) => {
        this.setState({blePermission: res});
        console.log(
          'DEBUG - IOSAuth iosRequestPermission Permissions.request() res = ',
          res,
        );
        this.props.changeState(res);
      });
    } else if (txt === 'Open Settings') {
      console.log('DEBUG - Open Settings - was selected');
      Permissions.openSettings().then((res) => {
        this.setState({blePermission: res});
        console.log('DEBUG - Permissions.openSettings() res = ', res);
        this.props.changeState(res);
      });
    } else {
      console.log('DEBUG - No Way - was selected');
    }
  };

  render() {
    return (
      <Container>
        <CompanyHeader menuAvailable={false} />

        <Content contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.introView}>
            <Text style={styles.introTxt}>
              {' '}
              Checking IOS for Bluetooth authorization...
            </Text>
            <Text style={styles.introTxt}> Please wait</Text>
          </View>

          <ActivityIndicator size="large" color="#0000ff" />
        </Content>
      </Container>
    );
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C3C3C3',
  },
  introView: {
    margin: 20,
  },
  introTxt: {
    fontSize: 15,
    textAlign: 'center',
  },
});

export default IOSAuth;
