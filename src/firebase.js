
import   firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import 'firebase/compat/database';
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCM9LNXsKe-H-fBgQbQnWb_Y9Oqdud3Ts8",
    authDomain: "tienda-11628.firebaseapp.com",
    projectId: "tienda-11628",
    storageBucket: "tienda-11628.appspot.com",
    messagingSenderId: "665136905333",
    appId: "1:665136905333:web:c35a9e27c3794106588c3c"
  };
  
  // Initialize Firebase
  var fireDb = firebase.initializeApp(firebaseConfig);
  export default fireDb.database().ref();