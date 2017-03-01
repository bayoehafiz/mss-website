app.controller('SoftwaresController', function($scope, $rootScope, $window, authService, NavShrink, productService, CartService, localStorageService, $q) {
    NavShrink.shrink();

    $scope.items = [];
    $scope.categories = ['email', 'office', 'windows'];

    productService.get().then(function(response) {
        var promises = [];
        angular.forEach(response.data, function(val) {
            if (val.type == 'software') {
                promises.push(val);
            };
        });

        $q.all(promises).then(function(response) {
            $scope.items = response;
            $rootScope.$broadcast('init-mixitup');
        })
    });
});
