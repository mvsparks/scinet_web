const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createDatabaseUser = functions.auth.user().onCreate((user) => {
    admin.auth().updateUser(user.uid, {
        displayName: user.email.split('@')[0]
    })
    .then(res => console.log(res))
    .catch(e => console.log(e));

    admin.database().ref(`/users/${user.uid}`).set({
        email: user.email,
        role: 'noaccess'
    })
    .then(res => console.log(res))
    .catch(e => console.log(e));
});

// admin.auth().deleteUser(uid)
//     .then(function() {
//         console.log("Successfully deleted user");
//     })
//     .catch(function(error) {
//         console.log("Error deleting user:", error);
//     });