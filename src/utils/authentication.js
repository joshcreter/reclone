import firebase from "firebase";
import React from "react";
import {isLoaded, isEmpty} from 'react-redux-firebase'

export function handleInitialFirebaseAuthentication() {
    // if(isLoaded(firebase.auth) && isEmpty(firebase.auth)){
    firebase.auth().signInAnonymously().catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
    // }
}

export function signInAnonymously() {
    firebase.auth().signInAnonymously().catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });

}




export function handleLogin(firestore, firebase) {
    if (firebase.auth().currentUser) {

        let prevUser = firebase.auth().currentUser;

        firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then(function (response) {
                // firebase.auth().signInAndRetrieveDataWithCredential(response.credential);
                mergeOtherAccountDataIntoCurrentUser(firestore, prevUser.uid, firebase.auth().currentUser.uid);
                prevUser.delete();
            })
            // .catch(function (error) {
            //         console.log(error);
            //         switch (error['code']) {
            //             case "auth/credential-already-in-use":
            //                 firebase.auth().signInAndRetrieveDataWithCredential(error['credential']).then(function (response) {
            //                     // console.log('success');
            //                     mergeOtherAccountDataIntoCurrentUser(firestore, prevUser.uid, firebase.auth().currentUser.uid);
            //                     prevUser.delete();
            //                 });
            //                 break;
            //             default:
            //                 break;
            //
            //         }
            //     }
            // );
    }
    else {
        handleInitialFirebaseAuthentication();
    }
}
//
// export function handleLogin(firestore, firebase) {
//     if (firebase.auth().currentUser) {
//
//         let prevUser = firebase.auth().currentUser;
//
//         firebase.auth().currentUser.linkWithPopup(new firebase.auth.GoogleAuthProvider())
//             .then(function (response) {
//                 firebase.auth().signInAndRetrieveDataWithCredential(response.credential);
//                 mergeOtherAccountDataIntoCurrentUser(firestore, prevUser.uid, firebase.auth().currentUser.uid);
//                 prevUser.delete();
//             })
//             .catch(function (error) {
//                     console.log(error);
//                     switch (error['code']) {
//                         case "auth/credential-already-in-use":
//                             firebase.auth().signInAndRetrieveDataWithCredential(error['credential']).then(function (response) {
//                                 // console.log('success');
//                                 mergeOtherAccountDataIntoCurrentUser(firestore, prevUser.uid, firebase.auth().currentUser.uid);
//                                 prevUser.delete();
//                             });
//                             break;
//                         default:
//                             break;
//
//                     }
//                 }
//             );
//     }
//     else {
//         handleInitialFirebaseAuthentication();
//     }
// }

export function handleLogout(firebase) {
    firebase.logout().then(function (result) {
            // Once logged out, log back in anonymously
            handleInitialFirebaseAuthentication();
        }
    );
}

function mergeOtherAccountDataIntoCurrentUser(firestore, otherAccountUid, currentUserUid) {
    firestore.get({collection: 'userVotes', doc: otherAccountUid}).then(function (response) {
        let voteData = response.data();
        for (let postId in voteData) if (voteData.hasOwnProperty(postId)) {
            let voteValue = voteData[postId];
            if (voteValue !== 0) {
                firestore.set({collection: 'userVotes', doc: currentUserUid}, {[postId]: voteValue}, {merge: true})
            }
        }
    });
}

// firebase.login({provider: 'google', type: 'popup'}).then(function(result) {
//     console.log(firebase.auth().currentUser.linkWithPopup({provider: 'google'}));

// console.log(firebase.auth().currentUser.linkWithCredential());
//     var credential = firebase.auth.GoogleAuthProvider.credential(
// googleUser.getAuthResponse().id_token);
//     console.log(credential);
//     }
// );

// // Get reference to the currently signed-in user
// var prevUser = auth.currentUser;
// // Sign in user with another account
// auth.signInWithCredential(credential).then(function(user) {
//   console.log("Sign In Success", user);
//   var currentUser = user;
//   // Merge prevUser and currentUser data stored in Firebase.
//   // Note: How you handle this is specific to your application
//
//   // After data is migrated delete the duplicate user
//   return user.delete().then(function() {
//     // Link the OAuth Credential to original account
//     return prevUser.linkWithCredential(credential);
//   }).then(function() {
//     // Sign in with the newly linked credential
//     return auth.signInWithCredential(credential);
//   });
// }).catch(function(error) {
//   console.log("Sign In Error", error);
// });

{/*<pre>{JSON.stringify(auth, null, 2)}</pre>*/
}


// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     // User is signed in.
//     var isAnonymous = user.isAnonymous;
//     var uid = user.uid;
//     // ...
//   } else {
//     // User is signed out.
//     // ...
//   }
//   // ...
// });

