var Peer = require('simple-peer')
var peer = new Peer({ initiator: location.hash === '', trickle: false })

peer.on('error', function (err) { console.log('error', err) })
console.log("cool stuff");

peer.on('signal', function (data) {
  console.log('SIGNAL', JSON.stringify(data))
  console.log("wick");
})

console.log("cool stuff 2");

var url = window.location.search;
var sessionKey = url.replace("?", '');
console.log(sessionKey);

// Initialize Firebase
		  var config = {
		    apiKey: "AIzaSyARfjKII2xxs01AAfBTEXkefDSEw1ctk3A",
		    authDomain: "bilsession.firebaseapp.com",
		    databaseURL: "https://bilsession.firebaseio.com",
		    storageBucket: "bilsession.appspot.com",
		    messagingSenderId: "399176089674"
		  };
		  firebase.initializeApp(config);

		  console.log("success");

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user.uid);
    var user = user;
    var userUID = user.uid;
    console.log(userUID);
  } else {
    // No user is signed in.
  }
});

		
		

		var rootRef = firebase.database().ref('sessions/' + sessionKey);
		var newPeerRef = rootRef.push();
		console.log("rat");
//window.onload = function() {
  peer.on('signal', function(data) {
  		
  		console.log("nice");
  		console.log(JSON.stringify(data));
  		newPeerRef.set({
			userUID : JSON.stringify(data)
		}, function(error) {
			console.log(error);
		})
		
  })
//};