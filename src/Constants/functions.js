import { store } from '../Redux/store'
import { DB, firebase } from '../Config/firebase'


export const DISPATCH_TO_REDUX = (type, payload) => store.dispatch({ type, payload });

export const GET_UNIQUE_ID = () => DB.collection('companies').doc().id;

export function UPLOAD_IMAGE_AS_PROMISE(imageFile, percentageCallback) {
    return new Promise(function (resolve, reject) {
        var storageRef = firebase.storage().ref('restaurant/' + imageFile.name);

        //Upload file
        var task = storageRef.put(imageFile);

        //Update progress bar
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                console.log('percentage = ' + percentage);
                percentageCallback && percentageCallback(percentage);
            },
            function error(err) {
                reject(err);
            },
            function complete() {
                var downloadURL = storageRef.getDownloadURL();
                resolve(downloadURL);

            }
        );
    });
}