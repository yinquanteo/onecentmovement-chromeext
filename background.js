function onRequest(request, sender, sendResponse) {
  // Show the page action for the tab that the sender (content script)
  // was on.
  chrome.pageAction.show(sender.tab.id);

  sendResponse({
    token: localStorage["token"]
  });
};

// Listen for the content script to send a message to the background page.
chrome.runtime.onMessage.addListener(onRequest);
