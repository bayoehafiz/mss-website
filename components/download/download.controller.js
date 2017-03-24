app.controller('DownloadController', function($scope, $rootScope, $http, $location, oneDriveFactory) {

    // User search query 
    $scope.query = $location.search().q;
    // Search result 
    $scope.items = null;
    // Retrieve data from Office 365 
    $scope.loadItems = function() {
            oneDriveFactory.searchItems($scope.query)
                .then(
                    function(response) {
                        // set result 
                        $scope.items = response.data.value;
                    }, $rootScope.responseError);
        }
        // if user query is not empty load data from Office 365 
    if ($scope.query) {
        $scope.loadItems();
    }

    NavShrink.shrink();
    $anchorScroll();
});
