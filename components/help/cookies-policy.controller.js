app.controller('CookiesPolicyController', CookiesPolicyController);

    CookiesPolicyController.$inject = ['authService', 'NavShrink'];

    function CookiesPolicyController(authService, NavShrink) {

        var vm = this;
        vm.authService = authService;

        NavShrink.shrink();
    }

