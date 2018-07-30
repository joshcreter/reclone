import { createStore, compose } from 'redux';
import rootReducer from './rootReducer';
import { firebaseConfig } from '../config/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import { reactReduxFirebase } from 'react-redux-firebase';
import { reduxFirestore } from 'redux-firestore';

export default function configureStore (initialState, history) {
    // Initialize Firebase instance
    firebase.initializeApp(firebaseConfig);
    // Initialize Firestore with timeshot settings
    firebase.firestore().settings({ timestampsInSnapshots: true });

    const createStoreWithMiddleware = compose(
        reactReduxFirebase(firebase,
            {
                userProfile: 'users',
                useFirestoreForProfile: true, // Store in Firestore instead of Real Time DB
                enableLogging: false
            }
        ),
        reduxFirestore(firebase),
        typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    )(createStore);

    const store = createStoreWithMiddleware(rootReducer);


    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./rootReducer', () => {
            const nextRootReducer = require('./rootReducer');
            store.replaceReducer(nextRootReducer)
        })
    }
   return store;
}