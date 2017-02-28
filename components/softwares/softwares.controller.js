app.controller('SoftwaresController', function($scope,authService, NavShrink, productRetailService, CartService, localStorageService) {

    var vm = this;
    vm.authService = authService;

    $scope.categories = ['email', 'windows', 'office'];

    productRetailService
        .get()
        .then(function(res) {
            $scope.items = [];
            res.data.forEach(function(val) {
                if (val.parent == 'software') {
                    $scope.items.push(val);
                }
            })

        })

    NavShrink.shrink();

   

    // $scope.items = [{
    //     "id": "poepwuriojvksdj",
    //     "name": "EMAIL BUSINESS STANDARD",
    //     "img": "assets/img/retail/email-1.png",
    //     "price": 65000,
    //     "periode": "Monthly",
    //     "group": "email",
    //     "desc": "Lorem ipsum dolor sit amet, consoleectetur adipisicing elit. Officia, omnis illo iste ratione. Numquam eveniet quo, ullam itaque expedita impedit. Eveniet, asperiores amet iste repellendus similique reiciendis, maxime laborum praesentium."

    // }, {
    //     "id": "ahzfchxgauhis",
    //     "name": "EMAIL BUSINESS PREMIUM",
    //     "img": "assets/img/retail/email-2.png",
    //     "price": 85000,
    //     "periode": "Monthly",
    //     "group": "email",
    //     "desc": "Lorem ipsum dolor sit amet, consoleectetur adipisicing elit. Officia, omnis illo iste ratione. Numquam eveniet quo, ullam itaque expedita impedit. Eveniet, asperiores amet iste repellendus similique reiciendis, maxime laborum praesentium."

    // }, {
    //     "id": "r8eutisjvkjfiofn",
    //     "name": "EMAIL ENTERPRISE",
    //     "img": "assets/img/retail/email-3.png",
    //     "price": 215000,
    //     "periode": "Monthly",
    //     "group": "email",
    //     "desc": "Lorem ipsum dolor sit amet, consoleectetur adipisicing elit. Officia, omnis illo iste ratione. Numquam eveniet quo, ullam itaque expedita impedit. Eveniet, asperiores amet iste repellendus similique reiciendis, maxime laborum praesentium."

    // }, {
    //     "id": "63542vhnklhgwi39tfjklndsa",
    //     "name": "OFFICE STANDARD 2016",
    //     "img": "assets/img/retail/office2016.jpg",
    //     "price": 5703000,
    //     "periode": "One Time Buy",
    //     "group": "office",
    //     "desc": "Lorem ipsum dolor sit amet, consoleectetur adipisicing elit. Officia, omnis illo iste ratione. Numquam eveniet quo, ullam itaque expedita impedit. Eveniet, asperiores amet iste repellendus similique reiciendis, maxime laborum praesentium."

    // }, {
    //     "id": "mvlkjioq8ripqm",
    //     "name": "Windows Pro 10",
    //     "img": "assets/img/retail/windows10.jpg",
    //     "price": 2867000,
    //     "periode": "One Time Buy",
    //     "group": "windows",
    //     "desc": "Lorem ipsum dolor sit amet, consoleectetur adipisicing elit. Officia, omnis illo iste ratione. Numquam eveniet quo, ullam itaque expedita impedit. Eveniet, asperiores amet iste repellendus similique reiciendis, maxime laborum praesentium."

    // }, {
    //     "id": "qwertyuiolkjhgf",
    //     "name": "Windows Server Standard 2016",
    //     "img": "assets/img/retail/winserverstd.png",
    //     "price": 1693000,
    //     "periode": "One Time Buy",
    //     "group": "windows",
    //     "desc": "Lorem ipsum dolor sit amet, consoleectetur adipisicing elit. Officia, omnis illo iste ratione. Numquam eveniet quo, ullam itaque expedita impedit. Eveniet, asperiores amet iste repellendus similique reiciendis, maxime laborum praesentium."

    // }, {
    //     "id": "dakcuiasdhjk",
    //     "name": "Windows Server CAL",
    //     "img": "assets/img/retail/winserverdvc.png",
    //     "price": 684000,
    //     "periode": "One Time Buy",
    //     "group": "windows",
    //     "desc": "Lorem ipsum dolor sit amet, consoleectetur adipisicing elit. Officia, omnis illo iste ratione. Numquam eveniet quo, ullam itaque expedita impedit. Eveniet, asperiores amet iste repellendus similique reiciendis, maxime laborum praesentium."

    // }, {
    //     "id": "asmdvlasjfkajof",
    //     "name": "Windows Server CAL",
    //     "img": "assets/img/retail/winserverusr.png",
    //     "price": 877000,
    //     "periode": "One Time Buy",
    //     "group": "windows",
    //     "desc": "Lorem ipsum dolor sit amet, consoleectetur adipisicing elit. Officia, omnis illo iste ratione. Numquam eveniet quo, ullam itaque expedita impedit. Eveniet, asperiores amet iste repellendus similique reiciendis, maxime laborum praesentium."

    // }]


});
