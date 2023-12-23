// Listening for a new page load
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Check if the page is loaded completely
    if (changeInfo.status === 'complete' && tab.active) {
        chrome.tabs.executeScript(tabId, {
            file: 'content.js'
        });
    }
});