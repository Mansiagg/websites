// Owlcarousel
$(document).ready(function(){
  $(".owl-banner").owlCarousel({
  	loop:true,
    dots:false,
    margin:30,
	autoplay:true,
    autoplayTimeout:5000,
    autoplayHoverPause:false,
    animateIn: 'slideInRight',
    animateOut: 'slideOutLeft',
   
   
    navText: [
	    "<i class='bi bi-chevron-left'></i>",
	    "<i class='bi bi-chevron-right'></i>"
	],
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
  });



  
});