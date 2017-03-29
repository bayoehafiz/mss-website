app.controller('CompanyProfileController', function($scope, $q, $state, $http, $location, $anchorScroll, authService, NavShrink, vcRecaptchaService, $q, orderFormService, authManager, ngDialog, blockUI, $timeout, userService) {
    var vm = this;
    vm.authService = authService;

    $scope.features = ['Product/Service','Portfolio','CSR/Investor','News/Article/Blog','Gallery','Download Page/catalogue','Career/Jobs'];
    $scope.addons = ['Interactive Map','Chat','Analytics','Search'];
    $scope.extras = ['Logo design','PSD slicing','Premium template'];

    $scope.cp = {
        name: '',
        email: '',
        company: '',
        phone: '',
        feats: [],
        plugin: [],
        extfeature: [],
    };
    $scope.feat = {};
    $scope.plugins = {};
    $scope.extfeat = {};

    $scope.submit = function() {
        angular.forEach($scope.feat, function(key, value) {
            if(key) $scope.cp.feats.push(value)
        });  
        angular.forEach($scope.plugins, function(key1, value1) {
            if(key1) $scope.cp.plugin.push(value1)
        });
        angular.forEach($scope.extfeat, function(key2, value2) {
            if(key2) $scope.cp.extfeature.push(value2)
        });
        console.log($scope.cp);      
    };
});
