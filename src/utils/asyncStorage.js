import { Platform } from 'react-native';

let AsyncStorage;
if (Platform.OS === 'web') {
  AsyncStorage = require('../web/asyncStorageShim');
} else {
  AsyncStorage = require('@react-native-async-storage/async-storage');
}

export default AsyncStorage;
