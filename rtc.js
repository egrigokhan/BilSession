navigator.webkitGetUserMedia({video: true, audio: true}, function(stream) {
		
		//Creating peer
		var Peer = require('simple-peer')
		var peer = new Peer
		({ 
			initiator: location.hash === '', 
			trickle: false, 
			stream: stream 
		});

		//Variables
		var validVideo = 1;
		var ownID;

		//If error, report error
		peer.on('error', function (err) { console.log('error', err) });
		console.log("cool stuff");

		//If signaled, log your own data
		peer.on('signal', function (data) {
	  		console.log('SIGNAL', JSON.stringify(data)),
	  		console.log("wick");

	  		//Get own ID
		  	ownID = JSON.stringify(data);
		});

		console.log("cool stuff 2");

		//Get the current sessionKey
		var url = window.location.search;
		var sessionKey = url.replace("?", '');
		console.log(sessionKey);

		// Initialize Firebase
        var config = 
        {
			apiKey: "AIzaSyARfjKII2xxs01AAfBTEXkefDSEw1ctk3A",
		    authDomain: "bilsession.firebaseapp.com",
		    databaseURL: "https://bilsession.firebaseio.com",
		    storageBucket: "bilsession.appspot.com",
		    messagingSenderId: "399176089674"
		};
		
		firebase.initializeApp(config);

		console.log("success");

	//Check if user is logged in
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) 
		{
	    	console.log(user.uid);
	    	var user = user;
	    	var userUID = user.uid;
	    	console.log(userUID);
	    	console.log("UP");
	  	} else {
	    // No user is signed in.
	  }
	});
		
		//Get base root ref for session databases
		var rootRef = firebase.database().ref('sessions/' + sessionKey);
		var userRef = firebase.database().ref('sessions/' + sessionKey + '/' + userUID);
		var newPeerRef = userRef.push();
		console.log("rat");

		//On peer signal
		peer.on('signal', function(data) {
	  		
	  		console.log("nice");
	  		console.log(JSON.stringify(data));
	  		newPeerRef.set(
	  		{
				//Save peer to database with current user ID
				userUID : JSON.stringify(data)
			}, function(error) {
				console.log(error);
			})	
		});

		//Reading values from database
	    rootRef.on('value', function(snapshot) {
	    snapshot.forEach(function(childSnapshot) {
	  	var peerOther = childSnapshot.val();
	  	peer.signal(JSON.parse(peerOther));
	  });

	  peer.on('stream', function(stream) {
	  	var video = document.getElementById('' + validVideo);
	  	validVideo++;
	  	video.src = window.URL.createObjectURL(stream);
	  	video.play();
	  })
})


  }, function(error) {
  	console.log(error);
  });