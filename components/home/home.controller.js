app.controller('HomeController', function HomeController($scope, $anchorScroll, authService, NavShrink ) {
    NavShrink.shrink();
    $anchorScroll();
});
