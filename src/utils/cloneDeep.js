function copyBuffer(cur) {
  if (cur instanceof Buffer) {
    return Buffer.from(cur);
  }

  return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length);
}

function rfdc(opts = {}) {
  if (opts.circles) {
    return rfdcCircles(opts);
  }

  return opts.proto ? cloneProto : clone;

  function cloneArray(a, fn) {
    let keys = Object.keys(a);
    let a2 = new Array(keys.length);

    for (let i = 0; i < keys.length; i++) {
      let k = keys[i];
      let cur = a[k];

      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur;
      } else if (cur instanceof Date) {
        a2[k] = new Date(cur);
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur);
      } else {
        a2[k] = fn(cur);
      }
    }

    return a2;
  }

  function clone(o) {
    if (typeof o !== 'object' || o === null) {
      return o;
    }

    if (o instanceof Date) {
      return new Date(o);
    }

    if (Array.isArray(o)) {
      return cloneArray(o, clone);
    }

    let o2 = {};

    for (let k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) {
        continue;
      }

      let cur = o[k];

      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur);
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        o2[k] = clone(cur);
      }
    }

    return o2;
  }

  function cloneProto(o) {
    if (typeof o !== 'object' || o === null) {
      return o;
    }

    if (o instanceof Date) {
      return new Date(o);
    }

    if (Array.isArray(o)) {
      return cloneArray(o, cloneProto);
    }

    let o2 = {};

    for (let k in o) {
      let cur = o[k];

      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur);
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        o2[k] = cloneProto(cur);
      }
    }

    return o2;
  }
}

function rfdcCircles(opts) {
  let refs = [];
  let refsNew = [];

  return opts.proto ? cloneProto : clone;

  function cloneArray(a, fn) {
    let keys = Object.keys(a);
    let a2 = new Array(keys.length);

    for (let i = 0; i < keys.length; i++) {
      let k = keys[i];
      let cur = a[k];

      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur;
      } else if (cur instanceof Date) {
        a2[k] = new Date(cur);
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur);
      } else {
        let index = refs.indexOf(cur);

        if (index !== -1) {
          a2[k] = refsNew[index];
        } else {
          a2[k] = fn(cur);
        }
      }
    }

    return a2;
  }

  function clone(o) {
    if (typeof o !== 'object' || o === null) {
      return o;
    }

    if (o instanceof Date) {
      return new Date(o);
    }

    if (Array.isArray(o)) {
      return cloneArray(o, clone);
    }

    let o2 = {};

    refs.push(o);
    refsNew.push(o2);

    for (let k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) {
        continue;
      }

      let cur = o[k];

      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur);
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        let i = refs.indexOf(cur);

        if (i !== -1) {
          o2[k] = refsNew[i];
        } else {
          o2[k] = clone(cur);
        }
      }
    }
    refs.pop();
    refsNew.pop();

    return o2;
  }

  function cloneProto(o) {
    if (typeof o !== 'object' || o === null) {
      return o;
    }

    if (o instanceof Date) {
      return new Date(o);
    }

    if (Array.isArray(o)) {
      return cloneArray(o, cloneProto);
    }

    let o2 = {};

    refs.push(o);
    refsNew.push(o2);

    for (let k in o) {
      let cur = o[k];

      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur);
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        let i = refs.indexOf(cur);

        if (i !== -1) {
          o2[k] = refsNew[i];
        } else {
          o2[k] = cloneProto(cur);
        }
      }
    }

    refs.pop();
    refsNew.pop();

    return o2;
  }
}

const cloneDeep = o => rfdc({ proto: true })(o);

export default cloneDeep;
