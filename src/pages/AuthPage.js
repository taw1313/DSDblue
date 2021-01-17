import React, {Component} from 'react'
// TAW import {ActivityIndicator, PermissionsAndroid, StyleSheet, Text, View} from 'react-native'
import {StyleSheet, Text, View} from 'react-native'
import {Container, Content} from 'native-base'
// TAW import Permissions from 'react-native-permissions'
import CompanyHeader from '../components/CompanyHeader'
import AndroidAuth from '../components/bleSupport/AndroidAuth'
import IOSAuth from '../components/bleSupport/IOSAuth'

class AuthPage extends Component {

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // 
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async componentDidMount() {
    console.log('DEBUG - within componentDidMount() props OS type ', this.props.osType)
  }
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render() {
    if(this.props.osType === 'android') {
      return (
        <Container>
          <AndroidAuth {...this.props} />
        </Container>
      )
    }
    else if (this.props.osType === 'ios') {
      return( 
        <Container>
          <IOSAuth {...this.props} />
        </Container>
      )
    }
    else {
      return (
        <Container>
          <CompanyHeader menuAvailable={false} />

          <Content contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.introView}>
              <Text style={styles.introTxt}> unkown OS type found...</Text>
              <Text style={styles.introTxt}> Please exit application</Text>
            </View>
          </Content>
        </Container>
      )
    }
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
    backgroundColor: '#C3C3C3'
  },
  introView: {
    margin: 20
  },
  introTxt: {
    fontSize: 15,
    textAlign: 'center'
  }
})

export default AuthPage
/*
*/