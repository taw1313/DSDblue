/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'
import {Platform} from 'react-native'

import MainPage from './src/pages/MainPage'
import AuthPage from './src/pages/AuthPage'

export default class App extends React.Component {
  state = {
    authToAccessBle: false,
    osType: Platform.OS
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  changeAuthAccessState = (newState) => {
    this.setState({ authToAccessBle: newState })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render() {
    console.log('DEBUG - App.js render()', this.state.authToAccessBle)
    if (this.state.authToAccessBle) 
      return( 
        <MainPage osType={this.state.osType}/> 
      )
    else 
      return( 
        <AuthPage osType={this.state.osType} changeState={this.changeAuthAccessState}/> 
      )
    }
}