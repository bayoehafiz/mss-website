app.controller('KnowledgeBaseController', function KnowledgeBaseController($anchorScroll, authService, NavShrink) {

    var vm = this;
    vm.authService = authService;

    NavShrink.shrink();

    $anchorScroll();
});
