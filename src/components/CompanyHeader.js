import React from 'react'
import {Body, Header, Right, Title} from 'native-base'
import HeaderButton from './HeaderButton'

const headerStyle = {
  backgroundColor: '#614031',
  color: '#b2b2b2',
  alignSelf: 'center'
}
class CompanyHeader extends React.Component {
  
  render() {
    return(
      <Header style={headerStyle}>
        { this.props.menuAvailable 
          ? ( <HeaderButton {...this.props}/> )
          : ( null ) }
        <Body style={{alignSelf: 'center'}}>
          <Title style={headerStyle}> MV Devices </Title>
        </Body>
        <Right />
      </Header>
    )
  }
}

export default CompanyHeader