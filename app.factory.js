app
    .factory('NavShrink', function() {

        shrink = function() {
            $(window).scroll(function(event) {
                var scroll = $(window).scrollTop();
                var headerHeight2 = $('.section-header').height();

                var a = scroll - (headerHeight2 - 500);

                if (scroll > a) {
                    $('.navbar-wrapper').addClass('shrink');
                }

                if (a < 0) {
                    $('.navbar-wrapper').removeClass('shrink');
                }

                // console.log(a)
            });
        }

        return {
            shrink: shrink
        }
    })

.factory('CartService', function(localStorageService, $window) {
    return {
        add: function(data) {
            $window.localStorage['product_id'] = JSON.stringify(data);
        }
    }
})

.factory('allHttpInterceptor', function(bsLoadingOverlayHttpInterceptorFactoryFactory) {
    return bsLoadingOverlayHttpInterceptorFactoryFactory();
})

.factory('oneDriveFactory', ['$http', 'graphUrl',
    function($http, graphUrl) {

        var oneDriveFactory = {};

        // retrieve child files and folders 
        oneDriveFactory.getChildren = function(itemId) {
            return $http({
                method: 'GET',
                url: graphUrl + '/me/drive/items/' + itemId + '/children'
            });
        };

        // getting information about file or folder 
        oneDriveFactory.getItem = function(itemId) {
            return $http({
                method: 'GET',
                url: graphUrl + '/me/drive/items/' + itemId
            });
        };

        // search 
        oneDriveFactory.searchItems = function(query) {
            return $http({
                method: 'GET',
                url: graphUrl + '/me/drive/root/search(q=\'{' + escape(query) + '}\')'
            });
        };

        return oneDriveFactory;
    }
])
