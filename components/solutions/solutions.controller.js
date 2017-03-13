app.controller('SolutionsController', function SolutionsController($anchorScroll, authService, NavShrink) {

	$scope.goto = function(sub) {
		var landingUrl = "https://" + sub + ".mss.co.id"
		$window.location.href = landingUrl;
	}

    NavShrink.shrink();
    $anchorScroll();

})
