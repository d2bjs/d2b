import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import 'd3-transition';

import functor from '../util/functor';
/**
  * d2b.modelBase() returns a d2b base model.
  *
  * model.interface() will return a base interface with various built in
  * getter/setter methods.
  * model.values() will return the values set through the interface.
  * @param {function} base - function that will act as the model interface
  * @param {object} $$ - attributes set by interactive with the base interface
  * @return {Object} model - object with properties and methods
  */

export default function (base = {}, $$ = {}) {

  // Define an emitter updater that will fire events around the base updater
  // if (typeof base === 'function') {
  //   base.emitter = function (context) {
  //     if (context.dispatch) context.dispatch('beforeApply', {bubbles: true});
  //     base.apply(this, arguments);
  //     if (context.dispatch) context.dispatch('applied', {bubbles: true});
  //   };
  // }

  const propFn = (prop, cb) => {
    return function (_) {
      if (!arguments.length) return $$[prop];
      const old = $$[prop];
      $$[prop] = _;
      if (cb) cb(_, old);
      return base;
    };
  };

  const propFnGet = (prop) => {
    return function () {
      return $$[prop];
    };
  };

  const propFnFunctor = (prop, cb) => {
    return function (_) {
      if (!arguments.length) return $$[prop];
      const old = $$[prop];
      $$[prop] = functor(_);
      if (cb) cb($$[prop], old);
      return base;
    };
  };

  const scaleFnFunctor = (prop, cb) => {
    return function (_) {
      if (!arguments.length) return $$[prop];
      const old = $$[prop];
      if (_ && _.domain) $$[prop] = () => _;
      else $$[prop] = functor(_);
      if (cb) cb($$[prop], old);
      return base;
    };
  };

  // Conditionally call a prop with arguments
  // If there are more than 2 arguments supplied, the prop will be called 
  // with the arguments as long as the condition is truthy
  // Else if only 2 arguments suplied, the prop will be called with the
  // condition argument as long as the condition is defined
  base.conditionally = (prop, cond, ...args) => {
    if (args.length) {
      if (cond || cond === 0) base[prop].apply(null, args);
    } else {
      if (cond !== undefined) base[prop](cond);
    }

    return base;
  };

  const methodAdded = function (method) {
    // Adds the conditionally modifier to a newly created base method. Similar to base.conditionally,
    // but is added to the method itself. e.g. `base.method.conditionally()`
    method.conditionally = (cond, ...args) => {
      if (args.length) {
        if (cond || cond === 0) method.apply(null, args);
      } else {
        if (cond !== undefined) method(cond);
      }
  
      return base;
    };
  };

  /* Base Model */
  const model = {
    base: () => { return base; },
    values: () => { return $$; },
    /**
      * model.removeProp removes the specified property
      * @param {Number} prop    - property key
      * @return {Object} model  - returns model to allow for method chaining
      */
    removeProp: (prop) => {
      $$[prop] = null;
      base[prop] = null;
      return model;
    },
    /**
      * model.addProp allows new properties to be added to the model and base
      * interface. If the property is already defined an error will be raised.
      * @param {Number} prop    - property key
      * @param {Number} value   - default value to set
      * @param {Number} fn      - function as new prop getter/setter
      * @param {Number} cb      - callback function after prop is set
      * @return {Object} model  - returns model to allow for method chaining
      */
    addProp: (prop, value = null, fn = propFn(prop), cb) => {
      if ($$[prop] || base[prop]) {
        // console.error(`${prop} property is already defined.`);
        return model;
      }
      // allow for null:default 'fn' in order to access callback
      fn = fn || propFn(prop, cb);

      fn(value);

      base[prop] = fn;
      methodAdded(base[prop]);

      return model;
    },
    /**
      * model.addPropGet is similar to addProp except it doesn't allow for the
      * property to be reset through the API.
      * @param {Number} prop    - property key
      * @param {Number} value   - default value to set
      * @param {Number} fn      - function as new prop getter
      * @return {Object} model  - returns model to allow for method chaining
      */
    addPropGet: (prop, value = null, fn = propFnGet(prop)) => {
      if ($$[prop] || base[prop]) {
        // console.error(`${prop} property is already defined.`);
        return model;
      }

      $$[prop] = value;
      base[prop] = fn;
      methodAdded(base[prop]);

      return model;
    },
    /**
      * model.addMethod allows new methods to be added to the model and base
      * interface. If the method is already defined an error will be raised.
      * @param {Number} method  - method key
      * @param {Number} fn      - new method
      * @return {Object} model  - returns model to allow for method chaining
      */
    addMethod: (method, fn) => {
      if (base[method]) {
        // console.error(`${method} method is already defined.`);
        return model;
      }
      base[method] = fn;
      methodAdded(base[method]);

      return model;
    },
    /**
      * model.addPropFunctor allows new functor properties to be added to the
      * model and base interface. If the property is already defined an error
      * will be raised.
      * @param {Number} prop    - property key
      * @param {Number} value   - default value to set
      * @param {Number} fn      - function as new prop getter/setter
      * @return {Object} model  - returns model to allow for method chaining
      */
    addPropFunctor: (prop, value = null, fn = propFnFunctor(prop), cb) => {
      if ($$[prop] || base[prop]) {
        // console.error(`${prop} property is already defined.`);
        return model;
      }
      // allow for null:default 'fn' in order to access callback
      fn = fn || propFnFunctor(prop, cb);

      fn(value);

      const newProp = base[prop] = fn;

      methodAdded(base[prop]);

      newProp.proxy = (proxy) => {
        const current = newProp();
        const original = current.original || current;
        const proxied = function (...args) {
          const value = proxy.apply(this, args);
          return value === undefined ? original.apply(this, args) : value;
        };
        proxied.original = original;
        newProp(proxied);

        return base;
      };

      return model;
    },
    /**
      * model.addScaleFunctor allows new scale functor properties to be added
      * to the model and base interface. If the property is already defined
      * an error will be raised.
      * @param {Number} prop    - property key
      * @param {Number} value   - default value to set
      * @param {Number} fn      - function as new prop getter/setter
      * @return {Object} model  - returns model to allow for method chaining
      */
    addScaleFunctor: (prop, value = null, fn = scaleFnFunctor(prop), cb) => {
      return model.addProp(prop, value, fn, cb);
    },
    /**
      * model.addDispatch allows dispatcher to be added to the model and base
      * interface.
      * @param {Number} prop    - property key
      * @param {Number} store   - store key
      * @param {Number} events  - array of event keys
      * @return {Object} model  - returns model to allow for method chaining
      */
    addDispatcher: (events, prop = 'on', store = 'dispatch') => {
      if (base[prop]) {
        // console.error(`${prop} property is already defined.`);
        return model;
      }
      if ($$[store]) {
        // console.error(`${store} value is already defined.`);
        return model;
      }

      base[prop] = function (key, fn) {
        if(arguments.length === 0) return $$[store];
        if(arguments.length === 1) return $$[store].on(key);
        $$[store].on(key, fn);

        return base;
      };
      methodAdded(base[prop]);

      $$[store] = dispatch.apply(this, events);

      return model;
    },
    /**
      * model.addAdvancedConfig adds the base.advanced prop that will proxy through
      * some config function before rendering the base on the selection.
      * @param {Number} conf    - property key
      * @return {Object} model  - returns model to allow for method chaining
      */
    addAdvancedConfig: (config) => {
      base.advanced = function (context) {
        const selection = (context.selection)? context.selection() : context;
        const transition = selection !== context;

        selection.each(function (datum) {
          if (datum.updated !== undefined) select(this).on('chart-updated.advanced', datum.updated);
          let el = select(this).selectAll('.d2b-chart-advanced').data([config(base, datum)]);
          const elEnter = el.enter().append('div').attr('class', 'd2b-chart-advanced');
          el = elEnter.merge(el);
          const elTransition = transition ? el.transition(context) : el;
          elTransition.call(base);
        });

        return base;
      };

      return model;
    }
  };

  return model;
}
