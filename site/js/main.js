$( document ).ready(onLoad);

operation = "";
operand = "";
save_state = "";
redirecting = false;
meta_colour = "";
DEFAULT_COLOUR = "#2F999C";
DEFAULT_SEARCH_ENGINE = "https://duckduckgo.com/?q=";
plugins = {};

function onLoad() {
  $('#cmd-primary').focus().css("color", "#ccc");

  //colours
  var colour;
  if((colour = localStorage["meta:colour"]) == null) {
    colour = DEFAULT_COLOUR;
  }
  change_accent_colour(colour);

  //search engine
  if(localStorage["searchEngine"] == null) {
    localStorage["searchEngine"] = DEFAULT_SEARCH_ENGINE;
  }
  $('#toast').css("display", "block");

  //just for detecting backspace
  $('#cmd-primary').on('keydown', function(e) {
    if( e.keyCode == 8 && redirecting) {
      redirecting = false;
      update_loading(0);
    }
  });

  //primary command box input event
  $('#cmd-primary').on("keypress", function(event) {
    if(redirecting) {
      redirecting = false;
      update_loading(0);
    }
    if(event.charCode == 13 ) {
      action($('#cmd-primary').val())
    }
    else if( 65 <= event.charCode <= 90)
    {
      char = String.fromCharCode(event.charCode);
      if($('#cmd-primary').val().length == 0) {
        if((shortcutCommand = localStorage["shortcut:" + char]) != null) {
          delayedAction(shortcutCommand);
        }
      }
    }

    //remove dragging and dropping files on whole page
    $(document).on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    $(document).on('dragover', function (e) {
      e.stopPropagation();
      e.preventDefault();
    });
    $(document).on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
  } );

  //make secondary input box longer as necessary
  $('#cmd-secondary').on("keypress", function(event) {
    if(event.charCode == 13 ) {
      if(event.altKey) {
        submit();
      }
    }
  } );

  $('#submit-btn').click(function() {
    if($("#cmd-secondary").val() == "") {
      action($("#cmd-primary").val());
    } else {
      submit();
    }
  });

  loadPlugins();
}

function action(command) {
  var firstSpaceIndex = command.indexOf(' ');
  operation = command.substring(0, firstSpaceIndex);
  operand = command.substring(firstSpaceIndex+1, command.length );
  if(firstSpaceIndex < 0) {
    operation = command;
    operand = "";
  }
  switch(operation) {
    case("!"):
      go_to_site(localStorage[operand]);
      reset();
      break;
    case("?"):
      searchEngine = localStorage["searchEngine"];
      go_to_site(searchEngine + operand);
      break;
    case("help"):
      go_to_site("help.html");
      break;
    case("bookmark"):
      open_cmd_sec();
      save_state = "bookmark";
      break;
    case("js"):
      open_cmd_sec();
      if(operand != "") {
        save_state = "js-save";
      } else {
        save_state = "js-execute";
      }
      break;
    case("note"):
      open_cmd_sec();
      break;
    case("map"):
      open_cmd_sec();
      save_state = "map";
      break;
    case("colour"):
      save("meta:colour", operand, "updated accent colour");
      change_accent_colour(operand);
      break;
    case("searchEngine"):
      save( "searchEngine", operand, "Saved new search engine");
      break;
    case("plugin"):
      save_plugin();
      break;
    default:
      if(plugins[operation] != undefined) {
        go_to_site(plugins[operation]);
        reset();
      }
      break;
  }
}

function submit() {
  var key = operand;
  var value = $("#cmd-secondary").val();
  switch(save_state) {
    case "bookmark":      value = "http://" + value;                    message = "saved bookmark"; break;
    case "js-save":       value = "javascript:" + value;                message = "saved script";   break;
    case "js-execute":    go_to_site("javascript:" + value);            message = "executed";       break;
    case "map":           key = "shortcut:" + key;                      message = "saved shortcut"; break;
  }
  if(save_state != "js-execute") {
    save(key, value, message);
  } else {
    display_toast(message);
  }
}

function open_cmd_sec( codeFont ) {
  $("#cmd-secondary").focus();
}

function reset() {
  $("#cmd-primary").val("");
  $("#cmd-secondary").fadeOut(200, function() {
    $("#cmd-secondary").val("").show();
  })
}

function delayedAction(command) {
  redirecting = true;

  update_loading(500);
  timeoutID = window.setTimeout(function() {
    if(redirecting && $("#cmd-primary").val().length == 1) {
      action(command);
    } else {
      redirecting = false;
      update_loading(0);
    }
  }, 2000);
}

function update_loading(width) {
  $("#loading").css("width", width + "px");
  if(width == 0){
    $("#loading").css("opacity", "0");
  } else {
    $("#loading").css("opacity", "1");
  }
}

function change_accent_colour(colour) {
  if( colour == "DEFAULT_COLOUR")
    colour = DEFAULT_COLOUR;
  meta_colour = colour;
  $('#loading').css("background-color", colour);
  $('#toast').css("color", colour);
}

function display_toast(message, colour) {
  var timeoutID = window.setTimeout(function() {
    toast_appear(message, colour);
  }, 500);
  timeoutID = window.setTimeout(toast_disappear, 2000);
}

function toast_appear(message, colour) {
  var toast = $('#toast');
  toast.text(message);
  toast.css("margin-top", "75px");
  toast.css("opacity", "1");
  if(arguments.length == 2) {
    toast.css("color", colour);
  }
}

function toast_disappear() {
  var toast = $('#toast');
  toast.css("margin-top", "100px");
  toast.css("opacity", "0");
  toast.css("color", meta_colour);
}

function save(key, value, message) {
  localStorage[key] = value;
  $('#cmd-primary').focus().css("color", "#ccc");
  reset();
  display_toast(message);
}

function scrollTo(id) {
  $('html, body').animate({
    scrollTop: $("#" + id).offset().top
  }, 2000);
};

function loadPlugins() {
  for(var storedItem in localStorage) {
    if(storedItem.substring(0, 7) == "plugin:") {
      plugins[storedItem.substring(7, storedItem.length)] = localStorage[storedItem];
    }
  }
}

function save_plugin() {
  open_cmd_sec();
  var dropZone = document.getElementById("cmd-secondary");
  dropZone.innerHTML = "Drop the plugin's JavaScript here.";

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  function handleFileSelect(evt) {
    var files = evt.dataTransfer.files; // FileList object.
    var f = files[0];

    var reader = new FileReader();

    reader.onload = function(e) {
      key = "plugin:" + operand;
      value = "javascript:" + reader.result;
      message = "Saved plugin.";
      save(key, value, message);
      plugins[operand] = value;
      dropZone.innerHTML = "";
    };

    reader.readAsText(f);
  };

  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
}

/****
** Built in functions
****/

function print(output, colour) {
    display_toast(output, colour);
}

function get_primary_arg() {
  return operand;
}

function go_to_site(URL) {
  window.location.href = URL;
}
