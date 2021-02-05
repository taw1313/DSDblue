import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import {Container, Content} from 'native-base';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import CompanyHeader from '../CompanyHeader';

////////////////////////////////////////////////////////////////////////////////////////////////////
//┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
//┃ check(PERMISSIONS.IOS.CAMERA) ┃
//┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
//                │
//    Is the feature available
//        on this device ?
//                │           ╔════╗
//                ├───────────║ NO ║──────────────┐
//                │           ╚════╝              │
//             ╔═════╗                            ▼
//             ║ YES ║                 ┌─────────────────────┐
//             ╚═════╝                 │ RESULTS.UNAVAILABLE │
//                │                    └─────────────────────┘
//        Is the permission
//          request-able ?
//                │           ╔════╗
//                ├───────────║ NO ║──────────────┐
//                │           ╚════╝              │
//             ╔═════╗                            ▼
//             ║ YES ║                  ┌───────────────────┐
//             ╚═════╝                  │ RESULTS.BLOCKED / │
//                │                     │ RESULTS.LIMITED / │
//                │                     │  RESULTS.GRANTED  │
//                ▼                     └───────────────────┘
//       ┌────────────────┐
//       │ RESULTS.DENIED │
//       └────────────────┘
//                │
//                ▼
//┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
//┃ request(PERMISSIONS.IOS.CAMERA) ┃
//┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
//                │
//      Does the user accept
//         the request ?
//                │           ╔════╗
//                ├───────────║ NO ║──────────────┐
//                │           ╚════╝              │
//             ╔═════╗                            ▼
//             ║ YES ║                   ┌─────────────────┐
//             ╚═════╝                   │ RESULTS.BLOCKED │
//                │                      └─────────────────┘
//                ▼
//       ┌─────────────────┐
//       │ RESULTS.GRANTED │
//       └─────────────────┘
////////////////////////////////////////////////////////////////////////////////////////////////////

function IOSAuth({changeState}) {
  const [available, setAvailable] = useState({});

  useEffect(() => {
    console.log('DEBUG - IOSAuth useEffect() check');
    check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL).then((result) => {
      console.log('DEBUG - IOSAuth after check() ', result);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          changeState(false);
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          setAvailable(true);
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          changeState(true);
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          changeState(true);
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not request-able anymore');
          changeState(false);
          break;
        default:
          changeState(false);
      }
    });
  });

  useEffect(() => {
    if (available) {
      request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL).then((result) => {
        switch (result) {
          case RESULTS.GRANTED:
            changeState(true);
            break;
          case RESULTS.DENIED:
          default:
            changeState(false);
            break;
        }
      });
    }
  }, [available, changeState]);

  return (
    <Container>
      <CompanyHeader menuAvailable={false} />

      <Content contentContainerStyle={styles.introCnt}>
        <View style={styles.introView}>
          <Text style={styles.introTxt}>
            {' '}
            Checking IOS for Bluetooth authorization...
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

export default IOSAuth;
