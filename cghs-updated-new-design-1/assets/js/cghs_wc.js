$(document).ready(function () {
	
	   initializeForm();
	    
	    // Fetch city names on page load
	    fetchCityNames();

	    // Event handlers
	    $('#cityWcSelect').on('change', function () {
	        handleCityChange();
	    });

	    $('#hospitalTypeSelect').on('change', function () {
	        handleHospitalTypeChange();
	    });

	    $('#submitBtn1').on('click', function () {
	        handleSubmit();
	    });

	    // Initialize form state
	    function initializeForm() {
	        $('#submitBtn1').prop('disabled', true);
	        $('#tableContainer').hide();
	        $('#hospitalTypeSelect').prop('disabled', true);
	        
	        // Clear any existing DataTable
	        if ($.fn.DataTable.isDataTable('#hospitalTable')) {
	            $('#hospitalTable').DataTable().destroy();
	        }
	    }

	    // Handle city selection change
	    function handleCityChange() {
	    	
	        var selectedCityId = $('#cityWcSelect').val();
	        
	        if (selectedCityId && selectedCityId !== '') {
	            // Enable hospital type dropdown
	            $('#hospitalTypeSelect').prop('disabled', false);
	            
	            // Reset hospital type selection
	            $('#hospitalTypeSelect').val('');
	            
	            // Disable submit button until hospital type is selected
	            $('#submitBtn1').prop('disabled', true);
	            
	            // Hide table container
	            $('#tableContainer').hide();
	            
	            console.log('City selected:', selectedCityId);
	        } else {
	            // Disable hospital type dropdown and submit button
	            $('#hospitalTypeSelect').prop('disabled', true);
	            $('#hospitalTypeSelect').val('');
	            $('#submitBtn1').prop('disabled', true);
	            
	            // Hide table container
	            $('#tableContainer').hide();
	        }
	    }

	    // Handle hospital type selection change
	    function handleHospitalTypeChange() {
	        var selectedHospitalType = $('#hospitalTypeSelect').val();
	        var selectedCityId = $('#cityWcSelect').val();
	        
	        if (selectedHospitalType && selectedHospitalType !== '' && selectedCityId && selectedCityId !== '') {
	            // Enable submit button
	            $('#submitBtn1').prop('disabled', false);
	            console.log('Hospital type selected:', selectedHospitalType);
	        } else {
	            // Disable submit button
	            $('#submitBtn1').prop('disabled', true);
	        }
	        
	        // Hide table container when selection changes
	        $('#tableContainer').hide();
	    }

	    // Handle submit button click
	    function handleSubmit() {
	    	

	    	$('#hospitalTable').DataTable().destroy();
	        var selectedCityId = $('#cityWcSelect').val();
	        var selectedHospitalType = $('#hospitalTypeSelect').val();
	        
	        // Validate selections
	        if (!selectedCityId || selectedCityId === '') {
	            alert('Please select a city first.');
	            return;
	        }
	        
	        if (!selectedHospitalType || selectedHospitalType === '') {
	            alert('Please select a hospital type.');
	            return;
	        }
	        
	        // Show loading state
	        $('#submitBtn1').prop('disabled', true);
	        $('#submitBtn1').text('Loading...');
	        
	        // Fetch data
	        fetchWellnessCenterByCity(selectedCityId, selectedHospitalType);
	    }

	    // Function to fetch and display city names in the dropdown
	    function fetchCityNames() {
	        var url = createFHashAjaxQuery("/AHIMSG5/hislogin/getCityNamesLgnFtr?");
	        
	        $.ajax({
	            url: url,
	            method: "GET",
	            success: function (data) {
	                populateWcCityNames(data);
	            },
	            error: function (xhr, status, error) {
	                console.error("Error fetching cities:", error);
	                console.log("XHR Status:", xhr.status);
	                console.log("XHR Status Text:", xhr.statusText);
	                console.log("Response Text:", xhr.responseText);
	                
	                // Show error message to user
	                alert('Failed to load cities. Please refresh the page and try again.');
	            }
	        });
	    }

	    // Populate city dropdown
	    function populateWcCityNames(cityData) {
	        if (cityData && cityData.cityNamesDtl && Array.isArray(cityData.cityNamesDtl)) {
	            console.log("Cities loaded:", cityData.cityNamesDtl.length);
	            
	            var cityWcSelect = $('#cityWcSelect');
	            
	            // Clear and reset dropdown
	            cityWcSelect.empty();
	            cityWcSelect.append('<option value="">--Select City--</option>');

	            // Populate dropdown with city names
	            cityData.cityNamesDtl.forEach(function(city) {
	                if (city && city.cityId && city.cityName) {
	                    var option = $('<option></option>')
	                        .val(city.cityId)
	                        .text(city.cityName);
	                    cityWcSelect.append(option);
	                }
	            });
	            
	            // Enable city dropdown
	            cityWcSelect.prop('disabled', false);
	        } else {
	            console.error("No city names found in the response.");
	            alert('No cities available. Please contact support.');
	        }
	    }

	    function fetchWellnessCenterByCity(cityId, hospTypeCode) {
	        console.log('Fetching data for City ID:', cityId, 'Hospital Type:', hospTypeCode);
	        
	        // Construct URL with proper parameter separator
	        var url = createFHashAjaxQuery("/AHIMSG5/hislogin/fetchWellnessCenterByCityLgnFtr?cityId=" + cityId + "&hospTypeCode=" + hospTypeCode);
	        
	        $.ajax({
	            url: url,
	            method: "GET",
	            dataType: "json",
	            success: function (data) {
	                console.log('Data received:', data);
	                
	                // Reset submit button
	                $('#submitBtn1').prop('disabled', false);
	                $('#submitBtn1').text('Submit');
	                
	                if (data && data.hospitalNamesDtl && Array.isArray(data.hospitalNamesDtl) && data.hospitalNamesDtl.length > 0) {
	                    console.log('Hospitals found:', data.hospitalNamesDtl.length);
	                    populateWCHospitalTable(data);
	                    $('#tableContainer').show();
	                } else {
	                    console.log('No hospitals found');
	                    populateWCHospitalTable({ hospitalNamesDtl: [] });
	                    $('#tableContainer').show();
	                }
	            },
	            error: function (xhr, status, error) {
	                console.error("Error fetching hospitals:", error);
	                console.log("XHR Status:", xhr.status);
	                console.log("Response Text:", xhr.responseText);
	                
	                // Reset submit button
	                $('#submitBtn1').prop('disabled', false);
	                $('#submitBtn1').text('Submit');
	                
	                alert('Failed to load hospital data. Please try again.');
	            }
	        });
	    }


});



function populateWCHospitalTable(hospitalData) {

    var table = document.getElementById('hospitalTable');
    var tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows
    
    // Check if data exists and is in expected format
    if (!hospitalData || !hospitalData.hospitalNamesDtl) {
        let noDataRow = document.createElement('tr');
        noDataRow.classList.add('table-warning');
        noDataRow.innerHTML = "<td colspan='4' style='text-align:center;'>No hospital data available</td>";
        tbody.appendChild(noDataRow);
        table.style.display = 'table';
        return;
    }
    
    
    
    if (Array.isArray(hospitalData.hospitalNamesDtl) && hospitalData.hospitalNamesDtl.length > 0) {
    	let serialNumber = 1;
        for (var i = 0; i < hospitalData.hospitalNamesDtl.length; i++) {
            var item = hospitalData.hospitalNamesDtl[i];
            
            if (!item || !item.hospNameCodeType) {
                console.warn("Invalid hospital item at index", i, item);
                continue; // Skip this item
            }
            
            if (item.shortname === "CDAC") {
                continue; // Skip if shortname is CDAC
            }
            var hospName = item.hospNameCodeType;
            
            let row = document.createElement('tr');
            row.classList.add('table-primary');
            row.innerHTML = 

            	"<td>" + serialNumber++ + "</td>" +
                "<td>" + hospName.replace(/[\(")]/g, "")  + "</td>" +
                "<td>" + (item.shortname || 'N/A') + "</td>" +
                "<td>" + (item.address || 'N/A') + "</td>" +
                "<td>" + (item.phone || 'N/A') + "</td>" +
                "<td>" + (item.email || 'N/A') + "</td>";
            
            tbody.appendChild(row);
            var selectedCityName = $('#cityWcSelect option:selected').text().trim();
            var exportTitle = selectedCityName + " Wellness Centers";
            $('#tableHeader').val(exportTitle);
        }
        
        if (tbody.children.length === 0) {
            console.log(noDataRow);
            let noDataRow = document.createElement('tr');
            noDataRow.classList.add('table-warning');
            noDataRow.innerHTML = "<td colspan='4' style='text-align:center;'>No valid hospital records found</td>";
            tbody.appendChild(noDataRow);
        }
    } else {
        let noDataRow = document.createElement('tr');
        noDataRow.classList.add('table-warning');
        noDataRow.innerHTML = "<td colspan='4' style='text-align:center;'>No hospitals found</td>";
        tbody.appendChild(noDataRow);
    }
    

    // Destroy any existing DataTable
    if ($.fn.DataTable.isDataTable('#hospitalTable')) {
        $('#hospitalTable').DataTable().destroy();
    }

    // Initialize DataTable
    var dataTable = $('#hospitalTable').DataTable({
        dom: 'Blfrtip',
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        buttons: [
            {
                extend: 'copy',
                title: exportTitle
            },
            {
                extend: 'csv',
                title: exportTitle,
                filename: exportTitle.replace(/\s+/g, '_') // filename-safe
            },
            {
                extend: 'excel',
                title: exportTitle,
                filename: exportTitle.replace(/\s+/g, '_')
            },
            {
                extend: 'pdf',
                title: exportTitle,
                filename: exportTitle.replace(/\s+/g, '_'),
                orientation: 'landscape',
                pageSize: 'A4'
            },
            {
                extend: 'print',
                title: '', // suppress default title
                messageTop: '', // suppress any default message
                customize: function (win) {
                    // Remove any default title from the print head
                    win.document.title = '';

                    // Inject your custom title into the body
                    $(win.document.body).prepend(
                        '<h2 style="text-align:center; margin-bottom: 20px;">' + exportTitle + '</h2>'
                    );

                    // Optional: Add table borders
                    $(win.document.body).find('table')
                        .css('border-collapse', 'collapse')
                        .css('width', '65%')
                        .find('th, td')
                        .css('border', '1px solid black')
                        .css('padding', '8px')
                        .css('text-align', 'left');
                }
            }
        ],
        pageLength: 10,
        searching: true,
        language: {
            search: "",
            searchPlaceholder: "Search Hospitals..." 
        }
    });

    // Show row count
    var totalRows = dataTable.rows({ search: 'applied' }).count();
    $('#totalRecords').text(totalRows);
    $('#rowCount').show();
}