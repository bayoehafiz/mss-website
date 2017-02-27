app.controller('PortfolioController', PortfolioController);

PortfolioController.$inject = ['$scope', '$location', '$anchorScroll', 'authService', 'NavShrink'];

function PortfolioController($scope, $location, $anchorScroll, authService, NavShrink) {

    var vm = this;
    vm.authService = authService;

    
}
