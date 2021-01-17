import React from 'react'
import {Button, Icon, Left} from 'native-base'

const buttonStyle = {
  backgroundColor: '#614031'
}
const iconStyle = {
  color: '#050505'
}

class HeaderButton extends React.Component {
  
  render() {
    return(
        <Left>
            <Button style={buttonStyle} onPress={this.props.leftHeaderFunction}>
                <Icon style={iconStyle} name={this.props.iconName}/>
            </Button>
        </Left>
    )
  }
}

export default HeaderButton