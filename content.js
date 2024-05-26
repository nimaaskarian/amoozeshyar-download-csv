let clickedElement = null;
document.addEventListener("contextmenu", function(event){
  console.log(event.target)
  clickedElement = event.target;
  while (clickedElement.nodeName !== "TABLE") {
    clickedElement = clickedElement.parentElement
    console.log(clickedElement)
  }
}, true);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.action) {
    case 'downloadCsv':
      download_current_csv(sendResponse)
    break;
    case 'appendCsv':
      append_to_csv_data(sendResponse, message.csv_data)
    break;
    case 'appendCsvElementId':
      append_to_csv_data(sendResponse, message.csv_data, document.getElementById(message.element_id))
    break;
    case 'downloadAppendedCsv':
      download_appended_csv(sendResponse, message.csv_data)
    break;
  }
});

function append_to_csv_data(sendResponse, csv_data, element=clickedElement) {
  let tmp_data = null;
  if (csv_data) {
    tmp_data = amoozeshyar_element_to_csv(element, false)
  } else {
    tmp_data = amoozeshyar_element_to_csv(element)
  }
  sendResponse({ message: "Appended some .csv", csv_data: tmp_data, element_id: element.id});
}

function download_appended_csv(sendResponse, csv_data) {
  if (csv_data) {
    download("amoozeshyar-"+date()+".csv",csv_data, 'text/csv')
    sendResponse({ message: "Download appended .csv and cleared the data", action: "clear_data"});
  } else {
    sendResponse({ message: "No .csv data found" });
  }
}

function download_current_csv(sendResponse) {
  download("amoozeshyar-"+date()+".csv",amoozeshyar_element_to_csv(clickedElement), 'text/csv')
  sendResponse({ message: "Downloaded some .csv" });
}

function download(filename, text, type='text/plain') {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:'+type+';charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function date() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  let time = String(today.getHours())+today.getMinutes()+today.getSeconds();
  return yyyy+'-'+mm + '-' + dd + '-' +time;
}

function amoozeshyar_element_to_csv(table_parent,include_head=true) {
  console.log(table_parent)
  let table_head = table_parent.querySelector("thead");
  let head_items = [...table_head.querySelector("tr").querySelectorAll("th")];
  let slice_index = 0;
  while (head_items[slice_index].querySelector("img")) {
    slice_index+=1;
  }
  let table = table_parent.querySelector("tbody")
  let rows = (include_head 
    ? [...table_head.querySelectorAll("tr"),...table.querySelectorAll("tr")]
    : [...table.querySelectorAll("tr")]);
  let output_str = ""
  rows.forEach(row => {
    let row_str = ""
    let cells = [...row.querySelectorAll("th"),...row.querySelectorAll("td")].slice(slice_index)
    cells.forEach(cell => {
      row_str += (cell.querySelector("font")||cell).innerText + ','
    })
    output_str += row_str.slice(0,-1) + '\n'
  });
  return output_str.slice(0,-1)
}
