/****
** Creates an email, in the default email client, to a given address
** To run, call "<command name> <To Address>", e.g.
** "email example@example.com, where "email" is the assigned command name
****/

address = get_primary_arg();
go_to_site("mailto:" + address);
