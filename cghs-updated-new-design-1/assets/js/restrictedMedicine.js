$(document).ready(function () {
	restMedicineDetail();
	//restrictedMedicineDtl
	   function restMedicineDetail() {
		  // alert(1);
	        var url = createFHashAjaxQuery("/AHIMSG5/hislogin/restMedicineDetailLgnFtr?flag=2");
	        //createFHashAjaxQuery("/AHIMSG5/hislogin/restMedicineDetailLgnFtr?flag=" + flag);
	        $.ajax({
	            url: url,
	            method: "GET",
	            success: function (data) {
	            	populateRestrictedMedicineTable(data,2);
	            },
	            error: function (xhr, status, error) {
	                console.error("Error fetching cities:", error);
	                console.log("XHR Status:", xhr.status); 
	                console.log("XHR Status Text:", xhr.statusText);
	                console.log("Response Text:", xhr.responseText); 
	            }
	        });
	    }

});

function restMedicineDetail(flag) {
	   //alert(flag);
	   
	
	    if (flag === 1) {
	    	document.getElementById("nonStcId").classList.add("active");
	    	document.getElementById("stcId").classList.remove("active");
	    } else{
	    	document.getElementById("stcId").classList.add("active");
	    	document.getElementById("nonStcId").classList.remove("active");
	    }
	

	   $('#restrictedMedicineTableID').DataTable().destroy();
     var url = createFHashAjaxQuery("/AHIMSG5/hislogin/restMedicineDetailLgnFtr?flag=" + flag);
     $.ajax({
         url: url,
         method: "GET",
         success: function (data) {
         	populateRestrictedMedicineTable(data, flag);
         },
         error: function (xhr, status, error) {
             console.error("Error fetching cities:", error);
             console.log("XHR Status:", xhr.status); 
             console.log("XHR Status Text:", xhr.statusText);
             console.log("Response Text:", xhr.responseText); 
         }
     });
 }


function populateRestrictedMedicineTable(medData,flag) {
	
	//alert(flag);
    var table = document.getElementById('restrictedMedicineTableID');
    var tbody = table.querySelector('tbody');
    

    tbody.innerHTML = '';

    if (!medData || !medData.restrictedMedicineDtl) {
        let noDataRow = document.createElement('tr');
        noDataRow.classList.add('table-warning');
        noDataRow.innerHTML = "<td colspan='4' style='text-align:center;'>No Restricted Medicine data available</td>";
        tbody.appendChild(noDataRow);
        table.style.display = 'table';
        return;
    }
    
    if (Array.isArray(medData.restrictedMedicineDtl) && medData.restrictedMedicineDtl.length > 0) {
    	//alert(2);
        for (var i = 0; i < medData.restrictedMedicineDtl.length; i++) {
        	//alert(3);
            var item = medData.restrictedMedicineDtl[i];
            
            if (!item || !item.rmName) {
                console.warn("Invalid Restricted Medicine item at index", i, item);
                continue; // Skip this item
            }
            
            let row = document.createElement('tr');
            row.classList.add('table-primary');
            row.innerHTML = 
                "<td>" + (item.rmName || 'N/A') + "</td>" +
                "<td>" + (item.dosage || 'N/A') + "</td>" /*+
                "<td>" + (item.supplier || 'N/A') + "</td>" +
                "<td>" + (item.facEmpled || 'N/A') + "</td>"*/;
            
            tbody.appendChild(row);
        }
        
        if (tbody.children.length === 0) {
        	console.log(noDataRow);
            let noDataRow = document.createElement('tr');
            noDataRow.classList.add('table-warning');
            noDataRow.innerHTML = "<td colspan='4' style='text-align:center;'>No valid Restricted Medicine records found</td>";
            tbody.appendChild(noDataRow);
        }
    } else {
        let noDataRow = document.createElement('tr');
        noDataRow.classList.add('table-warning');
        noDataRow.innerHTML = "<td colspan='4' style='text-align:center;'>No Restricted Medicine found</td>";
        tbody.appendChild(noDataRow);
    }
    
    var selectedRMName="";
    if(flag==1){
    	//alert(1);
    	selectedRMName = "NON STC";
    }else{
    	//alert(2);
    	selectedRMName = "STC";
    }
  var selectedCityName = $('#citySelect option:selected').text().trim();
var exportTitle = selectedRMName + " Restricted Medicine";

// Destroy any existing DataTable
$('#restrictedMedicineTableID').DataTable().destroy();

$('#restrictedMedicineTableID').DataTable({
    dom: 'Bfrtip',
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
            title: '<h2 style="text-align:center;">' + exportTitle + '</h2>'
        }
    ],
    pageLength: 10,
    searching: true,
    language: {
        search: "",
        searchPlaceholder: "Restricted Medicine..." // Custom placeholder text
    }
});

// Show row count
 var totalRows = table.rows({ search: 'applied' }).count();
            $('#totalRecords').text(totalRows);
            $('#rowCount').show();
}