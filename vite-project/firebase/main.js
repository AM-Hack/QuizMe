// setting up firebase
const firebaseApp = firebase.initializeApp({ 
    apiKey: "AIzaSyAAOudP4miJOCHcsVhVJ7YaiQL62EPeVuU",
    authDomain: "html-website-9c891.firebaseapp.com",
    projectId: "html-website-9c891",
    storageBucket: "html-website-9c891.appspot.com",
    messagingSenderId: "267591460930",
    appId: "1:267591460930:web:6c5290f3adddb9075b25db"
 });
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

//sign up function
const signUp=()=>{
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email, password)
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {
        // Signed up material
        location.replace('newsignup.html')
        console.log(result)
        // ...
    })
    .catch((error) => {
        alert('This email is already in use')
        console.log(error.code)
        console.log(error.message)
        // ..
    });
}




//sign in function
const signIn = ()=>{
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            // Signed in material
            location.replace('signedin.html')
            console.log(result)
            // ...
        })
        .catch((error) => {
            alert('There was an error signing in. Please make sure everything is typed correctly.')
            console.log(error.code)
            console.log(error.message)
        });

}