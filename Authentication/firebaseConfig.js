import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCzApTNALHzjavRuekQHGN3TMJrbqoJ7hw',
  authDomain: 'eventify-69ccd.firebaseapp.com',
  projectId: 'eventify-69ccd',
  storageBucket: 'eventify-69ccd.firebasestorage.app',
  appId: '1:1051907403339:android:24046a382871ec849a27ce',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
