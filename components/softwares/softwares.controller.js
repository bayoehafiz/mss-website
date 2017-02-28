app.controller('SoftwaresController', function($scope, $window, authService, NavShrink, productService, CartService, localStorageService) {
    NavShrink.shrink();

    $scope.items = [];
    $scope.categories = [];

    var result = productService.get('software');
    console.log(result);
});
