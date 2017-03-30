app.controller('CompanyProfileController', function($scope, $q, $state, $http, $location, $anchorScroll, authService, NavShrink, vcRecaptchaService, $q, orderFormService, authManager, ngDialog, blockUI, $timeout, userService) {
    var vm = this;
    vm.authService = authService;

    $scope.features = [{
        name: 'Product/Service',
        price: 2400000
    }, {
        name: 'Portfolio',
        price: 1400000
    }, {
        name: 'CSR/Investor',
        price: 1200000
    }, {
        name: 'News/Article/Blog',
        price: 1200000
    }, {
        name: 'Gallery',
        price: 800000
    }, {
        name: 'Download Page/catalogue',
        price: 600000
    }, {
        name: 'Career/Jobs',
        price: 400000
    }];
    $scope.addons = ['Interactive Map', 'Chat', 'Analytics', 'Search'];
    $scope.extras = ['Logo design', 'PSD slicing', 'Premium template'];

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
    $scope.totprice = 2000000;
    $scope.selectedItems = [];

    $scope.selectItems = function(item) {
        var total = 2000000;
        angular.forEach($scope.feat, function(key, value) {
            if (key)  total += $scope.features[value].price; 
        });
        $scope.totprice = total;
    }

    $scope.submit = function() {
        angular.forEach($scope.feat, function(key, value) {
            if (key) $scope.cp.feats.push($scope.features[value].name);
        });
        angular.forEach($scope.plugins, function(key1, value1) {
            if (key1) $scope.cp.plugin.push(value1)
        });
        angular.forEach($scope.extfeat, function(key2, value2) {
            if (key2) $scope.cp.extfeature.push(value2)
        });
        //console.log($scope.cp);
    };
});
