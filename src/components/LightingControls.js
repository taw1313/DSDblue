import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {SwitchOn, SwitchOff} from './Switch';

function LightingControls({
  setSwitchOnA,
  setSwitchOffA,
  setSwitchOnB,
  setSwitchOffB,
}) {
  return (
    <View style={styles.colContainer}>
      <View style={styles.rowContainer}>
        <Text style={styles.welcomeTxt}> Lighting Controls </Text>
      </View>
      <View style={styles.controls}>
        <View style={styles.asset}>
          <Text style={styles.introTxt}> Chassis</Text>
          <View style={styles.controls}>
            <View style={styles.btn}>
              <SwitchOn onSwitchOn={setSwitchOnB} />
            </View>

            <View style={styles.btn}>
              <SwitchOff onSwitchOff={setSwitchOffB} />
            </View>
          </View>
        </View>

        <View style={styles.asset}>
          <Text style={styles.introTxt}> Grill</Text>
          <View style={styles.controls}>
            <View style={styles.btn}>
              <SwitchOn onSwitchOn={setSwitchOnA} />
            </View>

            <View style={styles.btn}>
              <SwitchOff onSwitchOff={setSwitchOffA} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const styles = StyleSheet.create({
  colContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#C3C3C3',
    margin: 50,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C3C3C3',
  },
  introTxt: {
    fontSize: 15,
    textAlign: 'center',
  },
  welcomeTxt: {
    fontSize: 20,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  asset: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 30,
  },
  btn: {
    margin: 5,
  },
});

export default LightingControls;
