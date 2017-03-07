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
	//selfVideo.setAtribute( 'src' ) = vendorUrl.createObjectURL( stream );

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