app.controller('SoftwaresController', function($scope, $window, authService, NavShrink, productService, CartService, localStorageService) {
    NavShrink.shrink();

    $scope.items = [];
    $scope.categories = [];

    productService
        .get('software')
        .then(function(response) {
            console.log(response)
            // $scope.items = res.data;
        })
});
