app.controller('SoftwaresController', function($scope, $rootScope, $window, $anchorScroll, authService, NavShrink, productService, CartService, localStorageService, $q) {
    NavShrink.shrink();

    $scope.categories = ['email', 'office', 'windows'];

    productService.get().then(function(response) {
        var promises = [];
        angular.forEach(response.data, function(val) {
            if (val.type == 'software') {
                promises.push(val);
            };
        });

        $q.all(promises).then(function(response) {
            $scope.softwares = response;
        })
    });

    $anchorScroll();
});