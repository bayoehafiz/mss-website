app.controller('HomeController', HomeController);

function HomeController($scope, authService, NavShrink) {
    NavShrink.shrink();
}
