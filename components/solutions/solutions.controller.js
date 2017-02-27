app.controller('SolutionsController', SolutionsController);

function SolutionsController(authService, NavShrink) {

    var vm = this;
    vm.authService = authService;

     NavShrink.shrink();

}
