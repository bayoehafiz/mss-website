app.controller('HardwaresController', function($scope, $anchorScroll, authService, NavShrink, productService, blockUI, $timeout, $q) {
    $scope.items = [];
    $scope.categories = ['network', 'mikrotik', 'cctv'];

    productService.get().then(function(response) {
        var promises = [];
        angular.forEach(response.data, function(val) {
            if (val.type == 'hardware') {
                promises.push(val);
            };
        });

        $q.all(promises).then(function(response) {
            $scope.items = response;
        })
    });

    NavShrink.shrink();
    $anchorScroll();
});
