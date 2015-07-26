/****
** Search Spotify and plays the first result
** To run, call "<command name> <search query>", e.g.
** "play Little Lion Man", where "play" is the assigned command name
****/

var query = get_primary_arg();
var search_results = $.getJSON("http://ws.spotify.com/search/1/track.json?q=" + query, function() {
  var link = search_results.responseJSON.tracks[0].href;
  go_to_site(link);
});
