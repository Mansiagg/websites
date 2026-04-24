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



    $(document).ready(function(){
        // Initialize WOW.js
        new WOW().init();
    
        // Initialize Owl Carousel
        var owl = $('.header-carousel');
        owl.owlCarousel({
          items: 1, // adjust number of items per slide
          loop: false,
          smartSpeed: 1500,
          center: true,
          dots: true,
          autoplay: true,
          margin: 0,
        nav : true,
        navText : [
            '<span class="material-symbols-outlined">chevron_left</span>',
            '<span class="material-symbols-outlined">chevron_right</span>'
        ]
        });
    
      
      });
  
      var owl = $('.logo-carousel');
      owl.owlCarousel({
        items: 5, // adjust number of items per slide
        loop: true,
        smartSpeed: 700,
        center: false,
        dots: false,
        autoplay: true,
        margin: 0,
        nav : true,
      navText : [
          '<span class="material-symbols-outlined">chevron_left</span>',
          '<span class="material-symbols-outlined">chevron_right</span>'
      ],
      responsive: {
        0: { items: 1 },
        600: { items: 3 },
        1000: { items: 4},
        1200: { items: 5}
    }
      });


var counterContainer = document.querySelector(".website-counter");
var resetButton = document.querySelector("#reset");
var visitCount = localStorage.getItem("page_view");

// Check if page_view entry is present
/*if (visitCount) {
  visitCount = Number(visitCount) + 1;
  localStorage.setItem("page_view", visitCount);
} else {
  visitCount = 1;
  localStorage.setItem("page_view", 1);
}
counterContainer.innerHTML = visitCount;

// Adding onClick event listener
resetButton.addEventListener("click", () => {
  visitCount = 1;
  localStorage.setItem("page_view", 1);
  counterContainer.innerHTML = visitCount;
});
*/

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
  

/*  document.addEventListener("click", function (event) {
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
*/
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const collapseInstance = bootstrap.Collapse.getInstance(navbarCollapse) 
          || new bootstrap.Collapse(navbarCollapse, { toggle: false });

        collapseInstance.hide();
      });
    });
  });
  
    $(document).ready(function () {
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
     });

  
})(jQuery);



