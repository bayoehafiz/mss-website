app.run(run);

function run($rootScope, bsLoadingOverlayService, Analytics) {

    // Loading overlay
    bsLoadingOverlayService.setGlobalConfig({
        templateUrl: 'components/loading.html'
    });

    bsLoadingOverlayService.start();

    // Page loader on state change
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {})

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        localStorage.setItem('prev_state', fromState.name);
    })

    // Onedrive ADAL auth
    // adalAuthenticationService.login();
}
