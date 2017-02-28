app.controller('HardwaresController', function($scope, authService, NavShrink, productRetailService, blockUI, $timeout) { // Get the reference to the block service.

    var vm = this;
    vm.authService = authService;

    $scope.categories = ['network', 'mikrotik', 'cctv'];

    productRetailService
        .get()
        .then(function(res) {
            $scope.items = [];
            res.data.forEach(function(val) {
                if (val.parent == 'hardware') {
                    $scope.items.push(val);
                }
            })

        })

    // $scope.items = [{
    //     "id": "78438fhf892hf9",
    //     "sn": "",
    //     "name": "UBiQUiTi Access Point Long Range",
    //     "img": "assets/img/retail/ubiquiti-unifi-distributed-wifi-access-point_0.png",
    //     "price": 1150000,
    //     "group": "network",
    //     "desc": "Featuring a clean industrial design, the UniFi® AP can be integrated seamlessly into any wall or ceiling surface (mounting kits included). The LED indicator simplifies deployment and configuration."
    // }, {
    //     "id": "y892bjef892hj",
    //     "sn": "",
    //     "name": "TP-Link TL-WR840N (V2)",
    //     "img": "assets/img/retail/TL-WR840N_un_V2_1042_normal_0_20150725145744.png",
    //     "price": 165000,
    //     "group": "network",
    //     "desc": "TL-WR840N adalah gabungan kabel / jaringan nirkabel yang dirancang khusus untuk kebutuhan jaringan usaha kecil dan usaha rumahan. TL-WR840N menciptakan kinerja nirkabel yang luar biasa dan canggih, sehingga ideal untuk streaming video HD, VoIP dan game online. Dan juga, Tombol setup (WPS) Wi-Fi Protected pada bagian luar ramping dan modis memastikan enkripsi WPA2, mencegah jaringan dari intrusi luar."
    // }, {
    //     "id": "hjdsa79whfuiah",
    //     "sn": "",
    //     "name": "MikroTik RB1100Ahx2",
    //     "img": "assets/img/retail/718_hi_res.png",
    //     "price": 6200000,
    //     "group": "mikrotik",
    //     "desc": "RB1100AHx2 is 1U rackmount Gigabit Ethernet router - with a dual core CPU, it can reach up to a million packets per second and supports hardware encryption! It has thirteen individual gigabit Ethernet ports, two 5-port switch groups, and includes Ethernet bypass capability. 2 GB of SODIMM RAM are included, there is one microSD card slot, a beeper and a serial port. The RB1100AHx2 comes preinstalled in a 1 U aluminium rackmount case, power supply and power plug, assembled and ready to deploy."
    // }, {
    //     "id": "78438fhf892hf9",
    //     "sn": "",
    //     "name": "SNO-L6013R",
    //     "img": "assets/img/retail/samsung-cctv.png",
    //     "price": 5200000,
    //     "group": "cctv",
    //     "desc": "The SNO-L6013R is a 2 megapixel FullHD outdoor bullet camera with a wide angle 3.6mm lens. It is IP66 rated for waterproofing for outdoor installations. The IR LEDs provide visibility up to 20 meters. The SDHC memory card recording slot creates a simple recording solution up to 32Gb."
    // }, {
    //     "id": "ghjfdksa88329h",
    //     "sn": "",
    //     "name": "SND-L6013R",
    //     "img": "assets/img/retail/Samsung SND-L6013R Website-800x800.png",
    //     "price": 4650000,
    //     "group": "cctv",
    //     "desc": "The SND-L6013R is an indoor dome camera perfect for high resolution FullHD monitoring. Featuring IR LEDs for low light visibility and hallway view mode ideal for hallways or retail stores. The wide angle lens 3.6mm lens captures an 86° horizontal field of view while the Lens Distortion Correction provides a distortion-free image."
    // }, {
    //     "id": "8932bjife8929jd",
    //     "sn": "",
    //     "name": "QND-6010R",
    //     "img": "assets/img/retail/QND-6010R.png",
    //     "price": 5500000,
    //     "group": "cctv",
    //     "desc": "Wisenet Q series 2M fixed lens camera. Max. 2M (1920 x 1080) resolution. Built-in 2.8mm fixed lens. Max. 30fps@all resolutions (H.265/H.264). H.265, H.264, MJPEG codec supported, Multiple streaming. Motion detection, Tampering, Defocus detection. micro SD (128GB) memory slot, PoE / 12V DC. IR viewable length 20m, IK08. Hallway view, WiseStream support. LDC support (Lens Distortion Correction)"
    // }]


    NavShrink.shrink();
});
