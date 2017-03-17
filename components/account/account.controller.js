app.controller('AccountController', AccountController);

function AccountController($scope, $state, authService, userService, Notification, blockUI, $timeout, ngDialog, orderFormService, checkoutService) {
    // Get the reference to the block service.
    var myBlockUI = blockUI.instances.get('loadingBlock');
    // Start blocking the element.
    myBlockUI.start();
    
    if ($scope.isAuthenticated) {
        $scope.user = {};
        $scope.signupData = {};
        $scope.completed = false;
        $scope.showMain = false;

        // check if user is coming from order-form
        if (localStorage.getItem('fo_type') != undefined) {
            $timeout(function() {
                ngDialog.open({
                    template: 'components/modals/message.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    controller: ['$scope', function($scope) {
                        $scope.type = 'warning';
                        $scope.line1 = "Please complete your profile first.";
                        $scope.line2 = "Don't worry, your order data is save and will be sent directly after you completed this step.";
                    }]
                });
            }, 500);

            // Save filled form-data & re-assign them
            var formData = JSON.parse(localStorage.getItem('fo_data'));
            $scope.signupData = {
                first_name: formData.name,
                phone_number: formData.phone,
                company_name: formData.company,
                company_address: formData.address
            }

            // get user profile and save it to local storage
            userService.queryByEmail(formData.email).then(function(response) {
                var wantedUser,
                    listUsers = response.data;
                listUsers.forEach(function(val) {
                    if (val.email == formData.email) {
                        wantedUser = val;
                    }
                });
                localStorage.setItem('profile', JSON.stringify(wantedUser));
            })
        }

        authService.getProfileDeferred().then(function(profile) {
            $scope.user = profile;
            if (profile.user_metadata === undefined) { // if user_metadata not found!
                $scope.completed = false;
            } else {
                $scope.completed = true;
                $scope.showMain = true;
            }

            $timeout(function() {
                // Stop the block after some async operation.
                myBlockUI.stop();
            }, 1000);
        });

        $scope.signup = function() {
            myBlockUI.start();
            $scope.error = undefined;

            userService.update($scope.user.user_id, {
                user_metadata: $scope.signupData
            }).then(function(response) {
                if (response.status == 200) {
                    // update PROFILE session
                    localStorage.setItem('profile', JSON.stringify(response.data));
                    $scope.completed = true;

                    if (localStorage.getItem('fo_data') != undefined) {
                        var fo_data = JSON.parse(localStorage.getItem('fo_data'));

                        // send the form
                        if (localStorage.getItem('fo_type') == 'it') {
                            // Send INFRA form data
                            orderFormService.it_submit(fo_data).then(function(response) {
                                if (response.data.success) {
                                    ngDialog.open({
                                        template: 'components/modals/message.html',
                                        className: 'ngdialog-theme-default',
                                        scope: $scope,
                                        cache: false,
                                        controller: ['$scope', function($scope) {
                                            $scope.type = 'success';
                                            $scope.line1 = "Thank You. Your form has been submitted succesfully and is going into our sales team's email. We'll get you in touch soon!";
                                        }],
                                        preCloseCallback: function() {
                                            var payment = localStorage.getItem('pay_page');
                                            if (payment){
                                                $state.go('order');
                                            }
                                            else{
                                                $state.go('order');
                                            }
                                            localStorage.removeItem('fo_type');
                                            localStorage.removeItem('fo_data');
                                            

                                        }
                                    });
                                } 
                                else {
                                    ngDialog.open({
                                        template: 'components/modals/message.html',
                                        className: 'ngdialog-theme-default',
                                        scope: $scope,
                                        cache: false,
                                        controller: ['$scope', function($scope) {
                                            $scope.type = 'error';
                                            $scope.line1 = "Error submitting your data. Please try again later!";
                                        }],
                                        preCloseCallback: function() {
                                            localStorage.removeItem('fo_type');
                                            localStorage.removeItem('fo_data');
                                        }
                                    });
                                }
                            })
                        }
                        else{
                            // Send SOFTDEV form data
                            orderFormService.sd_submit(fo_data).then(function(response) { 
                                if (response.data.success) {
                                    ngDialog.open({
                                        template: 'components/modals/message.html',
                                        className: 'ngdialog-theme-default',
                                        scope: $scope,
                                        cache: false,
                                        controller: ['$scope', function($scope) {
                                            $scope.type = 'success';
                                            $scope.line1 = "Thank You. Your form has been submitted succesfully and is going into our sales team's email. We'll get you in touch soon!";
                                        }],
                                        preCloseCallback: function() {
                                            localStorage.removeItem('fo_type');
                                            localStorage.removeItem('fo_data');
                                            $state.go('order');
                                        }
                                    });
                                } else {
                                    ngDialog.open({
                                        template: 'components/modals/message.html',
                                        className: 'ngdialog-theme-default',
                                        scope: $scope,
                                        cache: false,
                                        controller: ['$scope', function($scope) {
                                            $scope.type = 'error';
                                            $scope.line1 = "Error submitting your data. Please try again later!";
                                        }],
                                        preCloseCallback: function() {
                                            localStorage.removeItem('fo_type');
                                            localStorage.removeItem('fo_data');
                                        }
                                    });
                                }
                            })
                        }
                    }
                    else if (localStorage.getItem('pay_page') == 'payment'){
                        console.log("you are in the account page");
                        var cart_data = JSON.parse(localStorage.getItem('cart_data'));
                        checkoutService.posttoken(cart_data).then(function(res) {
                                var response = res.data;
                                if (response.success) {
                                    if (response.data.token) {
                                        snap.pay(res.data.data.token, {
                                            onSuccess: function(result) {
                                                console.log('success');
                                                console.log(result);
                                            },
                                            onPending: function(result) {
                                                console.log('pending');
                                                console.log(result);
                                            },
                                            onError: function(result) {
                                                console.log('error');
                                                console.log(result);
                                            },
                                            onClose: function() { console.log('customer closed the popup without finishing the payment'); }
                                        });
                                    } else {
                                        alert(response.data.error_messages[0]);
                                    }
                                }
                            })
                        //localStorage.removeItem('pay_page');
                    }
                    else {
                        $scope.showMain = true;
                    }
                }
                else {
                    $scope.error = response.data.message;
                }

                $timeout(function() {
                    // Stop the block after some async operation.
                    myBlockUI.stop();
                }, 1000);
            });
        }
    }

    $scope.signin = function() {
        authService.login();
    }

    $scope.signout = function() {
        authService.logout();
    }

    $scope.open = function(page) {
        $state.go(page);
    }

    $timeout(function() {
        // Stop the block after some async operation.
        myBlockUI.stop();
    }, 1000);
}
