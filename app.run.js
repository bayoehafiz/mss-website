app.run(run);

function run($rootScope, authService, authManager, bsLoadingOverlayService, Analytics) {
    $rootScope.authService = authService;

    // check jwt token 
    authManager.checkAuthOnRefresh();
    if (localStorage.getItem('access_token') == undefined) {
        authService.setNewToken();
    }

    // refresh auth0 access token
    $rootScope.$on('tokenHasExpired', function() {
        console.log('Refreshing ACCESS TOKEN...');
        authService.setNewToken();
    });

    // Loading overlay
    bsLoadingOverlayService.setGlobalConfig({
        templateUrl: 'components/loading.html'
    });

    bsLoadingOverlayService.start();

    // Page loader on state change
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    })

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        localStorage.setItem('prev_state', fromState.name);
    })

}
