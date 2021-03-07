import _extends from '@babel/runtime/helpers/esm/extends';
import * as THREE from 'three';
import { Layers, Color, Texture, sRGBEncoding, Vector2, Raycaster, Scene, OrthographicCamera, PerspectiveCamera, Clock, Vector3, PCFSoftShadowMap, ACESFilmicToneMapping } from 'three';
import Reconciler from 'react-reconciler';
import { unstable_now, unstable_runWithPriority, unstable_IdlePriority } from 'scheduler';
import React, { createContext, useState, useRef, useCallback, useMemo, useLayoutEffect, useEffect, createElement, useContext as useContext$1 } from 'react';
import { TinyEmitter } from 'tiny-emitter';
import { useAsset } from 'use-asset';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import useMeasure from 'react-use-measure';
import mergeRefs from 'react-merge-refs';

var name = "react-three-fiber";
var version = "5.3.19";

const roots = new Map();
const emptyObject = {};
const is = {
  obj: a => a === Object(a) && !is.arr(a),
  fun: a => typeof a === 'function',
  str: a => typeof a === 'string',
  num: a => typeof a === 'number',
  und: a => a === void 0,
  arr: a => Array.isArray(a),

  equ(a, b) {
    // Wrong type or one of the two undefined, doesn't match
    if (typeof a !== typeof b || !!a !== !!b) return false; // Atomic, just compare a against b

    if (is.str(a) || is.num(a) || is.obj(a)) return a === b; // Array, shallow compare first to see if it's a match

    if (is.arr(a) && a == b) return true; // Last resort, go through keys

    let i;

    for (i in a) if (!(i in b)) return false;

    for (i in b) if (a[i] !== b[i]) return false;

    return is.und(i) ? a === b : true;
  }

};

function createSubs(callback, subs) {
  const index = subs.length;
  subs.push(callback);
  return () => void subs.splice(index, 1);
}

let globalEffects = [];
let globalAfterEffects = [];
let globalTailEffects = [];
const addEffect = callback => createSubs(callback, globalEffects);
const addAfterEffect = callback => createSubs(callback, globalAfterEffects);
const addTail = callback => createSubs(callback, globalTailEffects);
function renderGl(state, timestamp, repeat = 0, runGlobalEffects = false) {
  let i; // Run global effects

  if (runGlobalEffects) {
    for (i = 0; i < globalEffects.length; i++) {
      globalEffects[i](timestamp);
      repeat++;
    }
  } // Run local effects


  const delta = state.current.clock.getDelta();

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
let running = false;

function renderLoop(timestamp) {
  running = true;
  let repeat = 0;
  let i; // Run global effects

  for (i = 0; i < globalEffects.length; i++) {
    globalEffects[i](timestamp);
    repeat++;
  }

  roots.forEach(root => {
    const state = root.containerInfo.__state; // If the frameloop is invalidated, do not run another frame

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

function invalidate(state = true, frames = 1) {
  if (state === true) {
    roots.forEach(root => {
      const state = root.containerInfo.__state;
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
  roots.forEach(root => root.containerInfo.__state.current.forceResize());
}
let catalogue = {};
const extend = objects => void (catalogue = { ...catalogue,
  ...objects
});
function applyProps(instance, newProps, oldProps = {}, accumulative = false) {
  // Filter equals, events and reserved props
  const container = instance.__container;
  const sameProps = [];
  const handlers = [];
  let i;
  let keys = Object.keys(newProps);

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

  const leftOvers = [];
  keys = Object.keys(oldProps);

  if (accumulative) {
    for (i = 0; i < keys.length; i++) {
      if (newProps[keys[i]] === void 0) {
        leftOvers.push(keys[i]);
      }
    }
  }

  const toFilter = [...sameProps, 'children', 'key', 'ref']; // Instances use "object" as a reserved identifier

  if (instance.__instance) toFilter.push('object');
  const filteredProps = { ...newProps
  }; // Removes sameProps and reserved props from newProps

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

  const filteredPropsEntries = Object.entries(filteredProps);

  if (filteredPropsEntries.length > 0) {
    filteredPropsEntries.forEach(([key, value]) => {
      if (!handlers.includes(key)) {
        var _instance$__container, _instance$__container2;

        let root = instance;
        let target = root[key];

        if (key.includes('-')) {
          const entries = key.split('-');
          target = entries.reduce((acc, key) => acc[key], instance); // If the target is atomic, it forces us to switch the root

          if (!(target && target.set)) {
            const [name, ...reverseEntries] = entries.reverse();
            root = reverseEntries.reverse().reduce((acc, key) => acc[key], instance);
            key = name;
          }
        } // Special treatment for objects with support for set/copy


        const isColorManagement = (_instance$__container = instance.__container) == null ? void 0 : (_instance$__container2 = _instance$__container.__state) == null ? void 0 : _instance$__container2.current.colorManagement;

        if (target && target.set && (target.copy || target instanceof Layers)) {
          // If value is an array it has got to be the set function
          if (Array.isArray(value)) {
            target.set(...value);
          } // Test again target.copy(class) next ...
          else if (target.copy && value && value.constructor && target.constructor.name === value.constructor.name) {
              target.copy(value);
            } // If nothing else fits, just set the single value, ignore undefined
            // https://github.com/react-spring/react-three-fiber/issues/274
            else if (value !== undefined) {
                target.set(value); // Auto-convert sRGB colors, for now ...
                // https://github.com/react-spring/react-three-fiber/issues/344

                if (isColorManagement && target instanceof Color) {
                  target.convertSRGBToLinear();
                }
              } // Else, just overwrite the value

        } else {
          root[key] = value; // Auto-convert sRGB textures, for now ...
          // https://github.com/react-spring/react-three-fiber/issues/344

          if (isColorManagement && root[key] instanceof Texture) {
            root[key].encoding = sRGBEncoding;
          }
        }

        invalidateInstance(instance);
      }
    }); // Preemptively delete the instance from the containers interaction

    if (accumulative && container && instance.raycast && instance.__handlers) {
      instance.__handlers = undefined;

      const index = container.__interaction.indexOf(instance);

      if (index > -1) container.__interaction.splice(index, 1);
    } // Prep interaction handlers


    if (handlers.length) {
      if (accumulative && container && instance.raycast) container.__interaction.push(instance); // Add handlers to the instances handler-map

      instance.__handlers = handlers.reduce((acc, key) => {
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

function createInstance(type, {
  args = [],
  ...props
}, container, hostContext, internalInstanceHandle) {
  let name = `${type[0].toUpperCase()}${type.slice(1)}`;
  let instance;

  if (type === 'primitive') {
    // Switch off dispose for primitive objects
    props = {
      dispose: null,
      ...props
    };
    instance = props.object;
    instance.__instance = true;
    instance.__dispose = instance.dispose;
  } else {
    const target = catalogue[name] || THREE[name];

    if (!target) {
      throw `"${name}" is not part of the THREE namespace! Did you forget to extend it? See: https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md#using-3rd-party-objects-declaratively`;
    }

    instance = is.arr(args) ? new target(...args) : new target(args);
  } // Bind to the root container in case portals are being used
  // This is perhaps better for event management as we can keep them on a single instance


  while (container.__container) {
    container = container.__container;
  } // TODO: https://github.com/facebook/react/issues/17147
  // If it's still not there it means the portal was created on a virtual node outside of react


  if (!roots.has(container)) {
    const fn = node => {
      if (!node.return) return node.stateNode && node.stateNode.containerInfo;else return fn(node.return);
    };

    container = fn(internalInstanceHandle);
  } // Apply initial props


  instance.__objects = [];
  instance.__container = container; // Auto-attach geometries and materials

  if (name.endsWith('Geometry')) {
    props = {
      attach: 'geometry',
      ...props
    };
  } else if (name.endsWith('Material')) {
    props = {
      attach: 'material',
      ...props
    };
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
      const restSiblings = parentInstance.children.filter(sibling => sibling !== child); // TODO: the order is out of whack if data objects are present, has to be recalculated

      const index = restSiblings.indexOf(beforeChild);
      parentInstance.children = [...restSiblings.slice(0, index), child, ...restSiblings.slice(index)];
      updateInstance(child);
    } else {
      appendChild(parentInstance, child);
    } // TODO: order!!!


    invalidateInstance(child);
  }
}

function removeRecursive(array, parent, clone = false) {
  if (array) {
    // Three uses splice op's internally we may have to shallow-clone the array in order to safely remove items
    const target = clone ? [...array] : array;
    target.forEach(child => removeChild(parent, child));
  }
}

function removeChild(parentInstance, child) {
  if (child) {
    if (child.isObject3D) {
      parentInstance.remove(child);
    } else {
      child.parent = null;
      if (parentInstance.__objects) parentInstance.__objects = parentInstance.__objects.filter(x => x !== child); // Remove attachment

      if (child.attachArray) {
        parentInstance[child.attachArray] = parentInstance[child.attachArray].filter(x => x !== child);
      } else if (child.attachObject) {
        delete parentInstance[child.attachObject[0]][child.attachObject[1]];
      } else if (child.attach) {
        parentInstance[child.attach] = null;
      }
    } // Remove interactivity


    if (child.__container) child.__container.__interaction = child.__container.__interaction.filter(x => x !== child);
    invalidateInstance(child); // Allow objects to bail out of recursive dispose alltogether by passing dispose={null}

    if (child.dispose !== null) {
      unstable_runWithPriority(unstable_IdlePriority, () => {
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
  const parent = instance.parent;
  const newInstance = createInstance(type, newProps, instance.__container, null, fiber);
  removeChild(parent, instance);
  appendChild(parent, newInstance) // This evil hack switches the react-internal fiber node
  // https://github.com/facebook/react/issues/14983
  // https://github.com/facebook/react/pull/15021
  ;
  [fiber, fiber.alternate].forEach(fiber => {
    if (fiber !== null) {
      fiber.stateNode = newInstance;

      if (fiber.ref) {
        if (is.fun(fiber.ref)) fiber.ref(newInstance);else fiber.ref.current = newInstance;
      }
    }
  });
}

const Renderer = Reconciler({
  now: unstable_now,
  createInstance,
  removeChild,
  appendChild,
  insertBefore,
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

  commitUpdate(instance, updatePayload, type, oldProps, newProps, fiber) {
    if (instance.__instance && newProps.object && newProps.object !== instance) {
      // <instance object={...} /> where the object reference has changed
      switchInstance(instance, type, newProps, fiber);
    } else {
      // This is a data object, let's extract critical information about it
      const {
        args: argsNew = [],
        ...restNew
      } = newProps;
      const {
        args: argsOld = [],
        ...restOld
      } = oldProps; // If it has new props or arguments, then it needs to be re-instanciated

      const hasNewArgs = argsNew.some((value, index) => is.obj(value) ? Object.entries(value).some(([key, val]) => val !== argsOld[index][key]) : value !== argsOld[index]);

      if (hasNewArgs) {
        // Next we create a new instance and append it again
        switchInstance(instance, type, newProps, fiber);
      } else {
        // Otherwise just overwrite props
        applyProps(instance, restNew, restOld, true);
      }
    }
  },

  hideInstance(instance) {
    if (instance.isObject3D) {
      instance.visible = false;
      invalidateInstance(instance);
    }
  },

  unhideInstance(instance, props) {
    if (instance.isObject3D && props.visible == null || props.visible) {
      instance.visible = true;
      invalidateInstance(instance);
    }
  },

  hideTextInstance() {
    throw new Error('Text is not allowed in the react-three-fibre tree. You may have extraneous whitespace between components.');
  },

  getPublicInstance(instance) {
    return instance;
  },

  getRootHostContext() {
    return emptyObject;
  },

  getChildHostContext() {
    return emptyObject;
  },

  createTextInstance() {},

  finalizeInitialChildren(instance) {
    // https://github.com/facebook/react/issues/20271
    // Returning true will trigger commitMount
    return instance.__handlers;
  },

  commitMount(instance)
  /*, type, props*/
  {
    // https://github.com/facebook/react/issues/20271
    // This will make sure events are only added once to the central container
    const container = instance.__container;
    if (container && instance.raycast && instance.__handlers) container.__interaction.push(instance);
  },

  prepareUpdate() {
    return emptyObject;
  },

  shouldDeprioritizeSubtree() {
    return false;
  },

  prepareForCommit() {
    return null;
  },

  preparePortalMount() {
    return null;
  },

  resetAfterCommit() {},

  shouldSetTextContent() {
    return false;
  },

  clearContainer() {
    return false;
  }

});
const hasSymbol = is.fun(Symbol) && Symbol.for;
const REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
function render(element, container, state) {
  let root = roots.get(container);

  if (!root) {
    container.__state = state; // @ts-ignore

    let newRoot = root = Renderer.createContainer(container, state !== undefined && state.current.concurrent ? 2 : 0, false, // @ts-ignore
    null);
    roots.set(container, newRoot);
  }

  Renderer.updateContainer(element, root, null, () => undefined);
  return Renderer.getPublicRootInstance(root);
}
function unmountComponentAtNode(container, callback) {
  const root = roots.get(container);

  if (root) {
    Renderer.updateContainer(null, root, null, () => {
      roots.delete(container);
      if (callback) callback(container);
    });
  }
}
function createPortal(children, containerInfo, implementation, key = null) {
  if (!containerInfo.__objects) containerInfo.__objects = [];
  return {
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : '' + key,
    children,
    containerInfo,
    implementation
  };
}
Renderer.injectIntoDevTools({
  bundleType: process.env.NODE_ENV === 'production' ? 0 : 1,
  //@ts-ignore
  findHostInstanceByFiber: () => null,
  version: version,
  rendererPackageName: name
});

var threeTypes = /*#__PURE__*/Object.freeze({
  __proto__: null
});

function isOrthographicCamera(def) {
  return def.isOrthographicCamera;
}

function makeId(event) {
  return (event.eventObject || event.object).uuid + '/' + event.index;
}

const stateContext = /*#__PURE__*/createContext({});
const useCanvas = props => {
  const {
    children,
    gl,
    camera,
    orthographic,
    raycaster,
    size,
    pixelRatio,
    vr = false,
    concurrent = false,
    shadowMap = false,
    colorManagement = true,
    invalidateFrameloop = false,
    updateDefaultCamera = true,
    noEvents = false,
    onCreated,
    onPointerMissed,
    forceResize
  } = props; // Local, reactive state

  const [ready, setReady] = useState(false);
  const [mouse] = useState(() => new Vector2());
  const [defaultRaycaster] = useState(() => {
    const ray = new Raycaster();

    if (raycaster) {
      const {
        filter,
        computeOffsets,
        ...raycasterProps
      } = raycaster;
      applyProps(ray, raycasterProps, {});
    }

    return ray;
  });
  const [defaultScene] = useState(() => {
    const scene = new Scene();
    scene.__interaction = [];
    scene.__objects = [];
    return scene;
  });
  const [defaultCam, setDefaultCamera] = useState(() => {
    const cam = orthographic ? new OrthographicCamera(0, 0, 0, 0, 0.1, 1000) : new PerspectiveCamera(75, 0, 0.1, 1000);
    cam.position.z = 5;
    if (camera) applyProps(cam, camera, {}); // Always look at [0, 0, 0]

    cam.lookAt(0, 0, 0);
    return cam;
  });
  const [clock] = useState(() => new Clock()); // Public state

  const state = useRef({
    ready: false,
    active: true,
    manual: 0,
    colorManagement,
    vr,
    concurrent,
    noEvents,
    invalidateFrameloop: false,
    frames: 0,
    aspect: 0,
    subscribers: [],
    camera: defaultCam,
    scene: defaultScene,
    raycaster: defaultRaycaster,
    mouse,
    clock,
    gl,
    size,
    viewport: null,
    initialClick: [0, 0],
    initialHits: [],
    pointer: new TinyEmitter(),
    captured: undefined,
    events: undefined,
    subscribe: (ref, priority = 0) => {
      // If this subscription was given a priority, it takes rendering into its own hands
      // For that reason we switch off automatic rendering and increase the manual flag
      // As long as this flag is positive (there could be multiple render subscription)
      // ..there can be no internal rendering at all
      if (priority) state.current.manual++;
      state.current.subscribers.push({
        ref,
        priority: priority
      }); // Sort layers from lowest to highest, meaning, highest priority renders last (on top of the other frames)

      state.current.subscribers = state.current.subscribers.sort((a, b) => a.priority - b.priority);
      return () => {
        var _state$current;

        if ((_state$current = state.current) == null ? void 0 : _state$current.subscribers) {
          // Decrease manual flag if this subscription had a priority
          if (priority) state.current.manual--;
          state.current.subscribers = state.current.subscribers.filter(s => s.ref !== ref);
        }
      };
    },
    setDefaultCamera: camera => setDefaultCamera(camera),
    invalidate: () => invalidate(state),
    intersect: (event = {}, prepare = true) => handlePointerMove(event, prepare),
    forceResize
  });
  const position = new Vector3();
  const getCurrentViewport = useCallback((camera = state.current.camera, target = new Vector3(0, 0, 0)) => {
    const {
      width,
      height
    } = state.current.size;
    const distance = camera.getWorldPosition(position).distanceTo(target);

    if (isOrthographicCamera(camera)) {
      return {
        width: width / camera.zoom,
        height: height / camera.zoom,
        factor: 1,
        distance
      };
    } else {
      const fov = camera.fov * Math.PI / 180; // convert vertical fov to radians

      const h = 2 * Math.tan(fov / 2) * distance; // visible height

      const w = h * (width / height);
      return {
        width: w,
        height: h,
        factor: width / w,
        distance
      };
    }
  }, []); // Writes locals into public state for distribution among subscribers, context, etc

  useMemo(() => {
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

  useMemo(() => {
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

  const sharedState = useRef(null);
  useMemo(() => {
    const {
      ready,
      manual,
      vr,
      noEvents,
      invalidateFrameloop,
      frames,
      subscribers,
      captured,
      initialClick,
      initialHits,
      ...props
    } = state.current;
    sharedState.current = props; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, defaultCam]); // Update pixel ratio

  useLayoutEffect(() => {
    if (pixelRatio) {
      if (Array.isArray(pixelRatio)) gl.setPixelRatio(Math.max(Math.min(pixelRatio[0], window.devicePixelRatio), pixelRatio[1]));else gl.setPixelRatio(pixelRatio);
    }
  }, [gl, pixelRatio]); // Update shadow map

  useLayoutEffect(() => {
    if (shadowMap) {
      gl.shadowMap.enabled = true;
      if (typeof shadowMap === 'object') Object.assign(gl.shadowMap, shadowMap);else gl.shadowMap.type = PCFSoftShadowMap;
    }

    if (colorManagement) {
      gl.toneMapping = ACESFilmicToneMapping;
      gl.outputEncoding = sRGBEncoding;
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [shadowMap, colorManagement]);
  /** Events ------------------------------------------------------------------------------------------------ */

  const hovered = useMemo(() => new Map(), []);
  const temp = new Vector3();
  /** Sets up defaultRaycaster */

  const prepareRay = useCallback(event => {
    // https://github.com/pmndrs/react-three-fiber/pull/782
    // Events trigger outside of canvas when moved
    const offsets = (raycaster == null ? void 0 : raycaster.computeOffsets == null ? void 0 : raycaster.computeOffsets(event, sharedState.current)) || event.nativeEvent;

    if (offsets) {
      const {
        offsetX,
        offsetY
      } = offsets;
      const {
        width,
        height
      } = state.current.size;
      mouse.set(offsetX / width * 2 - 1, -(offsetY / height) * 2 + 1);
      defaultRaycaster.setFromCamera(mouse, state.current.camera);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);
  /** Intersects interaction objects using the event input */

  const intersect = useCallback(filter => {
    // Skip event handling when noEvents is set
    if (state.current.noEvents) return [];
    const seen = new Set();
    const hits = []; // Allow callers to eliminate event objects

    const eventsObjects = filter ? filter(state.current.scene.__interaction) : state.current.scene.__interaction; // Intersect known handler objects and filter against duplicates

    let intersects = defaultRaycaster.intersectObjects(eventsObjects, true).filter(item => {
      const id = makeId(item);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    }); // https://github.com/mrdoob/three.js/issues/16031
    // Allow custom userland intersect sort order

    if (raycaster && raycaster.filter && sharedState.current) {
      intersects = raycaster.filter(intersects, sharedState.current);
    }

    for (const intersect of intersects) {
      let eventObject = intersect.object; // Bubble event up

      while (eventObject) {
        const handlers = eventObject.__handlers;
        if (handlers) hits.push({ ...intersect,
          eventObject
        });
        eventObject = eventObject.parent;
      }
    }

    return hits;
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
  /**  Calculates click deltas */

  const calculateDistance = useCallback(event => {
    const dx = event.nativeEvent.offsetX - state.current.initialClick[0];
    const dy = event.nativeEvent.offsetY - state.current.initialClick[1];
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  }, []);
  const handlePointerCancel = useCallback((event, hits, prepare = true) => {
    state.current.pointer.emit('pointerCancel', event);
    if (prepare) prepareRay(event);
    Array.from(hovered.values()).forEach(hoveredObj => {
      // When no objects were hit or the the hovered object wasn't found underneath the cursor
      // we call onPointerOut and delete the object from the hovered-elements map
      if (hits && (!hits.length || !hits.find(hit => hit.object === hoveredObj.object && hit.index === hoveredObj.index))) {
        const eventObject = hoveredObj.eventObject;
        const handlers = eventObject.__handlers;
        hovered.delete(makeId(hoveredObj));

        if (handlers) {
          // Clear out intersects, they are outdated by now
          const data = { ...hoveredObj,
            intersections: hits || []
          };
          if (handlers.pointerOut) handlers.pointerOut({ ...data,
            type: 'pointerout'
          });
          if (handlers.pointerLeave) handlers.pointerLeave({ ...data,
            type: 'pointerleave'
          });
        }
      }
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**  Creates filtered intersects and returns an array of positive hits */

  const getIntersects = useCallback((event, filter) => {
    // Get fresh intersects
    const intersections = intersect(filter); // If the interaction is captured take that into account, the captured event has to be part of the intersects

    if (state.current.captured && event.type !== 'click' && event.type !== 'wheel') {
      state.current.captured.forEach(captured => {
        if (!intersections.find(hit => hit.eventObject === captured.eventObject)) intersections.push(captured);
      });
    }

    return intersections;
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
  /**  Handles intersections by forwarding them to handlers */

  const handleIntersects = useCallback((intersections, event, fn) => {
    // If anything has been found, forward it to the event listeners
    if (intersections.length) {
      const unprojectedPoint = temp.set(mouse.x, mouse.y, 0).unproject(state.current.camera);
      const delta = event.type === 'click' ? calculateDistance(event) : 0;

      const releasePointerCapture = id => event.target.releasePointerCapture(id);

      const localState = {
        stopped: false,
        captured: false
      };

      for (const hit of intersections) {
        const setPointerCapture = id => {
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

        const raycastEvent = { ...event,
          ...hit,
          intersections,
          stopped: localState.stopped,
          delta,
          unprojectedPoint,
          ray: defaultRaycaster.ray,
          camera: state.current.camera,
          // Hijack stopPropagation, which just sets a flag
          stopPropagation: () => {
            // https://github.com/react-spring/react-three-fiber/issues/596
            // Events are not allowed to stop propagation if the pointer has been captured
            const cap = state.current.captured;

            if (!cap || cap.find(h => h.eventObject.id === hit.eventObject.id)) {
              raycastEvent.stopped = localState.stopped = true; // Propagation is stopped, remove all other hover records
              // An event handler is only allowed to flush other handlers if it is hovered itself

              if (hovered.size && Array.from(hovered.values()).find(i => i.eventObject === hit.eventObject)) {
                // Objects cannot flush out higher up objects that have already caught the event
                const higher = intersections.slice(0, intersections.indexOf(hit));
                handlePointerCancel(raycastEvent, [...higher, hit]);
              }
            }
          },
          target: { ...event.target,
            setPointerCapture,
            releasePointerCapture
          },
          currentTarget: { ...event.currentTarget,
            setPointerCapture,
            releasePointerCapture
          },
          sourceEvent: event
        };
        fn(raycastEvent); // Event bubbling may be interrupted by stopPropagation

        if (localState.stopped === true) break;
      }
    }

    return intersections;
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
  const handlePointerMove = useCallback((event, prepare = true) => {
    state.current.pointer.emit('pointerMove', event);
    if (prepare) prepareRay(event);
    const hits = getIntersects(event, // This is onPointerMove, we're only interested in events that exhibit this particular event
    objects => objects.filter(obj => ['Move', 'Over', 'Enter', 'Out', 'Leave'].some(name => obj.__handlers['pointer' + name]))); // Take care of unhover

    handlePointerCancel(event, hits);
    handleIntersects(hits, event, data => {
      const eventObject = data.eventObject;
      const handlers = eventObject.__handlers; // Check presence of handlers

      if (!handlers) return; // Check if mouse enter or out is present

      if (handlers.pointerOver || handlers.pointerEnter || handlers.pointerOut || handlers.pointerLeave) {
        const id = makeId(data);
        const hoveredItem = hovered.get(id);

        if (!hoveredItem) {
          // If the object wasn't previously hovered, book it and call its handler
          hovered.set(id, data);
          if (handlers.pointerOver) handlers.pointerOver({ ...data,
            type: 'pointerover'
          });
          if (handlers.pointerEnter) handlers.pointerEnter({ ...data,
            type: 'pointerenter'
          });
        } else if (hoveredItem.stopped) {
          // If the object was previously hovered and stopped, we shouldn't allow other items to proceed
          data.stopPropagation();
        }
      } // Call mouse move


      if (handlers.pointerMove) handlers.pointerMove(data);
    });
    return hits; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handlePointer = useCallback(name => (event, prepare = true) => {
    state.current.pointer.emit(name, event);
    if (prepare) prepareRay(event);
    const hits = getIntersects(event);
    handleIntersects(hits, event, data => {
      const eventObject = data.eventObject;
      const handlers = eventObject.__handlers;

      if (handlers && handlers[name]) {
        // Forward all events back to their respective handlers with the exception of click events,
        // which must use the initial target
        if (name !== 'click' && name !== 'contextMenu' && name !== 'doubleClick' || state.current.initialHits.includes(eventObject)) {
          handlers[name](data);
          pointerMissed(event, defaultScene.__interaction, object => object !== eventObject);
        }
      }
    }); // If a click yields no results, pass it back to the user as a miss

    if (name === 'pointerDown') {
      state.current.initialClick = [event.nativeEvent.offsetX, event.nativeEvent.offsetY];
      state.current.initialHits = hits.map(hit => hit.eventObject);
    }

    if ((name === 'click' || name === 'contextMenu' || name === 'doubleClick') && !hits.length) {
      if (calculateDistance(event) <= 2) {
        pointerMissed(event, defaultScene.__interaction);
        if (onPointerMissed) onPointerMissed();
      }
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [onPointerMissed, calculateDistance, getIntersects, handleIntersects, prepareRay]);
  useMemo(() => {
    state.current.events = {
      onClick: handlePointer('click'),
      onContextMenu: handlePointer('contextMenu'),
      onDoubleClick: handlePointer('doubleClick'),
      onWheel: handlePointer('wheel'),
      onPointerDown: handlePointer('pointerDown'),
      onPointerUp: handlePointer('pointerUp'),
      onPointerLeave: e => handlePointerCancel(e, []),
      onPointerMove: handlePointerMove,
      // onGotPointerCapture is not needed any longer because the behaviour is hacked into
      // the event itself (see handleIntersects). But in order for non-web targets to simulate
      // it we keep the legacy event, which simply flags all current intersects as captured
      onGotPointerCaptureLegacy: e => state.current.captured = intersect(),
      onLostPointerCapture: e => (state.current.captured = undefined, handlePointerCancel(e))
    };
  }, [handlePointer, intersect, handlePointerCancel, handlePointerMove]);
  /** Events ------------------------------------------------------------------------------------------------- */
  // This component is a bridge into the three render context, when it gets rendered
  // we know we are ready to compile shaders, call subscribers, etc

  const Canvas = useCallback(function Canvas(props) {
    const activate = () => setReady(true); // Pre-compile all materials before rendering out the first time


    useLayoutEffect(() => void gl.compile(defaultScene, defaultCam), []);
    useEffect(() => {
      const result = onCreated && onCreated(state.current);
      if (result && result.then) result.then(activate);else activate();
    }, []);
    return props.children;
  }, // The Canvas component has to be static, it should not be re-created ever
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []); // Render v-dom into scene

  useLayoutEffect(() => {
    render( /*#__PURE__*/createElement(Canvas, null, /*#__PURE__*/createElement(stateContext.Provider, {
      value: sharedState.current
    }, typeof children === 'function' ? children(state.current) : children)), defaultScene, state); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, children, sharedState.current]);
  useLayoutEffect(() => {
    if (ready) {
      // Start render-loop, either via RAF or setAnimationLoop for VR
      if (!state.current.vr) {
        if (state.current.frames === 0) invalidate(state);
      } else if ((gl.xr || gl.vr) && gl.setAnimationLoop) {
        (gl.xr || gl.vr).enabled = true;
        gl.setAnimationLoop(t => renderGl(state, t, 0, true));
      } else {
        console.warn('the gl instance does not support VR!');
      }
    }
  }, [gl, ready, invalidateFrameloop]); // Dispose renderer on unmount

  useEffect(() => () => {
    if (state.current.gl) {
      if (state.current.gl.renderLists) state.current.gl.renderLists.dispose();
      if (state.current.gl.forceContextLoss) state.current.gl.forceContextLoss();
      dispose(state.current.gl);
    }

    unmountComponentAtNode(state.current.scene, () => {
      dispose(state.current.raycaster);
      dispose(state.current.camera);
      dispose(state.current);
    });
  }, []);
  return state.current.events;
};

function pointerMissed(event, objects, filter = object => true) {
  objects.filter(filter).forEach(object => {
    var _handlers$pointerMis, _handlers;

    return (_handlers$pointerMis = (_handlers = object.__handlers).pointerMissed) == null ? void 0 : _handlers$pointerMis.call(_handlers, event);
  });
}

function dispose(obj) {
  if (obj.dispose && obj.type !== 'Scene') obj.dispose();

  for (const p in obj) {
    if (typeof p === 'object' && p.dispose) p.dispose();
    delete obj[p];
  }
}

function useContext(context) {
  let result = useContext$1(context);

  if (!('subscribe' in result)) {
    throw new Error(`⚡️ react-three-fiber hooks can only be used within the Canvas component! https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md#hooks`);
  }

  return result;
}

function useFrame(callback, renderPriority = 0) {
  const {
    subscribe
  } = useContext(stateContext); // Update ref

  const ref = useRef(callback);
  useLayoutEffect(() => void (ref.current = callback), [callback]); // Subscribe/unsub

  useEffect(() => {
    const unsubscribe = subscribe(ref, renderPriority);
    return () => unsubscribe();
  }, [renderPriority, subscribe]);
  return null;
}
function useThree() {
  return useContext(stateContext);
}
function useUpdate(callback, dependents, optionalRef) {
  const {
    invalidate
  } = useContext(stateContext);
  const localRef = useRef();
  const ref = optionalRef ? optionalRef : localRef;
  useLayoutEffect(() => {
    if (ref.current) {
      callback(ref.current);
      invalidate();
    }
  }, dependents); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
function useResource(optionalRef) {
  const [_, forceUpdate] = useState(false);
  const localRef = useRef(undefined);
  const ref = optionalRef ? optionalRef : localRef;
  useLayoutEffect(() => void forceUpdate(i => !i), []);
  return ref;
}

function buildGraph(object) {
  const data = {
    nodes: {},
    materials: {}
  };

  if (object) {
    object.traverse(obj => {
      if (obj.name) data.nodes[obj.name] = obj;
      if (obj.material && !data.materials[obj.material.name]) data.materials[obj.material.name] = obj.material;
    });
  }

  return data;
}

function useGraph(object) {
  return useMemo(() => buildGraph(object), [object]);
}

function loadingFn(extensions, onProgress) {
  return function (Proto, ...input) {
    // Construct new loader and run extensions
    const loader = new Proto();
    if (extensions) extensions(loader); // Go through the urls and load them

    return Promise.all(input.map(input => new Promise((res, reject) => loader.load(input, data => {
      if (data.scene) Object.assign(data, buildGraph(data.scene));
      res(data);
    }, onProgress, error => {
      var _error$message;

      return reject((_error$message = error.message) != null ? _error$message : `failure loading ${input}`);
    }))));
  };
}

function useLoader(Proto, input, extensions, onProgress) {
  // Use suspense to load async assets
  const keys = Array.isArray(input) ? input : [input];
  const results = useAsset(loadingFn(extensions, onProgress), Proto, ...keys); // Return the object/s

  return Array.isArray(input) ? results : results[0];
}

useLoader.preload = function (Proto, input, extensions) {
  const keys = Array.isArray(input) ? input : [input];
  return useAsset.preload(loadingFn(extensions), Proto, ...keys);
};

const defaultStyles = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden'
};

function Content({
  children,
  setEvents,
  container,
  renderer,
  effects,
  ...props
}) {
  // Create renderer
  const [gl] = useState(renderer);
  if (!gl) console.warn('No renderer created!'); // Mount and unmount management

  useEffect(() => {
    if (effects) effects(gl, container);
  }, [container, effects, gl]); // Init canvas, fetch events, hand them back to the wrapping div

  const events = useCanvas({ ...props,
    children,
    gl: gl
  });
  useEffect(() => {
    setEvents(events);
  }, [events, setEvents]);
  return null;
}

const ResizeContainer = /*#__PURE__*/React.memo(function ResizeContainer(props) {
  const {
    renderer,
    effects,
    children,
    vr,
    webgl1,
    concurrent,
    shadowMap,
    colorManagement,
    orthographic,
    invalidateFrameloop,
    updateDefaultCamera,
    noEvents,
    gl,
    camera,
    raycaster,
    pixelRatio,
    onCreated,
    onPointerMissed,
    preRender,
    resize,
    style,
    ...restSpread
  } = props;
  const containerRef = useRef(); // onGotPointerCaptureLegacy is a fake event used by non-web targets to simulate poinzter capture

  const [{
    onGotPointerCaptureLegacy,
    ...events
  }, setEvents] = useState({});
  const [bind, size, forceResize] = useMeasure({
    scroll: true,
    debounce: {
      scroll: 50,
      resize: 0
    },
    ...resize
  }); // Flag view ready once it's been measured out

  const readyFlag = useRef(false);
  const ready = useMemo(() => readyFlag.current = readyFlag.current || !!size.width && !!size.height, [size]);
  const state = useMemo(() => ({
    size,
    forceResize,
    setEvents,
    container: containerRef.current
  }), [forceResize, size]); // Allow Gatsby, Next and other server side apps to run. Will output styles to reduce flickering.

  if (typeof window === 'undefined') return /*#__PURE__*/React.createElement("div", _extends({
    style: { ...defaultStyles,
      ...style
    }
  }, restSpread), preRender); // Render the canvas into the dom

  return /*#__PURE__*/React.createElement("div", _extends({
    ref: mergeRefs([bind, containerRef]),
    style: { ...defaultStyles,
      ...style
    }
  }, events, restSpread), preRender, ready && /*#__PURE__*/React.createElement(Content, _extends({}, props, state)));
});

const Canvas = /*#__PURE__*/React.memo(({
  children,
  ...props
}) => /*#__PURE__*/React.createElement(ResizeContainer, _extends({}, props, {
  renderer: () => new CSS3DRenderer(),
  effects: (gl, el) => (el.appendChild(gl.domElement), () => el.removeChild(gl.domElement))
}), children));

export { Canvas, threeTypes as ReactThreeFiber, Renderer, addAfterEffect, addEffect, addTail, applyProps, createPortal, extend, forceResize, invalidate, isOrthographicCamera, render, renderGl, stateContext, unmountComponentAtNode, useCanvas, useFrame, useGraph, useLoader, useResource, useThree, useUpdate };