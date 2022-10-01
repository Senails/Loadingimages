import { upload } from './upload.js';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAZiVKJgXZZk4sX882dEibBZyy5GeUsHy8",
    authDomain: "uplaod-image-bd69b.firebaseapp.com",
    projectId: "uplaod-image-bd69b",
    storageBucket: "uplaod-image-bd69b.appspot.com",
    messagingSenderId: "727424179086",
    appId: "1:727424179086:web:5870fd271b99a3a75be2df"
};

const app = initializeApp(firebaseConfig);
let storage = getStorage(app)

upload('#file', {
    multy: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, previews) {
        files.forEach((file, index) => {
            const storageRef = ref(storage, `images/${file.name}`);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    let sendbites = snapshot.bytesTransferred / snapshot.totalBytes * 100;

                    let statusdiv = previews[index].querySelector('.progres');

                    statusdiv.innerHTML = Math.floor(sendbites) + ' %'
                    statusdiv.style.width = Math.floor(sendbites) + '%'
                },
                (error) => {
                    console.log(error)
                },
                async() => {
                    let url = await getDownloadURL(uploadTask.snapshot.ref);
                    previews[index].parentElement.innerHTML += `
                    <a class="url" href="${url}" target="_blank">ссылка</a>
                    `
                });
        });
    }
});

















//