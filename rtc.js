var vendorUrl = window.URL || window.webkitURL;

var config = {
		    apiKey: "AIzaSyARfjKII2xxs01AAfBTEXkefDSEw1ctk3A",
		    authDomain: "bilsession.firebaseapp.com",
		    databaseURL: "https://bilsession.firebaseio.com",
		    storageBucket: "bilsession.appspot.com",
		    messagingSenderId: "399176089674"
		  };

firebase.initializeApp(config);

var ownRTC;
var validVideoIndex = 2;

var peerVideo;
var selfVideo = document.getElementById( '1' );

var url = window.location.search;
var sessionKey = url.replace("?", '');

var rootRef = firebase.database().ref('sessions/' + sessionKey);
var newPeerRef = rootRef.push();

navigator.getMedia = navigator.getUserMedia ||
					 navigator.webkitGetUserMedia ||
					 navigator.mozGetUserMedia ||
					 navigator.msGetUserMedia;

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
	    console.log('USER', user.uid);
	   	userUID = user.uid;
	  	} else {}
});

navigator.getMedia({ video: true, audio: false }, function( stream ) {
	var source = document.createElement('source');
	source.setAttribute('src', vendorUrl.createObjectURL(stream));
	selfVideo.appendChild(source);

	var Peer = require( 'simple-peer' );
	var peer = new Peer(
	{
		initiator: location.hash === '',
		trickle: false,
		stream: stream
	});

	peer.on( 'signal', function( data ) {
		console.log('USER RTC ID: ', JSON.stringify( data ) );
		ownRTC = JSON.stringify( data );
		newPeerRef.set(
		{
			userUID : ownRTC
		}
		);
	});

	rootRef.on( 'value', function( snapshot ) {
		snapshot.forEach( function( childSnapshot ) {
			if( childSnapshot.val() != ownRTC ) {
				peer.signal( JSON.parse( childSnapshot.val() ) );
			}
		});
	});

	peer.on( 'stream', function( stream ) {
		peerVideo = document.getElementById( '' + validVideoIndex );
		//peerVideo.setAtribute( 'src' ) = vendorUrl.createObjectURL( stream );
		peerVideo.play();
	}, function( error ) {
	console.log( 'PEER STREAM ERROR: ', error );
	});
}, function( error ) {
	console.log( 'SELF STREAM ERROR: ', error );
} );




