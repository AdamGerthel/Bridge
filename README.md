Bridge
======

Bridge is a small web-based markdown application using [PouchDB](http://pouchdb.com/). Data is stored locally in the browser and utilizes live synchronization remotely using CouchDB (optional). The app works both offline and online. Design and functionality heavily inspired by [IA Writer](http://www.iawriter.com/) and Notes.app (default OSX application).

### Background

Bridge has been built as an experiment in order to learn more about offline applications and writing experiences in-browser. It is however fully functional, so feel free to fork and improve!

### Installation

You'll need a web server in order to run the application. It's been built using Apache, but Node or similar will work just as well.

##### 1. Clone or download repo

##### 2. Install NPM dependencies: 
```bash
$ npm install
```
##### 3. Install Bower dependencies
```bash
$ bower install
```
##### 4. Follow instructions in default.config.js
##### 5. Visit the site in your browser of choice, and use the "+" sign to start your first document.

### Known issues

- The editor in use, ([Ace](http://ace.c9.io/)), doesn't work very well with Mobile Safari.
- DB changes (on remote) are currently poorly visualized.
- The document list on the left is sometime not in the correct order (mainly noticed in Chrome)

### Roadmap (which may or may not happen)

- Buttons are in need of some lovin'
- Animations the improve the overall UX would be sweet
- Perhaps find a more suitable monospace font
- Favicon and touch icons
