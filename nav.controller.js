app.controller('NavController', NavController);

function NavController(authService, $scope) {
    // console.clear();
    $scope.authService = authService;
}
