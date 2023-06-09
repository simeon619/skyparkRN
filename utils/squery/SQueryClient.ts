import * as Keychain from 'react-native-keychain';
import { io } from 'socket.io-client';
import { createModelFrom, getDesription, getDesriptions } from './SQueryUtils';
import { HOST } from '../metric';
const SQuery: { [str: string]: any } = {};

const socket = io(HOST);

(async () => {
  // await Keychain.resetGenericPassword();
  let u: any = await Keychain.getGenericPassword();
  console.log({ u: u.password });

  socket.io.opts.extraHeaders = {
    ...socket.io.opts.extraHeaders,
    cookie: u.password,
  };
})();

socket.on('storeCookie', async (cookie, cb) => {
  // await Keychain.resetGenericPassword();
  try {
    let result = await Keychain.setGenericPassword('squery_session', cookie);
    socket.io.opts.extraHeaders = {
      ...socket.io.opts.extraHeaders,
      cookie,
    };
    cb(result);
  } catch (error) {
    // console.log('Error storing cookie:', error);
  }
});

SQuery.CurrentUserInstance = async () => {
  return await new Promise(rev => {
    SQuery.emit('server:currentUser', {}, async (res: any) => {
      if (res.error) {
        throw new Error(JSON.stringify(res));
      }
      const userModel = await SQuery.Model(res.response.signup.modelPath);
      if (!userModel) {
        throw new Error('Model is null for modelPath : ' + res.modelPath);
      }
      const userInstance = await userModel.newInstance({
        id: res.response.signup.id,
      });
      rev(userInstance);
    });
  });
};
SQuery.socket = socket;
SQuery.Model = async (modelPath: string) => {
  return await createModelFrom(modelPath);
};
SQuery.emitNow = (event: string, ...arg: any[]) => {
  if (typeof event !== 'string') {
    throw new Error(
      'cannot emit with following event : ' +
        event +
        '; event value must be string',
    );
  }
  if (SQuery.socket.connected) {
    socket.emit(event, ...arg);
  } else {
    throw new Error('DISCONNECT FROM SERVER');
  }
};
SQuery.emit = (event: string, ...arg: string[]) => {
  if (typeof event !== 'string') {
    throw new Error(
      'cannot emit with following event : ' +
        event +
        '; event value must be string',
    );
  }
  socket.emit(event, ...arg);
};

SQuery.on = (event: string, cb: (...args: any[]) => void) => {
  if (typeof event !== 'string') {
    throw new Error(
      'cannot emit with following event : ' +
        event +
        '; event value must be string',
    );
  }
  socket.on(event, cb);
};
SQuery.getDesription = getDesription;
SQuery.getDesriptions = getDesriptions;

const ValidationMap: { [str: string]: any } = {
  String: ['minlength', 'maxlength', 'match', 'enum', 'required'],
  Number: ['min', 'max', 'enum', 'required'],
  Date: ['min', 'max', 'enum', 'required'],
  Array: ['length', 'required'], //////////
};

function isValideType(ruleTypes: any, type: String) {
  const typeSide = type.split('/');

  let valide = false;

  ruleTypes.forEach((ruleType: any) => {
    const ruleSide = ruleType.split('/');
    const match = (side: number) => {
      if (ruleSide[side] === '*') {
        return true;
      } else if (
        ruleSide[side].toLocaleLowerCase() ===
        typeSide[side].toLocaleLowerCase()
      ) {
        return true;
      } else {
        return false;
      }
    };

    if (match(0) && match(1)) {
      valide = true;
    }
  });
  return valide;
}

const validations: any = {
  minlength: (value: any, requirement: any) => {
    let isValide = false;

    if (Array.isArray(requirement)) {
      isValide = value.length >= requirement[0];
    } else {
      isValide = value.length >= requirement;
    }
    return {
      isValide,
      message: isValide ? '' : 'the minimun Length is ' + requirement,
    };
  },
  maxlength: (value: any, requirement: any) => {
    let isValide = false;
    if (Array.isArray(requirement)) {
      isValide = value.length <= requirement[0];
    } else {
      isValide = value.length <= requirement;
    }
    return {
      isValide,
      message: isValide ? '' : 'the maximum Length is ' + requirement,
    };
  },
  min: (value: number, requirement: number) => {
    const isValide = value >= requirement;
    return {
      isValide,
      message: isValide ? '' : 'the minimum value is ' + requirement,
    };
  },
  max: (value: number, requirement: number) => {
    const isValide = value <= requirement;
    return {
      isValide,
      message: isValide ? '' : 'the maximum value is ' + requirement,
    };
  },
  match: (value: string, requirement: string | RegExp) => {
    // console.log(requirement);
    const re = new RegExp(requirement);
    const isValide = re.test(value);
    return {
      isValide,
      message: isValide ? '' : 'the value must be Match with : ' + requirement,
    };
  },
  enum: (value: any, requirement: string | any[]) => {
    const isValide = requirement.includes(value);
    return {
      isValide,
      message: isValide ? '' : 'the value must be included in : ' + requirement,
    };
  },
  file: (value: { type: String }, requirement: any) => {
    // console.log(
    //   'value.type',
    //   value.type,
    //   'isValide',
    //   isValideType(requirement.type || ['*/*'], value.type),
    // );
    if (value.type && isValideType(requirement.type || ['*/*'], value.type)) {
      return {
        isValide: false,
        message: 'the value must be included in : ' + requirement,
      };
    }
    return true;
  },
  type: async (value: any, requirement: string) => {
    if (requirement === 'Boolean') {
      if (
        value === 'true' ||
        value === 'false' ||
        value === true ||
        value === false
      ) {
        return { isValide: true };
      }
      return {
        isValide: false,
        message: 'the type of value bust be : ' + requirement,
      };
    } else if (requirement === 'Number') {
      try {
        if (!Number.isNaN(Number(value))) {
          return { isValide: true, err: Number(value) };
        }
        return {
          isValide: false,
          message: 'the type of value bust be : ' + requirement,
        };
      } catch (error) {
        return {
          isValide: false,
          message: 'the type of value bust be : ' + requirement,
        };
      }
    } else if (requirement === 'String') {
      return {
        isValide: true,
      };
    } else if (requirement === 'Date') {
      try {
        if (new Date(value)) {
          return { isValide: true };
        }
        return {
          isValide: false,
          message: 'the type of value bust be : ' + requirement,
        };
      } catch (error) {
        return {
          isValide: false,
          message: 'the type of value bust be : ' + requirement,
        };
      }
    } else if (requirement === 'array') {
      ////////////////////////////////////////
      try {
        if (Array.isArray(value)) {
          return { isValide: true };
        }
        return {
          isValide: false,
          message: 'the type of value bust be : ' + requirement,
        };
      } catch (error) {
        return {
          isValide: false,
          message: 'the type of value bust be : ' + requirement,
        };
      }
    } else if (requirement === 'ObjectId') {
      try {
        return {
          isValide: await new Promise(rev => {
            SQuery.socket.emit(
              'server:valideId',
              { id: value },
              (res: { response: any }) => {
                rev(!!res.response);
              },
            );
          }),
          message: 'the type of value bust be : ' + requirement,
        };
      } catch (error) {
        return {
          isValide: false,
          message: 'the type of value bust be : ' + requirement,
        };
      }
    }
    return {
      isValide: true,
    };
  },
  required: (value: string | null | undefined, requirement: any) => {
    let isValide = true;
    if (requirement) {
      isValide =
        value === undefined || value == null || value === '' ? false : true;
    }
    return {
      isValide,
      message: 'the value is required',
    };
  },
};

SQuery.Validatior = async (rule: any, value: any) => {
  let res = await validations.type(value, rule.type);
  //   console.log('rule : ', rule, 'value : ', value, 'res: ', res);
  if (!res.isValide) {
    return {
      message: res.message,
      //   e: console.log('res: ', { res }),
    };
  }

  if (ValidationMap[rule.type]) {
    for (const p of ValidationMap[rule.type]) {
      if (rule[p] && validations[p]) {
        // console.log(
        //   'rule[p] : ',
        //   rule[p],
        //   'value : ',
        //   validations[p](value, rule[p]),
        // );
        if (!(res = validations[p](value, rule[p])).isValide) {
          return {
            message: res.message,
            // e: console.log('res: ', { res }),
          };
        }
      }
    }
  }
  if (rule.file) {
    if (!(res = validations.file(value, rule.file)).isValide) {
      return {
        message: res.message,
        // e: console.log('res: ', { res }),
      };
    }
  }

  // if (ActionsMap[rule.type]) {
  //     const actions = ActionsMap[rule.type];
  //     console.log(ActionsMap[rule.type]);
  //     for (const p in actions) {
  //         if (rule[p] && actions[p]) {
  //             value = actions[p](value, rule[p]);
  //         }
  //     }
  // }

  return {
    value,
  };
};
export default SQuery;

// function getIP(callback){
//     fetch('https://api.ipregistry.co/?key=tryout')
//       .then(response => response.json())
//       .then(data => callback(data));
//   }
//   getIP(function(ip){
//   console.log(ip);

//   });
