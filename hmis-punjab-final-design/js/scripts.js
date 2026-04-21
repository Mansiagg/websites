
$(window).scroll(function () {
  console.log($(window).scrollTop());
  if ($(window).scrollTop() > 63) {
    $('header').addClass('sticky');
  } else {
    $('header').removeClass('sticky');
  }

  // Ensure body overflow remains hidden
  if ($('body').css('overflow') === 'hidden') {
    $('body').css('overflow', 'hidden');
  }
});


var btn = $('#button');
$(window).scroll(function () {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function (e) {
  e.preventDefault();
  $('html, body').animate({ scrollTop: 0 }, '300');
});

const toggler = document.querySelector('.navbar-toggler');
const openIcon = toggler.querySelector('.open-icon');
const closeIcon = toggler.querySelector('.close-icon');

toggler.addEventListener('click', function () {
  openIcon.classList.toggle('d-none');
  closeIcon.classList.toggle('d-none');
});
 $(document).ready(function () {

        $('.counter').each(function () {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
            }, {
                duration: 4000,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });
        });

    });


const myModal = document.getElementById('login-form');

myModal.addEventListener('show.bs.modal', function () {
  document.body.classList.add('modal-blur');
});

myModal.addEventListener('hidden.bs.modal', function () {
  document.body.classList.remove('modal-blur');
});


var owl = $('.services-carousel');
owl.owlCarousel({
  items: 5, // adjust number of items per slide
  loop: true,
  smartSpeed: 700,
  center: false,
  dots: false,
  autoplay: true,
  margin: 0,
  nav: true,
  navText: [
    '<i class="fa-solid fa-arrow-left"></i>',
    '<i class="fa-solid fa-arrow-right"></i>'
  ],
  responsive: {
    0: { items: 1 },
    600: { items: 2 },
    1000: { items: 3 },
    1200: { items: 4 },
      1500: { items: 5 }
  }
});
