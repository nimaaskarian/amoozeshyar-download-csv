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

function amoozeshyar_element_to_csv(element=null) {
  let table_parent = element||document.getElementById("panel__3");
  let table_head = table_parent.querySelector("thead")
  let table = table_parent.querySelector("tbody")
  let rows = [...table_head.querySelectorAll("tr"),...table.querySelectorAll("tr")]
  let output_str = ""
  rows.forEach(row => {
    let row_str = ""
    let cells = [...row.querySelectorAll("th"),...row.querySelectorAll("td")].slice(3)
    cells.forEach(cell => {
      row_str += (cell.querySelector("font")||cell).innerText + ','
    })
    output_str += row_str.slice(0,-1) + '\n'
  });
  return output_str.slice(0,-1)
}
download("amoozeshyar-"+date()+".csv",amoozeshyar_element_to_csv(), 'text/csv')
