let csvData = null;
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
  chrome.tabs.sendMessage(tab.id, {action: info.menuItemId, csvData}, function(response) {
    if (response.csvData) {
      if (csvData) {
        csvData += '\n' + response.csvData;
      } else {
        csvData = response.csvData;
      }
    }
    if (response.action === "clear_data") {
      csvData = null;
    }
    updateAppendedCsvVisibility();
    console.log(response)
  });  
});

function updateAppendedCsvVisibility() {
  chrome.contextMenus.update("downloadAppendedCsv", { visible: !!csvData });
}
