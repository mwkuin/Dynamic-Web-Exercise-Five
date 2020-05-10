import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import * as firebase from 'firebase/app';
import "firebase/auth";

//Pages
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Header";

//Styles
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({});

  const firebaseConfig = {
    apiKey: "AIzaSyA7k1XqpdnQQPhy0VLQ4YYOIglKVUkf_Po",
    authDomain: "exercise-five-ff29b.firebaseapp.com",
    databaseURL: "https://exercise-five-ff29b.firebaseio.com",
    projectId: "exercise-five-ff29b",
    storageBucket: "exercise-five-ff29b.appspot.com",
    messagingSenderId: "1025880120605",
    appId: "1:1025880120605:web:9acff59137a614b6bf15f4"
  };

//ensure app is initialized when it is ready to be
  useEffect(() => {
    //ensure app is not initialized more than once
    //is firebase already initialized?
    if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  //Setting auth to be persistent in SESSION storage, not cookies
  //You can also use cookies with firebase but we're using session
  //because it is easier to work with
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .catch(function(e) {
      console.log('AUTH ERROR', e);
    });
  }, [firebaseConfig]);

  //Check to see if user is logged in
  //User loads page, check status -> set state accordingly
  useEffect(() => {firebase.auth().onAuthStateChanged(function (user) {
    if(user) {
      //Logged in
      setUserInfo(user);
      setLoggedIn(true);
    } else {
      //Not logged in
      setUserInfo({});
      setLoggedIn(false);
    }
      setLoading(false);
    });
    }, []);

//Login
function LoginFunction(e) {
  e.preventDefault();
  let email = e.currentTarget.loginEmail.value;
  let password = e.currentTarget.loginPassword.value;

  firebase
  .auth()
  .signInWithEmailAndPassword(email, password)
  .then(function(response) {
    console.log("LOGIN RESPONSE", response);
    setLoggedIn(true);
  })
  .catch(function(error) {
    console.log("LOGIN ERROR", error)
  });
}

//Logout
function LogoutFunction() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      setLoggedIn(false);
    })
    .catch(function(error) {
      console.log("LOGOUT ERROR", error);
    });
}

//Create account
function CreateAccountFunction(e) {
  e.preventDefault();
  console.log('form payload', e);

  //default values for testing
  let email = e.currentTarget.createEmail.value;
  let password = e.currentTarget.createPassword.value;


  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function(response) {
      console.log('VALID ACCOUNT CREATE', response);
      setLoggedIn(true);
    })
    .catch(function(e) {
      console.log("CREATE ACCOUNT ERROR", e);
    });

}


  return (
    <div className="App">
      <Header LogoutFunction={LogoutFunction} isLoggedIn={loggedIn}/>
      <Router>
        <Route exact path="/">
          {!loggedIn ? (<Redirect to="/login"/> ) : (<UserProfile userInformation={userInfo}/>)}
        </Route>

        <Route exact path="/login">
          {!loggedIn ? (<Login LoginFunction={LoginFunction}/> ) : (<Redirect to="/"/>)}
        </Route>

        <Route exact path="/create-account">
          {!loggedIn ? (<CreateAccount CreateAccountFunction={CreateAccountFunction} />) : (<Redirect to="/" />)}
        </Route>
      </Router>
    </div>
  );
}

export default App;
