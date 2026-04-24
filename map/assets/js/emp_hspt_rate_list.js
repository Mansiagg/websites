$(document).ready(function () {
	
	$('#tableContainer').hide();
    $('#rowCount').hide();
    $('.dataTables_length, .dataTables_filter, .dataTables_paginate, .dataTables_info, .dt-buttons').hide();


    const tier = getQueryParam('tier');
    const spaciality = getQueryParam('spaciality');
    const ward = getQueryParam('ward');

    // If you want to pre-select dropdowns
    if (tier) $('#tierSelect').val(tier);
    if (spaciality) $('#spacialitySelect').val(spaciality);
    if (ward) $('#wardSelect').val(ward);
    
    handleSelection(tier, spaciality, ward);
});


function getQueryParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}


document.getElementById('submitRateBtn').addEventListener('click', function () {
    let tierValue = "";
    let spacialityValue = "";
    let wardValue = "";
	

    tierValue = document.getElementById('tierSelect').value;
    spacialityValue = document.getElementById('spacialitySelect').value;
    wardValue = document.getElementById('wardSelect').value;
    

    console.log("Tier:", tierValue, "Spaciality:", spacialityValue, "Ward:", wardValue);

    handleSelection(tierValue, spacialityValue, wardValue);
});

function handleSelection(tier, spaciality, ward) {
    //alert(`Selected Values:\nTier: ${tier}\nSpaciality: ${spaciality}\nWard: ${ward}`);
    
	if ($.fn.DataTable.isDataTable('#hospitalTable')) {
	    $('#hospitalTable').DataTable().destroy();
	}
	
    var inputCol = tier+"_"+spaciality+"_"+ward;
    
    $.ajax({
        url: createFHashAjaxQuery("/AHIMSG5/hislogin/getCghsRateListLgnFtr?inputCol=" + inputCol),
        method: "GET",
        dataType: "json",
        success: function (data) {
        	populateRateTable(data.rateListArray, tier ,spaciality ,ward);
        },
        error: function () {
            console.error("Error fetching wellness centers");
        }
    });
    
}

function populateRateTable(rateListArray ,tier ,spaciality ,ward) {
    const table = document.getElementById('hospitalTable');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    if (!rateListArray || rateListArray.length === 0) {
    	tbody.innerHTML = "<tr class='table-warning'><td colspan='8' style='text-align:center;'>No Rates Found</td></tr>";
        table.style.display = 'table';
        return;
    }
    var dynamicRate = "";
    rateListArray.forEach((item, i) => {
        const dynamicKey = tier+"_"+spaciality+"_"+ward;  // 12th key
         dynamicRate = item[dynamicKey] +".00" ;
         var formattedTier = tier.replace(/_/g, ' ').toUpperCase();
         var formattedSpaciality = spaciality.replace(/_/g, ' ').toUpperCase();
         var formattedWard = ward.replace(/_/g, ' ').toUpperCase();

      const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item["s_no"]}</td>
            <td>${item["cghs_treatment_procedure_investigation_list"]}</td>
            <td>${item["speciality_classification"]}</td>
            <td>${formattedTier}</td>
            <td>${formattedSpaciality}</td>
            <td>${formattedWard}</td>
            <td>${item["alphanumeric_code"]}</td>
            <td>${dynamicRate}</td>
        `;
        tbody.appendChild(row);
    });
    var exportTitle = "Cghs Rate List" +dynamicRate;
    // Reinitialize DataTable
    $('#hospitalTable').DataTable().destroy();
    $('#hospitalTable').DataTable({
    	dom: "<'row'<'col-sm-6'l><'col-sm-6 text-end'Bf>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        buttons: [
            {
                extend: 'excel',
                className: 'btn-export-style animate__animated animate__fadeIn',
                title: exportTitle,
                text: '<i class="fas fa-file-excel" style="color: #17572e;"></i> Excel <i class="fas fa-download"></i>',
                filename: exportTitle.replace(/\s+/g, '_')
            }
        ],  
        columnDefs: [
            { width: '5%', targets: 0 },
            { width: '20%', targets: 1 },
            { width: '25%', targets: 2 },
            { width: '10%', targets: 3 },
            { width: '10%', targets: 4 },
            { width: '15%', targets: 5 },
            { width: '15%', targets: 6 },
            { width: '10%', targets: 7 },
            // Add more as needed
        ],
        autoWidth: false,
        pageLength: 5,
        lengthMenu: [5, 25, 50, 100],
        searching: true,
        order: [],
        language: {
            search: "",
            searchPlaceholder: "Search ..."
        }
    });

    $('.dt-buttons, .dataTables_length, .dataTables_filter, .dataTables_paginate, .dataTables_info').show();
    $('.dataTables_length').css('display', 'block');

    $('#totalRecords').text($('#hospitalTable').DataTable().rows({ search: 'applied' }).count());
    $('#rowCount').show();
    highlightTableOnLoad();
    $('#tableContainer').show();
    
}

function highlightTableOnLoad() {
    $('#hospitalTable').addClass('table table-hover table-striped').css({
        'borderRadius': '12px',
        'overflow': 'hidden',
    });
    $('#tableContainer').addClass('animate__animated animate__fadeInUp');
}

function getExportButtons(exportTitle) {
    return [
        {
            extend: 'excel',
            className: 'btn-export-style animate__animated animate__fadeIn',
            title: exportTitle,
            text: '<i class="fas fa-file-excel" style="color: #17572e;"></i> Excel <i class="fas fa-download"></i>',
            filename: exportTitle.replace(/\s+/g, '_')
        }
    ];
}
