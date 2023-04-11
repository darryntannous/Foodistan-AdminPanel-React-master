const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sunny-density-238208.firebaseio.com"
});
const cors = require('cors')({ origin: true });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.deleteUser = functions.https.onRequest((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    cors(request, response, (error) => {
        if (error) {
            response.status(400).send({ success: false, message: 'Error in API', error })
        }
        const body = request.body;
        console.log('BODYYYYYYYYYYY', JSON.stringify(body));

        admin.auth().deleteUser(body.userId)
            .then(async () => {
                console.log("User deleted successfully! userId = ", body.userId);
                try {
                    await admin.firestore().collection('users').doc(body.userId).delete()
                    response.status(200).send({ success: true, message: 'User deleted successfully!' });
                } catch (err) {
                    console.log('Error in deleting user from database ', err)
                }
                return;
            })
            .catch(err => {
                console.log('ERROR IN DELETING USER: ', err);
                response.status(200).send({ success: false, message: 'Error in deleting user!', error: err });
            });
    });
});

exports.getUserByEmail = functions.https.onRequest((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    cors(request, response, (error) => {
        if (error) {
            response.status(400).send({ success: false, message: 'Error in API', error })
        }
        const body = request.body;
        console.log('body', JSON.stringify(body, null, 2));

        admin.auth().getUserByEmail(body.email)
            .then(async (user) => {
                console.log('User = ', JSON.stringify(user, null, 2));
                response.status(200).send({ success: true, message: 'User has been retrieve successfully!', data: user });
                return;
            })
            .catch(err => {
                console.log('ERROR IN GET_USER_AUTH_PROVIDER: ', err);
                response.status(200).send({ success: false, message: 'Error in getting the auth provider!', error: err });
            });
    });
});

exports.updateUserOnCreateAccountTrigger = functions.auth.user().onCreate(user => {
    admin.auth().updateUser(user.uid, { emailVerified: true })
        .then((updatedUser) => {
            console.log('Updated user', updatedUser);
            return;
        })
        .catch((e) => {
            console.log('ERROR: err in updating user ', e);
        })
});

exports.deleteUserDataOnRemoveAccountTrigger = functions.auth.user().onDelete(async user => {
    console.log('USER DELETED! ' + user.uid);
    try {
        await admin.firestore().collection('users').doc(user.uid).delete();
        console.log('User data deleted successfully from DB!')
    } catch (err) {
        console.log('Error in deleting user from database ', err)
    }
    return;
});