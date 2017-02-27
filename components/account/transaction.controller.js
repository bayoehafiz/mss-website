app.controller('TransactionController', TransactionController);

function TransactionController($scope, $state) {
    $scope.close = function() {
        $state.go('account');
    }
}
