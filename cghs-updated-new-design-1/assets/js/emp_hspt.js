$(document).ready(function () {

    const urlParams = new URLSearchParams(window.location.search);
    const cityIdFromUrl = urlParams.get('cityId');

    if (cityIdFromUrl) {
        localStorage.setItem("selectedCityId", cityIdFromUrl);
    }

    fetchCityNames();

    $('#tableContainer').hide();
    $('#rowCount').hide();
    $('.dataTables_length, .dataTables_filter, .dataTables_paginate, .dataTables_info, .dt-buttons').hide();

    $('#submitBtn').on('click', function () {
        const selectedCityId = $('#citySelect').val();

        if (!selectedCityId) {
            alert('Please select a city first.');
            $('#tableContainer, #rowCount, .dt-buttons, .dataTables_length, .dataTables_filter, .dataTables_paginate, .dataTables_info').hide();
            return;
        }

        $('#tableContainer').show();
        $('#rowCount').show();
    });

    $('#citySelect').on('change', function () {
        const selectedCityId = $(this).val();
        if (selectedCityId) {
            localStorage.setItem("selectedCityId", selectedCityId);
            $('#tableContainer').hide();
            $('#hospitalTable').DataTable().destroy();
            fetchHospitalsByCity(selectedCityId);
        } else {
            $('#hospitalTable, #rowCount').hide();
            $('.dt-buttons, .dataTables_length, .dataTables_filter, .dataTables_paginate, .dataTables_info').hide();
        }
    });

    function fetchCityNames() {
        const url = createFHashAjaxQuery("/AHIMSG5/hislogin/getCityNamesLgnFtr?");
        $.ajax({
            url: url,
            method: "GET",
            success: function (data) {
                if (data.cityNamesDtl) {
                    const citySelect = $('#citySelect');
                    citySelect.empty().append('<option value="">--Select--</option>');

                    data.cityNamesDtl.forEach(function (city) {
                        const option = $('<option></option>')
                            .val(city.cityId)
                            .text(city.cityName);

                        if (localStorage.getItem("selectedCityId") === String(city.cityId)) {
                            option.attr("selected", "selected");
                            fetchHospitalsByCity(city.cityId);
                            $('#tableContainer, #rowCount, .dt-buttons, .dataTables_length, .dataTables_filter, .dataTables_paginate, .dataTables_info').show();
                        }

                        citySelect.append(option);
                    });
                }
            }
        });
    }

    function fetchHospitalsByCity(cityId) {
        $.ajax({
            url: createFHashAjaxQuery("/AHIMSG5/hislogin/getHospitalsByCityLgnFtr?cityId=" + cityId),
            method: "GET",
            dataType: "json",
            success: function (data) {
                populateHospitalTable(data || {});
            },
            error: function () {
                console.error("Error fetching hospitals");
            }
        });
    }

    function fetchWellnessCenterByCity(cityId) {
        $.ajax({
            url: createFHashAjaxQuery("/AHIMSG5/hislogin/fetchWellnessCenterByCityLgnFtr?cityId=" + cityId),
            method: "GET",
            dataType: "json",
            success: function (data) {
                populateWCHospitalTable(data || {});
            },
            error: function () {
                console.error("Error fetching wellness centers");
            }
        });
    }

    function populateWcCityNames(cityData) {
        const cityWcSelect = $('#cityWcSelect');
        cityWcSelect.empty().append('<option value="">--Select--</option>');

        if (cityData.cityNamesDtl) {
            cityData.cityNamesDtl.forEach(function (city) {
                $('<option></option>').val(city.cityId).text(city.cityName).appendTo(cityWcSelect);
            });
        }
    }

});

function highlightTableOnLoad() {
    $('#hospitalTable').addClass('table table-hover table-striped').css({
        'borderRadius': '12px',
        'overflow': 'hidden',
    });
    $('#tableContainer').addClass('animate__animated animate__fadeInUp');
}

function populateHospitalTable(hospitalData) {
    const table = document.getElementById('hospitalTable');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    if (!hospitalData || !hospitalData.hospitalNamesDtl || hospitalData.hospitalNamesDtl.length === 0) {
        tbody.innerHTML = "<tr class='table-warning'><td colspan='5' style='text-align:center;'>No hospitals found</td></tr>";
        table.style.display = 'table';
        return;
    }

    hospitalData.hospitalNamesDtl.forEach((item, i) => {
        if (!item || !item.hospName) return;

        const row = document.createElement('tr');
        row.classList.add('table-primary');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${item.adcityName || 'N/A'}</td>
            <td>${item.hospName || 'N/A'}</td>
            <td>${item.hospAcc || 'N/A'}</td>
            <td>${item.tierType || 'N/A'}</td>
            <td>${item.cityName || 'N/A'}</td>
        	<td>${ 'N/A'}</td>`;
        tbody.appendChild(row);
    });

    const selectedCityName = $('#citySelect option:selected').text().trim();
    const exportTitle = selectedCityName + " Empanelled Hospitals";

    $('#hospitalTable').DataTable().destroy();
    $('#hospitalTable').DataTable({
        buttons: [
            {
                extend: 'excel',
                className: 'btn-export-style animate__animated animate__fadeIn',
                title: exportTitle,
                text: '<i class="fas fa-file-excel" style="color: #17572e;"></i> Excel <i class="fas fa-download"></i>',
                filename: exportTitle.replace(/\s+/g, '_')
            }
        ],
    	dom: "<'row'<'col-sm-6'l><'col-sm-6 text-end'Bf>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        
        pageLength: 5,
        lengthMenu: [10, 25, 50, 100],
        searching: true,
        language: {
            search: "",
            searchPlaceholder: "Search Hospitals..."
        }
    });

    $('.dt-buttons, .dataTables_length, .dataTables_filter, .dataTables_paginate, .dataTables_info').show();
    $('.dataTables_length').css('display', 'block');

    $('#totalRecords').text($('#hospitalTable').DataTable().rows({ search: 'applied' }).count());
    $('#rowCount').show();
    highlightTableOnLoad();
}

function populateWCHospitalTable(hospitalData) {
    const table = document.getElementById('hospitalTable');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    if (!hospitalData || !hospitalData.hospitalNamesDtl || hospitalData.hospitalNamesDtl.length === 0) {
        tbody.innerHTML = "<tr class='table-warning'><td colspan='6' style='text-align:center;'>No wellness centers found</td></tr>";
        table.style.display = 'table';
        return;
    }

    hospitalData.hospitalNamesDtl.forEach((item, i) => {
        if (!item || !item.hospNameCodeType) return;

        const row = document.createElement('tr');
        row.classList.add('table-primary');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${item.hospNameCodeType || 'N/A'}</td>
            <td>${item.shortname || 'N/A'}</td>
            <td>${item.address || 'N/A'}</td>
            <td>${item.phone || 'N/A'}</td>
            <td>${item.email || 'N/A'}</td>`;
        tbody.appendChild(row);
    });

    const selectedCityName = $('#cityWcSelect option:selected').text().trim();
    const exportTitle = selectedCityName + " Wellness Centers";

    if ($.fn.DataTable.isDataTable('#hospitalTable')) {
        $('#hospitalTable').DataTable().destroy();
    }

    $('#hospitalTable').DataTable({
        dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row'<'col-sm-5'i><'col-sm-7'p>>B",
        buttons: getExportButtons(exportTitle),
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        searching: true,
        language: {
            search: "",
            searchPlaceholder: "Search Hospitals..."
        }
    });

    $('.dt-buttons, .dataTables_length, .dataTables_filter, .dataTables_paginate, .dataTables_info').show();
    $('.dataTables_length').css('display', 'block');

    $('#totalRecords').text($('#hospitalTable').DataTable().rows({ search: 'applied' }).count());
    $('#rowCount').show();
}

function getExportButtons(exportTitle) {
    return [
        {
            extend: 'copy',
            className: 'btn-export-style animate__animated animate__fadeIn',
            title: exportTitle
        },
        {
            extend: 'csv',
            className: 'btn-export-style animate__animated animate__fadeIn',
            title: exportTitle,
            filename: exportTitle.replace(/\s+/g, '_')
        },
        {
            extend: 'excel',
            className: 'btn-export-style animate__animated animate__fadeIn',
            title: exportTitle,
            filename: exportTitle.replace(/\s+/g, '_')
        },
        {
            extend: 'pdf',
            className: 'btn-export-style animate__animated animate__fadeIn',
            title: exportTitle,
            filename: exportTitle.replace(/\s+/g, '_'),
            orientation: 'landscape',
            pageSize: 'A4'
        },
        {
            extend: 'print',
            className: 'btn-export-style animate__animated animate__fadeIn',
            title: '<h2 style="text-align:center;">' + exportTitle + '</h2>'
        },
        {
            text: '<i class="fas fa-print"></i> Custom Print',
            className: 'btn-export-style animate__animated animate__pulse',
            action: function () {
                const printWindow = window.open('', '_blank', 'width=800,height=600');
                const tableHTML = $('#hospitalTable').clone().prop('outerHTML');
                printWindow.document.write(`
                    <html><head><title>Print Table</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h2 { text-align: center; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { padding: 10px; text-align: left; border: 1px solid #333; }
                        thead { background-color: #f2f2f2; }
                    </style>
                    </head><body>
                    <h2>${exportTitle}</h2>
                    ${tableHTML}
                    </body></html>
                `);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
            }
        }
    ];
}