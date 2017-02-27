app.controller('ProfileController', ProfileController);

function ProfileController($scope, $state, authService, userService, blockUI, $timeout, ngDialog) {
    // Get the reference to the block service.
    var myBlockUI = blockUI.instances.get('loadingBlock');
    // Start blocking the element.
    myBlockUI.start();

    var initValue, uid;

    // get profiel data
    function getUserData() {
        authService.getProfileDeferred().then(function(data) {
            $scope.userData = data;
            uid = data.user_id;
            initValue = data;
        })
    }

    // Watch user data changes
    $scope.$watch("userData", function(oldVal, newVal) {
        if (newVal != initValue)
            $scope.showbtn = true;
        else
            $scope.showbtn = false;
    }, true);

    $scope.update = function() {
        userService.update(uid, {
            user_metadata: $scope.userData
        }).then(function(response) {
            if (response.status == 200) {
                console.log(response.data);
                // update PROFILE session
                localStorage.removeItem('profile');
                localStorage.setItem('profile', JSON.stringify(response.data));
                getUserData();
                // success notification
                ngDialog.open({
                    template: 'components/modals/message.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    controller: ['$scope', function($scope) {
                        $scope.type = 'success';
                        $scope.line1 = "Your profile is updated";
                    }]
                });
            } else {
                // error notification
                ngDialog.open({
                    template: 'components/modals/message.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    controller: ['$scope', function($scope) {
                        $scope.type = 'error';
                        $scope.line1 = "Failed updating your profile";
                        $scope.line2 = "Please try again later"
                    }]
                });
            }
        });
    }

    $scope.close = function() {
        $state.go('account');
    }

    getUserData();

    $timeout(function() {
        // Stop the block after some async operation.
        myBlockUI.stop();
    }, 1000);
}
