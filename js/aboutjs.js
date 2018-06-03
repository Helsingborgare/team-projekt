var msg= document.getElementById('aboutMsg');

function updateAbout(){
    alert('it works');
    var firebaseRef = firebase.database().ref('users');
   

    firebaseRef.child("About").set("I Love dancing");
    console.log("I love dancing");
}