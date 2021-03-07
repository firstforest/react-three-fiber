'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/extends');
var _objectWithoutPropertiesLoose = require('@babel/runtime/helpers/objectWithoutPropertiesLoose');
var _construct = require('@babel/runtime/helpers/construct');
var THREE = require('three');
var Reconciler = require('react-reconciler');
var scheduler = require('scheduler');
var React = require('react');
var tinyEmitter = require('tiny-emitter');
var useAsset = require('use-asset');
var CSS3DRenderer = require('three/examples/jsm/renderers/CSS3DRenderer');
var useMeasure = require('react-use-measure');
var mergeRefs = require('react-merge-refs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var _extends__default = /*#__PURE__*/_interopDefaultLegacy(_extends);
var _objectWithoutPropertiesLoose__default = /*#__PURE__*/_interopDefaultLegacy(_objectWithoutPropertiesLoose);
var _construct__default = /*#__PURE__*/_interopDefaultLegacy(_construct);
var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);
var Reconciler__default = /*#__PURE__*/_interopDefaultLegacy(Reconciler);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var useMeasure__default = /*#__PURE__*/_interopDefaultLegacy(useMeasure);
var mergeRefs__default = /*#__PURE__*/_interopDefaultLegacy(mergeRefs);

var name = "react-three-fiber";
var version = "5.3.19";

var roots = new Map();
var emptyObject = {};
var is = {
  obj: function obj(a) {
    return a === Object(a) && !is.arr(a);
  },
  fun: function fun(a) {
    return typeof a === 'function';
  },
  str: function str(a) {
    return typeof a === 'string';
  },
  num: function num(a) {
    return typeof a === 'number';
  },
  und: function und(a) {
    return a === void 0;
  },
  arr: function arr(a) {
    return Array.isArray(a);
  },
  equ: function equ(a, b) {
    // Wrong type or one of the two undefined, doesn't match
    if (typeof a !== typeof b || !!a !== !!b) return false; // Atomic, just compare a against b

    if (is.str(a) || is.num(a) || is.obj(a)) return a === b; // Array, shallow compare first to see if it's a match

    if (is.arr(a) && a == b) return true; // Last resort, go through keys

    var i;

    for (i in a) {
      if (!(i in b)) return false;
    }

    for (i in b) {
      if (a[i] !== b[i]) return false;
    }

    return is.und(i) ? a === b : true;
  }
};

function createSubs(callback, subs) {
  var index = subs.length;
  subs.push(callback);
  return function () {
    return void subs.splice(index, 1);
  };
}

var globalEffects = [];
var globalAfterEffects = [];
var globalTailEffects = [];
var addEffect = function addEffect(callback) {
  return createSubs(callback, globalEffects);
};
var addAfterEffect = function addAfterEffect(callback) {
  return createSubs(callback, globalAfterEffects);
};
var addTail = function addTail(callback) {
  return createSubs(callback, globalTailEffects);
};
function renderGl(state, timestamp, repeat, runGlobalEffects) {
  if (repeat === void 0) {
    repeat = 0;
  }

  if (runGlobalEffects === void 0) {
    runGlobalEffects = false;
  }

  var i; // Run global effects

  if (runGlobalEffects) {
    for (i = 0; i < globalEffects.length; i++) {
      globalEffects[i](timestamp);
      repeat++;
    }
  } // Run local effects


  var delta = state.current.clock.getDelta();

  for (i = 0; i < state.current.subscribers.length; i++) {
    state.current.subscribers[i].ref.current(state.current, delta);
  } // Decrease frame count


  state.current.frames = Math.max(0, state.current.frames - 1);
  repeat += !state.current.invalidateFrameloop ? 1 : state.current.frames; // Render content

  if (!state.current.manual && state.current.gl.render) state.current.gl.render(state.current.scene, state.current.camera); // Run global after-effects

  if (runGlobalEffects) {
    for (i = 0; i < globalAfterEffects.length; i++) {
      globalAfterEffects[i](timestamp);
    }
  }

  return repeat;
}
var running = false;

function renderLoop(timestamp) {
  running = true;
  var repeat = 0;
  var i; // Run global effects

  for (i = 0; i < globalEffects.length; i++) {
    globalEffects[i](timestamp);
    repeat++;
  }

  roots.forEach(function (root) {
    var state = root.containerInfo.__state; // If the frameloop is invalidated, do not run another frame

    if (state.current.active && state.current.ready && (!state.current.invalidateFrameloop || state.current.frames > 0)) {
      repeat = renderGl(state, timestamp, repeat);
    } else {
      repeat = 0;
    }
  }); // Run global after-effects

  for (i = 0; i < globalAfterEffects.length; i++) {
    globalAfterEffects[i](timestamp);
  }

  if (repeat !== 0) {
    return requestAnimationFrame(renderLoop);
  } else {
    // Tail call effects, they are called when rendering stops
    for (i = 0; i < globalTailEffects.length; i++) {
      globalTailEffects[i](timestamp);
    }
  } // Flag end of operation


  running = false;
}

function invalidate(state, frames) {
  if (state === void 0) {
    state = true;
  }

  if (frames === void 0) {
    frames = 1;
  }

  if (state === true) {
    roots.forEach(function (root) {
      var state = root.containerInfo.__state;
      state.current.frames = state.current.ready ? state.current.frames + frames : frames;
    });
  } else if (state && state.current) {
    if (state.current.vr) return;
    state.current.frames = state.current.ready ? state.current.frames + frames : frames;
  }

  if (!running) {
    running = true;
    requestAnimationFrame(renderLoop);
  }
}
function forceResize() {
  roots.forEach(function (root) {
    return root.containerInfo.__state.current.forceResize();
  });
}
var catalogue = {};
var extend = function extend(objects) {
  return void (catalogue = _extends__default['default']({}, catalogue, objects));
};
function applyProps(instance, newProps, oldProps, accumulative) {
  if (oldProps === void 0) {
    oldProps = {};
  }

  if (accumulative === void 0) {
    accumulative = false;
  }

  // Filter equals, events and reserved props
  var container = instance.__container;
  var sameProps = [];
  var handlers = [];
  var i;
  var keys = Object.keys(newProps);

  for (i = 0; i < keys.length; i++) {
    if (is.equ(newProps[keys[i]], oldProps[keys[i]])) {
      sameProps.push(keys[i]);
    } // Event-handlers ...
    //   are functions, that
    //   start with "on", and
    //   contain the name "Pointer", "Click", "ContextMenu", or "Wheel"


    if (is.fun(newProps[keys[i]]) && keys[i].startsWith('on')) {
      if (keys[i].includes('Pointer') || keys[i].includes('Click') || keys[i].includes('ContextMenu') || keys[i].includes('Wheel')) {
        handlers.push(keys[i]);
      }
    }
  }

  var leftOvers = [];
  keys = Object.keys(oldProps);

  if (accumulative) {
    for (i = 0; i < keys.length; i++) {
      if (newProps[keys[i]] === void 0) {
        leftOvers.push(keys[i]);
      }
    }
  }

  var toFilter = [].concat(sameProps, ['children', 'key', 'ref']); // Instances use "object" as a reserved identifier

  if (instance.__instance) toFilter.push('object');

  var filteredProps = _extends__default['default']({}, newProps); // Removes sameProps and reserved props from newProps


  keys = Object.keys(filteredProps);

  for (i = 0; i < keys.length; i++) {
    if (toFilter.indexOf(keys[i]) > -1) {
      delete filteredProps[keys[i]];
    }
  } // Add left-overs as undefined props so they can be removed


  keys = Object.keys(leftOvers);

  for (i = 0; i < keys.length; i++) {
    if (keys[i] !== 'children') {
      filteredProps[keys[i]] = undefined;
    }
  }

  var filteredPropsEntries = Object.entries(filteredProps);

  if (filteredPropsEntries.length > 0) {
    filteredPropsEntries.forEach(function (_ref) {
      var key = _ref[0],
          value = _ref[1];

      if (!handlers.includes(key)) {
        var _instance$__container, _instance$__container2;

        var root = instance;
        var target = root[key];

        if (key.includes('-')) {
          var entries = key.split('-');
          target = entries.reduce(function (acc, key) {
            return acc[key];
          }, instance); // If the target is atomic, it forces us to switch the root

          if (!(target && target.set)) {
            var _entries$reverse = entries.reverse(),
                _name = _entries$reverse[0],
                reverseEntries = _entries$reverse.slice(1);

            root = reverseEntries.reverse().reduce(function (acc, key) {
              return acc[key];
            }, instance);
            key = _name;
          }
        } // Special treatment for objects with support for set/copy


        var isColorManagement = (_instance$__container = instance.__container) == null ? void 0 : (_instance$__container2 = _instance$__container.__state) == null ? void 0 : _instance$__container2.current.colorManagement;

        if (target && target.set && (target.copy || target instanceof THREE.Layers)) {
          // If value is an array it has got to be the set function
          if (Array.isArray(value)) {
            var _target;

            (_target = target).set.apply(_target, value);
          } // Test again target.copy(class) next ...
          else if (target.copy && value && value.constructor && target.constructor.name === value.constructor.name) {
              target.copy(value);
            } // If nothing else fits, just set the single value, ignore undefined
            // https://github.com/react-spring/react-three-fiber/issues/274
            else if (value !== undefined) {
                target.set(value); // Auto-convert sRGB colors, for now ...
                // https://github.com/react-spring/react-three-fiber/issues/344

                if (isColorManagement && target instanceof THREE.Color) {
                  target.convertSRGBToLinear();
                }
              } // Else, just overwrite the value

        } else {
          root[key] = value; // Auto-convert sRGB textures, for now ...
          // https://github.com/react-spring/react-three-fiber/issues/344

          if (isColorManagement && root[key] instanceof THREE.Texture) {
            root[key].encoding = THREE.sRGBEncoding;
          }
        }

        invalidateInstance(instance);
      }
    }); // Preemptively delete the instance from the containers interaction

    if (accumulative && container && instance.raycast && instance.__handlers) {
      instance.__handlers = undefined;

      var index = container.__interaction.indexOf(instance);

      if (index > -1) container.__interaction.splice(index, 1);
    } // Prep interaction handlers


    if (handlers.length) {
      if (accumulative && container && instance.raycast) container.__interaction.push(instance); // Add handlers to the instances handler-map

      instance.__handlers = handlers.reduce(function (acc, key) {
        acc[key.charAt(2).toLowerCase() + key.substr(3)] = newProps[key];
        return acc;
      }, {});
    } // Call the update lifecycle when it is being updated, but only when it is part of the scene


    if (instance.parent) updateInstance(instance);
  }
}

function invalidateInstance(instance) {
  if (instance.__container && instance.__container.__state) invalidate(instance.__container.__state);
}

function updateInstance(instance) {
  if (instance.onUpdate) instance.onUpdate(instance);
}

function createInstance(type, _ref2, container, hostContext, internalInstanceHandle) {
  var _ref2$args = _ref2.args,
      args = _ref2$args === void 0 ? [] : _ref2$args,
      props = _objectWithoutPropertiesLoose__default['default'](_ref2, ["args"]);

  var name = "" + type[0].toUpperCase() + type.slice(1);
  var instance;

  if (type === 'primitive') {
    // Switch off dispose for primitive objects
    props = _extends__default['default']({
      dispose: null
    }, props);
    instance = props.object;
    instance.__instance = true;
    instance.__dispose = instance.dispose;
  } else {
    var target = catalogue[name] || THREE__namespace[name];

    if (!target) {
      throw "\"" + name + "\" is not part of the THREE namespace! Did you forget to extend it? See: https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md#using-3rd-party-objects-declaratively";
    }

    instance = is.arr(args) ? _construct__default['default'](target, args) : new target(args);
  } // Bind to the root container in case portals are being used
  // This is perhaps better for event management as we can keep them on a single instance


  while (container.__container) {
    container = container.__container;
  } // TODO: https://github.com/facebook/react/issues/17147
  // If it's still not there it means the portal was created on a virtual node outside of react


  if (!roots.has(container)) {
    var fn = function fn(node) {
      if (!node["return"]) return node.stateNode && node.stateNode.containerInfo;else return fn(node["return"]);
    };

    container = fn(internalInstanceHandle);
  } // Apply initial props


  instance.__objects = [];
  instance.__container = container; // Auto-attach geometries and materials

  if (name.endsWith('Geometry')) {
    props = _extends__default['default']({
      attach: 'geometry'
    }, props);
  } else if (name.endsWith('Material')) {
    props = _extends__default['default']({
      attach: 'material'
    }, props);
  } // It should NOT call onUpdate on object instanciation, because it hasn't been added to the
  // view yet. If the callback relies on references for instance, they won't be ready yet, this is
  // why it passes "true" here


  applyProps(instance, props, {});
  return instance;
}

function appendChild(parentInstance, child) {
  if (child) {
    if (child.isObject3D) {
      parentInstance.add(child);
    } else {
      parentInstance.__objects.push(child);

      child.parent = parentInstance; // The attach attribute implies that the object attaches itself on the parent

      if (child.attachArray) {
        if (!is.arr(parentInstance[child.attachArray])) parentInstance[child.attachArray] = [];
        parentInstance[child.attachArray].push(child);
      } else if (child.attachObject) {
        if (!is.obj(parentInstance[child.attachObject[0]])) parentInstance[child.attachObject[0]] = {};
        parentInstance[child.attachObject[0]][child.attachObject[1]] = child;
      } else if (child.attach) {
        parentInstance[child.attach] = child;
      }
    }

    updateInstance(child);
    invalidateInstance(child);
  }
}

function insertBefore(parentInstance, child, beforeChild) {
  if (child) {
    if (child.isObject3D) {
      child.parent = parentInstance;
      child.dispatchEvent({
        type: 'added'
      });
      var restSiblings = parentInstance.children.filter(function (sibling) {
        return sibling !== child;
      }); // TODO: the order is out of whack if data objects are present, has to be recalculated

      var index = restSiblings.indexOf(beforeChild);
      parentInstance.children = [].concat(restSiblings.slice(0, index), [child], restSiblings.slice(index));
      updateInstance(child);
    } else {
      appendChild(parentInstance, child);
    } // TODO: order!!!


    invalidateInstance(child);
  }
}

function removeRecursive(array, parent, clone) {
  if (clone === void 0) {
    clone = false;
  }

  if (array) {
    // Three uses splice op's internally we may have to shallow-clone the array in order to safely remove items
    var target = clone ? [].concat(array) : array;
    target.forEach(function (child) {
      return removeChild(parent, child);
    });
  }
}

function removeChild(parentInstance, child) {
  if (child) {
    if (child.isObject3D) {
      parentInstance.remove(child);
    } else {
      child.parent = null;
      if (parentInstance.__objects) parentInstance.__objects = parentInstance.__objects.filter(function (x) {
        return x !== child;
      }); // Remove attachment

      if (child.attachArray) {
        parentInstance[child.attachArray] = parentInstance[child.attachArray].filter(function (x) {
          return x !== child;
        });
      } else if (child.attachObject) {
        delete parentInstance[child.attachObject[0]][child.attachObject[1]];
      } else if (child.attach) {
        parentInstance[child.attach] = null;
      }
    } // Remove interactivity


    if (child.__container) child.__container.__interaction = child.__container.__interaction.filter(function (x) {
      return x !== child;
    });
    invalidateInstance(child); // Allow objects to bail out of recursive dispose alltogether by passing dispose={null}

    if (child.dispose !== null) {
      scheduler.unstable_runWithPriority(scheduler.unstable_IdlePriority, function () {
        // Remove nested child objects
        removeRecursive(child.__objects, child);
        removeRecursive(child.children, child, true); // Dispose item

        if (child.dispose && child.type !== 'Scene') child.dispose();else if (child.__dispose) child.__dispose(); // Remove references

        delete child.__container;
        delete child.__objects;
      });
    }
  }
}

function switchInstance(instance, type, newProps, fiber) {
  var parent = instance.parent;
  var newInstance = createInstance(type, newProps, instance.__container, null, fiber);
  removeChild(parent, instance);
  appendChild(parent, newInstance) // This evil hack switches the react-internal fiber node
  // https://github.com/facebook/react/issues/14983
  // https://github.com/facebook/react/pull/15021
  ;
  [fiber, fiber.alternate].forEach(function (fiber) {
    if (fiber !== null) {
      fiber.stateNode = newInstance;

      if (fiber.ref) {
        if (is.fun(fiber.ref)) fiber.ref(newInstance);else fiber.ref.current = newInstance;
      }
    }
  });
}

var Renderer = Reconciler__default['default']({
  now: scheduler.unstable_now,
  createInstance: createInstance,
  removeChild: removeChild,
  appendChild: appendChild,
  insertBefore: insertBefore,
  warnsIfNotActing: true,
  supportsMutation: true,
  isPrimaryRenderer: false,
  scheduleTimeout: is.fun(setTimeout) ? setTimeout : undefined,
  cancelTimeout: is.fun(clearTimeout) ? clearTimeout : undefined,
  // @ts-ignore
  setTimeout: is.fun(setTimeout) ? setTimeout : undefined,
  // @ts-ignore
  clearTimeout: is.fun(clearTimeout) ? clearTimeout : undefined,
  noTimeout: -1,
  appendInitialChild: appendChild,
  appendChildToContainer: appendChild,
  removeChildFromContainer: removeChild,
  insertInContainerBefore: insertBefore,
  commitUpdate: function commitUpdate(instance, updatePayload, type, oldProps, newProps, fiber) {
    if (instance.__instance && newProps.object && newProps.object !== instance) {
      // <instance object={...} /> where the object reference has changed
      switchInstance(instance, type, newProps, fiber);
    } else {
      // This is a data object, let's extract critical information about it
      var _newProps$args = newProps.args,
          argsNew = _newProps$args === void 0 ? [] : _newProps$args,
          restNew = _objectWithoutPropertiesLoose__default['default'](newProps, ["args"]);

      var _oldProps$args = oldProps.args,
          argsOld = _oldProps$args === void 0 ? [] : _oldProps$args,
          restOld = _objectWithoutPropertiesLoose__default['default'](oldProps, ["args"]); // If it has new props or arguments, then it needs to be re-instanciated


      var hasNewArgs = argsNew.some(function (value, index) {
        return is.obj(value) ? Object.entries(value).some(function (_ref3) {
          var key = _ref3[0],
              val = _ref3[1];
          return val !== argsOld[index][key];
        }) : value !== argsOld[index];
      });

      if (hasNewArgs) {
        // Next we create a new instance and append it again
        switchInstance(instance, type, newProps, fiber);
      } else {
        // Otherwise just overwrite props
        applyProps(instance, restNew, restOld, true);
      }
    }
  },
  hideInstance: function hideInstance(instance) {
    if (instance.isObject3D) {
      instance.visible = false;
      invalidateInstance(instance);
    }
  },
  unhideInstance: function unhideInstance(instance, props) {
    if (instance.isObject3D && props.visible == null || props.visible) {
      instance.visible = true;
      invalidateInstance(instance);
    }
  },
  hideTextInstance: function hideTextInstance() {
    throw new Error('Text is not allowed in the react-three-fibre tree. You may have extraneous whitespace between components.');
  },
  getPublicInstance: function getPublicInstance(instance) {
    return instance;
  },
  getRootHostContext: function getRootHostContext() {
    return emptyObject;
  },
  getChildHostContext: function getChildHostContext() {
    return emptyObject;
  },
  createTextInstance: function createTextInstance() {},
  finalizeInitialChildren: function finalizeInitialChildren(instance) {
    // https://github.com/facebook/react/issues/20271
    // Returning true will trigger commitMount
    return instance.__handlers;
  },
  commitMount: function commitMount(instance)
  /*, type, props*/
  {
    // https://github.com/facebook/react/issues/20271
    // This will make sure events are only added once to the central container
    var container = instance.__container;
    if (container && instance.raycast && instance.__handlers) container.__interaction.push(instance);
  },
  prepareUpdate: function prepareUpdate() {
    return emptyObject;
  },
  shouldDeprioritizeSubtree: function shouldDeprioritizeSubtree() {
    return false;
  },
  prepareForCommit: function prepareForCommit() {
    return null;
  },
  preparePortalMount: function preparePortalMount() {
    return null;
  },
  resetAfterCommit: function resetAfterCommit() {},
  shouldSetTextContent: function shouldSetTextContent() {
    return false;
  },
  clearContainer: function clearContainer() {
    return false;
  }
});
var hasSymbol = is.fun(Symbol) && Symbol["for"];
var REACT_PORTAL_TYPE = hasSymbol ? Symbol["for"]('react.portal') : 0xeaca;
function render(element, container, state) {
  var root = roots.get(container);

  if (!root) {
    container.__state = state; // @ts-ignore

    var newRoot = root = Renderer.createContainer(container, state !== undefined && state.current.concurrent ? 2 : 0, false, // @ts-ignore
    null);
    roots.set(container, newRoot);
  }

  Renderer.updateContainer(element, root, null, function () {
    return undefined;
  });
  return Renderer.getPublicRootInstance(root);
}
function unmountComponentAtNode(container, callback) {
  var root = roots.get(container);

  if (root) {
    Renderer.updateContainer(null, root, null, function () {
      roots["delete"](container);
      if (callback) callback(container);
    });
  }
}
function createPortal(children, containerInfo, implementation, key) {
  if (key === void 0) {
    key = null;
  }

  if (!containerInfo.__objects) containerInfo.__objects = [];
  return {
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : '' + key,
    children: children,
    containerInfo: containerInfo,
    implementation: implementation
  };
}
Renderer.injectIntoDevTools({
  bundleType: process.env.NODE_ENV === 'production' ? 0 : 1,
  //@ts-ignore
  findHostInstanceByFiber: function findHostInstanceByFiber() {
    return null;
  },
  version: version,
  rendererPackageName: name
});

var threeTypes = /*#__PURE__*/Object.freeze({
  __proto__: null
});

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function isOrthographicCamera(def) {
  return def.isOrthographicCamera;
}

function makeId(event) {
  return (event.eventObject || event.object).uuid + '/' + event.index;
}

var stateContext = /*#__PURE__*/React.createContext({});
var useCanvas = function useCanvas(props) {
  var children = props.children,
      gl = props.gl,
      camera = props.camera,
      orthographic = props.orthographic,
      raycaster = props.raycaster,
      size = props.size,
      pixelRatio = props.pixelRatio,
      _props$vr = props.vr,
      vr = _props$vr === void 0 ? false : _props$vr,
      _props$concurrent = props.concurrent,
      concurrent = _props$concurrent === void 0 ? false : _props$concurrent,
      _props$shadowMap = props.shadowMap,
      shadowMap = _props$shadowMap === void 0 ? false : _props$shadowMap,
      _props$colorManagemen = props.colorManagement,
      colorManagement = _props$colorManagemen === void 0 ? true : _props$colorManagemen,
      _props$invalidateFram = props.invalidateFrameloop,
      invalidateFrameloop = _props$invalidateFram === void 0 ? false : _props$invalidateFram,
      _props$updateDefaultC = props.updateDefaultCamera,
      updateDefaultCamera = _props$updateDefaultC === void 0 ? true : _props$updateDefaultC,
      _props$noEvents = props.noEvents,
      noEvents = _props$noEvents === void 0 ? false : _props$noEvents,
      onCreated = props.onCreated,
      onPointerMissed = props.onPointerMissed,
      forceResize = props.forceResize; // Local, reactive state

  var _React$useState = React.useState(false),
      ready = _React$useState[0],
      setReady = _React$useState[1];

  var _React$useState2 = React.useState(function () {
    return new THREE.Vector2();
  }),
      mouse = _React$useState2[0];

  var _React$useState3 = React.useState(function () {
    var ray = new THREE.Raycaster();

    if (raycaster) {
      var filter = raycaster.filter,
          computeOffsets = raycaster.computeOffsets,
          raycasterProps = _objectWithoutPropertiesLoose__default['default'](raycaster, ["filter", "computeOffsets"]);

      applyProps(ray, raycasterProps, {});
    }

    return ray;
  }),
      defaultRaycaster = _React$useState3[0];

  var _React$useState4 = React.useState(function () {
    var scene = new THREE.Scene();
    scene.__interaction = [];
    scene.__objects = [];
    return scene;
  }),
      defaultScene = _React$useState4[0];

  var _React$useState5 = React.useState(function () {
    var cam = orthographic ? new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 1000) : new THREE.PerspectiveCamera(75, 0, 0.1, 1000);
    cam.position.z = 5;
    if (camera) applyProps(cam, camera, {}); // Always look at [0, 0, 0]

    cam.lookAt(0, 0, 0);
    return cam;
  }),
      defaultCam = _React$useState5[0],
      _setDefaultCamera = _React$useState5[1];

  var _React$useState6 = React.useState(function () {
    return new THREE.Clock();
  }),
      clock = _React$useState6[0]; // Public state


  var state = React.useRef({
    ready: false,
    active: true,
    manual: 0,
    colorManagement: colorManagement,
    vr: vr,
    concurrent: concurrent,
    noEvents: noEvents,
    invalidateFrameloop: false,
    frames: 0,
    aspect: 0,
    subscribers: [],
    camera: defaultCam,
    scene: defaultScene,
    raycaster: defaultRaycaster,
    mouse: mouse,
    clock: clock,
    gl: gl,
    size: size,
    viewport: null,
    initialClick: [0, 0],
    initialHits: [],
    pointer: new tinyEmitter.TinyEmitter(),
    captured: undefined,
    events: undefined,
    subscribe: function subscribe(ref, priority) {
      if (priority === void 0) {
        priority = 0;
      }

      // If this subscription was given a priority, it takes rendering into its own hands
      // For that reason we switch off automatic rendering and increase the manual flag
      // As long as this flag is positive (there could be multiple render subscription)
      // ..there can be no internal rendering at all
      if (priority) state.current.manual++;
      state.current.subscribers.push({
        ref: ref,
        priority: priority
      }); // Sort layers from lowest to highest, meaning, highest priority renders last (on top of the other frames)

      state.current.subscribers = state.current.subscribers.sort(function (a, b) {
        return a.priority - b.priority;
      });
      return function () {
        var _state$current;

        if ((_state$current = state.current) == null ? void 0 : _state$current.subscribers) {
          // Decrease manual flag if this subscription had a priority
          if (priority) state.current.manual--;
          state.current.subscribers = state.current.subscribers.filter(function (s) {
            return s.ref !== ref;
          });
        }
      };
    },
    setDefaultCamera: function setDefaultCamera(camera) {
      return _setDefaultCamera(camera);
    },
    invalidate: function invalidate$1() {
      return invalidate(state);
    },
    intersect: function intersect(event, prepare) {
      if (event === void 0) {
        event = {};
      }

      if (prepare === void 0) {
        prepare = true;
      }

      return handlePointerMove(event, prepare);
    },
    forceResize: forceResize
  });
  var position = new THREE.Vector3();
  var getCurrentViewport = React.useCallback(function (camera, target) {
    if (camera === void 0) {
      camera = state.current.camera;
    }

    if (target === void 0) {
      target = new THREE.Vector3(0, 0, 0);
    }

    var _state$current$size = state.current.size,
        width = _state$current$size.width,
        height = _state$current$size.height;
    var distance = camera.getWorldPosition(position).distanceTo(target);

    if (isOrthographicCamera(camera)) {
      return {
        width: width / camera.zoom,
        height: height / camera.zoom,
        factor: 1,
        distance: distance
      };
    } else {
      var fov = camera.fov * Math.PI / 180; // convert vertical fov to radians

      var h = 2 * Math.tan(fov / 2) * distance; // visible height

      var w = h * (width / height);
      return {
        width: w,
        height: h,
        factor: width / w,
        distance: distance
      };
    }
  }, []); // Writes locals into public state for distribution among subscribers, context, etc

  React.useMemo(function () {
    state.current.ready = ready;
    state.current.size = size;
    state.current.camera = defaultCam;
    state.current.invalidateFrameloop = invalidateFrameloop;
    state.current.vr = vr;
    state.current.gl = gl;
    state.current.concurrent = concurrent;
    state.current.noEvents = noEvents; // Make viewport backwards compatible

    state.current.viewport = getCurrentViewport; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidateFrameloop, vr, concurrent, noEvents, ready, size, defaultCam, gl]); // Adjusts default camera

  React.useMemo(function () {
    state.current.aspect = size.width / size.height; // Assign viewport props to the function

    Object.assign(state.current.viewport, getCurrentViewport()); // https://github.com/drcmda/react-three-fiber/issues/92
    // Sometimes automatic default camera adjustment isn't wanted behaviour

    if (updateDefaultCamera) {
      if (isOrthographicCamera(defaultCam)) {
        defaultCam.left = size.width / -2;
        defaultCam.right = size.width / 2;
        defaultCam.top = size.height / 2;
        defaultCam.bottom = size.height / -2;
      } else {
        defaultCam.aspect = state.current.aspect;
      }

      defaultCam.updateProjectionMatrix(); // https://github.com/react-spring/react-three-fiber/issues/178
      // Update matrix world since the renderer is a frame late

      defaultCam.updateMatrixWorld();
    }

    gl.setSize(size.width, size.height);
    if (ready) invalidate(state); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCam, gl, size, updateDefaultCamera, ready]); // Only trigger the context provider when necessary

  var sharedState = React.useRef(null);
  React.useMemo(function () {
    var _state$current2 = state.current,
        ready = _state$current2.ready,
        manual = _state$current2.manual,
        vr = _state$current2.vr,
        noEvents = _state$current2.noEvents,
        invalidateFrameloop = _state$current2.invalidateFrameloop,
        frames = _state$current2.frames,
        subscribers = _state$current2.subscribers,
        captured = _state$current2.captured,
        initialClick = _state$current2.initialClick,
        initialHits = _state$current2.initialHits,
        props = _objectWithoutPropertiesLoose__default['default'](_state$current2, ["ready", "manual", "vr", "noEvents", "invalidateFrameloop", "frames", "subscribers", "captured", "initialClick", "initialHits"]);

    sharedState.current = props; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, defaultCam]); // Update pixel ratio

  React.useLayoutEffect(function () {
    if (pixelRatio) {
      if (Array.isArray(pixelRatio)) gl.setPixelRatio(Math.max(Math.min(pixelRatio[0], window.devicePixelRatio), pixelRatio[1]));else gl.setPixelRatio(pixelRatio);
    }
  }, [gl, pixelRatio]); // Update shadow map

  React.useLayoutEffect(function () {
    if (shadowMap) {
      gl.shadowMap.enabled = true;
      if (typeof shadowMap === 'object') Object.assign(gl.shadowMap, shadowMap);else gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    if (colorManagement) {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.outputEncoding = THREE.sRGBEncoding;
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [shadowMap, colorManagement]);
  /** Events ------------------------------------------------------------------------------------------------ */

  var hovered = React.useMemo(function () {
    return new Map();
  }, []);
  var temp = new THREE.Vector3();
  /** Sets up defaultRaycaster */

  var prepareRay = React.useCallback(function (event) {
    // https://github.com/pmndrs/react-three-fiber/pull/782
    // Events trigger outside of canvas when moved
    var offsets = (raycaster == null ? void 0 : raycaster.computeOffsets == null ? void 0 : raycaster.computeOffsets(event, sharedState.current)) || event.nativeEvent;

    if (offsets) {
      var offsetX = offsets.offsetX,
          offsetY = offsets.offsetY;
      var _state$current$size2 = state.current.size,
          width = _state$current$size2.width,
          height = _state$current$size2.height;
      mouse.set(offsetX / width * 2 - 1, -(offsetY / height) * 2 + 1);
      defaultRaycaster.setFromCamera(mouse, state.current.camera);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);
  /** Intersects interaction objects using the event input */

  var intersect = React.useCallback(function (filter) {
    // Skip event handling when noEvents is set
    if (state.current.noEvents) return [];
    var seen = new Set();
    var hits = []; // Allow callers to eliminate event objects

    var eventsObjects = filter ? filter(state.current.scene.__interaction) : state.current.scene.__interaction; // Intersect known handler objects and filter against duplicates

    var intersects = defaultRaycaster.intersectObjects(eventsObjects, true).filter(function (item) {
      var id = makeId(item);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    }); // https://github.com/mrdoob/three.js/issues/16031
    // Allow custom userland intersect sort order

    if (raycaster && raycaster.filter && sharedState.current) {
      intersects = raycaster.filter(intersects, sharedState.current);
    }

    for (var _iterator = _createForOfIteratorHelperLoose(intersects), _step; !(_step = _iterator()).done;) {
      var _intersect = _step.value;
      var eventObject = _intersect.object; // Bubble event up

      while (eventObject) {
        var handlers = eventObject.__handlers;
        if (handlers) hits.push(_extends__default['default']({}, _intersect, {
          eventObject: eventObject
        }));
        eventObject = eventObject.parent;
      }
    }

    return hits;
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
  /**  Calculates click deltas */

  var calculateDistance = React.useCallback(function (event) {
    var dx = event.nativeEvent.offsetX - state.current.initialClick[0];
    var dy = event.nativeEvent.offsetY - state.current.initialClick[1];
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  }, []);
  var handlePointerCancel = React.useCallback(function (event, hits, prepare) {
    if (prepare === void 0) {
      prepare = true;
    }

    state.current.pointer.emit('pointerCancel', event);
    if (prepare) prepareRay(event);
    Array.from(hovered.values()).forEach(function (hoveredObj) {
      // When no objects were hit or the the hovered object wasn't found underneath the cursor
      // we call onPointerOut and delete the object from the hovered-elements map
      if (hits && (!hits.length || !hits.find(function (hit) {
        return hit.object === hoveredObj.object && hit.index === hoveredObj.index;
      }))) {
        var eventObject = hoveredObj.eventObject;
        var handlers = eventObject.__handlers;
        hovered["delete"](makeId(hoveredObj));

        if (handlers) {
          // Clear out intersects, they are outdated by now
          var data = _extends__default['default']({}, hoveredObj, {
            intersections: hits || []
          });

          if (handlers.pointerOut) handlers.pointerOut(_extends__default['default']({}, data, {
            type: 'pointerout'
          }));
          if (handlers.pointerLeave) handlers.pointerLeave(_extends__default['default']({}, data, {
            type: 'pointerleave'
          }));
        }
      }
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**  Creates filtered intersects and returns an array of positive hits */

  var getIntersects = React.useCallback(function (event, filter) {
    // Get fresh intersects
    var intersections = intersect(filter); // If the interaction is captured take that into account, the captured event has to be part of the intersects

    if (state.current.captured && event.type !== 'click' && event.type !== 'wheel') {
      state.current.captured.forEach(function (captured) {
        if (!intersections.find(function (hit) {
          return hit.eventObject === captured.eventObject;
        })) intersections.push(captured);
      });
    }

    return intersections;
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
  /**  Handles intersections by forwarding them to handlers */

  var handleIntersects = React.useCallback(function (intersections, event, fn) {
    // If anything has been found, forward it to the event listeners
    if (intersections.length) {
      (function () {
        var unprojectedPoint = temp.set(mouse.x, mouse.y, 0).unproject(state.current.camera);
        var delta = event.type === 'click' ? calculateDistance(event) : 0;

        var releasePointerCapture = function releasePointerCapture(id) {
          return event.target.releasePointerCapture(id);
        };

        var localState = {
          stopped: false,
          captured: false
        };

        var _loop = function _loop() {
          var hit = _step2.value;

          var setPointerCapture = function setPointerCapture(id) {
            // If the hit is going to be captured flag that we're in captured state
            if (!localState.captured) {
              localState.captured = true; // The captured hit array is reset to collect hits

              state.current.captured = [];
            } // Push hits to the array


            if (state.current.captured) {
              state.current.captured.push(hit);
            } // Call the original event now
            event.target.setPointerCapture(id);
          };

          var raycastEvent = _extends__default['default']({}, event, hit, {
            intersections: intersections,
            stopped: localState.stopped,
            delta: delta,
            unprojectedPoint: unprojectedPoint,
            ray: defaultRaycaster.ray,
            camera: state.current.camera,
            // Hijack stopPropagation, which just sets a flag
            stopPropagation: function stopPropagation() {
              // https://github.com/react-spring/react-three-fiber/issues/596
              // Events are not allowed to stop propagation if the pointer has been captured
              var cap = state.current.captured;

              if (!cap || cap.find(function (h) {
                return h.eventObject.id === hit.eventObject.id;
              })) {
                raycastEvent.stopped = localState.stopped = true; // Propagation is stopped, remove all other hover records
                // An event handler is only allowed to flush other handlers if it is hovered itself

                if (hovered.size && Array.from(hovered.values()).find(function (i) {
                  return i.eventObject === hit.eventObject;
                })) {
                  // Objects cannot flush out higher up objects that have already caught the event
                  var higher = intersections.slice(0, intersections.indexOf(hit));
                  handlePointerCancel(raycastEvent, [].concat(higher, [hit]));
                }
              }
            },
            target: _extends__default['default']({}, event.target, {
              setPointerCapture: setPointerCapture,
              releasePointerCapture: releasePointerCapture
            }),
            currentTarget: _extends__default['default']({}, event.currentTarget, {
              setPointerCapture: setPointerCapture,
              releasePointerCapture: releasePointerCapture
            }),
            sourceEvent: event
          });

          fn(raycastEvent); // Event bubbling may be interrupted by stopPropagation

          if (localState.stopped === true) return "break";
        };

        for (var _iterator2 = _createForOfIteratorHelperLoose(intersections), _step2; !(_step2 = _iterator2()).done;) {
          var _ret = _loop();

          if (_ret === "break") break;
        }
      })();
    }

    return intersections;
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
  var handlePointerMove = React.useCallback(function (event, prepare) {
    if (prepare === void 0) {
      prepare = true;
    }

    state.current.pointer.emit('pointerMove', event);
    if (prepare) prepareRay(event);
    var hits = getIntersects(event, // This is onPointerMove, we're only interested in events that exhibit this particular event
    function (objects) {
      return objects.filter(function (obj) {
        return ['Move', 'Over', 'Enter', 'Out', 'Leave'].some(function (name) {
          return obj.__handlers['pointer' + name];
        });
      });
    }); // Take care of unhover

    handlePointerCancel(event, hits);
    handleIntersects(hits, event, function (data) {
      var eventObject = data.eventObject;
      var handlers = eventObject.__handlers; // Check presence of handlers

      if (!handlers) return; // Check if mouse enter or out is present

      if (handlers.pointerOver || handlers.pointerEnter || handlers.pointerOut || handlers.pointerLeave) {
        var id = makeId(data);
        var hoveredItem = hovered.get(id);

        if (!hoveredItem) {
          // If the object wasn't previously hovered, book it and call its handler
          hovered.set(id, data);
          if (handlers.pointerOver) handlers.pointerOver(_extends__default['default']({}, data, {
            type: 'pointerover'
          }));
          if (handlers.pointerEnter) handlers.pointerEnter(_extends__default['default']({}, data, {
            type: 'pointerenter'
          }));
        } else if (hoveredItem.stopped) {
          // If the object was previously hovered and stopped, we shouldn't allow other items to proceed
          data.stopPropagation();
        }
      } // Call mouse move


      if (handlers.pointerMove) handlers.pointerMove(data);
    });
    return hits; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  var handlePointer = React.useCallback(function (name) {
    return function (event, prepare) {
      if (prepare === void 0) {
        prepare = true;
      }

      state.current.pointer.emit(name, event);
      if (prepare) prepareRay(event);
      var hits = getIntersects(event);
      handleIntersects(hits, event, function (data) {
        var eventObject = data.eventObject;
        var handlers = eventObject.__handlers;

        if (handlers && handlers[name]) {
          // Forward all events back to their respective handlers with the exception of click events,
          // which must use the initial target
          if (name !== 'click' && name !== 'contextMenu' && name !== 'doubleClick' || state.current.initialHits.includes(eventObject)) {
            handlers[name](data);
            pointerMissed(event, defaultScene.__interaction, function (object) {
              return object !== eventObject;
            });
          }
        }
      }); // If a click yields no results, pass it back to the user as a miss

      if (name === 'pointerDown') {
        state.current.initialClick = [event.nativeEvent.offsetX, event.nativeEvent.offsetY];
        state.current.initialHits = hits.map(function (hit) {
          return hit.eventObject;
        });
      }

      if ((name === 'click' || name === 'contextMenu' || name === 'doubleClick') && !hits.length) {
        if (calculateDistance(event) <= 2) {
          pointerMissed(event, defaultScene.__interaction);
          if (onPointerMissed) onPointerMissed();
        }
      }
    };
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [onPointerMissed, calculateDistance, getIntersects, handleIntersects, prepareRay]);
  React.useMemo(function () {
    state.current.events = {
      onClick: handlePointer('click'),
      onContextMenu: handlePointer('contextMenu'),
      onDoubleClick: handlePointer('doubleClick'),
      onWheel: handlePointer('wheel'),
      onPointerDown: handlePointer('pointerDown'),
      onPointerUp: handlePointer('pointerUp'),
      onPointerLeave: function onPointerLeave(e) {
        return handlePointerCancel(e, []);
      },
      onPointerMove: handlePointerMove,
      // onGotPointerCapture is not needed any longer because the behaviour is hacked into
      // the event itself (see handleIntersects). But in order for non-web targets to simulate
      // it we keep the legacy event, which simply flags all current intersects as captured
      onGotPointerCaptureLegacy: function onGotPointerCaptureLegacy(e) {
        return state.current.captured = intersect();
      },
      onLostPointerCapture: function onLostPointerCapture(e) {
        return state.current.captured = undefined, handlePointerCancel(e);
      }
    };
  }, [handlePointer, intersect, handlePointerCancel, handlePointerMove]);
  /** Events ------------------------------------------------------------------------------------------------- */
  // This component is a bridge into the three render context, when it gets rendered
  // we know we are ready to compile shaders, call subscribers, etc

  var Canvas = React.useCallback(function Canvas(props) {
    var activate = function activate() {
      return setReady(true);
    }; // Pre-compile all materials before rendering out the first time


    React.useLayoutEffect(function () {
      return void gl.compile(defaultScene, defaultCam);
    }, []);
    React.useEffect(function () {
      var result = onCreated && onCreated(state.current);
      if (result && result.then) result.then(activate);else activate();
    }, []);
    return props.children;
  }, // The Canvas component has to be static, it should not be re-created ever
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []); // Render v-dom into scene

  React.useLayoutEffect(function () {
    render( /*#__PURE__*/React.createElement(Canvas, null, /*#__PURE__*/React.createElement(stateContext.Provider, {
      value: sharedState.current
    }, typeof children === 'function' ? children(state.current) : children)), defaultScene, state); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, children, sharedState.current]);
  React.useLayoutEffect(function () {
    if (ready) {
      // Start render-loop, either via RAF or setAnimationLoop for VR
      if (!state.current.vr) {
        if (state.current.frames === 0) invalidate(state);
      } else if ((gl.xr || gl.vr) && gl.setAnimationLoop) {
        (gl.xr || gl.vr).enabled = true;
        gl.setAnimationLoop(function (t) {
          return renderGl(state, t, 0, true);
        });
      } else {
        console.warn('the gl instance does not support VR!');
      }
    }
  }, [gl, ready, invalidateFrameloop]); // Dispose renderer on unmount

  React.useEffect(function () {
    return function () {
      if (state.current.gl) {
        if (state.current.gl.renderLists) state.current.gl.renderLists.dispose();
        if (state.current.gl.forceContextLoss) state.current.gl.forceContextLoss();
        dispose(state.current.gl);
      }

      unmountComponentAtNode(state.current.scene, function () {
        dispose(state.current.raycaster);
        dispose(state.current.camera);
        dispose(state.current);
      });
    };
  }, []);
  return state.current.events;
};

function pointerMissed(event, objects, filter) {
  if (filter === void 0) {
    filter = function filter(object) {
      return true;
    };
  }

  objects.filter(filter).forEach(function (object) {
    var _handlers$pointerMis, _handlers;

    return (_handlers$pointerMis = (_handlers = object.__handlers).pointerMissed) == null ? void 0 : _handlers$pointerMis.call(_handlers, event);
  });
}

function dispose(obj) {
  if (obj.dispose && obj.type !== 'Scene') obj.dispose();

  for (var p in obj) {
    if (typeof p === 'object' && p.dispose) p.dispose();
    delete obj[p];
  }
}

function useContext(context) {
  var result = React.useContext(context);

  if (!('subscribe' in result)) {
    throw new Error("\u26A1\uFE0F react-three-fiber hooks can only be used within the Canvas component! https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md#hooks");
  }

  return result;
}

function useFrame(callback, renderPriority) {
  if (renderPriority === void 0) {
    renderPriority = 0;
  }

  var _useContext = useContext(stateContext),
      subscribe = _useContext.subscribe; // Update ref


  var ref = React.useRef(callback);
  React.useLayoutEffect(function () {
    return void (ref.current = callback);
  }, [callback]); // Subscribe/unsub

  React.useEffect(function () {
    var unsubscribe = subscribe(ref, renderPriority);
    return function () {
      return unsubscribe();
    };
  }, [renderPriority, subscribe]);
  return null;
}
function useThree() {
  return useContext(stateContext);
}
function useUpdate(callback, dependents, optionalRef) {
  var _useContext2 = useContext(stateContext),
      invalidate = _useContext2.invalidate;

  var localRef = React.useRef();
  var ref = optionalRef ? optionalRef : localRef;
  React.useLayoutEffect(function () {
    if (ref.current) {
      callback(ref.current);
      invalidate();
    }
  }, dependents); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
function useResource(optionalRef) {
  var _useState = React.useState(false),
      _ = _useState[0],
      forceUpdate = _useState[1];

  var localRef = React.useRef(undefined);
  var ref = optionalRef ? optionalRef : localRef;
  React.useLayoutEffect(function () {
    return void forceUpdate(function (i) {
      return !i;
    });
  }, []);
  return ref;
}

function buildGraph(object) {
  var data = {
    nodes: {},
    materials: {}
  };

  if (object) {
    object.traverse(function (obj) {
      if (obj.name) data.nodes[obj.name] = obj;
      if (obj.material && !data.materials[obj.material.name]) data.materials[obj.material.name] = obj.material;
    });
  }

  return data;
}

function useGraph(object) {
  return React.useMemo(function () {
    return buildGraph(object);
  }, [object]);
}

function loadingFn(extensions, onProgress) {
  return function (Proto) {
    // Construct new loader and run extensions
    var loader = new Proto();
    if (extensions) extensions(loader); // Go through the urls and load them

    for (var _len = arguments.length, input = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      input[_key - 1] = arguments[_key];
    }

    return Promise.all(input.map(function (input) {
      return new Promise(function (res, reject) {
        return loader.load(input, function (data) {
          if (data.scene) Object.assign(data, buildGraph(data.scene));
          res(data);
        }, onProgress, function (error) {
          var _error$message;

          return reject((_error$message = error.message) != null ? _error$message : "failure loading " + input);
        });
      });
    }));
  };
}

function useLoader(Proto, input, extensions, onProgress) {
  // Use suspense to load async assets
  var keys = Array.isArray(input) ? input : [input];
  var results = useAsset.useAsset.apply(void 0, [loadingFn(extensions, onProgress), Proto].concat(keys)); // Return the object/s

  return Array.isArray(input) ? results : results[0];
}

useLoader.preload = function (Proto, input, extensions) {
  var keys = Array.isArray(input) ? input : [input];
  return useAsset.useAsset.preload.apply(useAsset.useAsset, [loadingFn(extensions), Proto].concat(keys));
};

var defaultStyles = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden'
};

function Content(_ref) {
  var children = _ref.children,
      setEvents = _ref.setEvents,
      container = _ref.container,
      renderer = _ref.renderer,
      effects = _ref.effects,
      props = _objectWithoutPropertiesLoose__default['default'](_ref, ["children", "setEvents", "container", "renderer", "effects"]);

  // Create renderer
  var _useState = React.useState(renderer),
      gl = _useState[0];

  if (!gl) console.warn('No renderer created!'); // Mount and unmount management

  React.useEffect(function () {
    if (effects) effects(gl, container);
  }, [container, effects, gl]); // Init canvas, fetch events, hand them back to the wrapping div

  var events = useCanvas(_extends__default['default']({}, props, {
    children: children,
    gl: gl
  }));
  React.useEffect(function () {
    setEvents(events);
  }, [events, setEvents]);
  return null;
}

var ResizeContainer = /*#__PURE__*/React__default['default'].memo(function ResizeContainer(props) {
  var renderer = props.renderer,
      effects = props.effects,
      children = props.children,
      vr = props.vr,
      webgl1 = props.webgl1,
      concurrent = props.concurrent,
      shadowMap = props.shadowMap,
      colorManagement = props.colorManagement,
      orthographic = props.orthographic,
      invalidateFrameloop = props.invalidateFrameloop,
      updateDefaultCamera = props.updateDefaultCamera,
      noEvents = props.noEvents,
      gl = props.gl,
      camera = props.camera,
      raycaster = props.raycaster,
      pixelRatio = props.pixelRatio,
      onCreated = props.onCreated,
      onPointerMissed = props.onPointerMissed,
      preRender = props.preRender,
      resize = props.resize,
      style = props.style,
      restSpread = _objectWithoutPropertiesLoose__default['default'](props, ["renderer", "effects", "children", "vr", "webgl1", "concurrent", "shadowMap", "colorManagement", "orthographic", "invalidateFrameloop", "updateDefaultCamera", "noEvents", "gl", "camera", "raycaster", "pixelRatio", "onCreated", "onPointerMissed", "preRender", "resize", "style"]);

  var containerRef = React.useRef(); // onGotPointerCaptureLegacy is a fake event used by non-web targets to simulate poinzter capture

  var _useState2 = React.useState({}),
      _useState2$ = _useState2[0],
      onGotPointerCaptureLegacy = _useState2$.onGotPointerCaptureLegacy,
      events = _objectWithoutPropertiesLoose__default['default'](_useState2$, ["onGotPointerCaptureLegacy"]),
      setEvents = _useState2[1];

  var _useMeasure = useMeasure__default['default'](_extends__default['default']({
    scroll: true,
    debounce: {
      scroll: 50,
      resize: 0
    }
  }, resize)),
      bind = _useMeasure[0],
      size = _useMeasure[1],
      forceResize = _useMeasure[2]; // Flag view ready once it's been measured out


  var readyFlag = React.useRef(false);
  var ready = React.useMemo(function () {
    return readyFlag.current = readyFlag.current || !!size.width && !!size.height;
  }, [size]);
  var state = React.useMemo(function () {
    return {
      size: size,
      forceResize: forceResize,
      setEvents: setEvents,
      container: containerRef.current
    };
  }, [forceResize, size]); // Allow Gatsby, Next and other server side apps to run. Will output styles to reduce flickering.

  if (typeof window === 'undefined') return /*#__PURE__*/React__default['default'].createElement("div", _extends__default['default']({
    style: _extends__default['default']({}, defaultStyles, style)
  }, restSpread), preRender); // Render the canvas into the dom

  return /*#__PURE__*/React__default['default'].createElement("div", _extends__default['default']({
    ref: mergeRefs__default['default']([bind, containerRef]),
    style: _extends__default['default']({}, defaultStyles, style)
  }, events, restSpread), preRender, ready && /*#__PURE__*/React__default['default'].createElement(Content, _extends__default['default']({}, props, state)));
});

var Canvas = /*#__PURE__*/React__default['default'].memo(function (_ref) {
  var children = _ref.children,
      props = _objectWithoutPropertiesLoose__default['default'](_ref, ["children"]);

  return /*#__PURE__*/React__default['default'].createElement(ResizeContainer, _extends__default['default']({}, props, {
    renderer: function renderer() {
      return new CSS3DRenderer.CSS3DRenderer();
    },
    effects: function effects(gl, el) {
      return el.appendChild(gl.domElement), function () {
        return el.removeChild(gl.domElement);
      };
    }
  }), children);
});

exports.Canvas = Canvas;
exports.ReactThreeFiber = threeTypes;
exports.Renderer = Renderer;
exports.addAfterEffect = addAfterEffect;
exports.addEffect = addEffect;
exports.addTail = addTail;
exports.applyProps = applyProps;
exports.createPortal = createPortal;
exports.extend = extend;
exports.forceResize = forceResize;
exports.invalidate = invalidate;
exports.isOrthographicCamera = isOrthographicCamera;
exports.render = render;
exports.renderGl = renderGl;
exports.stateContext = stateContext;
exports.unmountComponentAtNode = unmountComponentAtNode;
exports.useCanvas = useCanvas;
exports.useFrame = useFrame;
exports.useGraph = useGraph;
exports.useLoader = useLoader;
exports.useResource = useResource;
exports.useThree = useThree;
exports.useUpdate = useUpdate;