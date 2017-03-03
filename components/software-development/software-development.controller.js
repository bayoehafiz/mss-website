app.controller('SoftwareDevController', function SoftwareDevController($anchorScroll, authService, NavShrink) {

    var vm = this;
    vm.authService = authService;

    NavShrink.shrink(); // Sticky Navigation
   	

   	$anchorScroll();
});
