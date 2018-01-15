(function() {
    
  var store = {};
  var libWithDependCache = {};

  function librarySystem(name, arr, callback) {
    // store the lib module
    if (arguments.length > 1){
      var futureDependArr = [];
      arr.forEach(function(depend) {
        futureDependArr.push(depend);
      });
      // create the lib
      store[name] = {
        dependencies: futureDependArr,
        callback: callback
      };
     // retrieve the lib module
    } else {
      // if lib module is cached then return
      if (libWithDependCache[name]) {        
        return libWithDependCache[name];     
      } else {
        // check if we have the module
        if (!store[name]) {
          throw Error('Module ' + name + ' does not exist. Store module first.')    
        }
          
        // check if the lib module has dependencies 
        if (store[name].dependencies.length) {    
          var dependencies = store[name].dependencies;
          dependencies.forEach(function(depend, i) {
            if (store[depend]) {        
              dependencies[i] = store[depend].callback();
            }
          });
             
        libWithDependCache[name] = store[name].callback.apply(null, dependencies);
        return libWithDependCache[name];  
        // if no dependencies then just run the callback and store to cache obj  
        } else {   
          libWithDependCache[name] = store[name].callback();
          return libWithDependCache[name];   
        }
      } 
    }
  }
    
  window.librarySystem = librarySystem;
    
  // reset function for tests
  window.reset = function reset() {
    store = {};
    libWithDependCache = {};
  };
    
})();