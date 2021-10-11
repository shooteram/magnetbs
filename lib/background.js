chrome.runtime.onMessage.addListener(request => {
    chrome.action.setIcon({ path: { "16": `/images/icon16-${request.accent}.png` } });
});

(async () => {
    let tab = await chrome.tabs.create({ active: false, url: '/lib/page.html' });
    chrome.tabs.reload(tab.id, async () => {
        while (tab.status !== 'complete') tab = await chrome.tabs.get(tab.id);
        chrome.tabs.remove(tab.id);
    });
})();
