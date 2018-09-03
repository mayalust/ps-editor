var tostring = Object.prototype.toString,
  slice = Array.prototype.slice,
  shift = Array.prototype.shift,
  isFunction = isType("Function"),
  isArray = isType("Array"),
  isString = isType("String"),
  isObject = isType("Object"),
  Dictionary = {
    value : "取值",
    theme : "样式"
  },
  items = {
  "input" : function(prop){
    var input = createElement("input"), dirty, old;
    addClass(input, "input");
    old = input.value = prop.value || "";
    input.placeholder = "请填写" + prop.title;
    input.onchange = function(){
      dirty = this.value !== old;
    }
    return {
      dom : input,
      destroy : function() {
        input.remove();
        input = null;
      },
      getValue : function(){
        return input.value
      },
      isDirty : function(){
        return dirty;
      }
    };
  },
  "select" : function(prop){
    var select = createElement("select"),
      map = {}, value = prop.value,
      option = createElement("option"),dp, offset, dirty, old;
    each(prop.options, function(n, i){
      map[n[0]] = n[1];
    })
    addClass(select, "select");
    old = prop.value;
    option.innerText = map[prop.value] || "--- 请选择 ---";
    select.appendChild(option);
    select.onmousedown = function(e){
      e.preventDefault();
      offset = getOffset(e.currentTarget);
      dp = createDrop(prop.options, {
        top : offset.top + e.currentTarget.clientHeight,
        left : offset.left,
        width : e.currentTarget.clientWidth
      });
      dp.on("select", function(e){
        option.innerText = e[1];
        value = e[0];
        dirty = value !== old;
      });
    }
    return {
      dom : select,
      destroy : function() {
        select.remove();
        option = null;
        select = null;
      },
      getValue : function(){
        return value
      },
      isDirty : function(){
        return dirty;
      }
    };
  }
};
function pushBack(arr, obj){
  if(isArray(obj)){
    push.apply(arr, obj)
  } else {
    push.call(arr, obj)
  }
}
function isType(type){
  return function(obj){
    return tostring.call(obj) == "[object " + type + "]" && obj === obj;
  }
}
function isNaN(num){
  return num !== num;
}
function bind(target, fn){
  return function() {
    fn.apply(target, arguments);
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
function clone(obj){
  return JSON.parse(JSON.stringify(obj));
}
function extend(a, b){
  for(var i in b){
    a[i] = b[i]
  }
  return a;
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
function createElement(tag, id, cls, style){
  var dom = document.createElement(tag);
  id && dom.setAttribute("id", id);
  cls && dom.setAttribute("class", cls);
  style && eachProp(cls, function(elem, attr){
    dom.style[attr] = elem;
  });
  return dom;
}
function createDocumentFragment(){
  return document.createDocumentFragment()
}
function addStyle(elem, style){
  eachProp(style, function(n, i){
    elem.style[i] = n;
  })
}
function addClass(elem, cls){
  var oldcls = elem.getAttribute("class"),
    oldClsList = isString(oldcls) ? oldcls.split(" ") : [];
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
function setStyle(dom, style){
  style && eachProp(style, function(elem, attr){
    dom.style[attr] = elem;
  })
}
function findParent(dom, callback){
  var parent = dom;
  do {
    if(callback(parent)){
      return parent;
    }
  } while(parent = parent.parentNode)

  return null;
}
function hasNode(dom, target){
  return !!findParent(target, function(el){
    return el === dom;
  });
}
function findNode(dom, query){
  return dom.querySelector(query);
}
function prop(dom, attr){
  return dom[attr];
}
function attachEvent(dom, eventname, callback){
  if(isFunction(dom.addEventListener)){
    /** webkit gesko presto */
    var arr = eventname.split("."),
      name = arr[0],
      cls = arr[1];
    dom.addEventListener(eventname, callback);
    dom.$eventlist = dom.$eventlist || [];
    if(name === eventname){
      dom.$eventlist.push(callback)
    } else {
      dom.$eventlist.cls = dom.$eventlist.cls || [];
      dom.$eventlist.cls.push(callback);
    }
  } else {
    /** ie 6,7,8 */
  }
}
function removeEvent(dom, callback){
  if(isFunction(dom.removeEventListener)){
    var arr = eventname.split("."),
      name = arr[0],
      cls = arr[1];
    if(cls){
      for(var i in dom.$eventlist[cls]){
        dom.removeEventListener(dom.$eventlist[cls][i]);
      }
    } else {
      for(var i in dom.$eventlist){
        if(isArray(typeof dom.$eventlist[i])){
          for(var j in dom.$eventlist[i]){
            dom.removeEventListener(dom.$eventlist[i][j]);
          }
        } else {
          dom.removeEventListener(dom.$eventlist[i]);
        }
      }
    }
  } else {
    /** ie 6,7,8 */
  }
}
function log(msg){
  console.log.apply(console, arguments);
}
function warn(msg){
  console.warn.apply(console, arguments);
}
function error(msg){
  console.error.apply(console, arguments);
}
function info(msg){
  console.info.apply(console, arguments);
}
function createDrop(point, config, align, highlight){
  var events, buttonWrap = createElement("div", null, "button-wrap", null),
    widget = createElement("div", null, "widget-bg", null),
    fragment = createDocumentFragment();
  align = align || "left";
  fragment.appendChild(widget);
  widget.appendChild(buttonWrap);
  each(config, function(btn, i){
    var node = createElement("div", null, "button-item", null);
    highlight == i ? addClass(node, "highlight") : null;
    node.innerText = btn.name || btn[0];
    node.onclick = function(e){
      destroy();
      btn.onclick(e);
    };
    buttonWrap.appendChild(node);
  })
  document.body.appendChild(fragment);
  if(align == "right"){
    setStyle(buttonWrap, {
      top : point.y + "px",
      left : point.x - buttonWrap.clientWidth + "px"
    });
  } else {
    setStyle(buttonWrap, {
      top : point.y + "px",
      left : point.x + "px"
    });
  }
  setTimeout(function(){
    addClass(widget, "fade-in");
    addClass(buttonWrap, "fade-in");
  })
  widget.onclick = function(e){
    if(e.eventPhase === 2){
      destroy();
    }
  }
  function emit(){
    var args = slice.call(arguments),
      eventname = args.shift();
    events[eventname] && events[eventname].apply(null, args);
  }
  function sethighlight(inx){
    each(nodelists, function(n, i){
      i == inx ? addClass(n, "highlight") : removeClass(n, "highlight")
    })
  }
  function destroy(){
    widget.remove();
    events = null;
    widget = null;
    buttonWrap = null;
  };
  return {
    on : function(eventname, callback){
      events[eventname] = callback;
    },
    sethighlight : sethighlight,
    destroy : destroy
  }
};
function createItem(prop){
  return items[prop.type](prop);
}
function createProperties(title, properties){
  var events = {},
    values = [],
    fragement = createDocumentFragment(),
    cover = createElement("div", null, "modal-cover", null),
    modal = createElement("div", null, "fb-modal", null),
    table = createElement("div", null, "prop-table", null),
    titledom = createElement("div", null, "title", null),
    submit = createElement("button", null, "submit", null),
    tools = [];
  titledom.innerText = title;
  modal.appendChild(titledom);
  cover.appendChild(modal);
  fragement.appendChild(cover);
  modal.appendChild(table);
  modal.appendChild(submit);
  submit.innerText = "提交";
  setTimeout(function(){
    addClass(cover, "fade-in");
  })
  setTimeout(function(){
    addClass(modal, "fade-in");
  });
  function getValue(tool){
    var type = tool[0];
    return tool[1].getValue();
  }
  submit.onclick = function(e){
    var rs = {};
    each(properties, function(n, i){
      rs[n.name] = getValue(values[i])
    })
    tools.some(function(t){
      return t.isDirty()
    }) ?
      events["submit"] && events["submit"](rs) :
      events["close"] && events["close"](e);
    destroy();
  }
  cover.onclick = function(e){
    if(e.eventPhase === 2){
      events["close"] && events["close"](e);
      destroy();
    }
  }
  each(properties, function(property){
    var tr = createElement("div"),
      title = createElement("div"),
      content = createElement("div"),
      tool;
    tool = createItem(property);
    tools.push(tool);
    tool.value = property.value;
    content.appendChild(tool.dom);
    title.innerText = Dictionary[property.name] || property.title || property.name;
    addClass(tr, "tr");
    addClass(title, "td-title");
    addClass(content, "td-content");
    values.push(["input", tool]);
    tr.appendChild(title);
    tr.appendChild(content);
    table.appendChild(tr);
  })
  document.body.appendChild(fragement);
  function destroy(){
    each(tools, function(t){
      t.destroy();
    })
    cover.remove();
    titledom = null;
    cover = null;
    modal = null;
    submit = null;
  }
  return {
    on : function(eventname, callback){
      events[eventname] = callback;
      return this;
    },
    destroy : destroy
  }
};
module.exports = {
  createDrop : createDrop,
  createProperties : createProperties
};