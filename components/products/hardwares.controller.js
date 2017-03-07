app.controller('HardwaresController', function($scope, $anchorScroll, authService, NavShrink, productService, blockUI, $timeout, $q) {

    productService.get().then(function(response) {
        var promises = [];
        angular.forEach(response.data, function(val) {
            if (val.type == 'hardware') {
                promises.push(val);
            };
        });

        $q.all(promises).then(function(response) {
            $scope.hardwares = response;
        })
    });

    NavShrink.shrink();
    $anchorScroll();
});
