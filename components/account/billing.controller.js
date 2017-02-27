app.controller('BillingController', BillingController);

function BillingController($scope, $state) {
	$scope.close = function() {
		$state.go('account');
	}
}