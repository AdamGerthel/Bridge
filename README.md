Bridge
======

Bridge is a small web-based markdown writer/note-taking app that utilizes [PouchDB](http://pouchdb.com/). Data is stored locally in the browser and synchronizes live to other clients using CouchDB (optional). The app works both offline and online. Design and functionality heavily inspired by [IA Writer](http://www.iawriter.com/) and Notes.app (default OSX application). If you want to try it before setting it up, you can [try the demo](http://bridge-demo.gerthel.com/).

### Background

Bridge was been built as an experiment in order to learn more about offline applications and writing experiences in-browser. It is however fully functional, so feel free to fork and improve!

### Installation

You'll need a web server in order to run the application. It's been built using Apache, but Node or similar will work just as well. If you're going to use a remote database (CouchDB), you'll need to enable [CORS](http://pouchdb.com/getting-started.html#enabling_cors).

**1. Clone or download repo**

**2. Install NPM dependencies:**
```bash
$ npm install
```
**3. Install Bower dependencies**
```bash
$ bower install
```
**4. Follow instructions in default.config.js (optionally sign up for free remote CouchDB at [Iris Couch](http://www.iriscouch.com/))**

**5. Visit the site in your browser of choice, and use the "+" sign to start your first document.**

If you want to use remote sync but don't want to set up CouchDB yourself I'd recommend using a free account over at [Iris Couch](http://iriscouch.com).

### Known issues

- The editor in use, ([Ace](http://ace.c9.io/)), doesn't work very well with Mobile Safari.
- The document list on the left is sometime not in the correct order (mainly noticed in Chrome)

### Roadmap (which may or may not happen)

- Buttons are in need of some lovin'
- Animations the improve the overall UX would be sweet
- Perhaps find a more suitable monospace font
- Favicon and touch icons
