app.controller('ContactController', function ContactController($scope, $anchorScroll,authService, vcRecaptchaService, contactformService) {

    var vm = this;
    vm.authService = authService;

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
        console.info('Created widget ID: %s', widgetId);
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
        console.log('sending the captcha response to the server :', response);
        if (response == null || response == "") {
            console.log('Failed validation');
            vcRecaptchaService.reload($scope.widgetId);
        } else {
            //console.log('Success');
            console.log($scope.contact);
            //$scope.tmpval = [];
            //$scope.tmpval.push($scope.contact);
            contactformService.create($scope.contact, function(res) {
                console.log(res);
            })

        }
    }


    $anchorScroll();

});
