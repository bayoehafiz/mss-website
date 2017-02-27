app.controller('ServiceController', ServiceController);

function ServiceController($scope, $state) {
	$scope.close = function() {
		$state.go('account');
	}
}