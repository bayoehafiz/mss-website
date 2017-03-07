app.controller('QuotationController', function QuotationController($scope, $q, $state, $http, $location, $anchorScroll, authService, NavShrink, vcRecaptchaService, $q, orderFormService, authManager, ngDialog, blockUI, $timeout, userService) {
    var vm = this;
    vm.authService = authService;

    $scope.softwaredev = {
        name: '',
        email: '',
        priority: '',
        company: '',
        phone: '',
        description: '',
        budget: ''
    };

    //auto fill when user has been logged in
    if ($scope.isAuthenticated && localStorage.getItem('profile') != undefined) {
        var userProfile = JSON.parse(localStorage.getItem('profile'));
        if (userProfile.user_metadata != undefined) {
            var firstname = userProfile.user_metadata.first_name;
            var lastname = userProfile.user_metadata.last_name;
            var fullname = firstname + " " + lastname;
            var company = userProfile.user_metadata.company_name;
            var address = userProfile.user_metadata.company_address;
            var phone = userProfile.user_metadata.phone_number;

            $scope.softwaredev.name = fullname;
            $scope.softwaredev.company = company;
            $scope.softwaredev.address = address;
            $scope.softwaredev.phone = phone;
        }

        var email = userProfile.email;
        $scope.softwaredev.email = email;
    }

    function isRegistered() {
        if (localStorage.getItem('profile') != undefined) {
            var profile = JSON.parse(localStorage.getItem('profile'));
            console.log(profile);
            if (profile.user_metadata != undefined) {
                console.log("user metafo_data defined");
                return true;
            } else {
                console.log("user metafo_data undefined");
                return false;
            }
        }
    };

    $scope.setWidgetId = function(widgetId) {
        console.info('Created widget ID: %s', widgetId);
        $scope.widgetId = widgetId;
    };

    $scope.setResponse = function(response) {
        console.info('Response available');
        $scope.response = response;
        // send the `response` to your server for verification.
    };

    // $scope.cbExpiration = function() {
    //     console.info('Captcha expired. Resetting response object');
    //     vcRecaptchaService.reload($scope.widgetId);
    //     $scope.response = null;
    // };

    function getQuote(fo_data) {

        orderFormService.sd_submit(fo_data);
    }

    $scope.submit = function() {
        var fo_data = $scope.softwaredev;
        var response = $scope.response;
        console.log(fo_data);
        console.log('sending the captcha response to the server :', response);
        if (response == null || response == "") {
            console.log('Failed validation');
            // vcRecaptchaService.reload($scope.widgetId);
        } else {
            console.log('Success');
            //if user not login
            if (!$scope.isAuthenticated) {
                // sign the guest in
                orderFormService.signUser(fo_data.email).then(function(response, id_token, profile) {
                    if (response.status == 200) {
                        ngDialog.open({
                            template: 'components/modals/verify-code.html',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            closeByEscape: false,
                            closeByNavigation: false,
                            closeByDocument: false,
                            cache: false,
                            scope: $scope,
                            controller: ['$scope', 'orderFormService', 'blockUI', '$timeout', 'userService', 'orderFormService', function($scope, orderFormService, blockUI, $timeout, userService, orderFormService) {
                                $scope.verify = function(code) {
                                    // Get the reference to the block service.
                                    var myBlockUI = blockUI.instances.get('loadingBlockModal');
                                    // Start blocking the element.
                                    myBlockUI.start();

                                    orderFormService
                                        .verifyCode(fo_data.email, code)
                                        .then(function(response) {
                                            if (response.status == 200) {
                                                localStorage.setItem('id_token', response.data.id_token);
                                                localStorage.setItem('user_token', response.data.access_token);

                                                // check if user registered or not
                                                orderFormService
                                                    .getUserProfile(response.data.access_token)
                                                    .then(function(response) {

                                                        var wantedUser = response.data;
                                                        localStorage.setItem('profile', JSON.stringify(wantedUser));

                                                        // user already registered
                                                        if (wantedUser.user_metadata != undefined) {
                                                            console.log('User is registered, syncing the form now...');

                                                            // replace form data with related user's data
                                                            fo_data.name = wantedUser.user_metadata.first_name + ' ' + wantedUser.user_metadata.last_name;
                                                            fo_data.company = wantedUser.user_metadata.company_name;
                                                            fo_data.phone = wantedUser.user_metadata.phone_number;
                                                            fo_data.address = wantedUser.user_metadata.company_address + ', ' + wantedUser.user_metadata.city + ', ' + wantedUser.user_metadata.province;

                                                            // send the form
                                                            console.log('.. sending the form');
                                                            orderFormService.sd_submit(fo_data).then(function(response) {
                                                                if (response.success) {
                                                                    ngDialog.open({
                                                                        template: 'components/modals/message.html',
                                                                        className: 'ngdialog-theme-default',
                                                                        scope: $scope,
                                                                        controller: ['$scope', function($scope) {
                                                                            $scope.type = 'success';
                                                                            $scope.line1 = "Thank You. Your form has been submitted succesfully and is going into our sales email. We'll get you in touch soon!";
                                                                        }]
                                                                    });

                                                                    // $state.go('account.order');
                                                                }
                                                            })
                                                        }

                                                        // if user is not registered
                                                        else {
                                                            console.log('User is not registered, getting to signup page...');
                                                            // save form data into local-storage & set origin-state flag
                                                            localStorage.setItem('fo_data', JSON.stringify(fo_data));
                                                            localStorage.setItem('fo_type', 'it');
                                                            $scope.closeThisDialog();
                                                            $state.go('account');
                                                        }
                                                    })

                                            } else {
                                                $scope.error = "Wrong passcode!";
                                            }

                                            $timeout(function() {
                                                // Stop the block after some async operation.
                                                myBlockUI.stop();
                                            }, 1000);
                                        })
                                }
                            }]
                        });
                    } else {
                        alert("Error sending access code to " + fo_data.email);
                    }
                })
            }
            // if user already logged in
            else {
                var wantedUser = JSON.parse(localStorage.getItem('profile'));

                // if user not registered
                if (wantedUser.user_metadata != undefined) {
                    // send the form
                    orderFormService.sd_submit(fo_data).then(function(response) {
                        // Get the reference to the block service.
                        var myBlockUI = blockUI.instances.get('loadingBlock');
                        // Start blocking the element.
                        myBlockUI.start();
                        console.log(response);
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
                                    $state.go('software-development');
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
                                }]
                            });
                        }

                        myBlockUI.stop();
                    });

                } else {
                    // save form data into local-storage & set origin-state flag
                    localStorage.setItem('fo_data', JSON.stringify(fo_data));
                    localStorage.setItem('fo_type', 'it');
                    $state.go('account');

                }
            }
        }
    }

    $scope.back = function() {
        prevState = localStorage.getItem('prev_state');
        if (prevState == '' || prevState == undefined)
            $state.go('software-development');
        else
            $state.go(prevState);
    }

    $anchorScroll();
});
