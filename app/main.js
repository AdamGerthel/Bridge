// Configure Ace Editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/textmate");
editor.getSession().setMode("ace/mode/markdown");
editor.setFontSize(18);
editor.renderer.setShowGutter(false);
editor.setHighlightActiveLine(false);
editor.setDisplayIndentGuides(false);
editor.setShowPrintMargin(false);
editor.getSession().setUseWrapMode(true);
editor.getSession().setUseSoftTabs(true);
editor.getSession().setTabSize(2);
editor.setOptions({maxLines: Infinity});

// Initialize angular
var documentApp = angular.module('documentApp', []);

// Main document controller
documentApp.controller('documentHandler', function ($scope) {

  // Create document object where we can store stuff
  $scope.current = {};

  // Loads the document and opens it in the editor
  function initialize() {
    $scope.fetchDocs();
  }

  // Fetches all documents
  $scope.fetchDocs = function() {
    db.allDocs({
      include_docs: true
    }, function(err, response) {
      $scope.documents = response.rows;

      // Find the latest edited document and load it into the workplace
      // if the user isn't already working on a document
      if (!($scope.current.doc)) {
        mostRecent = $scope.documents[0];
        for (i = 0; i < $scope.documents.length; i++) {
          if ($scope.documents[i].doc.edited > mostRecent.doc.edited) {
            mostRecent = $scope.documents[i];
          }
        }
        $scope.loadDocument(mostRecent.id);
      }

      $scope.$apply(function(){});
    });
  };

  $scope.fetchDocHistory = function() {
    if ($scope.current.history) {
      $scope.current.history = null;
      return;
    }
    var options = {
      revs_info: true,
      revs: true
    };
    db.get($scope.current.doc._id, options, function(err, doc) {
      $scope.$apply(function(){
        var history = [];
        for (i = 0; i < doc._revs_info.length; i++) {
          if(doc._revs_info[i].status == "available") {
            history.push(doc._revs_info[i]);
          }
        }
        $scope.current.history = history;
      });
    });
  };

  // Loads current document into workspace.
  // If a revision ID is specified it loads as read-only.
  //
  // @param {string} id The ID of the document to load
  // @param {string} rev The revision ID of the revision to load (optional)
  $scope.loadDocument = function(id, rev) {
    var options = {
      rev: rev
    };
    db.get(id, options, function(err, doc) {
      $scope.current.doc = doc;
      editor.setValue(doc.value, 1);
      if (!rev) {
        editor.setReadOnly(false);
        editor.focus();
      } else if (rev) {
        editor.setReadOnly(true);
      }
      $scope.$apply(function(){});
    });
  };

  // Deletes document
  $scope.deleteDocument = function() {
    if (remoteCouch) {
      // Display working indicator
      $scope.working = true;
    }
    db.get($scope.current.doc._id, function(err, doc) {
      db.remove(doc, function(err, response) {
        if (!err) {
          console.log('Successfully deleted the document');
          // Clear the current document since it no longer exists
          $scope.current.doc = null;
        } else {
          console.log('Uh-oh! ' + err);
        }
      });
    });
  };

  // Creates new document
  $scope.newDocument = function() {
    var doc = {
      type: 'document',
      value: '',
      edited: new Date()
    };
    db.post(doc, function callback(err, result) {
      if (!err) {
        console.log('Successfully created a new document!');
        $scope.loadDocument(result.id);
      } else {
        console.log('Uh-oh! ' + err);
      }
    });
  };

  // Updates document
  $scope.updateDocument = function() {
    if (remoteCouch) {
      // Display working indicator
      $scope.working = true;
    }
    db.get($scope.current.doc._id).then(function(doc) {
      return db.put({
        _id: doc._id,
        _rev: doc._rev,
        edited: new Date(),
        value: editor.getValue()
      }, function(err, response) {
      if (err) {
        console.log('Uh-oh! ' + err);
        // Display ERROR indicator
        $scope.$apply(function(){
          $scope.error = true;
        });
      } else {
        // Display OK indicator
        $scope.$apply(function(){
          $scope.saved = true;
          $scope.error = false;
        });
        // Fade away OK color
        setTimeout(function() {
          $scope.$apply(function(){
            $scope.saved = false;
          });
        }, 800);
      }
    });
    }
    );
  };

  // Help function that counts the amount of words in a text
  // and outputs both estimated reading time as well as word count
  $scope.wordCount = function(text) {
    var words = text ? text.split(/\s+/) : 0; // Split text on space/tab/enter
    var time = words.length > 0 ? (words.length / 200).toFixed(2) : 0;
    return {
      words: words ? words.length : '',
      readingTime: time
    };
  };

  $scope.highLightDoc = function() {
    if (editor.getReadOnly() === false) {
      editor.focus();
    }
  };

  // Syncronize to remote server
  $scope.working = false;
  var retryTimeout = 1500;
  function sync() {
    // Stop here if we're already syncing.
    if ($scope.working) {
      return;
    }
    // Indicate that we are syncing.
    $scope.working = true;

    var options = { live: true };

    db.replicate.to(remoteCouch, options, syncError);
    db.replicate.from(remoteCouch, options, syncError)
      .on('uptodate', function () {
        $scope.$apply(function(){
          console.log('Local database synced and up to date');
          $scope.working = false;
          $scope.offline = false;
          $scope.error = false;
        });
      })
      .on('error', function () {
        $scope.$apply(function(){
          console.log('An error has occured');
          $scope.working = false;
          $scope.offline = true;
        });
        // Keep retrying replication if we go offline
        setTimeout(sync, retryTimeout);
      });
  }

  function syncError() {
    console.log('There was an error trying to sync the document');
    // Display ERROR indicator
    $scope.$apply(function(){
      $scope.error = true;
      $scope.working = false;
    });
  }

  // Initialize synchronizing if CouchDB is available
  if (remoteCouch) {
    sync();
  }

  // Update the document if it's been changed on remote server
  db.changes({
    since: 'now',
    live: true
  })
  .on('change', initialize);

  // Start the application
  initialize();

  // Editor command that triggers save
  editor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
    exec: function(editor) {
      $scope.updateDocument();
    }
  });

});
