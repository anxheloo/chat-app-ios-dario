declare var global: any;

import 'react-native-get-random-values';

if (typeof global.crypto === 'undefined') {
  global.crypto = {} as Crypto;
}

if (typeof global.crypto.getRandomValues === 'undefined') {
  global.crypto.getRandomValues =
    require('react-native-get-random-values').getRandomValues;
}
