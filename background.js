chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "rightClickAction",
    title: "Download .csv",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === 'rightClickAction') {
    console.log(tab)
    chrome.tabs.sendMessage(tab.id, {action: "downloadCsv"}, function(response) {
      console.log(response)
    });  
  }
});
