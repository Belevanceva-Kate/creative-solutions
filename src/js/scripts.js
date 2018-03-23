$(document).ready(function() {

	//adaptive menu
	$("body").on("click", ".toggle-nav", function(e) {
		e.preventDefault();
		$("body").toggleClass("nav-opened");
	});

	//smooth scrolling
	$("body").on("click", ".scrollTo", function(e) {
		e.preventDefault();
		var target = $(this).attr("href");
		var offset = Math.floor($(target).offset().top);
		$("html").animate({
			scrollTop: offset
		}, 1000, function() {

		});
	});

});



//map
function createMarker(coords, map) {
	return new google.maps.Marker({
		position: coords,
		map: map,
		icon: "img/pin.svg",
		animation: google.maps.Animation.DROP
	});
}

function initMap() {

	var map, 
		marker,
		infoWindow,
		address 	= "Мариуполь, ул. Энгельса, 60",
		geocoder 	= new google.maps.Geocoder();

	geocoder.geocode({
		"address" : address
	}, function(result, status) {
		if (status == "OK" && result.length) {
			map = new google.maps.Map(document.getElementById('map'), {
				zoom: 13,
				center: result[0].geometry.location
			});
			marker = createMarker(result[0].geometry.location, map);
		}
	});
}