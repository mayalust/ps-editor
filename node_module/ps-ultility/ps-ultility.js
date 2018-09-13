(function(global, factory){
  if(typeof window === "undefined"){
    if(typeof module !== "undefined" && typeof module.exports === "function"){
      module.exports = factory();
    }
  } else {
    if(typeof define === "function"){
      define(factory);
    } else {
      window.psUltility = factory();
    }
  }
})(this, function(){
  var tostring = Object.prototype.toString,
    pop = Array.prototype.pop,
    push = Array.prototype.push,
    slice = Array.prototype.slice,
    shift = Array.prototype.shift,
    unshift = Array.prototype.unshift,
    isFunction = isType("Function"),
    isArray = isType("Array"),
    isString = isType("String"),
    isObject = isType("Object");
  function urlparser(input){
    var hostchar = "(?:[\\w\\d$!])+",
      querychar = "(?:[^;\\\/?:@&=+,$#]+)",
      protocol = "^(?:([\\w]+)\\:\/\/)?",
      pathchar = "(?:[^\/?;=]+)",
      host = "(" + hostchar + "(?:\\." + hostchar + ")*)",
      port = "(?:\\:([\\d]+))?",
      path = "(?:((?:\/" + pathchar + ")+))",
      query = "(?:\\?((?:" + querychar + "=" + querychar + ")(?:\\&{1,2}" + querychar + "=" + querychar + ")*))?",
      hash = "(#.*)?$",
      queryExp = "^(?:\\&{1,2})?(" + querychar + ")=(" + querychar + ")",
      pathExp = "^(?:\\\/?(" + pathchar + "))",
      url = protocol + host + port + path + query + hash,
      urlExp = new RegExp(protocol + host + port + path + query + hash, "g"),
      match = urlExp.exec(input),
      pathData = getPathData(match[4]),
      queryData = getQueryData(match[5]);
    function getQueryData(str){
      if(!str){
        return null;
      }
      var soFar = str, match, obj = {};
      while( match = new RegExp(queryExp).exec(soFar)){
        obj[match[1]] = match[2];
        soFar = soFar.slice(match[0].length)
      }
      return obj
    }
    function getPathData(str){
      if(!str){
        return null;
      }
      var soFar = str, match, obj = [];
      while( match = new RegExp(pathExp).exec(soFar)){
        obj.push(match[1]);
        soFar = soFar.slice(match[0].length)
      }
      return obj
    }
    return {
      url : match[0],
      protocol : match[1] ? match[1] : "http",
      address : match[2],
      port : match[3] ? match[3] - 0 : 80,
      path : match[4] ? match[4] : "/",
      patharr : pathData,
      query : queryData,
      hash : match[6]
    };
  };
  function remove$$hashKey(str){
    var regex = /(?:,\s*\"\${2}hashKey\"\s*:\s*\"[^"]*\"\s*)|(?:\"\${2}hashKey\"\s*:\s*\"[^"]*\"\s*,)/g;
    while(regex.test(str)){
      str = str.replace(regex, "");
    };
    console.log(str);
    return str;
  };
  function jsonparser(str){
    let json;
    try {
      json = JSON.parse(str);
    } catch(e) {
      console.error(e);
      json = null;
    } finally {
      return json
    }
  }
  function clone(obj){
    return JSON.parse(JSON.stringify(obj));
  }
  function extend(a, b){
    for(var i in b){
      a[i] = b[i];
    }
    return a;
  }
  function isType(type){
    return function(obj){
      return tostring.call(obj) == "[object " + type + "]" && obj === obj;
    }
  }
  function find(arr, callback){
    var i;
    arr = arr || [];
    for(var i = 0; i < arr.length; i++){
      if(callback(arr[i], i)){
        return arr[i];
      }
    }
  }
  function filter(arr, callback){
    var i, rs = [];
    arr = arr || [];
    for(var i = 0; i < arr.length; i++){
      if(callback(arr[i], i)){
        rs.push(arr[i]);
      }
    }
    return rs;
  }
  function each(arr, callback){
    var i;
    arr = arr || [];
    for(i=0; i<arr.length; i++){
      callback && callback(arr[i], i);
    }
  }
  function eachProp(obj, callback){
    var i;
    obj = obj || {};
    for(var i in obj){
      callback && callback(obj[i], i);
    }
  }
  function pushDiff(a, b){
    var i = 0;
    a = a || [];
    b = b || [];
    for(; i < b.length; i++){
      if(a.indexOf(b[i]) === -1){
        a.push(b[i])
      }
    }
    return a.length;
  }
  function addStyle(elem, style){
    eachProp(style, function(n, i){
      elem.style[i] = n;
    })
  }
  function setStyle(dom, style){
    style && eachProp(style, function(elem, attr){
      dom.style[attr] = elem;
    })
  }
  function getStyle(dom, name){
    
  }
  function addClass(elem, cls){
    var oldcls = elem.getAttribute("class"),
      oldClsList = isString(oldcls) ? oldcls.split(" ") : [],
      clsList = cls.split(" ");
    pushDiff(oldClsList, clsList);
    elem.setAttribute("class", oldClsList.join(" "));
  }
  function setClass(elem, cs){
    elem.setAttribute("class", cs);
  }
  function hasClass(elem, cls){
    if(elem && typeof elem.getAttribute === "function"){
      var oldcls = elem.getAttribute("class"),
        oldClsList = isString(oldcls) ? oldcls.split(" ") : [];
      return oldClsList.indexOf(cls) != -1;
    } else {
      return false;
    }
  }
  function removeClass(elem, cls){
    if(!(elem && typeof elem.getAttribute === "function")){
      return;
    }
    var oldcls = elem.getAttribute("class"),
      oldClsList = isString(oldcls) ? oldcls.split(" ") : [],
      i = oldClsList.indexOf(cls);
    i != -1 && oldClsList.splice(i, 1);
    elem.setAttribute("class", oldClsList.join(" "));
  }
  function appendChildren(){
    var self = this;
    var arr = slice.call(arguments, 0);
    each(arr, function(el){
      self.append(el);
    })
  }
  function screenOffset(context){
    var target = context,
      x = target.offsetLeft,
      y = target.offsetTop;
    while(target = target.offsetParent){
      x += target.offsetLeft + target.clientLeft - target.scrollLeft;
      y += target.offsetTop + target.clientTop - target.scrollTop;
    }
    return {
      left : x,
      top : y
    }
  }
  function createElement(tag){
    return document.createElement(tag);
  }
  function createDocumentFragment(){
    return document.createDocumentFragment();
  }
  function topArray(obj){
    return slice.call(obj);
  }
  function findElement(context, callback){
    var stack = topArray(context.children),len, item;
    while(item=stack.pop()){
      if(callback(item)){ return item; }
      item.children ? push.apply(stack,topArray(item.children)) : null;
    }
  }
  function filterElement(context, callback){
    var stack = topArray(context.children),len, item, rs = [];
    while(item=stack.pop()){
      callback(item) ? rs.push(item) : null;
      item.children ? push.apply(stack,topArray(item.children)) : null;
    }
    return rs;
  }
  var dh = (function(){
    /**
     * Date Handler Created by leonlin.
     * e.g.
     * 1) create a Date Object on Today
     * var dh = datehandler();
     * 2) create a Date on certain Date
     * var dh = datehandler('2017/12/31,10:20')
     * 3) Add several years on original Date Object
     * dh.addYear(1); dh.addYear(-2);
     * 3) Add several years on clone Date Object
     * var clone = dh.addYear(1, true)
     * 4)output date string
     * var str = dh.getDateString();
     * var str = dh.getDateString('yy/MM/dd,hh');
     * 5)output utc date string
     * var utcstr = dh.getUTCDateString();
     * var utcstr = dh.getUTCDateString('yy/MM/dd,hh');
     */
    function DateHandler(dateStr){
      return new DateHandler.fn.init(dateStr);
    };
    var VERSION = "DateHandler v1.0.0",
      SECONDTIMESTAMP = 1000,
      MINUTETIMESTAMP = 60 * SECONDTIMESTAMP,
      HOURTIMESTAMP = 60 * MINUTETIMESTAMP,
      DAYTIMESTAMP = 24 * HOURTIMESTAMP,
      OFFSET = "0800",
      events = {};
    function extend(self, target){
      var cur = self;
      for(var i in target){
        cur[i] = target[i];
      }
    };
    function to2Char(num){
      if(num < 10){
        return "0" + num
      } else {
        return num;
      }
    };
    function to3Char(num){
      if(num < 10){
        return "00" + num
      } else if(num < 100){
        return "0" + num
      } else {
        return num;
      }
    };
    function dateObject(date){
      function dObject(d){
        var cur = this;
        extend(cur, {
          year : d.getFullYear(),
          month : d.getMonth() + 1,
          dat : d.getDate(),
          hour : d.getHours(),
          minute : d.getMinutes(),
          second : d.getSeconds(),
          milisecond : d.getMilliseconds(),
          utcyear : d.getUTCFullYear(),
          utcmonth : d.getUTCMonth(),
          utcdat : d.getUTCDate(),
          utchour : d.getUTCHours(),
          utcminute : d.getUTCMinutes(),
          utcsecond : d.getUTCSeconds(),
          utcmilisecond : d.getUTCMilliseconds()
        })
      };
      dObject.prototype.toString = function(){
        var cur = this, str;
        str = cur.year + "-";
        str += to2Char(cur.month) + "-";
        str += to2Char(cur.dat) + ":";
        str += to2Char(cur.hour) + ":";
        str += to2Char(cur.minute) + ":";
        str += to2Char(cur.second) + ".";
        str += to2Char(cur.utcmilisecond) + "+" + OFFSET;
        return str;
      };
      dObject.prototype.toUTCString = function(){
        var cur = this, str;
        str = cur.utcyear + "-";
        str += to2Char(cur.utcmonth) + "-";
        str += to2Char(cur.utcdat) + ":";
        str += to2Char(cur.utchour) + ":";
        str += to2Char(cur.utcminute) + ":";
        str += to2Char(cur.utcsecond) + ".";
        str += to2Char(cur.utcmilisecond) + "+" + OFFSET;
        return str;
      };
      return new dObject(date);
    }
    DateHandler.fn = DateHandler.prototype;
    DateHandler.fn.init = function(dateStr){
      var cur = this;
      if(dateStr){
        if(typeof dateStr == "object"){
          cur.setDate(dateStr);
        } else {
          cur.setDate(new Date(dateStr));
        }
      } else {
        cur.setDate(new Date());
      };
      cur.on("dateChange", function(d){
        cur.setDate(d);
      });
    };
    DateHandler.fn.init.prototype = DateHandler.fn
    extend(DateHandler.fn.init.prototype, {
      version : VERSION,
      on : function(eventName, callback){
        events[eventName] = events[eventName] || [];
        events[eventName].push(callback);
      },
      clone : function(){
        var cur = this;
        return new DateHandler.fn.init(cur.getTimeStamp());
      },
      setDate : function(d){
        var cur = this;
        cur.date = d;
        cur.dateObject = dateObject(d);
        cur.dateString = cur.dateObject.toString();
        cur.utcDateString = cur.dateObject.toUTCString();
      },
      update : function(){
        var cur = this;
        var str = cur.dateObject.toString();
        cur.setDate(new Date(str));
      },
      addYear : function(num, clone){
        var target = clone == true ? this.clone() : this;
        target.dateObject.year += parseInt(num);
        target.update();
        return target;
      },
      addMonth : function(num, clone){
        var target = clone == true ? this.clone() : this;
        var madd = target.dateObject.month + parseInt(num);
        var yadd = 0;
        while(madd < 1){
          madd += 12;
          yadd--;
        }
        while(madd > 12){
          madd -= 12;
          yadd++;
        }
        target.dateObject.year += yadd;
        target.dateObject.month = madd;
        target.update();
        return target;
      },
      addDay : function(num, clone){
        var target = clone == true ? this.clone() : this;
        var dateMinSecond = DAYTIMESTAMP * num;
        target.addTimeStamp(dateMinSecond);
        return target;
      },
      addHour : function(num, clone){
        var target = clone == true ? this.clone() : this;
        var dateMinSecond = HOURTIMESTAMP * num;
        target.addTimeStamp(dateMinSecond);
        return target;
      },
      addMinute : function(num, clone){
        var target = clone == true ? this.clone() : this;
        var dateMinSecond = MINUTETIMESTAMP * num;
        target.addTimeStamp(dateMinSecond);
        return target;
      },
      addSecond : function(num, clone){
        var target = clone == true ? this.clone() : this;
        var dateMinSecond = SECONDTIMESTAMP * num;
        target.addTimeStamp(dateMinSecond);
        return target;
      },
      addTimeStamp : function(timestamp, clone){
        var target = clone == true ? this.clone() : this;
        var minSecond = target.date.getTime() + timestamp;
        target.setDate(new Date(minSecond));
        return target;
      },
      trimmToYear : function(clone){
        var target = clone == true ? this.clone() : this;
        var dt = target.dateObject.year + "-01-01,00:00:00.000+" + OFFSET;
        target.setDate(new Date(dt));
        return target;
      },
      trimmToMonth : function(clone){
        var target = clone == true ? this.clone() : this;
        var dt = target.dateObject.year + "-" + to2Char(target.dateObject.month) + "-01,00:00:00.000+" + OFFSET;
        target.setDate(new Date(dt));
        return target;
      },
      trimmToWeek : function(clone){
        var target = clone == true ? this.clone() : this;
        var d = target.date.getDay() || 7;
        return target.addDay(1 - d).trimmToDate();
      },
      trimmToDate : function(clone){
        var target = clone == true ? this.clone() : this;
        var dt = target.dateObject.year;
        dt += "-" + to2Char(target.dateObject.month);
        dt += "-" + to2Char(target.dateObject.dat) + ",00:00:00.000+" + OFFSET;
        target.setDate(new Date(dt));
        return target;
      },
      trimmToHour : function(clone){
        var target = clone == true ? this.clone() : this;
        var dt = target.dateObject.year;
        dt += "-" + to2Char(target.dateObject.month);
        dt += "-" + to2Char(target.dateObject.dat);
        dt += "," + to2Char(target.dateObject.hour) + ":00:00.000+" + OFFSET;
        target.setDate(new Date(dt));
        return target;
      },
      trimmToMinute : function(clone){
        var target = clone == true ? this.clone() : this;
        var dt = target.dateObject.year;
        dt += "-" + to2Char(target.dateObject.month);
        dt += "-" + to2Char(target.dateObject.dat);
        dt += "," + to2Char(target.dateObject.hour);
        dt += ":" + to2Char(target.dateObject.minute) + ":00.000+" + OFFSET;
        target.setDate(new Date(dt));
        return target;
      },
      trimmToSecond : function(clone){
        var target = clone == true ? this.clone() : this;
        var dt = target.dateObject.year;
        dt += "-" + to2Char(target.dateObject.month);
        dt += "-" + to2Char(target.dateObject.dat);
        dt += "," + to2Char(target.dateObject.hour);
        dt += ":" + to2Char(target.dateObject.minute);
        dt += ":" + to2Char(target.dateObject.second) + ".000+" + OFFSET;
        target.setDate(new Date(dt));
        return target;
      },
      getDate : function(){
        return this.date;
      },
      getTimeStamp : function(){
        return this.date.getTime();
      },
      getYear : function(){
        return this.dateObject.year;
      },
      getMonth : function(){
        return this.dateObject.month;
      },
      getDateString : function(str){
        var year = this.dateObject.year;
        var month = this.dateObject.month;
        var dat = this.dateObject.dat;
        var hour = this.dateObject.hour;
        var minute = this.dateObject.minute;
        var second = this.dateObject.second;
        var milisecond = this.dateObject.milisecond;
        if(str){
          str = str.replace(/y+/g, year);
          str = str.replace(/M+/g, to2Char(month));
          str = str.replace(/d+/g, to2Char(dat));
          str = str.replace(/h+/g, to2Char(hour));
          str = str.replace(/m+/g, to2Char(minute));
          str = str.replace(/s+/g, to2Char(second));
          return str.replace(/n+/g, to3Char(milisecond));
        } else {
          return year + "-" + to2Char(month) + "-" + to2Char(dat) + "," + to2Char(hour) + ":" + to2Char(minute) + ":" + to2Char(second) + "." + to3Char(milisecond) + "+" + OFFSET;
        }
      },
      getUTCDateString : function(str){
        var utcyear = this.dateObject.utcyear;
        var utcmonth = this.dateObject.utcmonth;
        var utcdat = this.dateObject.utcdat;
        var utchour = this.dateObject.utchour;
        var utcminute = this.dateObject.utcminute;
        var utcsecond = this.dateObject.utcsecond;
        var utcmilisecond = this.dateObject.utcmilisecond;
        if(str){
          str = str.replace(/y+/g, utcyear);
          str = str.replace(/M+/g, to2Char(utcmonth));
          str = str.replace(/d+/g, to2Char(utcdat));
          str = str.replace(/h+/g, to2Char(utchour));
          str = str.replace(/m+/g, to2Char(utcminute));
          str = str.replace(/s+/g, to2Char(utcsecond));
          return str.replace(/n+/g, to3Char(utcsecond));
        } else {
          return utcyear + "-" + to2Char(utcmonth) + "-" + to2Char(utcdat) + "T" + to2Char(utchour) + ":" + to2Char(utcminute) + ":" + to2Char(utcsecond) + "." + to3Char(utcmilisecond) +"Z";
        }
      }
    })
    return DateHandler;
  })()
  return {
    isFunction : isFunction,
    isArray : isArray,
    isString : isString,
    isObject : isObject,
    addStyle : addStyle,
    setStyle : setStyle,
    addClass : addClass,
    setClass : setClass,
    hasClass : hasClass,
    removeClass : removeClass,
    appendChildren : appendChildren,
    createElement : createElement,
    createDocumentFragment : createDocumentFragment,
    findElement : findElement,
    filterElement : filterElement,
    screenOffset : screenOffset,
    each : each,
    eachProp : eachProp,
    find : find,
    filter : filter,
    isType : isType,
    clone : clone,
    extend : extend,
    jsonparser : jsonparser,
    urlparser : urlparser,
    dateparser : dh,
    remove$$hashKey : remove$$hashKey
  }
});