app.controller('ItinfrastructureorderController', function(lockPasswordless, authManager, $scope, $q, $state, $http, $location, $anchorScroll, authService, NavShrink, orderFormService, vcRecaptchaService, authManager, ngDialog, blockUI, $timeout, userService) {

    $scope.checks = [{
        cat: 'Security System',
        val: [{
            name: 'CCTV'
        }, {
            name: 'Access Control'
        }],
        type: 'checkbox',
    }, {
        cat: 'Network System',
        val: [{
            name: 'Local Area Network(LAN)'
        }, {
            name: 'Wide Area Network(WAN)'
        }, {
            name: 'Fiber Optic'
        }, {
            name: 'Firewall System'
        }],
        type: 'checkbox'
    }, {
        cat: 'Telephone System',
        val: [{
            name: 'IP System'
        }, {
            name: 'Analog System'
        }, {
            name: 'Hybrid System'
        }],
        type: 'radio'
    }, {
        cat: 'Public Address System',
    }, {
        cat: 'Server System',
    }, {
        cat: 'Teleconference System',
    }, ]


    $scope.infra = {
        type_project: '',
        scopeProject: [],
        scopeProjectradio: '',
        target_complete: '',
        name: '',
        company: '',
        address: '',
        phone: '',
        email: ''
    };

    /*--start auto fill when user has been logged in--*/
    if ($scope.isAuthenticated && localStorage.getItem('profile') != undefined) {
        var userProfile = JSON.parse(localStorage.getItem('profile'));
        if (userProfile.user_metadata != undefined) {
            var firstname = userProfile.user_metadata.first_name;
            var lastname = userProfile.user_metadata.last_name;
            var fullname = firstname + " " + lastname;
            var company = userProfile.user_metadata.company_name;
            var address = userProfile.user_metadata.company_address;
            var phone = userProfile.user_metadata.phone_number;

            $scope.infra.name = fullname;
            $scope.infra.company = company;
            $scope.infra.address = address;
            $scope.infra.phone = phone;
        }

        var email = userProfile.email;
        $scope.infra.email = email;
    }
    /*--end auto fill when user has been logged in--*/


    $scope.submit = function() {
        var fo_data = $scope.infra;
        console.log(fo_data);

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
                                                            orderFormService.it_submit(fo_data).then(function(response) {
                                                                if (response.status == 200) {
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
                                        });
                                    //ngDialog.close();
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

                // if user is registered
                if (wantedUser.user_metadata != undefined) {
                    // send the form
                    orderFormService.it_submit(fo_data).then(function(response) {
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
                                    $state.go('it-infrastructure');
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

    $scope.back = function() {
        prevState = localStorage.getItem('prev_state');
        if (prevState == '' || prevState == undefined)
            $state.go('it-infrastructure');
        else
            $state.go(prevState);
    }

    $anchorScroll();
});
