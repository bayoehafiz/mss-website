app.controller('HardwaresController', function($scope, authService, NavShrink, productService, blockUI, $timeout) {
    $scope.items = [];
    $scope.categories = [];

    productService.get().then(function(response) {
        angular.forEach(response.data, function(val) {
            if (val.type == 'hardware') {
                $scope.items.push(val);
            }
        });
    });

    NavShrink.shrink();
});
