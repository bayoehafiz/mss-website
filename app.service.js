app
    .service('authService', authService)
    .service("userService", userService)
    .service('splashModal', splashModalService)
    .service('sotfwareService', sotfwareService)
    .service('hardwareService', hardwareService)
    .service('orderFormService', orderFormService)
    .service('contactformService', contactformService)
    .service('productRetailService', productRetailService);

function authService(lockPasswordless, authManager, $q, $state, $http) {
    var userProfile = JSON.parse(localStorage.getItem('profile'));
    var deferredProfile = $q.defer();

    if (userProfile) {
        deferredProfile.resolve(userProfile);
    }

    var options = {
        icon: 'assets/img/msslog.png',
        primaryColor: '#1c4488',
        defaultLocation: "ID",
        auth: {
            redirect: false
        },
        dict: {
            code: {
                codeInputPlaceholder: "Type your access code",
                footerText: "",
                headerText: "Access code has been sent to {email}.",
                resendLabel: "Didn't get email?"
            },
            email: {
                emailInputPlaceholder: "your@email.com",
                footerText: "",
                headerText: "Enter your valid email address to get access code"
            },
            title: "Sign in to MSS",
            welcome: "Hello {name}!"
        }
    }

    function login() {
        lockPasswordless.emailcode(options, function(error, profile, id_token) {
            console.log(error, profile, id_token);
            if (error) {
                console.log(error);
                return;
            }

            localStorage.setItem('id_token', id_token);
            authManager.authenticate();
            localStorage.setItem('profile', JSON.stringify(profile));

            deferredProfile.resolve(profile);
            $state.go('account');
            lockPasswordless.close();
        });
    }

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
        deferredProfile = $q.defer();
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        authManager.unauthenticate();
        userProfile = null;

        $state.go('home');
    }

    function getProfileDeferred() {
        return deferredProfile.promise;
    }

    function setNewToken() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://mssid.auth0.com/oauth/token",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": "{\"client_id\":\"lx0y61VUgT4CHM1Tmzpi6FWXXu8317LI\",\"client_secret\":\"atHXhdlWnm0YYX3yj_lNi_sj_yawx-q3uTw0bA8h4IvdqCsf_IFgZkQm-3dc7lex\",\"audience\":\"https://mssid.auth0.com/api/v2/\",\"grant_type\":\"client_credentials\"}"
        };

        $.ajax(settings).done(function(response) {
            localStorage.setItem('access_token', JSON.stringify(response));
        });
    }

    return {
        login: login,
        logout: logout,
        getProfileDeferred: getProfileDeferred,
        setNewToken: setNewToken
    }
};

function userService($http) {
    var vm = this;
    var name = '/users';

    //get the object name and optional parameters
    vm.queryByEmail = function(email) {
        var tokenData = JSON.parse(localStorage.getItem('access_token'));
        var auth_header = tokenData.token_type + " " + tokenData.access_token;

        return $http({
            method: 'GET',
            url: AUTH0_API_URL + name + '?q=' + email,
            headers: {
                'Authorization': auth_header
            }
        });
    }

    vm.get = function(uid) {
        var tokenData = JSON.parse(localStorage.getItem('access_token'));
        var auth_header = tokenData.token_type + " " + tokenData.access_token;

        return $http({
            method: 'GET',
            url: AUTH0_API_URL + name + '?' + uid,
            headers: {
                'Authorization': auth_header
            }
        });
    }

    vm.update = function(uid, data) {
        var tokenData = JSON.parse(localStorage.getItem('access_token'));
        var auth_header = tokenData.token_type + " " + tokenData.access_token;

        return $http({
            method: 'PATCH',
            url: AUTH0_API_URL + name + "/" + uid,
            data: data,
            headers: {
                'Authorization': auth_header
            }
        });
    }

    vm.remove = function(id) {
        var tokenData = JSON.parse(localStorage.getItem('access_token'));
        var auth_header = tokenData.token_type + " " + tokenData.access_token;

        return $http({
            method: 'DELETE',
            url: AUTH0_API_URL + name + "/" + uid,
            headers: {
                'Authorization': auth_header
            }
        });
    }
};

function splashModalService($uibModal, $rootScope) {
    return {
        open: function(attrs, opts) {
            var scope = $rootScope.$new();
            angular.extend(scope, attrs);
            opts = angular.extend(opts || {}, {
                backdrop: false,
                scope: scope,
                templateUrl: 'splash/content.html',
                windowTemplateUrl: 'splash/index.html'
            });
            return $uibModal.open(opts);
        }
    };
}

function sotfwareService($http, URL_BASE) {

    var API = "http://a.msscloud.id/";

    var get = function() {
        return $http.get('data/software.json');
    }

    return {
        get: get
    }
};

function hardwareService($http) {
    var get = function() {
        return $http.get('data/hardware.json');
    }

    return {
        get: get
    }
};


function productRetailService($http) {
    var get = function() {
        return $http.get('data/product-retail.json');
    }

    return {
        get: get
    }
}

function orderFormService($resource, $http) {
    var API = "http://a.msscloud.id/";

    var signUser = function(email) {
        var data = {
            "client_id": "842g1mnOSHptfdW19KVlvyahlIzq8xwZ",
            "connection": "email",
            "email": email,
            "send": "code"
        }

        return $http({
            method: 'POST',
            url: AUTH0_AUTH_URL + "/passwordless/start",
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    var verifyCode = function(email, code) {
        var data = {
            "client_id": "842g1mnOSHptfdW19KVlvyahlIzq8xwZ",
            "connection": "email",
            "grant_type": "password",
            "username": email, //email or phone number
            "password": code, //the verification code
            "scope": "openid profile email"
        }

        return $http({
            method: 'POST',
            url: AUTH0_AUTH_URL + "/oauth/ro",
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    var getUserProfile = function(token) {
        return $http({
            method: 'GET',
            url: AUTH0_AUTH_URL + '/userinfo',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        });
    }

    var sd_submit = function(data) {
        return $http({
            method: 'POST',
            url: API + 'quotation/soft_dev',
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    var it_submit = function(data) {
        return $http({
            method: 'POST',
            url: API + 'quotation/it_infra',
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    var get_data = function(email) {
        return $http({
            method: 'GET',
            url: API + 'quotation/' + email,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return {
        signUser: signUser,
        verifyCode: verifyCode,
        getUserProfile: getUserProfile,
        sd_submit: sd_submit,
        it_submit: it_submit,
        get_data: get_data
    }
};


function contactformService($resource) {
    var API = "http://a.msscloud.id/";
    create = function(data) {
        return $resource(API + 'contactform').save(data);
    }
    return {
        create: create
    }

}
