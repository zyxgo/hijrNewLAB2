import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: "AIzaSyBGvou4mkfskk6nXspzF22mkybyl7mSFv4",
    authDomain: "appsimlab19.firebaseapp.com",
    databaseURL: "https://appsimlab19.firebaseio.com",
    projectId: "appsimlab19",
    storageBucket: "appsimlab19.appspot.com",
    messagingSenderId: "1060073229678"
  };

  class Firebase {
    constructor() {
      app.initializeApp(config);
      this.auth = app.auth();
      this.db = app.database();

      this.serverValue = app.database.ServerValue;
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
              dbUser.roles = 'ROLELESS';
            }
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              area: authUser.area,
              username: authUser.username,
              nipUser: authUser.nipUser,
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

    // *** Message API ***
    message = uid => this.db.ref(`messages/${uid}`);
    messages = () => this.db.ref('messages');

  }
  
  export default Firebase;