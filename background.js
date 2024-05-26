let csv_data = null;
let element_id = null;
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "downloadCsv",
    title: "Download current .csv",
    contexts: ["all"]
  });
  chrome.contextMenus.create({
    id: "appendCsv",
    title: "Append to .csv",
    contexts: ["all"]
  });
  chrome.contextMenus.create({
    id: "downloadAppendedCsv",
    title: "Download appended .csv",
    contexts: ["all"]
  });
  updateAppendedCsvVisibility();
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  console.log(tab)
  chrome.tabs.sendMessage(tab.id, {action: info.menuItemId, csv_data}, handle_response);  
});

chrome.commands.onCommand.addListener((command,tab) => {
  switch (command) {
    case 'reappend':
      chrome.tabs.sendMessage(tab.id, {action: "appendCsvElementId", csv_data, element_id}, handle_response)
    break;
    case 'downloadAppendedCsv':
      chrome.tabs.sendMessage(tab.id, {action: command, csv_data}, handle_response)
    break;
  }
});

function updateAppendedCsvVisibility() {
  chrome.contextMenus.update("downloadAppendedCsv", { visible: !!csv_data });
}

function handle_response(response) {
    if (response.csv_data) {
      if (csv_data) {
        csv_data += '\n' + response.csv_data;
      } else {
        csv_data = response.csv_data;
      }
      element_id = response.element_id
    }
    if (response.action === "clear_data") {
      csv_data = null;
    }
    updateAppendedCsvVisibility();
    console.log(response)
  }
