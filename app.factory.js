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

    .factory('CartService', function(localStorageService,$window) {
        return {
            add: function(data) {
                $window.localStorage['product_id'] = JSON.stringify(data);
            }
        }
    })
    
    .factory('allHttpInterceptor', function(bsLoadingOverlayHttpInterceptorFactoryFactory) {
        return bsLoadingOverlayHttpInterceptorFactoryFactory();
    })
