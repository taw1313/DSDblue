import React, {Component} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Container, Content} from 'native-base';
// import Permissions from 'react-native-permissions'
import CompanyHeader from '../CompanyHeader';

class AndroidAuth extends Component {
  state = {
    accessState: false,
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async checkForPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'DSDblue',
          message:
            'Android requires access to your location to allow Bluetooth control.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({accessState: true});
      } else {
        this.setState({accessState: false});
      }
      this.props.changeState(this.state.accessState);
    } catch (err) {
      console.warn(err);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async componentDidMount() {
    await this.checkForPermission();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render() {
    return (
      <Container>
        <CompanyHeader menuAvailable={false} />

        <Content contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.introView}>
            <Text style={styles.introTxt}>
              {' '}
              Checking Android for Bluetooth authorization...
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

export default AndroidAuth;
