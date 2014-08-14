/*
 * Copy this file, name it config.js and enter your configuration.
 * remoteCouch is only needed if you're using a remote CouchDB instance,
 * which is needed for synchronization across devices/clients.
 * If you're only using the app locally, you can leave remoteCouch empty.
 *
 * The local database (i.e PouchDB) can be called anything, but 'docs' or
 * 'bridge' is recommended.
 *
 * Example configuration:
 * var db = new PouchDB('docs');
 * var remoteCouch = 'http://username:password@yourdomain.iriscouch.com/database';
 */

var db = new PouchDB('');
var remoteCouch = '';
