let menuData = [];
let siteLabel={};


$(document).ready(function() {
	
	console.log("baseURL0     "+ $("#baseURL").val());
	
	 var status="0";
	 console.log("cghs counter>> " ,  localStorage.getItem("cghsCounterDate") );
	 //alert("checking console");
	 
	  if ( localStorage.getItem("cghsCounterDate")!= null && localStorage.getItem("cghsCounterDate")!= ""  ){
				
		  }
	  else{
		  status="1";
		  localStorage.setItem('cghsCounterDate', "1" );
       // = "/AHIMSG5/hislogin/viewerHITCountLgnFtr?status="+ status;
        
	  }
	  insertHITCount(status);
	
    $("#searchButton").click(function() {
        // Set a flag indicating the page was reloaded
    	
		var sliderSection = $("#slider");
        var contentDiv = $('#submenu-content1');
        var submenu = $("#submenu-banner");
        var searchInput = $("#myInputMain");
		searchInput.val("");
        sliderSection.hide();
        //
        submenu.show();
        searchInput.show();
        contentDiv.show();
    });
    
    $("#searchButton2").click(function() {

    	// Set a flag indicating the page was reloaded
    	
		var sliderSection = $("#slider");
        var contentDiv = $('#submenu-content1');
        var submenu = $("#submenu-banner");
        var searchInput = $("#myInputMain");
		searchInput.val("");
        sliderSection.hide();
        //
        submenu.show();
        searchInput.show();
        contentDiv.show();
    });
	

 // Use event delegation to bind click event for dynamically added elements
 $(document).on("click", "#searchButton1", function() {
 	console.log("inside-------------------");
 	var searchInput = $("#myInputMain");
 	searchInput.val("");
 	
 	
 });
    
    
	$.ajax({
        url: '/AHIMSG5/hissso/portal/json/menu.json', // Path to your JSON file
        type: 'GET',
        dataType: 'json',
        success: function(data) {
        	menuData=data;
        	//alert(JSON.stringify(menuData));
        	//createMenu(menuData.menu, document.getElementById("menu"));
        	initAfterMenuJsonLoad();        	
        }
	});
	
	document.getElementById('closeModalBtn').addEventListener('click', function() {
    var modal = document.getElementById('pdfModal');
    modal.style.display = 'none';
	});
	$.ajax({
        url: '/AHIMSG5/hissso/portal/json/label.json', // Path to your JSON file
        type: 'GET',
        dataType: 'json',
        success: function(data) {
        	siteLabel=data;
        	var lang =localStorage.getItem('siteLanguage');
        	if (lang!=undefined)
        		$('#lang').val(lang);
        	else
        		lang='en';
        	
        	if(lang=='en')
        		initLanguageLabels();
        	else
        		languageChange();
        	        	        	
        }
	});
	
	$.ajax({
        url: '/AHIMSG5/hissso/portal/json/menu.json', // Path to your JSON file
        type: 'GET',
        dataType: 'json',
        success: function(data) {
        	menuData=data;
        	//alert(JSON.stringify(menuData));
        	
        	processMenu(menuData.menu);
        	//alert(window.saveResultJSON);
        	createMenu(menuData.menu, document.getElementById("menu"));
        	//initAfterMenuJsonLoad();   
        	//alert(window.saveResultJSON);
        }
	});
	
	
			function debounce(func, delay) {
			    let timeout;
			    return function () {
			        clearTimeout(timeout);
			        timeout = setTimeout(func, delay);
			    };
			}

		// Ensure the input element exists before adding an event listener
		var searchInput = document.getElementById('myInputMain');
		if (searchInput) {
			
			var siteLanguage = localStorage.getItem('siteLanguage');

			// Example: Reload the page if the language has changed (assuming `currentLanguage` is defined)
			var currentLanguage = 'en'; // Replace with the actual language detection logic
			if (siteLanguage && siteLanguage !== currentLanguage) {
			    localStorage.setItem('siteLanguage', currentLanguage);
			    location.reload();
			}
			

		    searchInput.addEventListener('keyup',debounce( function () {
		        var query = searchInput.value.toLowerCase();

		        // Ensure saveResultJSON is defined and has a `menu` property
		        if (window.saveResultJSON && window.saveResultJSON.menu) {
		            var results = searchMenu(window.saveResultJSON.menu, window.saveResultJSON.filedata ,query);
		            //console.log("Search results:", window.saveResultJSON);
		            $("#submenu-content").hide();
		             $("#submenu-header").hide();
		            $("#submenu-content1").show();
		            displaySearchResults(results);
		        }
		        else {
		            console.warn("saveResultJSON is not yet available.");
		        }
		    }, 300));
		}



		
		document.getElementById('closeModalBtn').addEventListener('click', function() {
	    var modal = document.getElementById('pdfModal');
	    modal.style.display = 'none';
		});
		$.ajax({
	        url: '/AHIMSG5/hissso/portal/json/label.json', // Path to your JSON file
	        type: 'GET',
	        dataType: 'json',
	        success: function(data) {
	        	siteLabel=data;
	        	var lang =localStorage.getItem('siteLanguage');
	        	if (lang!=undefined)
	        		$('#lang').val(lang);
	        	else
	        		lang='en';
	        	
	        	if(lang=='en')
	        		initLanguageLabels();
	        	else
	        		languageChange();
	        	        	        	
	        }
		});
		

		 let result = { menu: [] };
		 
		 
});




function loadCircularDetails(groupId,subGroupId){
	
    action = createFHashAjaxQuery("/AHIMSG5/hislogin/fetchCircularDetailsLgnFtr?groupId=" + 0 + "&subGroupId=" + 0);
      
	var jsonObject = { groupId: groupId,
					   subGroupId:subGroupId 
					  };

	var jsonData = window.btoa(JSON.stringify(jsonObject));
	
	    $.ajax({
	        url: action,
	        method: "GET",
	        dataType: "json", 
	        success: function (responses) {
	        	//alert(1);
	        	if (responses && responses.length) {
	        		
	        	    const useSubGroup = responses.length === 1;
	        	    
	        	    if (useSubGroup) {
	        	        addRows(responses, groupId, subGroupId);
	        	    } else {
	        	        addRows(responses, groupId); 
	        	    }
	        	}
	        },
	    });
}

function processMenu(menuArray) {
	
	//alert(1);
    let result = { menu: [] };
    let requests = [];
    let filedata2 =[];
    function processMenuItem(menuItem) {
        if (!menuItem) return;
        
       // console.log("Processing menu item: ", menuItem);

        switch (menuItem.contentType) {
       
            case 'html':
            case 'url':
            case 'files':
                if (menuItem.url && menuItem.url !== "#") {
                    //console.log("Fetching file details from URL:", menuItem.url);
                    try {
                        let request = $.ajax({
                            url: menuItem.url,
                            type: 'GET',
                            dataType: 'json'
                        }).done(function (fileData) {
                            if (fileData && fileData.length > 0) {
                            	filedata2 = fileData;
                                console.log("Received file data:", fileData);
                                menuItem.title = fileData[0].title || menuItem.title;

                                // console.log("Updated menuItem.title:", menuItem.title);
                                menuItem.fileNamePart = fileData[0].fileName.split('^')[0];
                                menuItem.folderNamePart = fileData[0].fileName.split('^')[1];
                                menuItem.menuSearchTerms = fileData[0].metaChar;
                                menuItem.displayName = fileData[0].displayName;
                                menuItem.displayNameHin = fileData[0].displayNameHin;
                                // menuItem.title = fileData[0].title;
                            }
                            result.menu.push(menuItem);
                        });
                        requests.push(request);
                        
                        //console.log("requests.push response   : ", requests);
                        
                    } catch (err) {
                        console.error("Exception while fetching file details:", err);
                    }
                }
                break;
               // console.log("menuItem.contentType menu item: ", menuItem.contentType);
        }

        if (menuItem.submenu && menuItem.submenu.length > 0) {
            menuItem.submenu.forEach(subItem => processMenuItem(subItem));
        }
    }

    menuArray.forEach(menuItem => {
        processMenuItem(menuItem);
        result.menu.push(menuItem);
    });

    $.when.apply($, requests).always(function () {
    	window.saveResultJSON = result; 
    	result.filedata = filedata2;
    	window.saveResultJSON = result;
    	console.log("Final processed result:", JSON.stringify(result, null, 2));
        //createMenu(result.menu, document.getElementById("menu"));
        initAfterMenuJsonLoad(result);
       // enableSearchFeature();


    });
   // alert(2);
   // console.log("Final processed result:", JSON.stringify(result, null, 2));
    //createMenu(result.menu, document.getElementById("menu"));
    //initAfterMenuJsonLoad(result);
    
}



function initLanguageLabels(){
	var lang= $('#lang').val();
	if(lang==undefined)
		lang='en';
	
	$("[data-lang-key]").each(function(){
		var key=$(this).attr("data-lang-key");
		var val='';
		if(siteLabel[key]!=undefined )
			val= siteLabel[key][lang];
		
		if(val==undefined){
			val=siteLabel[key]['en'];
		}
		
		if(val==undefined)
			val="";
		
		
		$(this).html(val);
	})
}

function initAfterMenuJsonLoad(){
	
	//console.log("inside >>initAfterMenuJsonLoad ");
	
	
    const $submenuItems = $('.navbar-nav a'); // Adjust the selector based on your menu structure
    
    

    $submenuItems.on('click', function (event) {
        event.preventDefault(); // Prevent default link behavior
        
        

        // Fetch and display the content based on the clicked submenu item
        const submenuId = $(this).data('submenu-id'); // Assuming you have a data attribute for submenu ID
        const menuType = $(this).data('submenu-type');
       // alert(submenuId);
        //alert(JSON.stringify(menuData.menu));
        const menuObj = findMenuById(submenuId, menuData.menu);
        setMenuDetailsByMenuId(menuObj);
        
        //console.log(      "menuobjj"  +setMenuDetailsByMenuId(menuObj), menuObj )
    });
    
    
	//loadCircularDetails(0);
	
}

    function setMenuDetailsByMenuId(menuObj) {
    	
    	//console.log("inside >>setMenuDetailsByMenuId   >> ",menuObj.url ,menuObj.menuId,menuObj.menuOrder);
    	
    	const $sliderSection = $('#slider');
        const $contentDiv = $('#submenu-content');
        if (menuObj != null) {
        	var contentType= menuObj.contentType;
        	
        	
        	localStorage.setItem('ctMenuId', menuObj.menuId);
        	localStorage.setItem('ctMenuType', 'normal');
        	
        	
        	//alert("inside setMenuDetailsByMenuId contentType >>> "+contentType);
        	switch(contentType) {
        	  case 'html':
        		  // $("#submenu-title").html(getMenuTitleByLang(menuObj));
                  setMenuBreadCrumb(menuObj.menuId, menuData);
                 $sliderSection.add($("#sociallinks")).add($("#newsSection")).hide();
                  $contentDiv.show();
                  $("#submenu-banner").show();
                  $("#breadcrumbIcon").show();
                  $("#content-display").html( getMenuContentByLang(menuObj));
                  $("#sociallinks").hide();
                  $("#submenu-content1").hide();
        	    break;
        	  case 'url':
        		if(menuObj.url=="" || menuObj.url=='#'){
        			
        			url="/AHIMSG5/hissso/Login";
        			window.location.href=url;
        		} else if (url.includes("Dashboard") || menuObj.menuId == "2003") {
        	        url = baseURL + "/HISUtilities/dashboard/dashBoardACTION.cnt?groupId=MQ==&dashboardFor=SE1JUw==&hospitalCode=998&seatId=10001&isGlobal=1&isPreview=0";
        	    } else
        			window.location.href = menuObj.url;
        	    break;
        	  case 'files':
        		  displayFileDetails(menuObj);
          	    break;  
        	    
        	  
        	}
        	
            
        }
    }

      function setMenuBreadCrumb(menuId, menuData) {
       
    	  $("#submenu-header").show();
        const menuArray = getMenuHierarchyById(menuId, menuData.menu);
        let breadcrumb = '';

        menuArray.forEach((item, index) => {
            const [id, newtitle] = item.split('###');
                       
            const menuDataVal = menuData.menu ? menuData.menu : menuData;
           
            const menuObjVal = findMenuById(id.toString() , menuDataVal);
           
           // console.log(menuObjVal);
           
            const title = getMenuTitleByLang(menuObjVal);
           
            // Capture the title for the last menu item (this will be used for the h2 heading)
            if (index === menuArray.length - 1) {
                pageTitle = title; // Set the page title
            }
           
        /*    if (index !== menuArray.length - 1) {
            	
                breadcrumb += `<a id="searchButton2" class="text-white opacity-75">Back to Search<i class="fa fa-search" style="margin-right: 20px;margin-left: 10px;"></i></a><a style="cursor: pointer;" onclick="goToParentPage('${id}')" class="text-white opacity-75">${title} &nbsp;&nbsp;</a><i class="fa-solid fa-arrow-right text-white mx-1"></i> &nbsp;&nbsp;`;
            } else {
                breadcrumb += `<a style="cursor: pointer;" onclick="goToPage('${id}')" class="text-white opacity-75">${title}</a>`;
            }*/
        });
       
        $("#submenu-header").text(pageTitle);
       $("#submenu-banner").show();
       
        //$("#submenu-breadcrumb").html(breadcrumb);
        
    }





    function findMenuById(menuId, menuData) {
    	
    	if(menuData)
        for (const menu of menuData) {
            if (menu.menuId == menuId) {
                return menu;
            }

            if (menu.submenu && menu.submenu.length > 0) {
                const foundInSubmenu = findMenuById(menuId, menu.submenu);
                if (foundInSubmenu) {
                    return foundInSubmenu;
                }
            }
        }
        return null;
    }

    function getMenuHierarchyById(menuId, menus = menuData.menu, path = []) {
        for (const menu of menus) {
            if (menu.menuId == menuId) {
                return [...path, `${menu.menuId}###${menu.title}`];
            }

            if (menu.submenu && menu.submenu.length > 0) {
                const result = getMenuHierarchyById(menuId, menu.submenu, [...path, `${menu.menuId}###${menu.title}`]);
                if (result) {
                    return result;
                }
            }
        }
        return null; // if no menu is found with the given menuId
    }

    function getAllSubmenuTitlesByParentId(parentMenuId, menus = menuData.menu) {
    	
    	//console.log("inside >>getAllSubmenuTitlesByParentId ");
    	
        for (const menu of menus) {
            if (menu.menuId == parentMenuId && menu.submenu) {
                return menu.submenu.map(submenu => `${submenu.menuId}###${submenu.title}###${submenu.titleHindi}`);
            }

            if (menu.submenu && menu.submenu.length > 0) {
                const result = getAllSubmenuTitlesByParentId(parentMenuId, menu.submenu);
                if (result.length > 0) {
                    return result;
                }
            }
        }
        return []; // return an empty array if no submenu is found with the given parentMenuId
    }

    function goToPage(menuId) {
    	
    	//console.log("inside >>goToPage ");
    	
    	localStorage.setItem('ctMenuId', menuId);
    	localStorage.setItem('ctMenuType', 'normal');
    	
        const menuObj = findMenuById(menuId, menuData.menu);
        setMenuDetailsByMenuId(menuObj);
    }

    function goToParentPage(menuId) {
    	
    	//console.log("inside >>goToParentPage >> "+menuId);
    	
    	localStorage.setItem('ctMenuId', menuId);
    	localStorage.setItem('ctMenuType', 'parray');
    	
    	
        setmenuListByArray(getAllSubmenuTitlesByParentId(menuId, menuData.menu));
                          
        setMenuBreadCrumb(menuId, menuData.menu);
                        
    }
    
    function searchMenu(menuItems, fileData, query) {
        if (query.trim() === "") return [];

        const lowerCaseQuery = query.toLowerCase();
        let results = [];

        // ✅ Keep menuItems logic unchanged
        menuItems.forEach(item => {
            if (
                (item.title && item.title.toLowerCase().includes(lowerCaseQuery)) ||
                (item.menuSearchTerms && item.menuSearchTerms.toLowerCase().includes(lowerCaseQuery)) ||
                (item.displayName && item.displayName.toLowerCase().includes(lowerCaseQuery))
            ) {
                results.push(item);
            }

            if (item.submenu && item.submenu.length > 0) {
                results = results.concat(searchMenu(item.submenu, [], query));
            }
        });
        //alert(2);
        // 📂 Improved logic for fileData based on its structure
        fileData.forEach(item => {
            const isMatch = 
                (item.fileName && item.fileName.toLowerCase().includes(lowerCaseQuery)) ||
                (item.displayName && item.displayName.toLowerCase().includes(lowerCaseQuery)) ||
                (item.description && item.description.toLowerCase().includes(lowerCaseQuery)) ||
                (item.displayHinName && item.displayHinName.toLowerCase().includes(lowerCaseQuery)) ||
                (item.circularId && item.circularId.toLowerCase().includes(lowerCaseQuery));

            if (isMatch) {
               // console.log("✅ Match found in fileData:", JSON.stringify(item, null, 2));
                results.push(item);
            }

            // Optional submenu support
            if (item.submenu && Array.isArray(item.submenu) && item.submenu.length > 0) {
                results = results.concat(searchMenu([], item.submenu, query));
            }
        });
      //  console.log("📂 fileData:", JSON.stringify(fileData, null, 2));
        //console.log("item.fileName   result    :::   :22 "+JSON.stringify(results, null, 2));
        return results;
    }

 function setmenuListByArray(menuArray) {
    	
        let menuList = '';
         
       // console.log("menuArray      :       "+menuArray);
        
        menuArray.forEach(item => {
            const [id, title,titleHindi] = item.split('###');
            
            const contentTitle = getMenuTitleByLangWithTitles(title , titleHindi);
            

            
			menuList += `
			  <li class="level3 official-menu-item">
			    <a style="cursor: pointer;" onclick="goToPage('${id}')" class="ruby-menu-link official-link">
			      ${contentTitle}
			    </a>
			  </li>
			`;        
			});
    
		  //$("#submenu-title").html(menuObj.title);
        //  setMenuBreadCrumb(menuObj.menuId, menuData);
        
        
        $('#slider').hide(); 
       $('#submenu-content').show();
	    $('#content-display').html(menuList);
         
    }
    
    
    
    function setFileListByArray(responses,menuObj) {
    	
    	//console.log("inside >>setFileListByArray ");
    	
        const displayNames = responses.map(item => ({
        	  displayName: item.displayName,
        	  displayHinName: item.displayHinName
        	}));

        let fileNames = responses.map(function (response) {
            return response.fileName;
        });
        
        let menuList = '';
        fileNames.forEach((item, index) => {
        	
        	var lang = document.getElementById("lang").value;  
        	var displayName="";
        	
            if (lang === 'en') {
            	displayName = JSON.stringify(displayNames[index].displayName).match(/"(.*)"/)[1];
            } else if (lang === 'hi') {
            	displayName = JSON.stringify(displayNames[index].displayHinName).match(/"(.*)"/)[1];
            }
            menuList += '<li class="ruby-menu-item" style="margin: 10px 0; padding: 14px 18px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.3s ease; cursor: pointer;" onmouseover="this.style.transform=\'translateY(-3px)\'; this.style.boxShadow=\'0 6px 12px rgba(0,0,0,0.1)\'" onmouseout="this.style.transform=\'none\'; this.style.boxShadow=\'0 2px 4px rgba(0,0,0,0.05)\'"><a style="text-decoration: none; color: #1e1e1e; font-weight: 600; flex-grow: 1; display: flex; align-items: center; transition: color 0.3s ease;" onclick="displayFile(\'' + item + '\',\'' + displayName + '\')" class="ruby-menu-link"><i class="fa-solid fa-file-circle-check" style="color: #4caf50; margin-right: 12px; font-size: 20px; transition: transform 0.3s ease;" onmouseover="this.style.transform=\'scale(1.2) rotate(5deg)\'" onmouseout="this.style.transform=\'none\'"></i>' + displayName +'</a>'+'<i class="fa-solid fa-share-nodes" title="Share File" style="color: #607d8b; font-size: 18px; margin-left: 15px; transition: color 0.3s ease;" onclick="openSharePopup(\'' + item + '\', \'' + displayName + '\')"></i>'+'</li>'
        });
        

          $('#slider').hide();
         // $contentDiv.show();
          
          //$("#submenu-banner").show();
        $('#submenu-content').show();
	    $('#content-display').html(menuList);
	    $("#submenu-content1").hide();
    }
    

	 
	function displayFile(fileName, displayFileName , displayHinName) {
	    var fileNamePart = fileName.split('^')[0];
	    var folderNamePart = fileName.split('^')[1];
	    var lang = document.getElementById("lang").value;
	    var displayFileNames = "";
        if (lang === 'en') {
        	displayFileNames = displayFileName;
        	// console.log("displayFileName in1 :  "+displayFileNames);
        } else if (lang === 'hi') {
        	displayFileNames = displayHinName;
        	 //console.log("displayFileName in2:  "+displayFileNames);
        }
    	alert("1",fileName);
    	$("#pdfFileName").text(fileName);
	   // console.log("displayFileName :  "+displayFileNames);
	    var fileURL = "/CGHSGrievance/FormFlowXACTION?hmode=ftpFileDownload&fileName=" + fileNamePart + "&folderName=" + folderNamePart + "&isGlobal=1";
	    
	    fetch(fileURL)
	        .then(response => response.blob())
	        .then(blob => {
	            var blobURL = URL.createObjectURL(blob);
	            
	            var iframe = document.getElementById('pdfIframe');
	            iframe.type = "application/pdf";
	            iframe.src = blobURL;

	            var modal = document.getElementById('pdfModal'); 
	            modal.style.display = "block";

	            

	            
	        })
	        .catch(error => {
	            console.error('Error fetching the file:', error);
	        });
	    
	    alert("2",fileName);
	    
        document.getElementById('pdfModalHeading').innerText = displayFileNames;
        $("#pdfModalHeading").on("click", function () {
        	
        	alert("3",fileName);
        	openSharePopup($("#pdfFileName").text(), displayFileName);
        });
	}

	// Close modal when clicking the close button
	document.getElementById('closeModalBtn').addEventListener('click', function() {
	    document.getElementById('pdfModal').style.display = 'none';
	});

	
	
	function displayFileURL(fileName, displayFileName) {
	    var fileNamePart = fileName.split('^')[0];
	    var folderNamePart = fileName.split('^')[1];
	    
	    var displayFileName = displayFileName;
	    
	   // console.log("displayFileName  "+displayFileName);
	    var fileURL = "/CGHSGrievance/FormFlowXACTION?hmode=ftpFileDownload&fileName=" + fileNamePart + 			"&folderName=" + folderNamePart + "&isGlobal=1";
	    
	    

	}

	// Close modal when clicking the close button
	document.getElementById('closeModalBtn').addEventListener('click', function() {
	    document.getElementById('pdfModal').style.display = 'none';
	});
	

	function displayFileDetails(menuObj){
		// console.log("inside displayFileDetails   >>"+menuDtl);
		 	
		try {
		    $.ajax({
		        url: menuObj.url,
		        method: "GET",
		        dataType: "json", 
		        success: function (responses) {
		        	
	                if (!responses || responses.length === 0) {
	                    alert("No records found.");
	                    return;
	                }
	                
		        	if(responses.length > 1 ){		              

		        	  	setFileListByArray(responses,menuObj);
		        	  	
		        	}else{
		        		
		        		displayFile(responses[0].fileName , responses[0].displayName, responses[0].displayHinName);

		        	}
		        	 
		    
		    },
	        error: function (xhr, status, error) {
	            console.error("AJAX Error - Status:", status, "Error:", error, "Response:", xhr.responseText);
	           // alert("An error occurred while processing your request: " + error);
	        }
	    });
	} catch (err) {
	    console.error("Exception occurred:", err.message);
	    alert("An unexpected error occurred: " + err.message);
	}
}


 function setFileListByArray1(responses) {
	 
	/* var fileNamePart = item.split('^')[0];
var folderNamePart = item.split('^')[1];
var fileURL = "/CGHSGrievance/FormFlowXACTION?hmode=ftpFileDownload&fileName=" + fileNamePart + "&folderName=" + folderNamePart + "&isGlobal=1";
   */
    //console.log("inside >>setFileL yArray 1");
   
        const displayNames = responses.map(item => item.displayName);
      //  console.log("Display Names:", displayNames);
       
        let fileNames = responses.map(function (response) {
            return response.fileName;
        });
    //    console.log("File Names Array:", fileNames);
       
        let menuList = '';
        fileNames.forEach((item, index) => {
            // Get the displayName corresponding to the fileName from the 'responses' array
            let displayName = displayNames[index];
         menuList += '<li class="ruby-menu-item" style="margin: 10px 0; padding: 14px 18px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.3s ease; cursor: pointer;" onmouseover="this.style.transform=\'translateY(-3px)\'; this.style.boxShadow=\'0 6px 12px rgba(0,0,0,0.1)\'" onmouseout="this.style.transform=\'none\'; this.style.boxShadow=\'0 2px 4px rgba(0,0,0,0.05)\'">' +
    '<a style="text-decoration: none; color: #1e1e1e; font-weight: 600; flex-grow: 1; display: flex; align-items: center; transition: color 0.3s ease;" onclick="displayFile(\'' + item + '\',\'' + displayName + '\')" class="ruby-menu-link">' +
    '<i class="fa-solid fa-file-circle-check" style="color: #4caf50; margin-right: 12px; font-size: 20px; transition: transform 0.3s ease;" onmouseover="this.style.transform=\'scale(1.2) rotate(5deg)\'" onmouseout="this.style.transform=\'none\'"></i>' + displayName +
    '</a>' +
    '<i class="fa-solid fa-share-nodes" title="Share File" style="color: #607d8b; font-size: 18px; margin-left: 15px; transition: color 0.3s ease;" onclick="openSharePopup(\'' + item + '\', \'' + displayName + '\')"></i>' +
    '</li>';
        });


          $('#slider').hide();
         // $contentDiv.show();
         
          //$("#submenu-banner").show();
        $('#submenu-content').show();
   $('#content-display').html(menuList);
    }


// share pop up
function openSharePopup(fileName, displayName) {
	
	const baseURL = document.getElementById('baseURL').value;
	
    const fileNamePart = fileName.split('^')[0];
    const folderNamePart = fileName.split('^')[1];
    var shareURL = "";
    if (fileName.includes("CGHSGrievance")){
    	shareURL = baseURL+fileName;
    }else{
     shareURL = baseURL+`/CGHSGrievance/FormFlowXACTION?hmode=ftpFileDownload&fileName=${fileNamePart}&folderName=${folderNamePart}&isGlobal=1`;
    }
    // Set the link in the input field
    $('#sharePopupInput').val('');
    console.log("  sharePopupInput   ",$('#sharePopupInput').val());
    document.getElementById('sharePopupInput').value = shareURL;
    document.getElementById('sharePopupTitle').innerText = `Share: ${displayName}`;
    
    // Create share links for different platforms
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(shareURL)}`;
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`;
    const emailURL = `mailto:?subject=Check this link&body=${encodeURIComponent(shareURL)}`;
    
    document.getElementById('whatsappLink').setAttribute('href', whatsappURL);
    document.getElementById('facebookLink').setAttribute('href', facebookURL);
    document.getElementById('emailLink').setAttribute('href', emailURL);
    
    // Show the popup
    document.getElementById('pdfModal').style.display = 'none';
    document.getElementById('sharePopup').style.display = 'block';
    document.getElementById('sharePopupOverlay').style.display = 'block';
}

function closeSharePopup() {
    document.getElementById('sharePopup').style.display = 'none';
    document.getElementById('sharePopupOverlay').style.display = 'none';
}

function copyShareLink() {
    const input = document.getElementById('sharePopupInput');
    input.select();
    input.setSelectionRange(0, 99999); // For mobile
    navigator.clipboard.writeText(input.value).then(() => {
        alert("Link copied to clipboard!");
    });
}






function displayFileDetails1(url){
// console.log("inside displayFileDetails   >>"+menuDtl);

try {
   $.ajax({
       url: url,
       method: "GET",
       dataType: "json",
       success: function (responses) {
       
                if (!responses || responses.length === 0) {
                    alert("No records found.");
                    return;
                }
               
        if(responses.length > 1 ){              

          setFileListByArray1(responses);
         
        }else{
       
        displayFile(responses[0].fileName , responses[0].displayName , responses[0].displayHinName);

        }
       
   
   },
        error: function (xhr, status, error) {
            console.error("AJAX Error - Status:", status, "Error:", error, "Response:", xhr.responseText);
        }
    });
} catch (err) {
    console.error("Exception occurred:", err.message);
    alert("An unexpected error occurred: " + err.message);
}
}


		
function handleLevel3Click(anchor) {
  const linkText = anchor.textContent.trim();
  const url = anchor.getAttribute('data-url');

  //console.log("Link text:", linkText);
  //console.log("URL:", url);
  displayFileDetails1(url)

  
}

	function addRows(responses,groupId,subGroupId) {
		//alert("Inside addRows: " + JSON.stringify(responses, null, 2));		
		const datalist = document.querySelector(`#datalistId${groupId}`);
		//$("#datalistId").html("");	
		$('.datalist').html("");	
	  responses.forEach(function(data) {
		//  console.log("Inside forEach CircularDetailsData:", data);

	    addRowData(responses,data,groupId,subGroupId);
	    
	  });
	}
	
	function formatDate(dateTimeStr) {
		 const datePart = dateTimeStr.split(" ")[0];

		    const dateObj = new Date(datePart);

		    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

		    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		    const weekday = weekdays[dateObj.getDay()];
		    const day = dateObj.getDate();
		    const month = months[dateObj.getMonth()];
		    const year = dateObj.getFullYear();

		    /*return weekday+" "+day +" "+ month+" "+year;*/
		    return +" "+day +" "+ month+" "+year;
	}

					

	function addRowData(responses,data,groupId,subGroupId) {
		//console.log(groupId);
		//console.log("Inside addRow1234:", data);
		var  description = data && data.description ? data.description.trim() : "No Description Available";
		var  fromDate = data && data.fromDate ? formatDate(data.fromDate.trim()  ) : "No Date Available";
		var  fileName = data && data.fileName ? data.fileName.trim() : "No File Available";
		var  displayName = data && data.displayName ? data.displayName.trim() : "No DisplayName Available";
		var  displayHinName = data && data.displayHinName ? data.displayHinName.trim() : "&#xA;&#x915;&#x94B;&#x908;&#x20;&#x939;&#x93F;&#x902;&#x926;&#x940;&#x20;&#x928;&#x93E;&#x92E;&#x20;&#x909;&#x92A;&#x932;&#x92C;&#x94D;&#x927;&#x20;&#x928;&#x939;&#x940;&#x902;&#x20;&#x939;&#x948;";
		// function t change formate date
		//console.log("Inside fromDate>>>>>:", fromDate);
		
		if($("#lang").val() === 'en'){
			
			var showFileName = displayName;
		}else{
			var showFileName = displayHinName;
		}
		
			
			var folderName = "";
			var urlFileName = fileName.split("^")[0]; // covert this to base64

			//var urlFileNameBase64 = btoa(urlFileName);

			// Now you have the Base64 encoded version of urlFileName
			//console.log("urlFileNameBase6400  .>>  "+ urlFileNameBase64);
			
			if (fileName && fileName !== "No File Available") {
			    // Split the fileName by `_` to get its parts
			    let parts = fileName.split("_");
			    if (parts.length > 1) {
			        let secondPart = parts[1];
			
			        // Split the second part by `^` to extract showFileName and folderName
			        let splitParts = secondPart.split("^");
			        folderName = splitParts[1] || "Circular";
			    }
			}

		var fileURL = "/CGHSGrievance/FormFlowXACTION?hmode=ftpFileDownload&fileName="+urlFileName+"&folderName="+folderName+"&isGlobal=1";
		
		//console.log("Show File Name:", showFileName);  
	const displayNames = responses.map(item => item.displayName);
	    const datalist = document.querySelector('.datalist');

	    const newListItem = document.createElement('li');
	   // console.log("newListItem  ++  "+ newListItem);
	    newListItem.classList.add('my-1', 'px-3', 'd-flex', 'align-items-top', 'py-2');

//	    if (responses.length > 0){
		 newListItem.innerHTML =
  "<div class='light-sm-txt datetime' " +
    "style='animation: fadeIn 0.5s ease;'>"  +
    fromDate +
  
  "</span>" +
"</button>" +
     
    
  "</div>" +

  "<div class='multiplepdflist d-flex align-items-center' style='animation: slideIn 0.5s ease;'>" +
    "<ul class='d-flex align-items-top p-0' style='list-style: none; margin: 0; padding: 0;'>" +
      "<li class='me-4'>" +
        "<a href='" + fileURL + "' target='_blank' class='d-flex align-items-center align-items-top text-decoration-none' " +
           "style='color: #333; font-size: 0.79rem; font-weight: 500; transition: color 0.3s ease; text-decoration: none;' " +
           "onmouseover=\"this.style.color='#ed1848'\" onmouseout=\"this.style.color='#333'\">" +
          showFileName +
        "</a>" +
      "</li>" +
    "</ul>" +
  "</div>" +

  "<style>" +
    "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }" +
    "@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }" +
  "</style>";

		    if(groupId === 0){
				datalistId1.appendChild(newListItem);
				}
			if(groupId==14){
				datalistId2.appendChild(newListItem);
				}
			if(groupId==14){
				datalistId3.appendChild(newListItem);
				}
			if(groupId==14){
				datalistId4.appendChild(newListItem);
				}/*
			if(groupId==5){
				datalistId5.appendChild(newListItem);
				}*/
			 
	  }

	

	function languageChange() {
	    console.log("Language change triggered to:", $('#lang').val());
	    localStorage.setItem('siteLanguage', $('#lang').val());
	    fetchCityNames();
	    initLanguageLabels();
	    
	    // Update chatbot language using existing function
	    if (typeof updateChatbotUILanguage === 'function') {
	        updateChatbotUILanguage($('#lang').val());
	    }
	    
	    // Clear and recreate menu with new language
	    document.getElementById("menu").innerHTML = '';
	    createMenu(menuData.menu, document.getElementById("menu"));
	    initAfterMenuJsonLoad();
	    
	    // Update search results with new language
	    var searchInput = $("#myInputMain").val();
	    var query = searchInput.toLowerCase();
	    if (window.saveResultJSON && window.saveResultJSON.menu) {
	        var results = searchMenu(window.saveResultJSON.menu, window.saveResultJSON.filedata, query);
	        console.log("Search results:", results);
	        $("#submenu-content").hide();
	        $("#submenu-content1").show();
	        displaySearchResults(results);
	    }
	    
	    // Update banner image immediately
	    var lang = document.getElementById("lang").value;  
	    var imageElement = document.getElementById("bannerImage");  
	    if (lang === 'en') {
	        imageElement.src = "/AHIMSG5/hissso/portal/images/slider/cghs-english-banner.jpg";  
	    } else if (lang === 'hi') {
	        imageElement.src = "/AHIMSG5/hissso/portal/images/slider/cghs-hindi-banner.jpg";  
	    }
	    
	    // Update current page content if any menu is active
	    let ctMenuTypeVal = localStorage.getItem('ctMenuType');
	    let ctMenuIdVal = localStorage.getItem('ctMenuId');
	    
	    if (ctMenuTypeVal == 'parray') {
	        goToParentPage(ctMenuIdVal);
	    } else {
	        if (ctMenuIdVal) {
	            const menuDataVal = menuData.menu ? menuData.menu : menuData;
	            const menuObjVal = findMenuById(ctMenuIdVal, menuDataVal);
	            if (menuObjVal) {
	                var contentType = menuObjVal.contentType;
	                if (contentType == "url" && menuObjVal.url != undefined && menuObjVal.url != '' && menuObjVal.url != '#') {
	                    setMenuDetailsByMenuId(menuObjVal);
	                } else if (contentType == "html" || contentType == "files") {
	                    setMenuDetailsByMenuId(menuObjVal);
	                }
	            }
	        }
	    }
	    
	    // Force refresh any modal content if open
	    refreshOpenModals();
	}
	
	// NEW FUNCTION: Refresh any open modals
	function refreshOpenModals() {
	    // Refresh chatbot modal if open
	    if ($('#chatbotModal').hasClass('show')) {
	        updateChatbotLanguage($('#lang').val());
	    }
	    
	    // Refresh PDF modal title if open
	    var pdfModal = document.getElementById('pdfModal');
	    if (pdfModal && pdfModal.style.display === 'block') {
	        // You may need to reload the PDF with new language if applicable
	        console.log("PDF modal is open - consider refreshing content");
	    }
	    
	    // Refresh share popup if open
	    var sharePopup = document.getElementById('sharePopup');
	    if (sharePopup && sharePopup.style.display === 'block') {
	        console.log("Share popup is open - titles would need translation");
	    }
	}
	
	
	function getMenuTitleByLang(menuObj){
		
		if($("#lang").val() === 'en'){
			
			return menuObj.title;
			
		}else{
			
			return menuObj.titleHindi ? menuObj.titleHindi :  menuObj.title;
			
		}
		
	}
	
		function getMenuContentByLang(menuObj){
		
		var content = '';
				
		if($("#lang").val() === 'en'){
			
			content = menuObj.encodedContent;
			
		}else{
			
			content =  menuObj.encodedContentHindi ? menuObj.encodedContentHindi :  menuObj.encodedContent;
			
		}
		
		
		return decodeURIComponent(escape(atob(content)))
		
	}
	
	
function getMenuTitleByLangWithTitles(title , hindiTitle){
		
		var content = '';
				
		if($("#lang").val() === 'en'){
			
			content = title;
			
		}else{
			
			content = hindiTitle ? hindiTitle : title;
			
		}
		
		
		return content;
		
	}
	
function createMenu(menuItems, parentElement, isSubmenu = false) {
    menuItems.forEach(item => {
        let li = document.createElement("li");
        if (!isSubmenu) {
            li.classList.add("nav-item");
        }

        let element;
        if (item.menuId == "15") {
            // create a button instead of a link
            element = document.createElement("button");
            element.classList.add("btn", "nav-link"); // style as needed
            element.type = "button";
            element.style.color = "white";
            element.style.backgroundColor = "transparent"; // Transparent background
			element.style.border = "none";
            element.textContent = getMenuTitleByLang(item);
            element.title = "Click here for CCGHS FAQ ";
            element.addEventListener("click", () => {
                // your button action here
                window.location.href = "faqLogin";

            });
        } else {
            // default: create an anchor
            element = document.createElement("a");
            element.classList.add("nav-link");
            if (item.submenu && item.submenu.length > 0) {
                element.classList.add("dropdown-toggle");
            }
            element.setAttribute("id", "navbarDropdown");
            element.setAttribute("role", "button");
            element.setAttribute("data-submenu-id", item.menuId);
            element.setAttribute("data-submenu-type", item.contentType);
            element.href = item.url;
            element.textContent = getMenuTitleByLang(item);
        }

        li.appendChild(element);

        if (item.submenu && item.submenu.length > 0) {
            let ul = document.createElement("ul");
            ul.classList.add("dropdown-menu");
            ul.setAttribute("aria-labelledby", "navbarDropdown");
            li.classList.add("dropdown");
            createMenu(item.submenu, ul, true);
            ul.querySelectorAll("a").forEach(submenuAnchor => {
                submenuAnchor.classList.add("dropdown-item");
                submenuAnchor.addEventListener("click", () => {
                    const navbarCollapse = document.querySelector(".navbar-collapse");
                    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
                        const collapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
                        collapse.hide();
                    }
                });
            });
            li.appendChild(ul);
        }

        parentElement.appendChild(li);
    });
}




$(document).ready(function () {
    // Fetch city names when the page loads
    fetchCityNames();

    // Event handler for when a city is selected
    $('#citySelect').on('change', function () {
        var selectedCityId = $(this).val(); // Get the selected city's ID
        if (selectedCityId) {
        	localStorage.setItem('selectedCityId', selectedCityId );
            //fetchHospitalsByCity(selectedCityId); // Fetch hospitals for the selected city
        } else {
            $('#hospitalTable').hide(); // Hide the hospital table if no city is selected
        }
    });

    // Function to fetch and display city names in the dropdown

});

function fetchCityNames() {
    var url = createFHashAjaxQuery("/AHIMSG5/hislogin/getCityNamesLgnFtr?");
    $.ajax({
        url: url,
        method: "GET",
        success: function (data) {
            // Ensure you are accessing the correct part of the response
            if (data.cityNamesDtl) {
            	
                //console.log("Cities:", data.cityNamesDtl);
            	 var citySelect = $('#citySelect');
                 citySelect.empty(); 
            	if ($("#lang").val() === 'en') {
            		citySelect.append('<option data-lang-key="citySelect" value="">--Select--</option>');    
                } else {
                	citySelect.append('<option data-lang-key="citySelect" value="">--&#x91A;&#x92F;&#x928;&#x20;&#x915;&#x930;&#x947;&#x902;--</option>'); 
                }

                data.cityNamesDtl.forEach(function(city) {
                    var cityNameToShow;
                    if ($("#lang").val() === 'en') {
                        cityNameToShow = city.cityName;     // English name
                    } else {
                        cityNameToShow = city.cityHinName;  // Hindi name or other language
                    }
                    //console.log("Current language is en: " + ($("#lang").val() === 'en'));

                    var option = $('<option></option>')
                        .val(city.cityId)       // Set cityId as the value
                        .text(cityNameToShow);  // Use the selected city name

                    citySelect.append(option);
                });
            } else {
                console.error("No city names found in the response.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching cities:", error);
            console.log("XHR Status:", xhr.status); 
            console.log("XHR Status Text:", xhr.statusText);
            console.log("Response Text:", xhr.responseText); 
        }
    });
}

$(document).ready(function () {
   // $('#searchInput').hide();

    $('#submitBtn').on('click', function () {
    	window.location = "/AHIMSG5/hissso/empanelledLogin";
    });
    

	$('#submitRateFWDBtn').on('click', function () {
	    const tier = $('#tierSelect').val() || '';
	    const spaciality = $('#spacialitySelect').val() || '';
	    const ward = $('#wardSelect').val() || '';
	    alert(`Selected Values:\nTier: ${tier}\nSpaciality: ${spaciality}\nWard: ${ward}`);
	    const url = `/AHIMSG5/hissso/cghsRateListLogin?tier=${encodeURIComponent(tier)}&spaciality=${encodeURIComponent(spaciality)}&ward=${encodeURIComponent(ward)}`;

	    window.location = url;
	});
	
    $('#searchInput').on('keyup', function () {
      var value = $(this).val().toLowerCase();
      $('#hospitalTable tbody tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);

        var visibleRows = $('#hospitalTable tbody tr:visible').length;
        $('#totalRecords').text(visibleRows);
      });
    });
  });




function displaySearchResults(results) {
	
    const menuElement = document.getElementById('submenu-content1');
    menuElement.innerHTML = '';
    // Show the default message only if the search box is empty
    if (!results || results.length === 0) {
    	displayPreLoadedSearch(results)
    }

    results.forEach(result => {
    	
    	  if (result.fileName && typeof result.fileName === 'string' && result.fileName.trim() !== '') {
    		    console.log("displaySearchResults 2 :: ", JSON.stringify(result));
    		    displaySearchUrlbyDb(result);
    		  }

        //alert("displaySearchResults results.forEach :: " + JSON.stringify(result.title, null, 2));
       // console.log("results are: ", results);
        const { id, title, titleHindi } = result; 
        const contentTitle = getMenuTitleByLangWithTitles(title, titleHindi);

        const menuItem = document.createElement('li');
        menuItem.textContent = contentTitle;
        menuItem.style.cursor = 'pointer';

        menuItem.addEventListener('click', () => {
            if (result.submenu) {
                displaySubmenu(result.submenu);
            } else {
                setMenuDetailsByMenuId(result);
            }
        });

        menuElement.appendChild(menuItem);
        document.getElementById('myInputMain').focus(); 
    });
}

function displaySearchUrlbyDb(item) {
	
	  if (
			    !item ||
			    !item.fileName ||
			    typeof item.fileName !== 'string' ||
			    item.fileName.trim() === '' ||
			    !item.displayName
			  ) {
			    console.warn("Skipping blank or invalid item:", item);
			    return;
			  }

	  console.log("displaySubmenu :: " + JSON.stringify(item, null, 2));

	  const menuElement = document.getElementById('submenu-content1');

	  const { fileName, displayName, displayHinName } = item;
	  const contentTitle = getMenuTitleByLangWithTitles(displayName, displayHinName);

	  const menuItem = document.createElement('li');
	  menuItem.className = 'ruby-menu-item';
	  menuItem.style.margin = '10px 0px';
	  menuItem.style.padding = '14px 18px';
	  menuItem.style.border = '1px solid rgb(224, 224, 224)';
	  menuItem.style.borderRadius = '10px';
	  menuItem.style.backgroundColor = 'rgb(255, 255, 255)';
	  menuItem.style.display = 'flex';
	  menuItem.style.alignItems = 'center';
	  menuItem.style.justifyContent = 'space-between';
	  menuItem.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.05)';
	  menuItem.style.transition = '0.3s';
	  menuItem.style.cursor = 'pointer';

	  menuItem.onmouseover = () => {
	    menuItem.style.transform = 'translateY(-3px)';
	    menuItem.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
	    menuItem.style.listStyleType = 'none';
	  };

	  menuItem.onmouseout = () => {
	    menuItem.style.transform = 'none';
	    menuItem.style.listStyleType = 'none';
	    menuItem.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
	  };

	  const anchor = document.createElement('a');
	  anchor.className = 'ruby-menu-link';
	  anchor.style.textDecoration = 'none';
	  anchor.style.color = '#1e1e1e';
	  anchor.style.fontWeight = '600';
	  anchor.style.flexGrow = '1';
	  anchor.style.display = 'flex';
	  anchor.style.alignItems = 'center';
	  anchor.style.transition = 'color 0.3s ease';
	  anchor.onclick = () => displayFile(fileName, displayName, displayHinName);

	  const icon = document.createElement('i');
	  icon.className = 'fa-solid fa-file-circle-check';
	  icon.style.color = '#4caf50';
	  icon.style.marginRight = '12px';
	  icon.style.fontSize = '20px';
	  icon.style.transition = 'transform 0.3s ease';

	  icon.addEventListener('mouseover', () => {
	    icon.style.transform = 'scale(1.2) rotate(5deg)';
	  });

	  icon.addEventListener('mouseout', () => {
	    icon.style.transform = 'none';
	  });

	  anchor.appendChild(icon);
	  anchor.appendChild(document.createTextNode(contentTitle));
	  menuItem.appendChild(anchor);
	  menuElement.appendChild(menuItem);

	  $('#submenu-content1').show();
	}

function displaySubmenu(submenu) {
    console.log("displaySubmenu :: " + JSON.stringify(submenu, null, 2));

    const menuElement = document.getElementById('submenu-content1');
    menuElement.innerHTML = ''; // Clear existing menu

    submenu.forEach(result => {
        console.log("displaySearchResults results.forEach :: " + JSON.stringify(result.title, null, 2));

        const { menuId, title, titleHindi } = result; 
        const contentTitle = getMenuTitleByLangWithTitles(title, titleHindi);

        const menuItem = document.createElement('li');
        menuItem.textContent = contentTitle;
        menuItem.style.cursor = 'pointer';

        menuItem.addEventListener('click', () => setMenuDetailsByMenuId(result)); 
        menuElement.appendChild(menuItem);
    });
}


function showPDF(fileURL, displayFileName) {
    fetch(fileURL)
        .then(response => response.blob())
        .then(blob => {
            var blobURL = URL.createObjectURL(blob);

            var iframe = document.getElementById('pdfIframe');
            iframe.src = blobURL; // Set the Blob URL to iframe

            var modal = document.getElementById('pdfModal');
            modal.style.display = "block"; // Show modal

            document.getElementById('pdfModalHeading').innerText = displayFileName;
            $("#pdfModalHeading").on("click", function () {
            	alert(fileURL);
            	openSharePopup(fileURL, displayFileName);
            });
        })
        .catch(error => console.error("Error loading PDF:", error));
}

// Function to display the search results and attach click event to show PDF
function displayPreLoadedSearch(responses) {
    const menuElement = document.getElementById('submenu-content1');
    menuElement.innerHTML = ''; // Clear existing content

if (!responses || responses.length === 0) {
        menuElement.innerHTML = '<h2 style="text-align: center; margin-top: 30px; margin-bottom: 30px;">Please Search for News and Updates</h2>';
        return;
    }

    responses.forEach(result => {
        const { displayName, displayNameHin, fileName } = result;
        const contentTitle = getMenuTitleByLangWithTitles(displayName, displayNameHin);

        let folderName = "";
        var urlFileName = fileName.split("^")[0];
        
        if (fileName && fileName !== "No File Available") {
            const parts = fileName.split('_');
            if (parts.length > 1) {
                const fileParts = parts[1].split('^');
                folderName = fileParts[1] || "";
            }
        }

        const fileURL = fileName && fileName !== "No File Available"
            ? `/CGHSGrievance/FormFlowXACTION?hmode=ftpFileDownload&fileName=${encodeURIComponent(urlFileName)}&folderName=${encodeURIComponent(folderName)}&isGlobal=1`
            : null;

        const menuItem = document.createElement('li');
        menuItem.style.cursor = 'pointer';

        if (fileURL) {
            menuItem.textContent = contentTitle;
            menuItem.addEventListener('click', () => showPDF(fileURL, contentTitle));
        } else {
            menuItem.textContent = contentTitle;
        }

        menuElement.appendChild(menuItem);
    });
}





function openFrame(id){
	
	var url="";

	if(id=="appointment"){
      
		 $('#myModalserving').modal('hide');
		 url=createFHashAjaxQuery("/CGHSAppointment/FormFlowXACTION?isGlobal=1&masterKey=Mobileotp");
		 //url=createFHashAjaxQuery("/ABDM_QMS/ABHACreation?abdmMode=appointment&isGlobal=1");

	}	
	if(id=="deprtmntLogin"){
          
		 $('#myModalserving').modal('hide');
		 url=createFHashAjaxQuery("/CGHSCardMgmt/FormFlowXACTION?isGlobal=1&masterKey=mobiledptOtp");
		 //url=createFHashAjaxQuery("/ABDM_QMS/ABHACreation?abdmMode=appointment&isGlobal=1");

	}	
	if(id == "applycard"){

		 $('#myModalserving').modal('hide');
		 url= '/CGHSCardMgmt/FormFlowXACTION?isGlobal=1&masterKey=Mobileotp';
		// url= '/CGHSCardMgmt/FormFlowXACTION?isGlobal=1&masterKey=PanVerification';
		}
	
	if(id == "applycardonline"){

		 $('#myModalserving').modal('hide');
		 url= '/CGHSCardMgmt/FormFlowXACTION?isGlobal=1&masterKey=PanVerification';
		}
	if(id == "pensionerapplycard"){

		 $('#myModalserving').modal('hide');
		 url= '/CGHSCardMgmt/FormFlowXACTION?isGlobal=1&masterKey=DAOnlinePensioner';
		}
	//url="/AHIMSG5/hissso/constructionLogin";

	$('#preloader').show();
	$('#iframeModalFullScreen').attr("src",url);

	 $('#modalFullScreen').show();
	 $(".modal-backdrop").hide();
	
	
	 $('#iframeModalFullScreen').on('load', function(){
			$('#preloader').delay(450).fadeOut('slow');		
		});
		
	}	

	function closeModal(){
		closeFullScreenModal();
	}		

	function closeFullScreenModal(){
		 $('#iframeModalFullScreen').attr("src","");
		 $('#modalFullScreen').hide();
		 $(".modal-backdrop").hide();

	}

	
    function insertHITCount(status) {
        
		var url = "/AHIMSG5/hislogin/viewerHITCountLgnFtr?status="+ status;
        $.ajax({
            url: url,
            method: "GET",
            success: function (data) {
            	  if (data.data && Array.isArray(data.data)) {
                      // Find the object with device_type === "Total"
                      var totalObj = data.data.find(item => item.device_type === "Total");
                      if (totalObj) {
                          var counterValue = totalObj.total_hits;
                          $('.website-counter').text(counterValue);
                      } else {
                          console.error("Total device_type not found.");
                      }
                  } else {
                      console.error("Invalid data format or no records found.");
                  }
              },
            error: function (xhr, status, error) {
                console.error("Error fetching cities:", error);
                console.log("XHR Status:", xhr.status); 
                console.log("XHR Status Text:", xhr.statusText);
                console.log("Response Text:", xhr.responseText); 
            }
        });
    }
    
    document.addEventListener('DOMContentLoaded', function () {
        // Define the URL to fetch file details
        var coveredCityUrl = "/AHIMSG5/hislogin/fetchCircularDetailsLgnFtr?groupId=10&subGroupId=103";
        //var faclityCGHSUrl = "/AHIMSG5/hislogin/fetchCircularDetailsLgnFtr?groupId=10&subGroupId=102";
        fetchAndSetDownloadLink(coveredCityUrl);
    });

    function fetchAndSetDownloadLink(coveredCityUrl) {
        try {
            $.ajax({
                url: coveredCityUrl,
                method: "GET",
                dataType: "json",
                success: function (responses) {
                    if (!responses || responses.length === 0) {
                        console.log("No records found.");
                        return;
                    }
                    // Assuming the first response contains the file details
                    var fileName = responses[0].fileName;
                    var folderName = responses[0].folderName || "default-folder"; // Replace with actual folder name if needed

            	    var fileNamePart = fileName.split('^')[0];
            	    var folderNamePart = fileName.split('^')[1];
            	    
            	    var displayFileName = displayFileName;
            	    
            	    console.log("displayFileName  "+displayFileName);
            	    var fileURL = "/CGHSGrievance/FormFlowXACTION?hmode=ftpFileDownload&fileName=" + fileNamePart + "&folderName=" + folderNamePart + "&isGlobal=1";
            	    
                    var downloadLink = document.getElementById('downloadLink');
                    downloadLink.href = fileURL;

                    // Add an event listener to trigger the download when the link is clicked
                    downloadLink.addEventListener('click', function (event) {
                        event.preventDefault(); // Prevent the default link behavior
                        window.location.href = fileURL; // Trigger the download
                    });
                },
                error: function (xhr, status, error) {
                    console.error("AJAX Error - Status:", status, "Error:", error, "Response:", xhr.responseText);
                  //  alert("An error occurred while processing your request: " + error);
                }
            });
        } catch (err) {
            console.error("Exception occurred:", err.message);
           // alert("An unexpected error occurred: " + err.message);
        }
    }

    
    function mySearchFunction1() {
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById("myInputMain");
        filter = input.value.toUpperCase();
        ul = document.getElementById("datalistId1");
        li = ul.getElementsByTagName("li");

        for (i = 0; i < li.length; i++) {
            let label = li[i].getElementsByTagName("label")[0]; // Get the label text
            let links = li[i].getElementsByTagName("a"); // Get all <a> elements inside the list item

            let found = false;
            // Check label text
            if (label) {
                txtValue = label.textContent || label.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                }
            }

            // Check links text (PDF file names)
            for (let j = 0; j < links.length; j++) {
                let linkText = links[j].textContent || links[j].innerText;
                if (linkText.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }

            // Show or hide the <li> element based on search result
            li[i].style.display = found ? "" : "none";
        }
    }
    
    

    function mySearchFunction() {
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        ul = document.getElementById("datalistId1");
        li = ul.getElementsByTagName("li");

        for (i = 0; i < li.length; i++) {
            let label = li[i].getElementsByTagName("label")[0]; // Get the label text
            let links = li[i].getElementsByTagName("a"); // Get all <a> elements inside the list item

            let found = false;
            // Check label text
            if (label) {
                txtValue = label.textContent || label.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                }
            }

            // Check links text (PDF file names)
            for (let j = 0; j < links.length; j++) {
                let linkText = links[j].textContent || links[j].innerText;
                if (linkText.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }

            // Show or hide the <li> element based on search result
            li[i].style.display = found ? "" : "none";
        }
    }



    function openCustomPopup(contentId) {
        let content = '';

        // You can use JSP logic to decide the content dynamically
        if (contentId === 'content1') {
            content = `
            	 <header>
                <h1>Privacy Policy for CGHS Website</h1>
                <p><strong>Effective Date:</strong> 11 March 2025 | <strong>Last Updated:</strong>  11 March 2025</p>
                          </header>
<div class="content">
<section>
<h2>1. Introduction</h2>
<p>The Central Government Health Scheme (CGHS) is committed to safeguarding the privacy and security of its beneficiaries' personal data. This Privacy Policy outlines the collection, usage, storage, and protection of personal data when using the CGHS website (<a href="http://www.cghs.gov.in">www.cghs.gov.in</a>). Our data handling practices comply with the Information Technology Act, (2000) the Right to Information (RTI) Act, 2005, and applicable Draft Data Protection Rules. The CGHS website conforms to Guidelines for Indian Government Websites (GIGW) 3.0, ensuring quality, security, and accessibility.</p>
</section>

<section>
<h2>2. Accuracy Disclaimer</h2>
<p>Though all efforts have been made to ensure the accuracy of the content on this website, the same should not be construed as a statement of law or used for any legal purposes. The Central Government Health Scheme accepts no responsibility in relation to the accuracy, completeness, usefulness, or otherwise, of the contents. Users are advised to verify/check any information and obtain appropriate professional advice before acting on the information provided on this website.</p>
</section>

<section>
<h2>3. Data Collection & Processing</h2>
<p>When you fill the online CGHS Card application form, we collect and process:</p>
<ul>
    <li><strong>Personal Identification Data:</strong> Name, age, date of birth, gender.</li>
    <li><strong>Contact Details:</strong> Address, mobile number, email ID.</li>
    <li><strong>Identity & Verification Documents:</strong> PAN card, Voter ID, passport details etc.</li>
    <li><strong>Employment & Financial Data:</strong> Salary slip, employment details, pension information.</li>
    <li><strong>Nominee Details:</strong> Information of individuals nominated under CGHS benefits.</li>
    <li><strong>Transaction & Contribution Data:</strong> History of CGHS contributions and payment records.</li>
    <li><strong>Device & Log Data:</strong> IP address, browser type, operating system details, timestamps, and session activity.</li>
</ul>
</section>

<section>
<h2>4. Conformity with GIGW 3.0</h2>
<p>The CGHS website follows GIGW 3.0 guidelines, ensuring:</p>
<ul>
    <li><strong>User-Centric Design & Accessibility:</strong> Compliance with Web Content Accessibility Guidelines (WCAG 2.1, Level AA) for people with disabilities.</li>
    <li><strong>API Integrations:</strong> Secure linkage with DigiLocker, PAN verification, BharatKosh, UTI-ITSL Single-Sign-On (SSO), and other government platforms.</li>
    <li><strong>Security Standards:</strong> Protection against unauthorized access, cyber threats, and data breaches as per ISO 27001, OWASP security guidelines, and CERT-In advisories.</li>
    <li><strong>Regular Audit & Compliance Checks:</strong> The CGHS website undergoes STQC website quality certification and cybersecurity audits.</li>
    <li><strong>Multilingual Support:</strong> Ensuring accessibility to beneficiaries in multiple Indian languages.</li>
</ul>
</section>

<section>
<h2>5. Consent & Legal Basis for Data Processing</h2>
<p>By consenting to the use of the CGHS website for card application and login-based CGHS beneficiary services, you consent to the collection and processing of your data for:</p>
<ul>
    <li>Verification & Authentication of CGHS beneficiaries.</li>
    <li>Processing financial transactions & nominee details.</li>
    <li>Security, fraud prevention & cybersecurity measures.</li>
    <li>Service-related updates.</li>
</ul>
</section>

<section>
<h2>6. Data Sharing & Third-Party Disclosure</h2>
<p>CGHS does not sell, rent, or trade your personal data. However, we may disclose data under the following circumstances:</p>
<ul>
    <li><strong>Legal & RTI Requests:</strong> Personal data is exempt from disclosure under Section 8(1)(e) and Section 8(1)(j) of the RTI Act. If required by law, CGHS will redact confidential details under Section 10 before sharing.</li>
    <li><strong>Government Authorities & Audits:</strong> Data may be shared for policy implementation, audits, and compliance.</li>
    <li><strong>Third-Party Service Providers:</strong> External vendors handling data storage, IT services, and payment processing must comply with CGHS data protection agreements.</li>
</ul>
</section>

<section>
<h2>7. Data Retention & Security Measures</h2>
<p>CGHS follows strict data retention & security protocols:</p>
<ul>
    <li><strong>Retention Period:</strong> Personal data shall be retained only for the duration necessary for its purpose, as detailed in the department&#8217;s record retention policy, after which it is securely deleted.</li>
    <li><strong>Encryption:</strong> All stored and transmitted data is secured using AES-256 encryption.</li>
    <li><strong>Access Controls:</strong> Multi-factor authentication (MFA) restricts access to authorized personnel only.</li>
    <li><strong>Regular Security Audits:</strong> Periodic evaluations to prevent cyber threats & vulnerabilities.</li>
</ul>
</section>

<section>
<h2>8. User Rights</h2>
<p>CGHS beneficiaries have the right to:</p>
<ul>
    <li>Access their stored personal data.</li>
    <li>Request correction or updates to inaccurate data.</li>
    <li>Request data in a structured, machine-readable format.</li>
    <li>Request deletion of personal data, subject to legal obligations.</li>
    <li>Opt-out of non-essential notifications & analytics tracking.</li>
    <li>File complaints with CGHS.</li>
</ul>
</section>

<section>
<h2>9. Contact Information</h2>
<p>For privacy concerns, contact toll free CGHS Helpline Number at <a href="tel:1800-208-8900">1800-208-8900</a> or write to us at <a href="mailto:cghs-helpdesk@lsmgr.nic.in">cghs-helpdesk@lsmgr.nic.in</a>.</p>
</section>
</div>
            
            `;
        } else if (contentId === 'content2') {
            content = `
            	<header>
                <h1>Disclaimer for the CGHS Website</h1>
                <p><strong>Effective Date:</strong> 11 March 2025 | <strong>Last Updated:</strong> 11 March 2025</p>
                 </header>
            <div class="content">
            <section>
                <h2>1. General Disclaimer</h2>
                <p>The Central Government Health Scheme (CGHS) website is provided as a public service to disseminate information regarding CGHS services, policies, and beneficiary-related matters. While every effort is made to ensure the accuracy and reliability of the content, the CGHS does not guarantee the completeness, correctness, or timeliness of the information provided on this website.</p>
                <p>Users are advised to verify any official announcements, policies, or updates through authorized government sources before making decisions based on the content of this website.</p>
            </section>

            <section>
                <h2>2. Accuracy and Reliability of Information</h2>
                <p>CGHS endeavors to keep the information on this website accurate and up to date; however, errors may occur due to technical, administrative, or regulatory updates. CGHS does not assume any legal liability or responsibility for any errors, omissions, or discrepancies in the website content.</p>
                <p>Information on this website:</p>
                <ul>
                    <li>Is subject to change without prior notice.</li>
                    <li>Should not be considered legally binding unless specifically stated in government circulars or notifications.</li>
                    <li>May be interpreted differently based on specific individual or organizational circumstances.</li>
                </ul>
            </section>

            <section>
                <h2>3. External Links and Third-Party Content</h2>
                <p>This website may provide links to external websites operated by other government agencies, organizations, or third parties for informational purposes. The inclusion of such links does not imply:</p>
                <ul>
                    <li>Endorsement of the linked site or its content.</li>
                    <li>Responsibility for the accuracy or security of third-party sites.</li>
                </ul>
                <p>CGHS does not guarantee the accessibility, availability, or reliability of external links and is not responsible for any data security, privacy concerns, or damages resulting from the use of third-party websites. Users are encouraged to review the privacy policies and terms of service of external websites before accessing or sharing personal information.</p>
            </section>

            <section>
                <h2>4. Security and Technical Issues Disclaimer</h2>
                <p>CGHS implements industry-standard security measures to safeguard user data and ensure website functionality. However, CGHS does not guarantee:</p>
                <ul>
                    <li>That the website will always operate without disruption, delays, or security vulnerabilities.</li>
                    <li>That the website is free from viruses, malware, or cyber threats.</li>
                    <li>That unauthorized third parties will not gain unauthorized access to user information despite security measures in place.</li>
                </ul>
                <p>Users are responsible for ensuring their own cybersecurity measures, such as using updated antivirus software, secure connections, and verifying website authenticity before entering sensitive data.</p>
            </section>

            <section>
                <h2>5. No Professional or Legal Advice</h2>
                <p>The information provided on this website is for general informational purposes only and does not constitute:</p>
                <ul>
                    <li>Medical advice or guidance on health treatments.</li>
                    <li>Legal consultation for disputes or government policies.</li>
                    <li>Financial advice on payments, benefits, or transactions.</li>
                </ul>
                <p>Beneficiaries and users are encouraged to consult licensed professionals, government officials, or authorized representatives for personalized assistance.</p>
            </section>

            <section>
                <h2>6. Limitation of Liability</h2>
                <p>Under no circumstances shall CGHS, the Ministry of Health & Family Welfare, its employees, or affiliated government agencies be liable for:</p>
                <ul>
                    <li>Direct, indirect, incidental, or consequential damages resulting from website use.</li>
                    <li>Loss of data, financial loss, or service interruptions due to website downtime.</li>
                    <li>User decisions or actions based on information obtained from this website.</li>
                </ul>
                <p>Users accessing this website do so at their own risk and acknowledge that CGHS does not guarantee uninterrupted service, absolute security, or the absence of technical errors.</p>
            </section>

            <section>
                <h2>7. Changes to the Disclaimer</h2>
                <p>CGHS reserves the right to modify, update, or remove any part of this disclaimer without prior notice. Users are encouraged to review this disclaimer periodically to remain informed of any changes.</p>
            </section>

            <section>
                <h2>8. Contact Information</h2>
                <p>For queries regarding this disclaimer, users may contact:</p>
                <p>Email: <a href="mailto:cghs-helpdesk@lsmgr.nic.in">cghs-helpdesk@lsmgr.nic.in</a></p>
                <p>Helpline: <a href="tel:1800-208-8900">1800-208-8900</a></p>
                <p>This disclaimer is issued in accordance with government policies, cybersecurity regulations, and the Guidelines for Indian Government Websites (GIGW 3.0).</p>
            </section>
                </div>    

                
            `;
        }

        else if (contentId === 'content3') {
            content = `
            	<header>
                <h1>Hyperlinking Policy</h1>
                      </header>
            	<div class="content">
            	<section>
            	<h2>1. Introduction</h2>
                <p>This Hyperlinking Policy outlines the guidelines for linking to and from the Central Government Health Scheme (CGHS) website (<a href="https://www.cghs.mohfw.gov.in" target="_blank">www.cghs.mohfw.gov.in</a>).</p>
                </section>
             	<section>
                <h2>2. Linking to the CGHS Website</h2>
                <ul>
                    <li>The link must not misrepresent the CGHS website or create an impression of endorsement or affiliation where none exists.</li>
                    <li>Links should be direct to the CGHS homepage or specific service pages, without altering the original content.</li>
                    <li>No website shall frame or replicate CGHS content in a way that could mislead users.</li>
                    <li>Websites that link to CGHS must not contain defamatory, misleading, or unlawful content.</li>
                    <li>Any entity wishing to use CGHS logos, branding, or official symbols must obtain prior written permission from CGHS.</li>
                </ul>
                </section>
             	<section>
                <h2>3. Linking from the CGHS Website</h2>
                <p>The CGHS website may include links to external websites for user convenience. These may include:</p>
                <ul>
                    <li>Government websites, including ministries, health departments, and public sector organizations.</li>
                    <li>Recognized healthcare institutions and regulatory bodies.</li>
                    <li>Other relevant resources that align with CGHS s objectives.</li>
                </ul>
                <p>However:</p>
                <ul>
                    <li>CGHS does not endorse or guarantee the accuracy, reliability, or security of third-party websites.</li>
                    <li>External links are provided solely for informational purposes.</li>
                    <li>CGHS is not responsible for third-party website policies, privacy measures, or content changes.</li>
                </ul>
                </section>
             	<section>
                <h2>4. Prohibited Practices</h2>
                <ul>
                    <li>Deep linking, embedding, or modifying CGHS content in a way that misleads users.</li>
                    <li>Using CGHS hyperlinks on websites that host illegal, obscene, or defamatory content.</li>
                    <li>Implying official endorsement or affiliation without written approval.</li>
                    <li>Linking to the CGHS website for commercial purposes without express permission.</li>
                </ul>
                </section>
             	<section>
                <h2>5. Request for Linking Permission</h2>
                <p>Organizations or individuals who wish to:</p>
                <ul>
                    <li>Link to CGHS using official branding, logos, or graphics.</li>
                    <li>Embed specific CGHS web pages in portals or applications.</li>
                    <li>Obtain approval for link placement on CGHS s digital platforms.</li>
                </ul>
                <p>Must submit a formal request to:</p>
                <p><strong>Email:</strong> <a href="mailto:cghs-helpdesk@lsmgr.nic.in">cghs-helpdesk@lsmgr.nic.in</a></p>
                <p><strong>Helpline:</strong> 1800-208-8900</p>
                <p><strong>Address:</strong> &nbsp; MS Flats Rd, Sector 13 R K Puram, Sector 13, Rama Krishna Puram, New Delhi, Delhi 110022</p>
                </section>
             	<section>
                <h2>6. Disclaimer and Liability</h2>
                <ul>
                    <li>CGHS reserves the right to withdraw linking permissions at any time.</li>
                    <li>CGHS does not assume responsibility for any consequences resulting from accessing external links.</li>
                    <li>CGHS will not be liable for damages resulting from the use or inability to use hyperlinks provided on its website.</li>
                </ul>
                </section>
             	<section>
                <h2>7. Policy Updates</h2>
                <p>This Hyperlinking Policy is subject to periodic review. Users are encouraged to review this page for the latest updates.</p>
                </section>
             	<section>
                <h2>Compliance Statement</h2>
                <p>This Hyperlinking Policy ensures that CGHS hyperlinks are used responsibly and securely. CGHS remains committed to maintaining clear, lawful, and secure digital interactions across platforms.</p>
                </section></div>
                `;
        }

        else if (contentId === 'content4') {
            content = `
            	<header><h1>Copyright Policy for CGHS Website</h1>
                <p><strong>Effective Date:</strong> 11 March 2025 | <strong>Last Updated:</strong> 11 March 2025</p></header>
                <div class="content">
                <section>
                <h2>1. Ownership of Content</h2>
                <p>All content, including but not limited to text, images, graphics, logos, documents, videos, software, and digital materials available on the Central Government Health Scheme (CGHS) website (<a href="https://www.cghs.mohfw.gov.in" target="_blank">www.cghs.mohfw.gov.in</a>) is the intellectual property of the Government of India and CGHS, unless otherwise stated. This content is protected under the Copyright Act, 1957 (India), international copyright treaties, and applicable intellectual property laws.</p>
                </section>
                <section>
                <h2>2. Permitted Use</h2>
                <p>Users may:</p>
                <ul>
                    <li>Access and use the content for personal, informational, and non-commercial purposes.</li>
                    <li>Download and print materials such as government circulars, policies, and beneficiary guidelines, provided they are used without modification and with appropriate attribution to CGHS.</li>
                    <li>Share official government notifications from the website for educational or administrative purposes, as long as they are not altered or misrepresented.</li>
                </ul>
                </section>
                <section>
                <h2>3. Prohibited Use</h2>
                <p>Users are strictly prohibited from:</p>
                <ul>
                    <li>Modifying or creating derivative works based on the websiteÃ¢â¬â¢s content without prior written permission from CGHS.</li>
                    <li>Using CGHS logos, emblems, trademarks, or any other branding elements without official authorization.</li>
                    <li>Commercializing any website content by selling, licensing, or incorporating it into third-party products or services.</li>
                    <li>Embedding CGHS content in external websites in a way that misrepresents the original source.</li>
                </ul>
                </section>
                <section>
                <h2>4. Copyright Infringement and Reporting Mechanism</h2>
                <p>CGHS respects the intellectual property rights of others and expects users to do the same. If you believe that any content on the CGHS website infringes your copyright, you may report the violation by providing the following details:</p>
                <ul>
                    <li>A description of the copyrighted work allegedly being infringed.</li>
                    <li>The URL or location of the infringing content on the CGHS website.</li>
                    <li>Your contact details (name, email, phone number).</li>
                    <li>A declaration of good faith that you have the authority to report the claim.</li>
                </ul>
                <p><strong>Contact for Copyright Concerns:</strong></p>
                <p>Email: <a href="mailto:cghs-helpdesk@lsmgr.nic.in">cghs-helpdesk@lsmgr.nic.in</a></p>
                <p>Helpline: 1800-208-8900</p>
                </section>
                <section>
                <h2>5. Use of Third-Party Content</h2>
                <p>The CGHS website may contain content, references, or links to external resources owned by third parties, including government reports, external research papers, and collaborative materials. The copyright of such content remains with the respective owners, and:</p>
                <ul>
                    <li>CGHS does not claim ownership over third-party content.</li>
                    <li>Any third-party content used on the website is either under a valid license, permitted by law, or with appropriate attribution.</li>
                    <li>Users must refer to the respective third-party copyright policies before using such content.</li>
                </ul>
                </section>
                <section>
                <h2>6. Disclaimer of Liability</h2>
                <p>While all efforts have been made to ensure the accuracy and reliability of content on the CGHS website, the Government of India and CGHS are not responsible for any unauthorized reproduction, distribution, or misuse of website materials by third parties. Users accessing or using the website&#8217;s content do so at their own discretion and risk.</p>
                </section>
                <section>
                <h2>7. Enforcement and Legal Actions</h2>
                <p>Any unauthorized use or violation of this Copyright Policy may result in:</p>
                <ul>
                    <li>Legal action under applicable copyright laws, including the Copyright Act, 1957.</li>
                    <li>Blocking of access to CGHS services for users found in violation.</li>
                    <li>Issuance of takedown notices to infringing parties under the Information Technology Act, 2000.</li>
                </ul>
                </section>
                <section>
                <h2>8. Policy Updates</h2>
                <p>This Copyright Policy is subject to periodic review and updates. Users are encouraged to review this policy regularly to stay informed about their rights and obligations.</p>
                </section>
                <section>
                <h2>Compliance Statement</h2>
                <p>This Copyright Policy ensures that the intellectual property of CGHS and the Government of India is protected and used in accordance with applicable copyright laws and digital governance standards. Users are expected to respect these guidelines while accessing and utilizing the CGHS website and its content.</p>
</section></div>

                `;}
        else if (contentId === 'content5') {
            content = `
            	<header><h1>Content Review Policy</h1></header>
<div class="content">
<scetion>
                <h2>1. Purpose</h2>
                <p>The Content Review Policy ensures that all content on the CGHS website remains accurate, relevant, and compliant with the Guidelines for Indian Government Websites (GIGW) 3.0.</p>
</section>
<section>
                <h2>2. Review Frequency</h2>
                <ul>
                    <li><strong>Quarterly Reviews:</strong> All general website content is reviewed every three months.</li>
                    <li><strong>Bi-Annual Reviews:</strong> Critical healthcare-related information, eligibility criteria, and beneficiary services undergo a detailed review every six months.</li>
                    <li><strong>Annual Compliance Reviews:</strong> A full content audit is conducted once a year to ensure adherence to GIGW 3.0, cybersecurity, and accessibility standards.</li>
                </ul>
                </section>
                <section>
                <h2>3. Review Process</h2>
                <ul>
                    <li>The <strong>Content Management Team</strong> is responsible for identifying content requiring updates or removal.</li>
                    <li>The <strong>Technical & Cybersecurity Team</strong> ensures all security protocols are maintained in line with CERT-In recommendations.</li>
                    <li>Any content update request must be submitted for approval by the <strong>Webmaster</strong> and CGHS Compliance Team.</li>
                </ul>
                </section>
                <section>
                <h2>4. Corrections & Updates</h2>
                <ul>
                    <li>Any factual inaccuracies identified during the review process will be corrected immediately.</li>
                    <li>Any new updates, policies, or guidelines mandated by the government will be added within five working days of notification.</li>
                    <li>If an urgent correction is required (such as a security concern or incorrect beneficiary information), it will be implemented within 24 hours.</li>
                </ul>
                </section>
                <section>
                <h2>Compliance Statement</h2>
                <p>CGHS ensures compliance with data protection laws, cybersecurity best practices, and GIGW 3.0 standards, keeping all published content accurate, secure, and accessible to beneficiaries.</p>
</div>

                `;}
        else if (contentId === 'content6') {
            content = `
            	<header><h1>Content Contribution, Moderation & Approval Policy</h1></header>
            	<div class="content">
            	 <section>
                <h2>1. Purpose</h2>
                <p>This policy governs how content is contributed, moderated, and approved for publication on the CGHS website, ensuring accuracy, reliability, and adherence to government communication standards.</p>
                </section>
                <section>
                <h2>2. Content Contribution Guidelines</h2>
                <ul>
                    <li>Content contributions are allowed only from authorized CGHS personnel.</li>
                    <li>Contributors must ensure that all information aligns with CGHS policies and government guidelines.</li>
                    <li>Submissions must include appropriate references and citations where necessary.</li>
                </ul>
                </section>
                <section>
                <h2>3. Moderation Process</h2>
                <ul>
                    <li>A <strong>Content Moderation Team</strong> will review all submitted content for factual accuracy, grammar, and compliance with security and accessibility standards.</li>
                    <li>Any submissions containing sensitive or restricted information will undergo additional scrutiny by the CGHS Compliance Team.</li>
                    <li>User-generated content, such as comments or inquiries, will be monitored and moderated to maintain decorum and accuracy.</li>
                </ul>
                </section>
                <section>
                <h2>4. Content Approval Workflow</h2>
                <ul>
                    <li><strong>Step 1: Submission</strong>  Authorized personnel submit content through the CGHS Content Management System.</li>
                    <li><strong>Step 2: Review</strong>  Moderation Team checks content for accuracy and compliance.</li>
                    <li><strong>Step 3: Approval</strong>  The Webmaster and Designated Officials approve the content for publication.</li>
                    <li><strong>Step 4: Publication</strong>  Approved content is published on the CGHS website.</li>
                </ul></section>
</div>

                `;}
        else if (contentId === 'content7') {
            content = `
                      
            	<header> <h1>Content Archival Policy</h1></header>
       <div class="content">
                <section>
                <h2>1. Purpose</h2>
                <p>The Content Archival Policy of the Central Government Health Scheme (CGHS) ensures that digital content on the CGHS website is periodically reviewed, archived, and managed to maintain relevance, accuracy, and compliance with legal and regulatory requirements.</p>
             	</section>
             	<section>
                <h2>2. Archival Guidelines</h2>
                <ul>
                    <li>All web content will be reviewed every year to ensure its continued relevance.</li>
                    <li>Content that is no longer applicable or outdated will be archived for a minimum of five years before deletion.</li>
                    <li>Content of historical importance, government circulars, policy updates, and beneficiary guidelines will be permanently archived for reference.</li>
                    <li>Archived content will be securely stored and accessible upon request through official CGHS channels.</li>
                </ul>
                </section>
             	<section>
                <h2>3. Responsibilities</h2>
                <ul>
                    <li>The <strong>Web Administrator</strong> is responsible for identifying outdated content for archival.</li>
                    <li>The <strong>CGHS Content Management Team</strong> will oversee the periodic content review process.</li>
                    <li>Archived content retrieval requests must be approved by the <strong>CGHS Content Oversight Committee</strong>.</li>
                </ul></section>
</div>
                `;}


        else if (contentId === 'content8') {
            content = `
            	<header> <h1>CGHS Password and Authentication Policy</h1></header>
<div class="content">
            	<section>
            <h2>1. Purpose</h2>
                <p>This policy establishes the requirements for password security and authentication mechanisms within the Central Government Health Scheme (CGHS). It aims to ensure the protection of user accounts, prevent unauthorized access, and uphold data integrity and confidentiality.</p>
                </section>
                <section>
                <h2>2. Authentication Mechanism</h2>
                <p>CGHS employs <strong>Single Sign-On (SSO)</strong> authentication through <strong>MeriPehchaan</strong>, the national digital identity platform, to ensure secure and seamless access to CGHS services.</p>

                <h3 class="mt-2">Primary Authentication Methods:</h3>
                <ul>
                    <li><strong>MeriPehchaan SSO Login:</strong> Recommended for beneficiaries and employees for centralized access control.</li>
                    <li><strong>Username & Password-Based Authentication:</strong> Used for non-SSO CGHS users, including internal personnel.</li>
                    <li><strong>Multi-Factor Authentication (MFA):</strong> Mandatory for administrators and privileged accounts to enhance security.</li>
                </ul>
                </section>
                <section>
                <h2>3. Password Policy for Non-SSO Users</h2>
                
                <h3 class="mt-2">3.1 Password Complexity Requirements</h3>
                <ul>
                    <li>Minimum password length: 12 characters (maximum 20 characters).</li>
                    <li>Must contain at least one uppercase letter (A-Z).</li>
                    <li>Must contain at least one lowercase letter (a-z).</li>
                    <li>Must include at least one numeric digit (0-9).</li>
                    <li>Must have at least one special character (@ $ # ? _ % & !).</li>
                    <li>Must not contain the user&#8217;s name, ID, or commonly used dictionary words.</li>
                </ul>

                <h3>3.2 Password Expiration and Rotation</h3>
                <ul>
                    <li>Passwords must be changed every 90 days.</li>
                    <li>Users will receive password expiration reminders 10 days prior to expiration.</li>
                    <li>New passwords must not match any of the last five previously used passwords.</li>
                </ul>

                <h3>3.3 Account Lockout and Recovery</h3>
                <ul>
                    <li>Accounts will be locked after five consecutive failed login attempts for CGHS staff.</li>
                    <li>Beneficiary accounts will be locked after ten failed login attempts.</li>
                    <li>Locked accounts can only be reset through registered email/SMS OTP verification.</li>
                </ul>
                </section>
                <section>
                <h2>4. Multi-Factor Authentication (MFA) Policy</h2>
                <ul>
                    <li>MFA is mandatory for all CGHS administrators and employees.</li>
                    <li>MFA is enabled for beneficiaries through OTP-based authentication via MeriPehchaan SSO.</li>
                    <li>Additional authentication factors, such as biometric verification, may be implemented in future security enhancements.</li>
                </ul>
                </section>
                <section>
                <h2>5. Single Sign-On (SSO) via MeriPehchaan</h2>
                <p>CGHS encourages users to authenticate via <strong>MeriPehchaan</strong>, which provides:</p>
                <ul>
                    <li>Secure identity verification using Aadhaar, DigiLocker, or mobile OTP authentication.</li>
                    <li>Centralized access control, reducing password fatigue and the need for multiple logins.</li>
                    <li>Enhanced security through passwordless authentication.</li>
                    <li>Direct integration with CGHS e-Services to ensure seamless user experience.</li>
                </ul>
                </section>
                <section>
                <h2>6. Password Storage and Confidentiality</h2>
                <ul>
                    <li>Passwords must never be shared with others, including IT personnel.</li>
                    <li>Passwords must be stored securely, using encryption and industry-standard hashing techniques.</li>
                    <li>Administrators must enforce password hashing and salting mechanisms to mitigate security risks.</li>
                </ul>
                </section>
                <section>
                <h2>7. Password Reset and Recovery</h2>
                <ul>
                    <li>Self-service password reset is available through registered email/SMS OTP verification.</li>
                    <li>SSO users must reset their credentials via MeriPehchaan&#8217;s account recovery process.</li>
                    <li>Additional biometric or multi-factor authentication may be required for critical system access resets.</li>
                </ul>
                </section>
                <section>
                <h2>8. System Administrator Responsibilities</h2>
                <ul>
                    <li>Implement role-based access control (RBAC) to enforce least privilege principles.</li>
                    <li>Conduct regular security audits to ensure compliance with password policies.</li>
                    <li>Monitor login activities and enforce adaptive authentication for suspicious login attempts.</li>
                </ul>
                </section>
                <section>
                <h2>9. Compliance and Enforcement</h2>
                <ul>
                    <li>Failure to comply with this policy may result in account suspension or restricted access.</li>
                    <li>Periodic security awareness training will be conducted for all CGHS users.</li>
                    <li>Regular security audits will be performed to ensure continued compliance with government cybersecurity policies.</li>
                </ul></section>
</div>
                `;}
        else if (contentId === 'content9') {
            content = `
            	<header><h1>Accessibility Statement for CGHS Website</h1>
                <p><strong>Effective Date:</strong> 11 March 2025 | <strong>Last Updated:</strong> 11 March 2025</p>
              </header>
<div class="content">
<section>
                <h2>1. Commitment to Accessibility</h2>
                <p>The Central Government Health Scheme (CGHS) is dedicated to ensuring that its digital services are accessible to all users, regardless of device, technology, or ability. Our objective is to provide an inclusive and seamless user experience across various platforms, including desktop computers, laptops, and web-enabled mobile devices.</p>
                <p>Recognizing the importance of accessibility, CGHS has integrated features to accommodate users with visual, auditory, motor, and cognitive disabilities. Assistive technologies such as screen readers, screen magnifiers, and keyboard navigation tools are supported to enhance accessibility.</p>
                </section>
                <section>
                <h2>2. Compliance with Accessibility Standards</h2>
                <p>The CGHS website has been developed in adherence to <strong>Guidelines for Indian Government Websites (GIGW) 3.0</strong> and follows universal design principles to ensure usability for all visitors. The website is built using <strong>XHTML 1.0 Transitional</strong> and complies with <strong>Level AAA of the Web Content Accessibility Guidelines (WCAG) 2.1</strong>, as established by the <strong>World Wide Web Consortium (W3C)</strong>.</p>

                <h3 class="mt-2">The CGHS website ensures:</h3>
                <ul>
                    <li><strong>User-Centric Design & Accessibility:</strong> Optimized for screen readers and keyboard navigation.</li>
                    <li><strong>API Integrations:</strong> Secure connectivity with India Portal, DigiLocker, Aadhaar-based identity verification, Single-Sign-On (SSO), MyGov, and other government platforms.</li>
                    <li><strong>Security & Compliance:</strong> Compliance with ISO 27001, OWASP security protocols, and CERT-In cybersecurity advisories.</li>
                    <li><strong>Multilingual Support:</strong> Availability in multiple Indian languages to cater to diverse users.</li>
                    <li><strong>Regular Audits & Compliance Checks:</strong> Subject to STQC certification and periodic accessibility assessments.</li>
                </ul>
                </section>
                <section>
                <h2>3. Scope of Accessibility</h2>
                <p>This accessibility statement applies to all publicly available sections of the CGHS website, including:</p>
                <ul>
                    <li>Healthcare service information</li>
                    <li>Beneficiary login</li>
                    <li>Online payment and contribution portals</li>
                    <li>Government notifications and circulars</li>
                    <li>Feedback mechanisms and contact support</li>
                </ul>
                <p>While every effort has been made to enhance accessibility, some Portable Document Format (PDF) files may not yet be fully accessible. Work is ongoing to improve their accessibility.</p>
                </section>
                <section>
                <h2>4. Accessibility Features</h2>
                <p>To support users with disabilities, the CGHS website incorporates the following accessibility features:</p>
                <ul>
                    <li><strong>Keyboard Navigation:</strong> Enables full website navigation using only a keyboard.</li>
                    <li><strong>Screen Reader Compatibility:</strong> Fully functional with NVDA, JAWS, and TalkBack.</li>
                    <li><strong>Alternative Text Descriptions:</strong> Ensures all significant images and non-text content are accompanied by appropriate descriptions.</li>
                    <li><strong>High Contrast Mode:</strong> Enhances readability for visually impaired users.</li>
                    <li><strong>Adjustable Text Size:</strong> Allows users to modify font sizes for better visibility.</li>
                    <li><strong>Skip to Main Content Link:</strong> Facilitates direct navigation to primary content, bypassing repetitive elements.</li>
                    <li><strong>Accessible Forms & Captions:</strong> Ensures proper structuring of online forms and captions for multimedia content.</li>
                </ul>
                </section>
                <section>
                <h2>5. External Websites & Third-Party Content</h2>
                <p>Certain sections of this website contain links to external websites, which are maintained by their respective government departments. CGHS is not responsible for the accessibility compliance of external websites, as their accessibility is managed by the respective entities.</p>
                </section>
                <section>
                <h2>6. Reporting Accessibility Issues</h2>
                <p>We are committed to maintaining an accessible digital platform. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:</p>
                <ul>
                    <li><strong>Email:</strong> <a href="mailto:cghs-helpdesk@lsmgr.nic.in">cghs-helpdesk@lsmgr.nic.in</a></li>
                    <li><strong>Helpline:</strong> 1800-208-8900</li>
                    <li><strong>Feedback Form:</strong> <a href="[Insert Feedback Form URL]">[Insert Link to Feedback Form]</a></li>
                </ul>
                <p>We aim to acknowledge all accessibility-related inquiries within five working days and provide an alternative means of accessing the requested content if necessary.</p>
                </section>
                <section>
                <h2>7. Future Accessibility Enhancements</h2>
                <p>CGHS is actively enhancing its accessibility framework through:</p>
                <ul>
                    <li>Biennial accessibility audits to identify and rectify issues.</li>
                    <li>Implementation of AI-powered accessibility solutions.</li>
                    <li>Expansion of voice-assisted and screen reader-compatible functionalities.</li>
                    <li>Optimization of mobile and tablet accessibility features.</li>
                </ul>
                <p>We encourage users to share feedback to help us improve the accessibility of CGHS services.</p>
                </section>
                <section>
                <h2>Compliance Statement</h2>
                <p>CGHS remains committed to fostering universal digital access and ensuring that all individuals, regardless of their abilities, can interact with our online services efficiently. The CGHS website follows globally recognized web accessibility, usability, and inclusive design principles to uphold equal access to critical healthcare information and services.</p>
</section>
                </div>
                
                `;}

        else if (contentId === 'content10') {
            content = `
            	<div class="content" style="background: #f9f9f9; border: 1px solid #ddd; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); font-family: Arial, sans-serif;">
            	  <h3 style="color: #38843a; margin-bottom: 16px;">Facilities available under CGHS</h3>
            	  <ul style="padding-left: 20px; margin: 0; color: #333; line-height: 1.7;">
            	    <li style="margin-bottom: 10px;">OPD Treatment at WCs including issue of medicines.</li>
            	    <li style="margin-bottom: 10px;">Specialist Consultation at Polyclinic/Govt. Hospitals and at CGHS empanelled hospitals after referral by CGHS.</li>
            	    <li style="margin-bottom: 10px;">OPD/ Indoor treatment at Government and empanelled Hospitals.</li>
            	    <li style="margin-bottom: 10px;">Investigations at Government and empanelled Diagnostic centers.</li>
            	    <li style="margin-bottom: 10px;">Cashless facility available for treatment in empanelled hospitals and diagnostic centers for <span style="color: #ed1848;">Pensioners</span> and other identified beneficiaries.</li>
            	    <li style="margin-bottom: 10px;">Reimbursement of expenses for treatment availed in Govt. /Private Hospitals under emergency and specific treatment advised by Govt. Specialist or Specialist of Pvt. HCOs duly endorsed by CMO/MO of WCs.</li>
            	    <li style="margin-bottom: 10px;">Reimbursement of expenses incurred for purchase of hearing aids, artificial limbs, appliances etc., after obtaining permission.</li>
            	    <li style="margin-bottom: 10px;">Family Welfare, Maternity and Child Health Services.</li>
            	    <li style="margin-bottom: 10px;">Medical consultation. Dispensing of medicines in <span style="color: #38843a;">Ayurveda, Homeopathy, Unani and Siddha</span> system of medicines (AYUSH).</li>
            	  </ul>
            	</div> 

                
            `;
        }
        else if (contentId === 'content11') {
            content = `
            	<div class="content" style="background: #f9f9f9; border: 1px solid #ddd; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); font-family: Arial, sans-serif;">
            	  <h3 style="color: #38843a; margin-bottom: 16px;">CGHS Covered Cities</h3>
            	  <ol style="padding-left: 20px; margin: 0; color: #333; line-height: 1.7;">
            	    <li>Agra</li>
            	    <li>Agartala</li>
            	    <li>Ahmedabad</li>
            	    <li>Aizwal</li>
            	    <li>Ajmer</li>
            	    <li>Aligarh</li>
            	    <li>Allahabad (Prayagraj)</li>
            	    <li>Ambala</li>
            	    <li>Amritsar</li>
            	    <li>Baghpat</li>
            	    <li>Bengaluru</li>
            	    <li>Bareilly</li>
            	    <li>Behrampur</li>
            	    <li>Bhopal</li>
            	    <li>Bhubaneshwar</li>
            	    <li>Chandrapur</li>
            	    <li>Chandigarh</li>
            	    <li>Chhatrapati Sambhaji Nagar (Aurangabad)</li>
            	    <li>Chennai</li>
            	    <li>Chhapra</li>
            	    <li>Coimbatore</li>
            	    <li>Cuttack</li>
            	    <li>Darbhanga</li>
            	    <li>Dhanbad</li>
            	    <li>Dehradun</li>
            	    <li>Delhi & NCR: Delhi, Faridabad, Ghaziabad, Greater Noida, Noida, Gurgaon, Indirapuram, Sahibabad</li>
            	    <li>Dibrugarh</li>
            	    <li>Gandhinagar</li>
            	    <li>Gangtok</li>
            	    <li>Gaya</li>
            	    <li>Gorakhpur</li>
            	    <li>Guwahati</li>
            	    <li>Guntur</li>
            	    <li>Gwalior</li>
            	    <li>Hyderabad</li>
            	    <li>Imphal</li>
            	    <li>Indore</li>
            	    <li>Jabalpur</li>
            	    <li>Jaipur</li>
            	    <li>Jalandhar</li>
            	    <li>Jammu</li>
            	    <li>Jodhpur</li>
            	    <li>Kannur</li>
            	    <li>Kanpur</li>
            	    <li>Kohima</li>
            	    <li>Kolkata (including Ishapore)</li>
            	    <li>Kochi</li>
            	    <li>Kota</li>
            	    <li>Kozhikode</li>
            	    <li>Lucknow</li>
            	    <li>Meerut</li>
            	    <li>Moradabad</li>
            	    <li>Mumbai</li>
            	    <li>Muzaffarpur</li>
            	    <li>Mysuru</li>
            	    <li>Nagpur</li>
            	    <li>Nashik</li>
            	    <li>Nellore</li>
            	    <li>Panaji</li>
            	    <li>Panchkula</li>
            	    <li>Patna</li>
            	    <li>Puducherry</li>
            	    <li>Pune</li>
            	    <li>Raipur</li>
            	    <li>Ranchi</li>
            	    <li>Rajahmundry</li>
            	    <li>Saharanpur</li>
            	    <li>Shillong</li>
            	    <li>Shimla</li>
            	    <li>Silchar</li>
            	    <li>Siliguri (including Jalpaiguri)</li>
            	    <li>Sonipat</li>
            	    <li>Srinagar</li>
            	    <li>Thiruvananthapuram</li>
            	    <li>Varanasi (Benaras)</li>
            	    <li>Tiruchirapalli (Trichy)</li>
            	    <li>Tirunelveli</li>
            	    <li>Vadodara</li>
            	    <li>Vijayawada</li>
            	    <li>Vishakhapatnam</li>
            	  </ol>
            	</div>
            `;
        }
        // Set the content of the popup
      
    }

    // Function to close the popup
   
    function applyLanguage(lang) {
  	  document.querySelectorAll('[data-lang-key]').forEach(el => {
  	    const key = el.getAttribute('data-lang-key');
  	    const text = languageStrings[lang][key];

  	    if (el.tagName === 'INPUT' && 'placeholder' in el) {
  	      el.placeholder = text;
  	    } else {
  	      el.textContent = text;
  	    }
  	  });
  	}
    
    
    
    function updateFeedbackModalLanguage(language) {
	    const feedbackModal = document.getElementById('chatbotFeedbackModal');
	    if (feedbackModal) {
	        console.log("Updating feedback modal language to:", language);
	        
	        if (language === 'hi') {
	            // Hindi translations for feedback modal
	            const modalLabel = document.getElementById('chatbotFeedbackModalLabel');
	            if (modalLabel) modalLabel.textContent = 'प्रतिक्रिया';
	            
	            const labels = document.querySelectorAll('#chatbotFeedbackModal .form-label strong');
	            if (labels.length >= 5) {
	                labels[0].textContent = 'आपने अपना प्रश्न कैसे पूछा?';
	                labels[1].textContent = 'क्या हमने आपके प्रश्नों को सही ढंग से समझा?';
	                labels[2].textContent = 'क्या आपको अपने प्रश्न का उत्तर सही ढंग से मिला?';
	                labels[3].textContent = 'आप सिस्टम को कैसे रेट करेंगे?';
	                labels[4].textContent = 'कोई अतिरिक्त टिप्पणी या प्रतिक्रिया';
	            }
	            
	            // Update radio button labels
	            const bySpeakingLabel = document.querySelector('#chatbotFeedbackModal label[for="bySpeaking"]');
	            const byTypingLabel = document.querySelector('#chatbotFeedbackModal label[for="byTyping"]');
	            const understandingYesLabel = document.querySelector('#chatbotFeedbackModal label[for="understandingYes"]');
	            const understandingNoLabel = document.querySelector('#chatbotFeedbackModal label[for="understandingNo"]');
	            const answerYesLabel = document.querySelector('#chatbotFeedbackModal label[for="answerYes"]');
	            const answerNoLabel = document.querySelector('#chatbotFeedbackModal label[for="answerNo"]');
	            
	            if (bySpeakingLabel) bySpeakingLabel.textContent = 'बोलकर';
	            if (byTypingLabel) byTypingLabel.textContent = 'टाइप करके';
	            if (understandingYesLabel) understandingYesLabel.textContent = 'हाँ';
	            if (understandingNoLabel) understandingNoLabel.textContent = 'नहीं';
	            if (answerYesLabel) answerYesLabel.textContent = 'हाँ';
	            if (answerNoLabel) answerNoLabel.textContent = 'नहीं';
	            
	            // Update textarea placeholder
	            const additionalFeedback = document.querySelector('#chatbotFeedbackModal #additionalFeedback');
	            if (additionalFeedback) additionalFeedback.placeholder = 'अपनी प्रतिक्रिया यहाँ टाइप करें...';
	            
	            // Update button texts
	            const submitBtn = document.querySelector('#chatbotFeedbackModal .btn-primary');
	            const cancelBtn = document.querySelector('#chatbotFeedbackModal .btn-danger');
	            if (submitBtn) submitBtn.textContent = 'जमा करें';
	            if (cancelBtn) cancelBtn.textContent = 'रद्द करें';
	            
	        } else {
	            // English (default) translations
	            const modalLabel = document.getElementById('chatbotFeedbackModalLabel');
	            if (modalLabel) modalLabel.textContent = 'Feedback';
	            
	            const labels = document.querySelectorAll('#chatbotFeedbackModal .form-label strong');
	            if (labels.length >= 5) {
	                labels[0].textContent = 'How did you ask your query?';
	                labels[1].textContent = 'Did we understand your queries accurately?';
	                labels[2].textContent = 'Could you get answer of query correctly?';
	                labels[3].textContent = 'How will you rate the system?';
	                labels[4].textContent = 'Any additional comment or feedback';
	            }
	            
	            // Update radio button labels
	            const bySpeakingLabel = document.querySelector('#chatbotFeedbackModal label[for="bySpeaking"]');
	            const byTypingLabel = document.querySelector('#chatbotFeedbackModal label[for="byTyping"]');
	            const understandingYesLabel = document.querySelector('#chatbotFeedbackModal label[for="understandingYes"]');
	            const understandingNoLabel = document.querySelector('#chatbotFeedbackModal label[for="understandingNo"]');
	            const answerYesLabel = document.querySelector('#chatbotFeedbackModal label[for="answerYes"]');
	            const answerNoLabel = document.querySelector('#chatbotFeedbackModal label[for="answerNo"]');
	            
	            if (bySpeakingLabel) bySpeakingLabel.textContent = 'By speaking';
	            if (byTypingLabel) byTypingLabel.textContent = 'By typing';
	            if (understandingYesLabel) understandingYesLabel.textContent = 'Yes';
	            if (understandingNoLabel) understandingNoLabel.textContent = 'No';
	            if (answerYesLabel) answerYesLabel.textContent = 'Yes';
	            if (answerNoLabel) answerNoLabel.textContent = 'No';
	            
	            // Update textarea placeholder
	            const additionalFeedback = document.querySelector('#chatbotFeedbackModal #additionalFeedback');
	            if (additionalFeedback) additionalFeedback.placeholder = 'Type your feedback here...';
	            
	            // Update button texts
	            const submitBtn = document.querySelector('#chatbotFeedbackModal .btn-primary');
	            const cancelBtn = document.querySelector('#chatbotFeedbackModal .btn-danger');
	            if (submitBtn) submitBtn.textContent = 'Submit';
	            if (cancelBtn) cancelBtn.textContent = 'Cancel';
	        }
	    }
	}