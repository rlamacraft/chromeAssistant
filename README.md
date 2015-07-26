# chromeAssistant
A minimalist launcher for Chrome that is inspired by Google Now, Apple's Spotlight, Alfred and some other bits and pieces.

# Installation Instructions

1. Download zip, unzip and place in a suitable place.
2. Open /site/index.html in Chrome and copy the path in the omnibox
3. Open /extension/newTab.html in a plaintext editor and replace existing path with copied path
4. Load /extension as an unpacked extension in Chrome.
5. Create a new window in Chrome, type "help" for, well.., help.

# Change Log

V1.1
+ Source Code Pro used for code fields
+ Customise seach engine with 'searchEngine'
+ Maps are not shortcuts to commands, rather than bookmarks
+ Load javascript plugins, allowing custom commands - bundled plugins contains some examples
  - To load a plugin type 'plugin <command name>' such as 'plugin images' for google images plugin, then drop the plugin .js file in the box
  - Call the plugin with the command name, like every other command.
+ Redesigned UI, to be even more minimalist!!

V1.0
+ Search DuckDuckGo with '?'
+ Save bookmarks ('bookmark') and JavaScript bookmarklets ('js')
+ Open bookmarks and run bookmarks lets with '!'
+ Map bookmarks to shortcut keys with 'map'
+ Customise accent colour with 'colour'
+ Create temporary notes with 'note'
