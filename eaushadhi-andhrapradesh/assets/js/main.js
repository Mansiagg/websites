(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
       
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(window).width() > 992) {
            if ($(this).scrollTop() > 45) {
                $('.sticky-top .container').addClass('shadow-sm').css('max-width', '100%');
            } else {
                $('.sticky-top .container').removeClass('shadow-sm').css('max-width', $('.topbar .container').width());
            }
        } else {
            $('.sticky-top .container').addClass('shadow-sm').css('max-width', '100%');
        }
    });



$(window).scroll(function () {
 
	console.log($(window).scrollTop())
	if ($(window).scrollTop() > 63) {
	  $('.main-menu').addClass('sticky');
    
	}
	if ($(window).scrollTop() < 64) {
	  $('.main-menu').removeClass('sticky');
	}
  });
    

  var btn = $('#button');
  $(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
      btn.addClass('show');
    } else {
      btn.removeClass('show');
    }
  });
  
  btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
    
  });
  
  document.addEventListener("click", function (event) {
    const navbar = document.getElementById("navbarWithDropdown");
    const navbarToggler = document.getElementById("navbarToggler");

    // Check if the clicked area is NOT inside the navbar or the toggler
    if (!navbar.contains(event.target) && !navbarToggler.contains(event.target)) {
        const bsCollapse = new bootstrap.Collapse(navbar, {
            toggle: false
        });
        bsCollapse.hide(); // Hide the navbar if clicked outside
    }
});


})(jQuery);



