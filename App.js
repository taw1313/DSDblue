import React, {useState} from 'react';
import {Platform} from 'react-native';

import MainPage from './src/pages/MainPage';
import AuthPage from './src/pages/AuthPage';

function App() {
  const [authToAccessBle, setAuthToAccessBle] = useState(false);
  const osType = Platform.OS;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  console.log('DEBUG - App.js render()', authToAccessBle);
  if (authToAccessBle) {
    return <MainPage osType={osType} />;
  } else {
    return (
      <AuthPage
        osType={osType}
        changeState={(newState) => setAuthToAccessBle(newState)}
      />
    );
  }
}

export default App;
