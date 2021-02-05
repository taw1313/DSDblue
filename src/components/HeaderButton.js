import {Button, Icon, Left} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';

function HeaderButton({leftHeaderFunction}) {
  return (
    <Left>
      <Button style={styles.buttonStyle} onPress={leftHeaderFunction}>
        <Icon name="ios-menu" />
        {/*
        <Icon
          type="MaterialCommunityIcons"
          style={styles.iconStyle}
          name="menu"
        />
        */}
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
  },
});

export default HeaderButton;
