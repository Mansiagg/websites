$(document).ready(function () {
	fetchFaqs("0");
    $('#faqSelect').on('change', function () {
        var selectedFaqId = $(this).val();
        if (selectedFaqId) {
            //localStorage.setItem("selectedFaqId", selectedFaqId);
            fetchFaqs(selectedFaqId);
        }
    });

});

var faqArray = [];
    function fetchFaqs(subMenuType) {
        var mode = "1";
        if (subMenuType == "0") {
            mode = '2';
        }

        $.ajax({
            url: "/AHIMSG5/hislogin/getCghsFaqLgnFtr?subMenuType=" + subMenuType + "&mode=" + mode,
            method: "GET",
            dataType: "json",
            success: function (data) {
                 console.log("FAQ Data:", JSON.stringify(data));
                faqArray = data.faqArray; // Store the FAQ data globally
                createAccordion(faqArray); 
            },
            error: function () {
                console.error("Error fetching FAQs");
            }
        });
    }

     // Create accordion dynamically
function createAccordion(data) {
    var accordionContainer = $('#accordionPanelsStayOpenExample');
    accordionContainer.empty(); // Clear any existing content

    if (data.length > 0) {
        data.forEach(function (faq, index) {

            // Create unique IDs for each accordion item
            var uniqueCollapseId = 'collapse' + index;
            var uniqueButtonId = 'heading' + index;

            // If there are uploaded docs, split them and generate download URL
            var docsName = faq.uploaded_docs ? faq.uploaded_docs.split("^")[0] : '';
            var folderName = faq.uploaded_docs ? faq.uploaded_docs.split("^")[1] : '';
           // var baseURL = $('#baseURL').val();
            var url = docsName && folderName
                ?  `/CGHSGrievance/FormFlowXACTION?hmode=ftpFileDownload&fileName=${encodeURIComponent(docsName)}&folderName=${encodeURIComponent(folderName)}&isGlobal=1`
                : '';
			var docsNameDisplay = docsName ? docsName.split("_")[1] : '';
            // Convert line breaks (\n) in the answer to <br>
            var answer = faq.ans
                ? faq.ans.replace(/\n/g, '<br>')
                : "No answer provided.";

            // ✅ NEW: Handle multiple input links
            var linksHtml = '';
            if (faq.inputlnk) {
                linksHtml = faq.inputlnk
                    .split(',')
                    .map(link => link.trim())
                    .filter(link => link.length > 0)
                    .map((link, i) => {
                        const finalLink = /^https?:\/\//i.test(link)
                            ? link
                            : 'https://' + link;

                        return `
                            <div>
                                <a href="${finalLink}" target="_blank" rel="noopener">
                                    ${link}
                                </a>
                            </div>
                        `;
                    })
                    .join('');
            }

            // Create the accordion item HTML dynamically
            var accordionItem = ` 
                <div class="accordion-item">
                    <h2 class="accordion-header" id="${uniqueButtonId}">
                        <button class="accordion-button" type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#${uniqueCollapseId}"
                                aria-expanded="true"
                                aria-controls="${uniqueCollapseId}">
                            ${faq.quest}
                        </button>
                    </h2>
                    <div id="${uniqueCollapseId}"
                         class="accordion-collapse collapse"
                         aria-labelledby="${uniqueButtonId}"
                         data-bs-parent="#accordionPanelsStayOpenExample">
                        <div class="accordion-body bg-light my-2 border-radius:5px">
                            ${answer}
                            <br>
                            ${url ? `<a href="${url}" target="_blank">${docsNameDisplay}</a>` : ''}
                            <br>
                            ${linksHtml}
                        </div>
                    </div>
                </div>`;

            // Append the dynamically created accordion item
            accordionContainer.append(accordionItem);
        });
    } else {
        accordionContainer.append(
            '<div class="alert alert-info" role="alert">No FAQs available.</div>'
        );
    }
}

	        $('#Search').on('input', function () {
	        var query = $(this).val().toLowerCase(); // Get the search input value
	
	        // Filter FAQ items based on the 'quest' field (case-insensitive)
	        var filteredFaqs = faqArray.filter(function (faq) {
	            return faq.quest.toLowerCase().includes(query); // Search for the query in the 'quest' field
	        });
	
	        // Recreate the accordion with the filtered data
	        createAccordion(filteredFaqs);
	    });
	    
	 
	 
	 $(document).on('change', 'input[name="sortFaq"]', function () {

    var sortType = $(this).val();
    var sortedFaqs = faqArray.slice(); // clone array

    if (sortType === 'az') {
        sortedFaqs.sort(function (a, b) {
            return (a.quest || '').localeCompare(b.quest || '');
        });
    }

    if (sortType === 'za') {
        sortedFaqs.sort(function (a, b) {
            return (b.quest || '').localeCompare(a.quest || '');
        });
    }

    if (sortType === 'oldest') {
        sortedFaqs.sort(function (a, b) {
            return new Date(a.created_date || 0) - new Date(b.created_date || 0);
        });
    }

    if (sortType === 'latest') {
        sortedFaqs.sort(function (a, b) {
            return new Date(b.created_date || 0) - new Date(a.created_date || 0);
        });
    }

    createAccordion(sortedFaqs);
});
