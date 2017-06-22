app.controller('SolutionsController', function SolutionsController($scope, $anchorScroll, authService, NavShrink, $window) {
    $scope.goto = function(sub) {
        if (sub != 'salesbook') {
            var landingUrl = "https://" + sub + ".mss.co.id";
            $window.location.href = landingUrl;
        } else {
            var landingUrl = "https://www." + sub + ".co.id";
            $window.open(landingUrl, '_blank');
        }
    };

    NavShrink.shrink();
    $anchorScroll();
});
