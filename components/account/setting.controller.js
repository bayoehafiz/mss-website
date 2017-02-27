app.controller('SettingController', SettingController);

function SettingController($scope, $state) {
	$scope.close = function() {
		$state.go('account');
	}
}