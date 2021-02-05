import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Container, Content} from 'native-base';
// import Permissions from 'react-native-permissions'
import CompanyHeader from '../CompanyHeader';

////////////////////////////////////////////////////////////////////////////////////////////////////
// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃ check(PERMISSIONS.ANDROID.CAMERA) ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
//                   │
//       Is the feature available
//           on this device ?
//                   │           ╔════╗
//                   ├───────────║ NO ║──────────────┐
//                   │           ╚════╝              │
//                ╔═════╗                            ▼
//                ║ YES ║                 ┌─────────────────────┐
//                ╚═════╝                 │ RESULTS.UNAVAILABLE │
//                   │                    └─────────────────────┘
//           Is the permission
//             request-able ?
//                   │           ╔════╗
//                   ├───────────║ NO ║──────────────┐
//                   │           ╚════╝              │
//                ╔═════╗                            ▼
//                ║ YES ║                  ┌───────────────────┐
//                ╚═════╝                  │ RESULTS.BLOCKED / │
//                   │                     │  RESULTS.GRANTED  │
//                   ▼                     └───────────────────┘
//          ┌────────────────┐
//          │ RESULTS.DENIED │◀──────────────────────┐
//          └────────────────┘                       │
//                   │                               │
//                   ▼                               │
// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓         ╔════╗
// ┃ request(PERMISSIONS.ANDROID.CAMERA) ┃         ║ NO ║
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛         ╚════╝
//                   │                               │
//         Does the user accept                      │
//            the request ?                          │
//                   │           ╔════╗     Does the user check
//                   ├───────────║ NO ║─────"Never ask again" ?
//                   │           ╚════╝              │
//                ╔═════╗                         ╔═════╗
//                ║ YES ║                         ║ YES ║
//                ╚═════╝                         ╚═════╝
//                   │                               │
//                   ▼                               ▼
//          ┌─────────────────┐             ┌─────────────────┐
//          │ RESULTS.GRANTED │             │ RESULTS.BLOCKED │
//          └─────────────────┘             └─────────────────┘
////////////////////////////////////////////////////////////////////////////////////////////////////

function AndroidAuth({changeState}) {
  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const checkForPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'DSDblue',
          message:
            'Android requires access to your location to allow Bluetooth control.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      changeState(granted === PermissionsAndroid.RESULTS.GRANTED);
    };
    checkForPermission();
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <Container>
      <CompanyHeader menuAvailable={false} />

      <Content contentContainerStyle={styles.introCnt}>
        <View style={styles.introView}>
          <Text style={styles.introTxt}>
            {' '}
            Checking Android for Bluetooth authorization...
          </Text>
          <Text style={styles.introTxt}> Please wait</Text>
        </View>

        <ActivityIndicator size="large" color="#0000ff" />
      </Content>
    </Container>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////
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

export default AndroidAuth;
