$( document ).ready(onLoad);

operation = "";
operand = "";
save_state = "";
redirecting = false;
meta_colour = "";
drawer_open = false;

function onLoad() {
  $('#cmd-primary').focus()
  if(localStorage["meta:colour"] == null) {
    localStorage["meta:colour"] = "#2F999C";
  }
  change_accent_colour(localStorage["meta:colour"]);
  $('#toast').css("display", "block");

  //just for detecting backspace
  $('#cmd-primary').on('keydown', function(e) {
    if( e.keyCode == 8 && redirecting) {
      redirecting = false;
      update_loading(0);
    }
  });

  //primary command box input event
  $('#cmd-primary').on("keypress", function(event)
  {
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
      if($('#cmd-primary').val().length == 0)
      {
        if((shortcutName = localStorage["shortcut:" + char]) != null)
        {
          redirect(localStorage[shortcutName]);
        }
      }
    }
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
    if(drawer_open) {
      submit();
    } else {
      action($("#cmd-primary").val());
    }
  });

  $(".back").hover(function() {
    $(".back i").css("color", meta_colour);
  },
  function() {
    $(".back i").css("color", "#ccc");
  });
}

function action(command) {
  firstSpaceIndex = command.indexOf(' ');
  operation = command.substring(0, firstSpaceIndex);
  operand = command.substring(firstSpaceIndex+1, command.length );
  if(firstSpaceIndex < 0) {
    operation = command;
    operand = "";
  }
  switch(operation) {
    case("!"):
      window.location.href = localStorage[operand];
      reset();
      break;
    case("?"):
      window.location.href = "https://duckduckgo.com/?q=" + operand;
      break;
    case("help"):
      window.location.href = "help.html";
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
  }
}

function submit() {
  key = operand;
  value = $("#cmd-secondary").val();
  switch(save_state) {
    case "bookmark":      value = "http://" + value;      message = "saved bookmark"; break;
    case "js-save":       value = "javascript:" + value;  message = "saved script";   break;
    case "js-execute":    window.location.href = "javascript:" + value; message = "executed"; break;
    case "map":           key = "shortcut:" + key;        message = "saved shortcut"; break;
  }
  if(save_state != "js-execute") {
    save(key, value, message);
  } else {
    display_toast(message);
  }
}

function open_cmd_sec() {
  cmd_sec = $("#cmd-secondary");
  cmd_sec.css('opacity','1');
  cmd_sec.css('height', '300px');
  cmd_sec.focus();
  drawer_open = true;
}

function reset() {
  console.log("RESET");
  $("#cmd-primary").val("");
  cmd_sec = $("#cmd-secondary")
  cmd_sec.val("");
  cmd_sec.css('opacity', '0');
  cmd_sec.css('height', '0px');
  drawer_open = false;
}

function redirect(destination) {
  redirecting = true;
  //width = parseInt($("#loading").css("width").substring(0, 3));

  update_loading(500);
  timeoutID = window.setTimeout(function() {
    if(redirecting && $("#cmd-primary").val().length == 1) {
      window.location.href = destination;
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
  meta_colour = colour;
  $('#loading').css("background-color", colour);
  $('#toast').css("color", colour);
}

function display_toast(message, colour) {
  timeoutID = window.setTimeout(function() {
    toast_appear(message, colour);
  }, 500);
  timeoutID = window.setTimeout(toast_disappear, 2000);
}

function toast_appear(message, colour) {
  toast = $('#toast');
  toast.text(message);
  toast.css("margin-top", "75px");
  toast.css("opacity", "1");
  if(arguments.length == 2) {
    console.log(colour);
    toast.css("color", colour);
  }
}

function toast_disappear() {
  toast = $('#toast');
  toast.css("margin-top", "100px");
  toast.css("opacity", "0");
  toast.css("color", meta_colour);
}

function save(key, value, message) {
  localStorage[key] = value;
  $('#cmd-primary').focus();
  reset();
  display_toast(message);
}

/****
** Built in functions
****/

function print(output, colour) {
    display_toast(output, colour);
}
