app.controller('PortfolioController', function PortfolioController($scope, $location, $anchorScroll, authService, NavShrink) {

    var vm = this;
    vm.authService = authService;

    $anchorScroll();
});
