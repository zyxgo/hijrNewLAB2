import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: "AIzaSyC04O3DtcTcx2QiX7GJQZrDQcg1b8H2rMw",
    authDomain: "reactjsfirebase-ef94d.firebaseapp.com",
    databaseURL: "https://reactjsfirebase-ef94d.firebaseio.com",
    projectId: "reactjsfirebase-ef94d",
    storageBucket: "reactjsfirebase-ef94d.appspot.com",
    messagingSenderId: "688544737720"
  };

  class Firebase {
    constructor() {
      app.initializeApp(config);
      this.auth = app.auth();
      this.db = app.database();
    }
    
    /****AUTH API */
    doCreateUserWithEmailAndPassword = (email, password) =>
      this.auth.createUserWithEmailAndPassword(email, password);
    
    doSignInWithEmailAndPassword = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);
    
    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);

    // *** Merge Auth and DB User API *** //
    onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            };
            next(authUser);
          });
      } else {
        fallback();
      } });

    /****USER API */
    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

  }
  
  export default Firebase;