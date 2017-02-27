app.controller('SupportController', SupportController);

function SupportController($scope, $state) {
	$scope.close = function() {
		$state.go('account');
	}
}