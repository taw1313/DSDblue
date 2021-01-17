// import {useAsyncStorage} from '@react-native-community/async-storage';

// const {getItem, setItem, removeItem} = useAsyncStorage('@DSDblue_key');

module.exports = {
  readBleDevicesFromStorage: async () => {
    console.log(
      'DEBUG - asyncStorage.js readBleDevicesFromStorage before getItem() ',
    );
    /*
    const items = await getItem();
    console.log('DEBUG - asyncStorage.js readBleDevicesFromStorage = ', items);
    return JSON.parse(items);
    */
    return [];
  },

  writeBleDevicesFromStorage: async (items) => {
    /*
    await setItem(JSON.stringify(items));
    */
    console.log('DEBUG - asyncStorage.js writeBleDevicesFromStorage = ', items);
    return items;
  },

  removeBleDevicesFromStorage: async () => {
    /*
    try {
      await removeItem();
    } catch (e) {
      alert('ERROR - removing device from storage');
    }
    */
    return 'Done';
  },
};
