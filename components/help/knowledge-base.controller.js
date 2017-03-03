app.controller('KnowledgeBaseController', KnowledgeBaseController);

    KnowledgeBaseController.$inject = ['authService', 'NavShrink'];

    function KnowledgeBaseController(authService, NavShrink) {

        var vm = this;
        vm.authService = authService;

        NavShrink.shrink();
    }

