// polyfill Array.prototype.findIndex()
// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

// get all unique DOM elements
var getUniqueDomElements = function() {
  // get all DOM elements
  var domArray = Array.prototype.slice.call(document.getElementsByTagName("*"));
  var domElementNames = [];
  // add DOM elements to new array
  for (var i = 0; i < domArray.length; i++) {
    domElementNames[i] = domArray[i].nodeName;
  }
  // add unique DOM elements to new array
  var uniqueDomElements = domElementNames.filter(function(item, index, array){
    return array.indexOf(item) === index;
  });
  // get index of BODY element
  var indexOfBodyElement = uniqueDomElements.findIndex(function(item, index, array){
    return item === "BODY";
  });
  var uniqueBodyElements = [];
  // get unique children of BODY element
  var getUniqueBodyElements = function() {
    for (var i = indexOfBodyElement; i < uniqueDomElements.length; i++) {
      uniqueBodyElements.push(uniqueDomElements[i]);
    }
    return uniqueBodyElements;
  };
  // console.log(getUniqueBodyElements());
  return getUniqueBodyElements();
};
