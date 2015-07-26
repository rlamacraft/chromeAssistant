//index_path = document.getElementById('index-path').innerHTML;
//localStorage.clear();

if( (index_path = localStorage["index-path"]) == undefined) {
  index_path = "file:///Users/Robert/Documents/GitHub/chromeAssistant/site/index.html";
  localStorage["index-path"] = index_path;



  //index_path = document.getElementById('index-path').innerHTML;
  //localStorage["index-path"] = index_path;
  //display dropbox
  //save path to localStorage["index-path"]
}
chrome.tabs.create({ url: index_path });
window.close();

/*function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function handleFileSelect(evt) {
  evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    var f = files[0];
    console.log(f);

    var reader = new FileReader();

    reader.onload = function(e) {
      console.log(reader);
      console.log(reader.result);
    };

    reader.readAsText(f);
}*/
