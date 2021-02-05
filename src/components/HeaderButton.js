import {Button, Left} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function HeaderButton({leftHeaderFunction}) {
  return (
    <Left>
      <Button style={styles.buttonStyle} onPress={leftHeaderFunction}>
        <Icon style={styles.iconStyle} name="menu" />
      </Button>
    </Left>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#614031',
  },
  iconStyle: {
    color: '#050505',
    fontSize: 20,
  },
});

export default HeaderButton;
