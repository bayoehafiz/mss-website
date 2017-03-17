app.controller('NavController', NavController);

function NavController(authService, $scope, ngCart) {
    // console.clear();
    $scope.authService = authService;

    ngCart.setTaxRate(7.5);
    ngCart.setShipping(2.99); 
}
