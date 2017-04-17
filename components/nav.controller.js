app.controller('NavController', NavController);

function NavController($scope, $window) {
    $scope.myAccount = function() {
    	console.log('redirecting...');
        $window.location.href = "https://my.mss.co.id";
    }
}
