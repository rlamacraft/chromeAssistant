/****
** Goes to a given reddit subreddit
** To run, call "<command name> <subreddit name>", e.g.
** "subreddit CasualConversation", where "subreddit" is the assigned command name
****/

var subreddit = get_primary_arg();
go_to_site("http://reddit.com/r/" + subreddit);
