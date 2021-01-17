import React from 'react'
import {Alert} from 'react-native'
import {Header} from 'react-native-elements'

class CompanyHeader extends React.Component {

  menuSelected = () => {
    Alert.alert(
      'Title of something',
      'menu selected',
      [
        {
          text: 'Ok', 
          onPress: () => console.log('ok pressed')
        }
      ],
      {cancelable: false}
    )
  }

  render() {
    return(
      <Header
        containerStyle={{ height: 40, paddingBottom: 15, marginBottom: 20 }}
        leftComponent={{ icon: 'menu', color: '#fff', onPress: this.menuSelected }}
        centerComponent={{ text: 'Motion Vector Devices', color: '#fff' }}
      />
    )
  }
}

export default CompanyHeader
/*
        containerStyle={{ height: 40, padding: 20, marginBottom: 20, zIndex: 1 }}
        containerStyle={{ height: 40, padding: 20, marginBottom: 20}}
        outerContainerStyles={{ zIndex: 1 }}
*/
