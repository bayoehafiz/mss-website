app.controller('ItInfrastructureController', function($scope, $anchorScroll, authService, NavShrink, $state) {

    var vm = this;
    vm.authService = authService;

    NavShrink.shrink(); // Sticky Navigation

    $scope.openForm = function() {
    	//$state.go('it-infrastructure-order');
    	$state.go('contact');
    }

    $anchorScroll();
});