app.controller('ContactController', function ContactController($scope, $anchorScroll, vcRecaptchaService, contactformService) {
    $scope.contact = {
        name: '',
        email: '',
        comment: ''
    };

    var userProfile = JSON.parse(localStorage.getItem('profile')) || null;
    if (userProfile) {
        var firstname = userProfile.user_metadata.first_name;
        var lastname = userProfile.user_metadata.last_name;
        var fullname = firstname + " " + lastname;
        var email = userProfile.email;
        $scope.contact = {};
        $scope.contact.name = fullname;
        $scope.contact.email = email;
    }
    $scope.setWidgetId = function(widgetId) {
        $scope.widgetId = widgetId;
    };

    $scope.setResponse = function(response) {
        console.info('Response available');
        $scope.response = response;
        // send the `response` to your server for verification.
    };

    $scope.cbExpiration = function() {
        console.info('Captcha expired. Resetting response object');
        vcRecaptchaService.reload($scope.widgetId);
        $scope.response = null;
    };


    $scope.submit = function() {
        var response = $scope.response;

        if (response == null || response == "") {
            localStorage.setItem('callback_contact_captcha_error', 'Please fill captcha correctly');
            var callback = localStorage.getItem('callback_contact_captcha_error');
            document.getElementById('callbackerror').innerHTML = callback;
            document.getElementById('callbacksuccess').innerHTML = "";
            localStorage.removeItem('callback_contact_captcha_error');
            var callback = "";
            vcRecaptchaService.reload($scope.widgetId);

        } else {

            contactformService.submit($scope.contact).then(function(response) {
                console.log(response);
                if (!response.data.success) {
                    localStorage.setItem('callback_contact_captcha_error', response.data.message);
                    var callback = localStorage.getItem('callback_contact_captcha_error');
                    localStorage.removeItem('callback_contact_captcha_error');

                } else {
                    localStorage.setItem('callback_contact_captcha_success', 'Thank You for contact us, we will touch you under 1x24 hours');
                    var callback = localStorage.getItem('callback_contact_captcha_success');
                    localStorage.removeItem('callback_contact_captcha_success');

                    $scope.contact = {
                        name: '',
                        email: '',
                        comment: ''
                    };
                }

                document.getElementById('callbacksuccess').innerHTML = callback;
                document.getElementById('callbackerror').innerHTML = "";
                var callback = "";
                vcRecaptchaService.reload($scope.widgetId);
            });
        }
    }

    $anchorScroll();

});
