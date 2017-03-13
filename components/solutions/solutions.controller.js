app.controller('SolutionsController', function SolutionsController($scope, $anchorScroll, authService, NavShrink, $window) {

	$scope.goto = function(sub) {
		var landingUrl = "https://" + sub + ".mss.co.id"
		$window.location.href = landingUrl;
	}

    NavShrink.shrink();
    $anchorScroll();

})
