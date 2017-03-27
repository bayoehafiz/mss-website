app.controller('DownloadController', function($scope, $rootScope, $http, $location, fileService, $q) {
    fileService.get().then(function(response) {
        var promises = [];
        angular.forEach(response.data, function(val) {
            promises.push(val);
            console.log(val)
        });

        $q.all(promises).then(function(response) {
            console.log(response)
            $scope.files = response;
        })
    });
});
