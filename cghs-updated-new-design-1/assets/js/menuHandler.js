// $(document).ready(function () {
//     function createMenu(menuItems, parentElement) {
//         menuItems.forEach(item => {
//             let li = $("<li></li>");
//             let a = $("<a></a>").attr("href", item.url).text(item.title);

//             if (item.submenu && item.submenu.length > 0) {
//                 let ul = $("<ul></ul>").addClass("submenu");
//                 createMenu(item.submenu, ul);
//                 li.append(a).append(ul);
//             } else {
//                 a.attr("data-menuid", item.menuId);
//             }

//             parentElement.append(li);
//         });
//     }

//     // Build the menu
//     const menuContainer = $("#menu");
//     createMenu(menuData.menu, menuContainer);

//     // Hover to show submenu
//     $("#menu li").hover(function () {
//         $(this).children(".submenu").slideToggle();
//     });

//     // Click event to load PDFs
//     $("#menu").on("click", "a[data-menuid]", function (e) {
//         e.preventDefault();
//         let menuId = $(this).data("menuid");
//         let pdfs = findPDFsByMenuId(menuId);

//         if (pdfs.length > 0) {
//             let pdfList = $("#pdfList");
//             pdfList.empty();
//             pdfs.forEach(pdf => {
//                 let pdfItem = $("<li></li>");
//                 let pdfLink = $("<a></a>").attr("href", pdf.url).attr("target", "_blank").text(pdf.name);
//                 pdfItem.append(pdfLink);
//                 pdfList.append(pdfItem);
//             });

//             $("#pdfContainer").show();
//         } else {
//             $("#pdfContainer").hide();
//         }
//     });

//     // Find PDFs by menuId
//     function findPDFsByMenuId(menuId) {
//         for (let category of menuData.menu) {
//             if (category.submenu) {
//                 for (let sub of category.submenu) {
//                     if (sub.menuId == menuId) {
//                         return sub.pdfs || [];
//                     }
//                 }
//             }
//         }
//         return [];
//     }
// });
  