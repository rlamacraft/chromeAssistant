index_path = document.getElementById('index-path').innerHTML;
chrome.tabs.create({ url: index_path });
window.close();
