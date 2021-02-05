import React, {useState} from 'react';
import {Platform} from 'react-native';

import MainPage from './src/pages/MainPage';
import AuthPage from './src/pages/AuthPage';

function App() {
  const [accessBluetooth, setAccessBluetooth] = useState();
  const osType = Platform.OS;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  console.log('DEBUG - App.js render()', accessBluetooth);
  if (accessBluetooth !== undefined) {
    return <MainPage osType={osType} accessBluetooth={accessBluetooth} />;
  } else {
    return (
      <AuthPage
        osType={osType}
        changeState={(newState) => setAccessBluetooth(newState)}
      />
    );
  }
}

export default App;
