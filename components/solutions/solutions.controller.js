app.controller('SolutionsController', function SolutionsController($anchorScroll, authService, NavShrink) {

    var vm = this;
    vm.authService = authService;

    NavShrink.shrink();
    $anchorScroll();

})
