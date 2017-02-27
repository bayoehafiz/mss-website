app.controller('SoftwareDevController', SoftwareDevController);

function SoftwareDevController(authService, NavShrink) {

    var vm = this;
    vm.authService = authService;

    NavShrink.shrink(); // Sticky Navigation

}
