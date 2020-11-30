(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('json2mq'), require('vue')) :
  typeof define === 'function' && define.amd ? define(['json2mq', 'vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global['vue3-mq'] = factory(global.json2mq, global.vue));
}(this, (function (json2mq, vue) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var json2mq__default = /*#__PURE__*/_interopDefaultLegacy(json2mq);

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var DEFAULT_BREAKPOINTS = {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1400,
    xxl: Infinity
  };
  var state = {
    mqAvailableBreakpoints: vue.ref({}),
    currentBreakpoint: vue.ref("")
  };
  var setAvailableBreakpoints = function setAvailableBreakpoints(v) {
    return state.mqAvailableBreakpoints.value = v;
  };
  var mqAvailableBreakpoints = vue.readonly(state.mqAvailableBreakpoints);
  var setCurrentBreakpoint = function setCurrentBreakpoint(v) {
    return state.currentBreakpoint.value = v;
  };
  var currentBreakpoint = vue.readonly(state.currentBreakpoint);
  function updateBreakpoints(breakpoints) {
    // Remove any existing MQ listeners
    for (var i = listeners.length - 1; i >= 0; i--) {
      var _listeners$i = listeners[i],
          mql = _listeners$i.mql,
          cb = _listeners$i.cb;
      mql.removeEventListener('change', cb);
      listeners.splice(i, 1);
    }

    sanitiseBreakpoints(breakpoints); // Save new breakpoints to reactive variable

    setAvailableBreakpoints(breakpoints); // Create css media queries from breakpoints

    var mediaQueries = convertBreakpointsToMediaQueries(breakpoints); // Add new MQ listeners

    var _loop = function _loop(key) {
      var mediaQuery = mediaQueries[key];

      var enter = function enter() {
        setCurrentBreakpoint(key);
      };

      subscribeToMediaQuery(mediaQuery, enter);
    };

    for (var key in mediaQueries) {
      _loop(key);
    }
  }
  function shouldRender(mq) {
    var isMqArray = Array.isArray(mq);
    var isMqPlus = !isMqArray.value && /\+$/.test(mq) === true;
    var isMqMinus = !isMqArray.value && /-$/.test(mq) === true;
    var isMqRange = !isMqArray.value && /^\w*-\w*/.test(mq) === true;
    var activeBreakpoints = vue.computed(function () {
      if (isMqArray) return mq;else if (!isMqPlus && !isMqMinus && !isMqRange) return [mq];else {
        return selectBreakpoints({
          mqProp: mq,
          isMqPlus: {
            value: isMqPlus
          },
          isMqMinus: {
            value: isMqMinus
          },
          isMqRange: {
            value: isMqRange
          }
        });
      }
    });
    return activeBreakpoints.value.includes(currentBreakpoint.value);
  }

  var listeners = [];
  function convertBreakpointsToMediaQueries(breakpoints) {
    var keys = Object.keys(breakpoints);
    var values = keys.map(function (key) {
      return breakpoints[key];
    });
    var breakpointValues = [0].concat(_toConsumableArray(values.slice(0, -1)));
    var mediaQueries = breakpointValues.reduce(function (accumulator, current, index) {
      var options = Object.assign({
        minWidth: current
      }, index < keys.length - 1 ? {
        maxWidth: breakpointValues[index + 1] - 1
      } : {});
      var mediaQuery = json2mq__default['default'](options);
      return Object.assign(accumulator, _defineProperty({}, keys[index], mediaQuery));
    }, {});
    return mediaQueries;
  }
  function selectBreakpoints(_ref) {
    var mqProp = _ref.mqProp,
        _ref$isMqPlus = _ref.isMqPlus,
        isMqPlus = _ref$isMqPlus === void 0 ? {
      value: false
    } : _ref$isMqPlus,
        _ref$isMqMinus = _ref.isMqMinus,
        isMqMinus = _ref$isMqMinus === void 0 ? {
      value: false
    } : _ref$isMqMinus,
        _ref$isMqRange = _ref.isMqRange,
        isMqRange = _ref$isMqRange === void 0 ? {
      value: false
    } : _ref$isMqRange;
    var ents = Object.entries(mqAvailableBreakpoints.value);
    if (ents.length === 0) return [];
    if (isMqPlus.value) mqProp = mqProp.replace(/\+$/, "");else if (isMqMinus.value) mqProp = mqProp.replace(/-$/, "");else if (isMqRange.value) {
      mqProp = mqProp.split("-");
      if (!mqProp || mqProp.length !== 2) throw new Error("Invalid MQ range provided");
    }
    var eligible;

    if (isMqRange.value) {
      var from = ents.find(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            key = _ref3[0],
            value = _ref3[1];

        return key == mqProp[0].trim();
      });
      if (!from || from.length === 0) throw new Error('Range from breakpoint (' + mqProp[0].trim() + ') not found');
      var to = ents.find(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
            key = _ref5[0],
            value = _ref5[1];

        return key == mqProp[1].trim();
      });
      if (!to || to.length === 0) throw new Error('Range to breakpoint (' + mqProp[1].trim() + ') not found');

      if (from[1] > to[1]) {
        var _ref6 = [to, from];
        from = _ref6[0];
        to = _ref6[1];
      }

      eligible = ents.filter(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            key = _ref8[0],
            value = _ref8[1];

        return value >= from[1] && value <= to[1];
      });
    } else {
      var base = ents.find(function (_ref9) {
        var _ref10 = _slicedToArray(_ref9, 2),
            key = _ref10[0],
            value = _ref10[1];

        return key == mqProp;
      });
      if (isMqPlus.value) eligible = ents.filter(function (_ref11) {
        var _ref12 = _slicedToArray(_ref11, 2),
            key = _ref12[0],
            value = _ref12[1];

        return value >= base[1];
      });else if (isMqMinus.value) eligible = ents.filter(function (_ref13) {
        var _ref14 = _slicedToArray(_ref13, 2),
            key = _ref14[0],
            value = _ref14[1];

        return value <= base[1];
      });
    }

    eligible.sort(function (a, b) {
      return a[1] - b[1];
    });
    return eligible.map(function (el) {
      return el[0];
    });
  }
  function subscribeToMediaQuery(mediaQuery, enter) {
    var mql = window.matchMedia(mediaQuery);

    var cb = function cb(_ref15) {
      var matches = _ref15.matches;
      if (matches) enter();
    };

    listeners.push({
      mql: mql,
      cb: cb
    });
    mql.addEventListener('change', cb); //subscribing

    cb(mql); //initial trigger
  }
  function sanitiseBreakpoints(breakpoints) {
    for (var bp in breakpoints) {
      if (!['string', 'number'].includes(_typeof(bp)) || !bp) throw new Error("Invalid or missing breakpoint key");
      if (typeof breakpoints[bp] === 'string') breakpoints[bp] = parseFloat(breakpoints[bp].replace(/[^0-9]/g, ""));
      if (typeof breakpoints[bp] !== 'number' || breakpoints[bp] < 0) throw new Error("Invalid breakpoint value for " + bp + ". Please use a valid number.");
      if (!breakpoints[bp]) throw new Error("No valid breakpoint value for " + bp + " was found");
    }
  }

  var MqLayout = {
    name: "MqLayout",
    props: {
      mq: {
        type: [String, Array]
      },
      tag: {
        type: String,
        "default": "div"
      },
      group: {
        type: Boolean,
        "default": false
      }
    },
    setup: function setup(props, context) {
      var defaultOptions = {
        name: "fade",
        mode: "out-in"
      };
      var isMqArray = vue.computed(function () {
        return Array.isArray(props.mq);
      });
      var isMqPlus = vue.computed(function () {
        return !isMqArray.value && /\+$/.test(props.mq) === true;
      });
      var isMqMinus = vue.computed(function () {
        return !isMqArray.value && /-$/.test(props.mq) === true;
      });
      var isMqRange = vue.computed(function () {
        return !isMqArray.value && /^\w*-\w*/.test(props.mq) === true;
      });
      var activeBreakpoints = vue.computed(function () {
        if (isMqArray.value) return props.mq;else if (!isMqPlus.value && !isMqMinus.value && !isMqRange.value) return [props.mq];else {
          return selectBreakpoints({
            mqProp: props.mq,
            isMqPlus: isMqPlus,
            isMqMinus: isMqMinus,
            isMqRange: isMqRange
          });
        }
      });
      var shouldRenderChildren = vue.computed(function () {
        return activeBreakpoints.value.includes(currentBreakpoint.value);
      });

      var renderSlots = function renderSlots(tag) {
        var slots = [];

        var _loop = function _loop(slot) {
          if (!props.group && slots.length > 0) return {
            v: slots
          };
          var shouldRenderSlot = vue.computed(function () {
            return shouldRender(slot.split(":")[0]);
          });

          if (shouldRenderSlot.value) {
            slots.push(vue.h(tag ? tag : context.slots[slot], {
              key: slot
            }, tag ? context.slots[slot]() : undefined));
          }
        };

        for (var slot in context.slots) {
          var _ret = _loop(slot);

          if (_typeof(_ret) === "object") return _ret.v;
        }

        return slots;
      };

      if (context.slots["default"]) {
        return function () {
          return shouldRenderChildren.value ? vue.h(props.tag, {}, context.slots["default"]()) : vue.h();
        };
      } else {
        return function () {
          var transitionOptions = _objectSpread2(_objectSpread2({}, defaultOptions), context.attrs);

          var el = props.group ? vue.TransitionGroup : vue.Transition;
          return vue.h(el, transitionOptions, renderSlots(props.tag));
        };
      }
    }
  };

  var install = function install(app) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$breakpoints = _ref.breakpoints,
        breakpoints = _ref$breakpoints === void 0 ? DEFAULT_BREAKPOINTS : _ref$breakpoints,
        _ref$defaultBreakpoin = _ref.defaultBreakpoint,
        defaultBreakpoint = _ref$defaultBreakpoin === void 0 ? 'sm' : _ref$defaultBreakpoin;

    var hasSetupListeners = false;
    setCurrentBreakpoint(defaultBreakpoint);
    app.provide('updateBreakpoints', updateBreakpoints);
    app.provide('mq', vue.readonly(currentBreakpoint)); // Init reactive component

    app.mixin({
      computed: {
        $mq: function $mq() {
          return currentBreakpoint.value;
        }
      },
      mounted: function mounted() {
        if (!hasSetupListeners) {
          updateBreakpoints(breakpoints);
          hasSetupListeners = true;
        }
      }
    });
    app.config.globalProperties.$mqAvailableBreakpoints = breakpoints;
    app.component('MqLayout', MqLayout);
  };

  var index = {
    install: install
  };

  return index;

})));
