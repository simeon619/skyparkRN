import * as Keychain from 'react-native-keychain';
import { io } from 'socket.io-client';
import { createModelFrom, getDesription, getDesriptions } from './SQueryUtils';
const SQuery: any = {};
/**
 * 
 * const socket = io(null,{
    extraHeaders: {
        cookie: null/keyChaine.get("cookie")/||'',
    }
});

socket.on("storeCookie", (cookie) => {
   //keyChaine.set('cookie',cookie);
    socket.io.opts.extraHeaders = {
        ...socket.io.opts.extraHeaders,
        cookie,
    }
});
 */

// Keychain.getGenericPassword('cookie')

const socket = io('http://192.168.1.4:3500');

(async () => {
  let u: any = await Keychain.getGenericPassword();
  console.log(u);
  
  socket.io.opts.extraHeaders = {
    ...socket.io.opts.extraHeaders,
    cookie: u.password,
  };
})();

socket.on('storeCookie', async cookie => {
  await Keychain.resetGenericPassword();
  try {
    await Keychain.setGenericPassword('cookie', cookie);
    socket.io.opts.extraHeaders = {
      ...socket.io.opts.extraHeaders,
      cookie,
    };
    console.log('Cookie stored successfully');
  } catch (error) {
    console.log('Error storing cookie:', error);
  }
});

SQuery.socket = socket;

SQuery.Model = async (modelPath: string) => {
  return await createModelFrom(modelPath);
};

SQuery.emit = (event: string, ...arg: any[]) => {
  if (typeof event != 'string')
    throw new Error(
      'cannot emit with following event : ' +
        event +
        '; event value must be string',
    );
  if (SQuery.socket.connected) {
    console.log('event:'+event);
    
    socket.emit(event, ...arg);
  } else {
    throw new Error('DISCONNECT FROM SERVER');
  }
};
SQuery.emitLater = (event: string, ...arg: any[]) => {
  if (typeof event != 'string')
    throw new Error(
      'cannot emit with following event : ' +
        event +
        '; event value must be string',
    );
  socket.emit(event, ...arg);
};

SQuery.on = (event: string, listener: any) => {

  socket.on(event, listener);
};

SQuery.getDesription = getDesription;
SQuery.getDesriptions = getDesriptions;

// const ActionsMap = {
//     String: {
//         lowerCase: (value, requirement) => {
//             return requirement ? value.toLowerCase() : value;
//         },
//         upperCase: (value, requirement) => {
//             return requirement ? value.toUpperCase() : value;
//         },
//         trim: (value, requirement) => {
//             return requirement ? value.trim() : value;
//         },
//     }
// }
const ValidationMap: any = {
  String: ['minlength', 'maxlength', 'match', 'enum', 'required'],
  Number: ['min', 'max', 'enum', 'required'],
  Date: ['min', 'max', 'enum', 'required'],
  Array: ['length', 'required'], //////////
};

function isValideType(ruleTypes: any[], type: string) {
  const typeSide = type.split('/');

  let valide = false;

  ruleTypes.forEach((ruleType: any) => {
    const ruleSide = ruleType.split('/');
    const match = (side: any) => {
      if (ruleSide[side] == '*') return true;
      else if (
        ruleSide[side].toLocaleLowerCase() == typeSide[side].toLocaleLowerCase()
      )
        return true;
      else return false;
    };

    if (match(0) && match(1)) {
      valide = true;
    }
  });
  return valide;
}

const validations: any = {
  minlength: (
    value: string | any[],
    requirement: string | number | number[],
  ) => {
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
  maxlength: (
    value: string | any[],
    requirement: string | number | number[],
  ) => {
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
  min: (value: number, requirement: string | number) => {
    const isValide = value >= requirement;
    return {
      isValide,
      message: isValide ? '' : 'the minimum value is ' + requirement,
    };
  },
  max: (value: number, requirement: string | number) => {
    const isValide = value <= requirement;
    return {
      isValide,
      message: isValide ? '' : 'the maximum value is ' + requirement,
    };
  },
  match: (value: string, requirement: string | RegExp) => {
    console.log(requirement);
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
  file: (value: { type: any }, requirement: any) => {
    console.log(
      'value.type',
      value.type,
      'isValide',
      isValideType(requirement.type || ['*/*'], value.type),
    );
    if (value.type && isValideType(requirement.type || ['*/*'], value.type)) {
      return 'the value must be included in : ' + requirement;
    }
    return true;
  },
  type: async (value: any, requirement: string) => {
    if (requirement == 'Boolean') {
      if (
        value == 'true' ||
        value == 'false' ||
        value === true ||
        value === false
      )
        return { isValide: true };
      return {
        isValide: false,
        message: 'the type of value bust be : ' + requirement,
      };
    } else if (requirement == 'Number') {
      try {
        if (!Number.isNaN(Number(value)))
          return { isValide: true, err: Number(value) };
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
    } else if (requirement == 'String') {
      return {
        isValide: true,
      };
    } else if (requirement == 'Date') {
      try {
        if (new Date(value)) return { isValide: true };
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
    } else if (requirement == 'array') {
      ////////////////////////////////////////
      try {
        if (Array.isArray(value)) return { isValide: true };
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
    } else if (requirement == 'ObjectId') {
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
        value == undefined || value == null || value == '' ? false : true;
    }
    return {
      isValide,
      message: 'the value is required',
    };
  },
};

SQuery.Validatior = async (rule: any, value: any) => {
  let res = await validations.type(value, rule.type);
  console.log('rule : ', rule, 'value : ', value, 'res: ', res);
  if (!res.isValide)
    return {
      message: res.message,
      e: console.log('res: ', { res }),
    };

  if (ValidationMap[rule.type]) {
    for (const p of ValidationMap[rule.type]) {
      if (rule[p] && validations[p]) {
        console.log(
          'rule[p] : ',
          rule[p],
          'value : ',
          validations[p](value, rule[p]),
        );
        if (!(res = validations[p](value, rule[p])).isValide)
          return {
            message: res.message,
            e: console.log('res: ', { res }),
          };
      }
    }
  }
  if (rule.file) {
    if (!(res = validations.file(value, rule.file)).isValide)
      return {
        message: res.message,
        e: console.log('res: ', { res }),
      };
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
