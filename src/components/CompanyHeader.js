import React from 'react';
import {Body, Header, Right, Title} from 'native-base';
import HeaderButton from './HeaderButton';
import {StyleSheet} from 'react-native';

////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function CompanyHeader(props) {
  return (
    <Header style={styles.headerStyle}>
      {props.menuAvailable ? <HeaderButton {...props} /> : null}
      <Body style={styles.headerBody}>
        <Title style={styles.headerStyle}> MV Devices </Title>
      </Body>
      <Right />
    </Header>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////
const styles = StyleSheet.create({
  companyHeader: {
    backgroundColor: '#614031',
    color: '#b2b2b2',
    alignSelf: 'center',
  },
  companyBody: {
    alignSelf: 'center',
  },
});

export default CompanyHeader;
