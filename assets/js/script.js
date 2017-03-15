window.addEventListener("load", function() {
    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#252e39"
            },
            "button": {
                "background": "#1c4488"
            }
        },
        "theme": "edgeless",
        "position": "bottom-left",
        "content": {
            "href": "#/cookies-policy"
        }
    })
});

$(document).ready(function() {
    // Shrink the nav bar
    $(window).scroll(function() {
        if ($(document).scrollTop() > 50) {
            $('.navbar-wrapper').addClass('shrink');
        } else {
            $('.navbar-wrapper').removeClass('shrink');
        }
    });

    // Cart handler
    function addProduct() {
        //this is just a product placeholder
        var productAdded = $('<li class="product"><div class="product-image"><a href="#0"><img src="img/product-preview.png" alt="placeholder"></a></div><div class="product-details"><h3><a href="#0">Product Name</a></h3><span class="price">$25.99</span><div class="actions"><a href="#0" class="delete-item">Delete</a><div class="quantity"><label for="cd-product-' + productId + '">Qty</label><span class="select"><select id="cd-product-' + productId + '" name="quantity"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select></span></div></div></div></li>');
        cartList.prepend(productAdded);
    }



    $(window).load(function() {
        var width = $(window).width();

        // hide continue and cancel text button when window with of browser less then 840 pixels
        if (width < 840) {
            $(document).find('.fs-continue').text('');
            $(document).find('.fs-cancel').text('');
        } else {
            $(document).find('.fs-continue').text('Continue');
            $(document).find('.fs-cancel').text('Cancel');
        }


        $(window).resize(function() {
            var width = $(window).width();
            if (width > 840) {
                $(document).find('.fs-continue').text('Continue');
                $(document).find('.fs-cancel').text('Cancel');
            } else {
                $(document).find('.fs-continue').text('');
                $(document).find('.fs-cancel').text('');
            }
        })


    })

    $('.fs-form-overview').closest('.fs-form-wrap').find('.fs-cancel').hide();


    $('body').on('click', function(e) {
        if (!$('.navbar-toggle').is(e.target) && $('.navbar-toggle').has(e.target).length === 0 && $('.in').has(e.target).length === 0) {
            $('#navbar').removeClass('in');
        }
    });


});
