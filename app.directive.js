app.directive('isBtnQuoteShown', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            scope.location = $location;

            scope.$watch('location.path()', function(currentPath) {
                var currentPath = currentPath.split('/')[1];
                if (currentPath === 'software-development' || currentPath === 'it-infrastructure') {
                    $('#box-btn-quotation').show();
                } else {
                    $('#box-btn-quotation').hide();
                }

            });

        }
    };
}])

app.directive('capitalizeAll', function(uppercaseFilter, $parse) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue == undefined) inputValue = '';
                var capitalized = inputValue.toUpperCase();
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]); // capitalize initial value
        }
    };
})

app.directive('capitalizeFirst', function(uppercaseFilter, $parse) {
    return {
        require: 'ngModel',
        scope: {
            ngModel: "="
        },
        link: function(scope, element, attrs, modelCtrl) {
            scope.$watch("ngModel", function() {
                if (scope.ngModel != null && scope.ngModel != '') {
                    scope.ngModel = scope.ngModel.replace(/^(.)|\s(.)/g, function(v) {
                        return v.toUpperCase();
                    });
                }
            });
        }
    };
})

app.directive('slick', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).slick({
                autoplay: true,
                arrows: false,
                dots: true,
                fadingEffect: true,
                easing: 'easeInOutCubic',
                easingcss3: 'ease',
            });
        }
    }
})

app.directive('productView', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var sliderFinalWidth = 400,
                maxQuickWidth = 900;

            $('a.cd-close').on('click', function(e) {
                e.preventDefault();
            })

            //open the quick view panel
            $(element).on('click', '.cd-trigger', function(event) {

                var selectedImage = $(this).find('img'),
                    slectedImageUrl = selectedImage.attr('src'),
                    title = $(this).closest('.mix').find('.box-chart-content').children('p.title').text(),
                    price = $(this).closest('.mix').find('.price').text(),
                    desc = $(this).closest('.mix').find('.desc').val(),
                    data_price = parseInt(price.replace(/[^\d.]/g, '')),
                    data_index = $(this).attr('data-index'),
                    id = $(this).attr('data-id');

                $('body').addClass('overlay-layer');
                getId(id);
                animateQuickView(selectedImage, sliderFinalWidth, maxQuickWidth, 'open');

                //update the visible slider image in the quick view panel
                //you don't need to implement/use the updateQuickView if retrieving the quick view data with ajax
                updateQuickView(slectedImageUrl, title, price, desc, data_price, data_index);
            });

            //close the quick view panel
            $('body').on('click', function(event) {
                if ($(event.target).is('.cd-close') || $(event.target).is('body.overlay-layer')) {
                    closeQuickView(sliderFinalWidth, maxQuickWidth);
                }
            });

            $(document).keyup(function(event) {
                //check if user has pressed 'Esc'
                if (event.which == '27') {
                    closeQuickView(sliderFinalWidth, maxQuickWidth);
                }
            });

            //quick view slider implementation
            $('.cd-quick-view').on('click', '.cd-slider-navigation a', function() {
                updateSlider($(this));
            });

            //center quick-view on window resize
            $(window).on('resize', function() {
                if ($('.cd-quick-view').hasClass('is-visible')) {
                    window.requestAnimationFrame(resizeQuickView);
                }
            });

            function getId(id) {
                $('.cd-quick-view').find('.cd-add-to-cart').attr('data-id', id);
            }

            function updateSlider(navigation) {
                var sliderConatiner = navigation.parents('.cd-slider-wrapper').find('.cd-slider'),
                    activeSlider = sliderConatiner.children('.selected').removeClass('selected');
                if (navigation.hasClass('cd-next')) {
                    (!activeSlider.is(':last-child')) ? activeSlider.next().addClass('selected'): sliderConatiner.children('li').eq(0).addClass('selected');
                } else {
                    (!activeSlider.is(':first-child')) ? activeSlider.prev().addClass('selected'): sliderConatiner.children('li').last().addClass('selected');
                }
            }

            function updateQuickView(url, title, price, desc, data_price, data_index) {
                $('.cd-quick-view .cd-slider li').removeClass('selected').find('img').attr('src', url).parent('li').addClass('selected');
                $('.cd-quick-view .cd-item-info').find('.title').html(title);
                $('.cd-quick-view .cd-item-info').find('.price').html(price);
                $('.cd-quick-view .cd-item-info').find('.desc').html(desc);
                $('.cd-quick-view .cd-item-info').find('.cd-add-to-cart').attr('data-price', data_price);
                $('.cd-quick-view .cd-item-info').find('.cd-add-to-cart').attr('data-index', data_index);
            }

            function resizeQuickView() {
                var quickViewLeft = ($(window).width() - $('.cd-quick-view').width()) / 2,
                    quickViewTop = ($(window).height() - $('.cd-quick-view').height()) / 2;
                $('.cd-quick-view').css({
                    "top": quickViewTop,
                    "left": quickViewLeft,
                });
            }

            function closeQuickView(finalWidth, maxQuickWidth) {
                var close = $('.cd-close'),
                    activeSliderUrl = close.siblings('.cd-slider-wrapper').find('.selected img').attr('src'),
                    // selectedImage = $(element).find('img');
                    selectedImage = close.siblings('.cd-slider-wrapper').find('.selected img');

                //update the image in the gallery
                if (!$('.cd-quick-view').hasClass('velocity-animating') && $('.cd-quick-view').hasClass('add-content')) {

                    selectedImage.attr('src', activeSliderUrl);

                    animateQuickView(selectedImage, finalWidth, maxQuickWidth, 'close');
                } else {
                    closeNoAnimation(selectedImage, finalWidth, maxQuickWidth);
                }
            }

            function animateQuickView(image, finalWidth, maxQuickWidth, animationType) {
                //store some image data (width, top position, ...)
                //store window data to calculate quick view panel position
                var parentListItem = image.closest('.cd-item'),
                    topSelected = image.offset.top - $(window).scrollTop(),
                    leftSelected = image.offset.left,
                    widthSelected = image.width(),
                    heightSelected = image.height(),
                    windowWidth = $(window).width(),
                    windowHeight = $(window).height(),
                    finalLeft = (windowWidth - finalWidth) / 2,
                    finalHeight = finalWidth * heightSelected / widthSelected,
                    finalTop = (windowHeight - finalHeight) / 2,
                    quickViewWidth = (windowWidth * .8 < maxQuickWidth) ? windowWidth * .8 : maxQuickWidth,
                    quickViewLeft = (windowWidth - quickViewWidth) / 2;

                if (animationType == 'open') {
                    //hide the image in the gallery
                    // parentListItem.addClass('empty-box');
                    //place the quick view over the image gallery and give it the dimension of the gallery image
                    $('.cd-quick-view').css({
                        "top": topSelected,
                        "left": leftSelected,
                        "width": widthSelected,
                    }).velocity({
                        //animate the quick view: animate its width and center it in the viewport
                        //during this animation, only the slider image is visible
                        'top': finalTop + 'px',
                        'left': finalLeft + 'px',
                        'width': finalWidth + 'px',
                    }, 1000, [400, 20], function() {
                        //animate the quick view: animate its width to the final value
                        $('.cd-quick-view').addClass('animate-width').velocity({
                            'left': quickViewLeft + 'px',
                            'width': quickViewWidth + 'px',
                        }, 300, 'ease', function() {
                            //show quick view content
                            $('.cd-quick-view').addClass('add-content');
                        });
                    }).addClass('is-visible');
                } else {
                    //close the quick view reverting the animation
                    $('.cd-quick-view').removeClass('add-content').velocity({
                        'top': finalTop + 'px',
                        'left': finalLeft + 'px',
                        'width': finalWidth + 'px',
                    }, 300, 'ease', function() {
                        $('body').removeClass('overlay-layer');
                        $('.cd-quick-view').removeClass('animate-width').velocity({
                            "top": topSelected,
                            "left": leftSelected,
                            "width": widthSelected,
                        }, 500, 'ease', function() {
                            $('.cd-quick-view').removeClass('is-visible');
                            parentListItem.removeClass('empty-box');
                        });
                    });
                }
            }

            function closeNoAnimation(image, finalWidth, maxQuickWidth) {
                var parentListItem = image.parent('.cd-item'),
                    topSelected = image.offset().top - $(window).scrollTop(),
                    leftSelected = image.offset().left,
                    widthSelected = image.width();

                //close the quick view reverting the animation
                $('body').removeClass('overlay-layer');
                parentListItem.removeClass('empty-box');
                $('.cd-quick-view').velocity("stop").removeClass('add-content animate-width is-visible').css({
                    "top": topSelected,
                    "left": leftSelected,
                    "width": widthSelected,
                });
            }
        }
    }
})

app.directive('productCartInteraction', function(productService, CartService, $window, checkoutService, authService, $state) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.items = []; // cart items
            scope.count = 0;
            scope.total = 0;
            scope.cartTotal = 0;

            // Count total price
            if ($window.localStorage['product_id'] != null) {
                scope.items = JSON.parse($window.localStorage['product_id']);
                scope.items.forEach(function(val, key) {
                    scope.count += val.qty;
                    scope.cartTotal += val.qty * val.price;
                })
            }

            scope.addCart = function(e) {
                var index = $(e.target).attr('data-index');
                var id = $(e.target).attr('data-id');

                productService
                    .get()
                    .then(function(res) {
                        var data = res.data;

                        data.forEach(function(val1, key1) {
                            if (key1 == index) {

                                var found = false,
                                    foundData;
                                val1.qty = 1;

                                if (scope.items.length <= 0) {

                                    scope.items.push(val1);

                                } else {

                                    scope.items.forEach(function(val2, key2) {
                                        if (id == val2.id) {
                                            found = true;
                                            foundData = val2;
                                        }
                                    });

                                    if (!found) {
                                        // push
                                        scope.items.push(val1);
                                    } else {
                                        // tambah 1
                                        if (foundData.id == id) {
                                            foundData.qty += 1;
                                        }
                                    }

                                }

                            }

                            CartService.add(scope.items);
                        })
                    })

                scope.count += 1;

            }

            scope.remove = function(index, e) {
                e.preventDefault();
                // console.log(scope.items[index].qty*scope.items[index].price);
                scope.items.splice(index, 1);
                CartService.add(scope.items);
            }


            scope.qtyMinus = function(index, e) {
                scope.items[index].qty -= 1;
                if (scope.items[index].qty <= 0) {
                    scope.items[index].qty = 1;
                }

                CartService.add(scope.items);
                e.preventDefault();
            }

            scope.qtyPlus = function(index, e) {
                scope.items[index].qty += 1;
                CartService.add(scope.items);
                e.preventDefault();

            }


            scope.checkout = function(e, $http, uppercaseFilter, $parse, $scope) {
                var API = API_PROD;
                e.preventDefault();

                // check if user sigend in or not
                var userProfile = JSON.parse(localStorage.getItem('profile'));

                // if user isn't signed in
                if (userProfile == undefined) {
                    ngDialog.open({
                        template: 'components/modals/message.html',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        cache: false,
                        controller: ['$scope', function($scope) {
                            $scope.type = 'info';
                            $scope.line1 = "You need to be sign into your account to continue the check out process";
                            $scope.line2 = "If you don't have an account, don't be worry! Just hit the below signin button and follow the instruction";
                        }]
                    });
                } else {
                    var order_id = Math.floor((Math.random() * 100000) + 1);
                    scope.data = {
                        products: scope.items,
                        order_id: "ORD-" + order_id,
                        gross_amount: scope.cartTotal
                    };

                    // get the token to open snap
                    checkoutService.posttoken(scope.data).then(function(res) {
                        var response = res.data;
                        if (response.success) {
                            if (response.data.token) {
                                // open snap popup
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
                                    onClose: function() {
                                        console.log('customer closed the popup without finishing the payment');
                                    }
                                });
                            } else {
                                alert(response.data.error_messages[0]);
                            }
                        }
                    });
                }

                /*
                localStorage.setItem('order_id', order_id);
                var lostor = localStorage.getItem('order_id');
                if (lostor == order_id) {
                    var userProfile = JSON.parse(localStorage.getItem('profile'));
                    console.log(userProfile);
                    // if user already logged in
                    if (localStorage.getItem('profile') != undefined) {
                        console.log("have a profile");
                        //if user have metadata
                        if (userProfile.user_metadata != undefined) {
                            console.log('User is registered, syncing the form now...');
                            /*checkoutService.posttoken(scope.data).then(function (res) {
                                if(res.data.success){
                                    console.log(res.data.data.token);
                                    snap.pay(res.data.data.token, {
                                        onSuccess: function(result){console.log('success');console.log(result);},
                                        onPending: function(result){console.log('pending');console.log(result);},
                                        onError: function(result){console.log('error');console.log(result);},
                                        onClose: function(){console.log('customer closed the popup without finishing the payment');}
                                    });
                                }
                            })*/
                /*}
                        //if user have not metadata
                        else {
                            console.log('User is not registered, getting to signup page...');
                            // save form data into local-storage & set origin-state flag
                            localStorage.setItem('cart_data', JSON.stringify(scope.data));
                            localStorage.setItem('pay_page', 'payment');
                            $state.go('account');
                            toggleCart();
                            
                        }
                    }
                    // if user not logged in
                    else {
                        console.log("user not login ");
                        /*
                        if (userProfile.user_metadata != undefined) {
                            console.log('User is registered, syncing the form now...');
                            checkoutService.posttoken(scope.data).then(function (res) {
                                if(res.data.success){
                                    console.log(res.data.data.token);
                                    snap.pay(res.data.data.token, {
                                        onSuccess: function(result){console.log('success');console.log(result);},
                                        onPending: function(result){console.log('pending');console.log(result);},
                                        onError: function(result){console.log('error');console.log(result);},
                                        onClose: function(){console.log('customer closed the popup without finishing the payment');}
                                    });
                                }
                            })
                        }
                        //if user have not metadata
                        else {
                            console.log('User is not registered, getting to signup page...');
                            localStorage.setItem('cart_data', JSON.stringify(scope.data));
                            localStorage.setItem('pay_page', 'payment');
                            $scope.closeThisDialog();
                            authService.login();
                        }                       
                        
                    }
                }*/
            }

            scope.$watch('items', function(newVal) {
                if (newVal.length <= 0) {
                    scope.cartTotal = 0;
                    scope.count = 0;
                }
                scope.total = 0;
                scope.qty = 0;
                newVal.forEach(function(val) {
                    scope.total += val.qty * val.price;
                    scope.cartTotal = scope.total;
                    scope.qty += val.qty
                    scope.count = scope.qty;
                })
            }, true)

            var cartWrapper = $('.cd-cart-container');
            //product id - you don't need a counter in your real project but you can use your real product id
            var productId = 0;

            // if (cartWrapper.length > 0) {
            //store jQuery objects
            var cartBody = cartWrapper.find('.body')
            var cartList = cartBody.find('ul').eq(0);
            var cartTotal = cartWrapper.find('.checkout').find('span');
            var cartTrigger = cartWrapper.children('.cd-cart-trigger');
            var cartCount = cartTrigger.children('.count')
            var addToCartBtn = $('.cd-add-to-cart');

            //add product to cart
            addToCartBtn.on('click', function(event) {
                event.preventDefault();
                console.log($(this));
                addToCart($(this));
            });

            cartTrigger.on('click', function(event) {
                event.preventDefault();
                toggleCart();
            });

            //close cart when clicking on the .cd-cart-container::before (bg layer)
            cartWrapper.on('click', function(event) {
                if ($(event.target).is($(this))) toggleCart(true);
            });

            // }

            // show cart when localstorage product id not empty
            if ($window.localStorage['product_id'] != undefined) {
                if (JSON.parse($window.localStorage['product_id']).length > 0) {
                    var cartIsEmpty = cartWrapper.hasClass('empty');
                    cartWrapper.removeClass('empty');
                }
            }

            function toggleCart(bool) {
                var cartIsOpen = (typeof bool === 'undefined') ? cartWrapper.hasClass('cart-open') : bool;

                if (cartIsOpen) {
                    cartWrapper.removeClass('cart-open');
                    // cartList.find('.deleted').remove();

                    setTimeout(function() {
                        cartBody.scrollTop(0);
                        //check if cart empty to hide it
                        if (Number(cartCount.find('li').eq(0).text()) == 0) cartWrapper.addClass('empty');
                    }, 500);
                } else {
                    cartWrapper.addClass('cart-open');
                }
            }

            function addToCart(trigger) {
                var cartIsEmpty = cartWrapper.hasClass('empty');
                cartWrapper.removeClass('empty');
            }

        }
    }
})

app.directive('productGrid', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var support = {
                    animations: Modernizr.cssanimations
                },
                animEndEventNames = {
                    'WebkitAnimation': 'webkitAnimationEnd',
                    'OAnimation': 'oAnimationEnd',
                    'msAnimation': 'MSAnimationEnd',
                    'animation': 'animationend'
                },
                animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
                onEndAnimation = function(el, callback) {
                    var onEndCallbackFn = function(ev) {
                        if (support.animations) {
                            if (ev.target != this) return;
                            this.removeEventListener(animEndEventName, onEndCallbackFn);
                        }
                        if (callback && typeof callback === 'function') {
                            callback.call();
                        }
                    };
                    if (support.animations) {
                        el.addEventListener(animEndEventName, onEndCallbackFn);
                    } else {
                        onEndCallbackFn();
                    }
                };

            // from http://www.sberry.me/articles/javascript-event-throttling-debouncing
            function throttle(fn, delay) {
                var allowSample = true;

                return function(e) {
                    if (allowSample) {
                        allowSample = false;
                        setTimeout(function() {
                            allowSample = true;
                        }, delay);
                        fn(e);
                    }
                };
            }

            // sliders - flickity
            var sliders = [].slice.call(document.querySelectorAll('.slider')),
                // array where the flickity instances are going to be stored
                flkties = [],
                // grid element
                grid = document.querySelector('.grid'),
                // isotope instance
                iso,
                // filter ctrls
                filterCtrls = [].slice.call(document.querySelectorAll('.filter > button')),
                // cart
                cart = document.querySelector('.cart'),
                cartItems = cart.querySelector('.cart__count');

            function init() {
                // preload images
                imagesLoaded(grid, function() {
                    initFlickity();
                    initIsotope();
                    initEvents();
                    classie.remove(grid, 'grid--loading');
                });
            }

            function initFlickity() {
                sliders.forEach(function(slider) {
                    var flkty = new Flickity(slider, {
                        prevNextButtons: false,
                        wrapAround: true,
                        cellAlign: 'left',
                        contain: true,
                        resize: false
                    });

                    // store flickity instances
                    flkties.push(flkty);
                });
            }

            function initIsotope() {
                iso = new Isotope(grid, {
                    isResizeBound: false,
                    itemSelector: '.grid__item',
                    percentPosition: true,
                    masonry: {
                        // use outer width of grid-sizer for columnWidth
                        columnWidth: '.grid__sizer'
                    },
                    transitionDuration: '0.6s'
                });
            }

            function initEvents() {
                filterCtrls.forEach(function(filterCtrl) {
                    filterCtrl.addEventListener('click', function() {
                        classie.remove(filterCtrl.parentNode.querySelector('.filter__item--selected'), 'filter__item--selected');
                        classie.add(filterCtrl, 'filter__item--selected');
                        iso.arrange({
                            filter: filterCtrl.getAttribute('data-filter')
                        });
                        recalcFlickities();
                        iso.layout();
                    });
                });

                // window resize / recalculate sizes for both flickity and isotope/masonry layouts
                window.addEventListener('resize', throttle(function(ev) {
                    recalcFlickities()
                    iso.layout();
                }, 50));

                // add to cart
                [].slice.call(grid.querySelectorAll('.grid__item')).forEach(function(item) {
                    item.querySelector('.action--buy').addEventListener('click', addToCart);
                });
            }

            function addToCart() {
                classie.add(cart, 'cart--animate');
                setTimeout(function() {
                    cartItems.innerHTML = Number(cartItems.innerHTML) + 1;
                }, 200);
                onEndAnimation(cartItems, function() {
                    classie.remove(cart, 'cart--animate');
                });
            }

            function recalcFlickities() {
                for (var i = 0, len = flkties.length; i < len; ++i) {
                    flkties[i].resize();
                }
            }

            init();
        }
    }
})

app.directive('mixitup', function($compile) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            $compile(element.contents())($scope);
            $timeout(function() {
                angular.element(element).mixItUp({
                    callbacks: {
                        onMixLoad: function() {
                            console.log('MixItUp ready!');
                        },
                        onMixFail: function() {
                            console.log("No elements found matching");
                        }
                    },
                    load: {
                        filter: 'all'
                    },
                    debug: {
                        enable: true,
                        showWarnings: true,
                        mode: 'verbose'
                    }
                });
            });
        }
    };
});

app.directive('bgParallax', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).parallax({
                imageSrc: attrs.img
            });
        }
    }
})

app.directive('masonry', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var $grid = $('.product-gallery').masonry({
                // options
                itemSelector: '.mix',
            });
            // layout Masonry after each image loads
            $grid.imagesLoaded().progress(function() {
                $grid.masonry('layout');
            });
        }
    }
})

app.directive('loadingScreen', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {

            $(window).load(function() {
                $(element).fadeOut();
            });

        }
    }
})

app.directive('preventDefault', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('click', function(e) {
                e.preventDefault();
            });
        }
    }
})
