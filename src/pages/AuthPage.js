import React, {useEffect} from 'react';
// TAW import {ActivityIndicator, PermissionsAndroid, StyleSheet, Text, View} from 'react-native'
import {StyleSheet, Text, View} from 'react-native';
import {Container, Content} from 'native-base';
// TAW import Permissions from 'react-native-permissions'
import CompanyHeader from '../components/CompanyHeader';
import AndroidAuth from '../components/bleSupport/AndroidAuth';
import IOSAuth from '../components/bleSupport/IOSAuth';

function AuthPage({osType, changeState}) {
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log('DEBUG - within useEffect() props OS type ', osType);
  }, [osType]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (osType === 'android') {
    return (
      <Container>
        <AndroidAuth osType={osType} changeState={changeState} />
      </Container>
    );
  } else if (osType === 'ios') {
    return (
      <Container>
        <IOSAuth osType={osType} changeState={changeState} />
      </Container>
    );
  } else {
    return (
      <Container>
        <CompanyHeader menuAvailable={false} />

        <Content contentContainerStyle={styles.introCnt}>
          <View style={styles.introView}>
            <Text style={styles.introTxt}> unknown OS type found...</Text>
            <Text style={styles.introTxt}> Please exit application</Text>
          </View>
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
  introCnt: {
    flexGrow: 1,
  },
  introView: {
    margin: 20,
  },
  introTxt: {
    fontSize: 15,
    textAlign: 'center',
  },
});

export default AuthPage;
