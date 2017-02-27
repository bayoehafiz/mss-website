app.controller('OrderController', function(orderFormService, $http, $state, $scope, $window, authService, NavShrink, localStorageService) {
    NavShrink.shrink();

    var userProfile = JSON.parse(localStorage.getItem('profile'));
    const userEmail = userProfile.email;

    $scope.selected = [];

    function success(response) {
        console.log(response);
        $scope.orders = [];
        var data = response.data.message;
        data.forEach(function(val) {
            if (val.type_project == undefined) {
                val.order_type = 'softwarefo';
            } else {
                val.order_type = 'itinfrafo';
            }
            $scope.orders.push(val);
        })
    }

    $scope.getOrders = function() {
        $scope.promise = orderFormService
            .get_data(userEmail)
            .then(success)
            .$promise;
    };


    $scope.changeme = function() {
        console.log("success");
    }

    $scope.openForminfra = function() {
        $state.go('it-infrastructure-order');
    }
    $scope.openFormsoft = function() {
        $state.go('software-development-order');
    }

    $scope.close = function() {
        $state.go('account');
    }

    $scope.getOrders();
});
