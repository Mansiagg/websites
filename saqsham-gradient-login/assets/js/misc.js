(function($) {
  'use strict';
  $(function() {
    var body = $('body');
    var contentWrapper = $('.content-wrapper');
    var scroller = $('.container-scroller');
    var footer = $('.footer');
    var sidebar = $('.sidebar');

    //Add active class to nav-link based on url dynamically
    //Active class can be hard coded directly in html file also as required

    function addActiveClass(element) {
      if (current === "") {
        //for root url
        if (element.attr('href').indexOf("index.html") !== -1) {
          element.parents('.nav-item').last().addClass('active');
          if (element.parents('.sub-menu').length) {
            element.closest('.collapse').addClass('show');
            element.addClass('active');
          }
        }
      } else {
        //for other url
        if (element.attr('href').indexOf(current) !== -1) {
          element.parents('.nav-item').last().addClass('active');
          if (element.parents('.sub-menu').length) {
            element.closest('.collapse').addClass('show');
            element.addClass('active');
          }
          if (element.parents('.submenu-item').length) {
            element.addClass('active');
          }
        }
      }
    }

    var current = location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
    $('.nav li a', sidebar).each(function() {
      var $this = $(this);
      addActiveClass($this);
    })

    $('.horizontal-menu .nav li a').each(function() {
      var $this = $(this);
      addActiveClass($this);
    })

    //Close other submenu in sidebar on opening any

    sidebar.on('show.bs.collapse', '.collapse', function() {
      sidebar.find('.collapse.show').collapse('hide');
    });


    //Change sidebar and content-wrapper height
    applyStyles();

    function applyStyles() {
      //Applying perfect scrollbar
      if (!body.hasClass("rtl")) {
        if ($('.settings-panel .tab-content .tab-pane.scroll-wrapper').length) {
          const settingsPanelScroll = new PerfectScrollbar('.settings-panel .tab-content .tab-pane.scroll-wrapper');
        }
        if ($('.chats').length) {
          const chatsScroll = new PerfectScrollbar('.chats');
        }
        if (body.hasClass("sidebar-fixed")) {
          var fixedSidebarScroll = new PerfectScrollbar('#sidebar .nav');
        }
      }
    }

    $('[data-toggle="minimize"]').on("click", function() {
      if ((body.hasClass('sidebar-toggle-display')) || (body.hasClass('sidebar-absolute'))) {
        body.toggleClass('sidebar-hidden');
      } else {
        body.toggleClass('sidebar-icon-only');
      }
    });



    //fullscreen
    $("#fullscreen-button").on("click", function toggleFullScreen() {
      if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }) 

  
  });

  $(document).ready(function () {
    var table = $('#example').DataTable({
        dom: '<"d-md-flex d-block justify-content-between align-items-center"fB>rtip',
        responsive: true,
        buttons: [
            'copy', 'excel', 'pdf', 'print', 'colvis',
            {
                text: 'Card View', className: 'buttons-card-view',
                action: function () {
                    toggleCardView();
                }
            }
        ],
        columnDefs: [
            {
                targets: 0,
                orderable: false,
                className: 'select-checkbox',
                render: function () {
                    return '<input type="checkbox" class="row-select">';
                }
            }
        ],
        order: [[1, 'asc']],
        scrollY: "calc(100vh - 250px)",
        scrollCollapse: true,
        paging: true,
        fixedHeader: true
    });

    $(window).on('resize', function () {
    table.columns.adjust().responsive.recalc();
});
    // Select All Checkbox
    $('#selectAll').on('click', function () {
        var rows = table.rows({ 'search': 'applied' }).nodes();
        $('input.row-select', rows).prop('checked', this.checked);
    });

    // Manage Select-All Based on Row Check
    $('#example tbody').on('change', 'input.row-select', function () {
        if (!this.checked) {
            $('#selectAll').prop('checked', false);
        } else if ($('.row-select:checked').length === $('.row-select').length) {
            $('#selectAll').prop('checked', true);
        }
    });

    // ---- Card View Code ----
    function toggleCardView() {
        var isTableVisible = $('#example').is(':visible');

        if (isTableVisible) {
            $('#example').hide();
            $('#cardView').empty().show();

            table.rows({ search: "applied" }).every(function () {
                var data = this.data();
                $('#cardView').append(`
                    <div class="col-md-4">
                      <div class="data-card">
                        <h6>${data[1]}</h6>
                        <p><span class="fw-semibold">Facility Name:</span> ${data[1]}</p>
                        <p><span class="fw-semibold">NIN ID:</span> ${data[2]}</p>
                        <p><span class="fw-semibold">State:</span> ${data[3]}</p>
                        <p><span class="fw-semibold">District:</span> ${data[4]}</p>
                        <p><span class="fw-semibold">Mode/Program:</span> ${data[6]}</p>
                        <p><span class="fw-semibold">Assessment Date:</span> ${data[7]}</p>
                        <p><span class="fw-semibold">QPS Approval Date:</span> ${data[8]}</p>
                        <p><span class="fw-semibold">Status:</span> ${data[9]}</p>
                        <p><span class="fw-semibold">Action:</span> ${data[10]}</p>
                      </div>
                    </div>
                `);
            });

            table.button('.buttons-card-view').text('Table View');
        } else {
            $('#cardView').hide();
            $('#example').show();
            $('.buttons-card-view').text('Card View');
        }
    }
});
})(jQuery);