Object.resolve = function(path, obj) {
  return path.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined
  }, obj || self);
}

function withProperty(search_me, dot_keys) {
  var results = [];
  for (i in search_me) {
    if (Object.resolve(dot_keys, search_me[i])) {
      results.push(search_me[i]);
    }
  }
  if (!(results.length)) { results = null; }
  return results;
}

function lackingProperty(search_me, dot_keys) {
  var results = [];
  for (i in search_me) {
    if (!Object.resolve(dot_keys, search_me[i])) {
      results.push(search_me[i]);
    }
  }
  if (!(results.length)) { results = null; }
  return results;
}

function findByProperty(search_me, dot_keys, matching_val) {
  for (i in search_me) {
    if (Object.resolve(dot_keys, search_me[i]) === matching_val) {
      return search_me[i];
    }
  }
  return null;
}

function findAllByProperty(search_me, dot_keys, matching_val) {
  var results = [];
  for (i in search_me) {
    if (Object.resolve(dot_keys, search_me[i]) === matching_val) {
      results.push(search_me[i]);
    }
  }
  if (!(results.length)) { results = null; }
  return results;
}

function getSortedLoHi(selector, attrName) {
  return $($(selector).toArray().sort(function(a, b){
    var aVal = parseInt(a.getAttribute(attrName)),
      bVal = parseInt(b.getAttribute(attrName));
    return aVal - bVal;
  }));
}

function getSortedHiLo(selector, attrName) {
  return $($(selector).toArray().sort(function(a, b){
    var aVal = parseInt(a.getAttribute(attrName)),
      bVal = parseInt(b.getAttribute(attrName));
    return aVal - bVal;
  }).reverse());
}

function arrayReverse(array) {
  for(let i = 0; i<Math.floor((array.length)/2); i++){
    var pointer = array[i];
    array[i] = array[ (array.length-1) - i];
    array[(array.length-1) - i] = pointer;
  }
  return array;
}

/**
 * Traverses a javascript object, and deletes all circular values
 * @param source object to remove circular references from
 * @param censoredMessage optional: what to put instead of censored values
 * @param censorTheseItems should be kept null, used in recursion
 * @returns {undefined}
 */
function preventCircularJson(source, censoredMessage, censorTheseItems) {
    //init recursive value if this is the first call
    censorTheseItems = censorTheseItems || [source];
    //default if none is specified
    censoredMessage = censoredMessage || "CIRCULAR_REFERENCE_REMOVED";
    //values that have allready apeared will be placed here:
    var recursiveItems = {};
    //initaite a censored clone to return back
    var ret = {};
    //traverse the object:
    for (var key in source) {
        var value = source[key];
        if (typeof value == "object") {
            //re-examine all complex children again later:
            recursiveItems[key] = value;
        } else {
            //simple values copied as is
            ret[key] = value;
        }
    }
    //create list of values to censor:
    var censorChildItems = [];
    for (var key in recursiveItems) {
        var value = source[key];
        //all complex child objects should not apear again in children:
        censorChildItems.push(value);
    }
    //censor all circular values
    for (var key in recursiveItems) {
        var value = source[key];
        var censored = false;
        censorTheseItems.forEach(function (item) {
            if (item === value) {
                censored = true;
            }
        });
        if (censored) {
            //change circular values to this
            value = censoredMessage;
        } else {
            //recursion:
            value = preventCircularJson(value, censoredMessage, censorChildItems.concat(censorTheseItems));
        }
        ret[key] = value;

    }

    return ret;
}

function AoeCircle( radius, x, y ) {
    "object" == typeof radius && (x = radius.x || x || 0, y = radius.y || y || 0, radius = radius.radius || 0);
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.contains = function( x, y ) {
        let result = false;
        "object" == typeof x && ( (x.h && x.w && (y = x.y + (x.w/2.0), x = x.x + (x.h/2.0)) ) || (true && (y = x.y || 0, x = x.x || 0) ) );
        if (Math.sqrt((this.x - x)**2 + (this.y - y)**2) <= this.radius) {
            result = true;
        }
        return result;
    }
}

function extendUtilEventTrigger(newTrigger) {
    let newEventIndex = Object.keys(util.events).length + 1;
    util.events[newEventIndex] = newTrigger;
}

(function(){
    extendUtilEventTrigger({
        name : "Execute Arbitrary JS",
        load : function(obj, app, scope, newValue) {
          obj.data = {e : newValue};
        },
        interface : function(obj, app, scope, board, pieceData) {
          var targetDiv = $("<div>");
          targetDiv.addClass("flexcolumn flex spadding");

          var flavor = genInput({
            parent : targetDiv,
            classes : "line flex",
            value : obj.data.msg,
            placeholder : "Flavor Text (Optional)",
          });
          flavor.change(function(){
            obj.data.msg = $(this).val();
          });

          targetDiv.append("<b class='subtitle smargin'>JS to execute</b>");

          var equation = $("<textarea>").appendTo(targetDiv);
          equation.addClass("smooth");
          equation.attr("placeholder", "Enter the javascript here");
          equation.text(obj.data.doThis || "");
          equation.change(function(){
            obj.data.doThis = $(this).val();
          });

          return targetDiv;
        },
        fire : function(obj, app, calcData, pieceData, ctx) {
          eval(calcData.doThis);
        },
    });
})();