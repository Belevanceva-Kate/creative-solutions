$(document).ready(function() {

	$("body").on("click", ".toggle-nav", function(e) {
		e.preventDefault();
		$("body").toggleClass("nav-opened");
	})

});