/* eslint-disable */
import local_storage from './local_storage';

const debugLevels = {
  log: 1,
  trace: 0,
  debug: 0,
  info: 0,
  warn: 1,
  table: 0,
  error: 1,
};

let localDebugLevels = local_storage.get('nexo.log_levels') || debugLevels;

const log = {
  log: function () {
    localDebugLevels['log'] && console.log(...arguments);
  },
  trace: function () {
    localDebugLevels['trace'] && console.trace(...arguments);
  },
  debug: function () {
    localDebugLevels['debug'] && console.debug(...arguments);
  },
  info: function () {
    localDebugLevels['info'] && console.info(...arguments);
  },
  warn: function () {
    localDebugLevels['warn'] && console.warn(...arguments);
  },
  table: function () {
    localDebugLevels['table'] && console.table(...arguments);
  },
  error: function () {
    localDebugLevels['error'] && console.error(...arguments);
  },
};

if (!local_storage.get('nexo.log_levels')) {
  local_storage.set('nexo.log_levels', debugLevels);
}

window.setPlatformDebugLevels = obj => {
  let isValid = false;

  if (typeof obj === 'object' && Object.keys(obj).length) {
    isValid = true;

    for (let key in obj) {
      if (!(key in debugLevels) || isNaN(Number(obj[key]))) {
        isValid = false;

        break;
      }
    }
  }

  if (isValid) {
    const newDebugLevels = { ...local_storage.get('nexo.log_levels'), ...obj };

    local_storage.set('nexo.log_levels', newDebugLevels);
    localDebugLevels = newDebugLevels;
  } else {
    console.log(`Please use the following format: ${JSON.stringify(debugLevels)}`);
  }
};

export default log;
