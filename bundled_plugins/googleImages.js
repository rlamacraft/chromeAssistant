/****
** Search Google Images
** To run, call "<command name> <search query>", e.g.
** "images traffic lights", where "images" is the assigned command name
****/

var query = get_primary_arg();
go_to_site("https://www.google.com/search?q=" + query + "&tbm=isch");
