(function() {
	var video = document.getElementById('video'),
		vendorUrl = window.URL || window.webkitURL;

	navigator.getMedia = navigator.getUserMedia ||
						 navigator.webkitGetUserMedia ||
						 navigator.mozGetUserMedia ||
						 navigator.msGetUserMedia;

	//Capture video
	navigator.getMedia({
		video: true,
		audio: true 
	}, function(stream){
	
		console.log(stream);
		var source = document.createElement('source');
		source.setAttribute('src', vendorUrl.createObjectURL(stream));
		video.appendChild(source);
		video.play();
		
	}, function(error){
		console.log(error);		
	});
})();