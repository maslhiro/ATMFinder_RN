import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCq6OO3PHfHDmlbfFN6VCGCJNDaG5PbeI4",
  authDomain: "testmap-198808.firebaseapp.com",
  databaseURL: "https://testmap-198808.firebaseio.com",
  projectId: "testmap-198808",
  storageBucket: "testmap-198808.appspot.com",
  messagingSenderId: "805732284875"
};
firebase.initializeApp(config);

export default firebase;