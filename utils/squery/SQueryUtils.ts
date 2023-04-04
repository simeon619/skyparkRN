import EventEmiter from './event/eventEmiter';
import SQuery from './SQueryClient';

export const Descriptions: { [str: string]: any } = {};

export async function getDesription(modelPath: string): Promise<any> {
  if (typeof modelPath != 'string')
    throw new Error(
      'getDesription(' +
        modelPath +
        ') is not permit, parameter must be string',
    );
  if (Descriptions[modelPath]) {
    return Descriptions[modelPath];
  }
  return await new Promise(rev => {
    // console.log('********************');
    SQuery.emitNow(
      'server:description',
      {
        modelPath,
      },
      (res: any) => {
        // console.log('server:description', res);
        if (res.error) throw new Error(JSON.stringify(res));
        Descriptions[modelPath] = res.response;
        //console.log('********************', res);
        rev(Descriptions[modelPath]);
      },
    );
  });
}
export async function getDesriptions() {
  const descriptions: any = await new Promise(rev => {
    SQuery.socket.emit('server:descriptions', {}, (res: any) => {
      if (res.error) throw new Error(JSON.stringify(res));
      //console.log('88888888888888888888888888', res);
      rev(res.response);
    });
  });
  for (const key in descriptions) {
    if (Object.hasOwnProperty.call(descriptions, key)) {
      Descriptions[key] = descriptions[key];
    }
  }

  return Descriptions;
}
export async function createModelFrom(modelPath: string) {
  const Model: any = {};
  const description = await getDesription(modelPath);
  Model.description = description;
  Model.create = async (data: any, errorCb: (e: any) => void) => {
    ///// verifier si chaque donner est bien rentrer

    if (!errorCb) errorCb = (e: any) => console.error(e);
    const validation = await SQuery.Validatior(description, data);
    if (validation.message) {
      // console.error(validation);
      errorCb({
        properties: validation,
      });
      return null;
    }
    return await new Promise(rev => {
      try {
        SQuery.emitNow(
          'model_' + modelPath + ':create',
          data,
          async (res: { error: any; response: any }) => {
            try {
              if (res.error) {
                errorCb(res);
                return rev(null);
              }
              rev(await createInstanceFrom({ modelPath, id: res.response }));
            } catch (e) {
              errorCb(e);
              return rev(null);
            }
          },
        );
      } catch (e) {
        errorCb(e);
        return rev(null);
      }
    });
  };
  /** ****************      Instance      ******************* */
  Model.newInstance = async (data: { id: any }, errorCb: (e: any) => void) => {
    if (!errorCb) errorCb = (e: any) => console.error(e);
    let instance = null;
    try {
      try {
        // console.log('*************', { modelPath, id: data.id, description });
        instance = await createInstanceFrom({ modelPath, id: data.id, Model });
      } catch (e) {
        errorCb(e);
      }
    } catch (e) {
      errorCb(e);
    }
    return instance;
  };

  Model.newParentInstance = async (
    { childInstance, childId }: any,
    errorCb: (e: any) => void,
  ) => {
    if (!errorCb) errorCb = (e: any) => console.error(e);
    let parentInstance = null;
    let parentModelPath;
    let parentId;
    if (!childInstance) {
      childInstance = await createInstanceFrom({
        modelPath,
        id: childId,
        Model,
      });
    }
    try {
      try {
        parentId = await childInstance['$parentId'];
        parentModelPath = await childInstance['$parentModelPath'];
        const parentModel = await SQuery.Model(parentModelPath);
        parentInstance = parentModel.newInstance({ id: parentId });
      } catch (e) {
        errorCb(e);
      }
    } catch (e) {
      errorCb(e);
    }

    return parentInstance;
  };
  Model.update = async (data: any) => {
    return await new Promise((rev, rej) => {
      try {
        SQuery.emitNow(
          'model_' + modelPath + ':update',
          data,
          (res: { error: any; response: any }) => {
            try {
              if (res.error) {
                console.error(res);
                return rev(null);
              }
              //console.log('*************', { modelPath, id: res.response, description });
              rev(createInstanceFrom({ modelPath, id: res.response, Model }));
              //restCarte.text.value = JSON.stringify(res);
            } catch (e) {
              console.error(res);
              rev(null);
              //restCarte.text.value = JSON.stringify(e);
            }
          },
        );
      } catch (e) {
        rev(null);
        console.error(e);
        //restCarte.text.value = e;
      }
    });
  };
  return Model;
}
export async function createInstanceFrom({ modelPath, id, Model }: any) {
  let cache: any = {};
  let propertyCache: any = {};
  const instance: any = {};
  if (!id || !modelPath) {
    console.error('id = ' + id, 'modelPath = ' + modelPath);
    return null;
  }
  const description = await getDesription(modelPath);
  description._id = {
    type: 'String',
  };

  let lastInstanceUpdateAt = 0;
  const emiter = new EventEmiter();
  await (async () => {
    await new Promise(rev => {
      SQuery.emitNow(
        'model_' + modelPath + ':read',
        {
          id: id,
        },
        async (res: { error: any; response: {} }) => {
          if (res.error) throw new Error(JSON.stringify(res));
        //   console.log('--> response:' + 'model_' + modelPath + ':read', res);
          cache = res.response;
          lastInstanceUpdateAt = cache.updatedAt;
          //  await emitRefresh()
          rev(cache);
        },
      );
    });
  })();
  SQuery.on(
    'update:' + cache._id,
    async (data: { doc: { updatedAt?: any }; properties: any }) => {
    //   console.log('+++++++++++++ 1 ++++++++++++++', data);
      // console.log('last : ' + lastInstanceUpdateAt, 'data update At  :' + data.doc.updatedAt);
      // console.log('now : ' + lastInstanceUpdateAt, 'data update At  :' + data.doc.updatedAt);
      // console.log('data.properties : ' + data.properties);
      cache = data.doc;
      lastInstanceUpdateAt = data.doc.updatedAt;
      await emitRefresh(data.properties);
    },
  );
  //////
  async function emitRefresh(properties: any[]) {
    emiter.emit('refresh', instance);
    if (properties) {
      properties.forEach(async (p: string) => {
        console.log('+++++++++++++ 2 ++++++++++++++', p, await instance[p]);
        emiter.emit('refresh:' + p, await instance[p]);
      });
    } else {
      for (const p in description) {
        if (Object.hasOwnProperty.call(description, p)) {
        //   console.log('+++++++++++++ 3 ++++++++++++++', p, await instance[p]);
          emiter.emit('refresh:' + p, await instance[p]);
        }
      }
    }
  }

  for (const property in description) {
    if (Object.hasOwnProperty.call(description, property)) {
      const rule = description[property];
      let lastPropertyUpdateAt = 0;
      let firstRead = true;
      Object.defineProperties(instance, {
        [property]: {
          get: async function () {
            if (rule.ref) {
              if (firstRead || lastPropertyUpdateAt != lastInstanceUpdateAt) {
                propertyCache[property] = await createInstanceFrom({
                  modelPath: rule.ref,
                  id: cache[property],
                  Model,
                });
                lastPropertyUpdateAt = lastInstanceUpdateAt;
                firstRead = false;
                // console.log('get:propertyCache[' + property + ']', {
                //   propertyCache,
                //   cache,
                // });
              }
              return propertyCache[property];
            } else if (rule[0] && rule[0].ref) {
              // invalible
              if (firstRead) {
                propertyCache[property] = await createArrayInstanceFrom({
                  modelPath,
                  id,
                  property,
                  description,
                  Model,
                });
                propertyCache[property].when('refresh', async () => {
                //   console.log(
                //     '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ array emit  refresh  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
                //   );
                  // await emitRefresh([property]);
                });
                instance.when('refresh:' + property, (value: any) => {
                //   console.log(
                //     '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ array emit  refresh  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
                //     { value },
                //   );
                  propertyCache[property].update();
                });
                firstRead = false;
              }
              return propertyCache[property];
            } else if (rule[0]) {
              if (firstRead || lastPropertyUpdateAt != lastInstanceUpdateAt) {
                propertyCache[property] = cache[property];
                lastPropertyUpdateAt = lastInstanceUpdateAt;
                firstRead = false;
                // console.log('get:propertyCache[' + property + ']', { propertyCache, cache });
              }
              return propertyCache[property];
            } else {
              if (firstRead || lastPropertyUpdateAt != lastInstanceUpdateAt) {
                propertyCache[property] = cache[property];
                lastPropertyUpdateAt = lastInstanceUpdateAt;
                firstRead = false;
                //  console.log('get:propertyCache[' + property + ']', { propertyCache, cache });
              }
              return propertyCache[property];
            }
          },
          set: async function (value) {
           
            if (value == cache[property]) return;
            if (rule.ref) {
              //vouloire changer l'id stocker dans une proprieter, cella de doit etre permis ou non
              //return console.error('ReadOnly modelInstance["refProperty"], Exemple: const modelInstance =  await modelInstance["refProperty"] ');
            } else if (rule[0] && rule[0].ref) {
              const ai = await instance[property];
              //console.log('array instance avant .update(conf)', ai);
              return await ai.update(value);
            } else if (rule[0] && rule[0].file) {
              const files = [];
              for (const p in value) {
                if (Object.hasOwnProperty.call(value, p)) {
                  const file = value[p];
                  const fileData = {
                    fileName: file.name || file.fileName,
                    size: file.size,
                    type: file.type || file.mime,
                    buffer: file.buffer || await file.arrayBuffer(),
                  };
                  console.log({...fileData , buffer :'null'}, "filedata");
                  
                  files.push(fileData);
                }
              }
              value = files;
              console.log('value',{...value[0] , buffer :'null'} , 'value');
              
            }
            const result = await SQuery.Validatior(
              description[property],
              value,
            );
            if (result.value == undefined) {
              await emitRefresh([property]);
              throw new Error(
                'Invalide Value :' + value + ' \n because : ' + result.message,
              );
            }
            try {
              await instance.update({
                id,
                [property]: value,
              });
            } catch (error) {
              console.error(error);
            }
            await emitRefresh([property]);
            lastPropertyUpdateAt = cache.updatedAt;
          },
        },
      });
    }
  }
  instance.update = async (data: any) => {
    console.log('avant emit now',{data ,id , modelPath});
    
    SQuery.emitNow(
      'model_' + modelPath + ':update',
      {
        ...data,
        id,
      },
      (res: { error: any; response: {} }) => {
        if (res.error) {
          throw new Error(JSON.stringify(res));
        }
        console.log('response',res);
        
        cache = res.response;
      },
    );
  };
  instance.when = (
    events: string,
    listener: any,
    changeRequired?: boolean | undefined,
  ) => {
    emiter.when(events, listener, changeRequired);
  };
  const parts = (await instance.__parentModel).split('_');
  instance.$modelPath = modelPath;
  instance.$parentModelPath = parts[0];
  instance.$parentId = parts[1];
  instance.$parentProperty = parts[2];
  instance.$model = Model;
  instance.$id = await instance._id;
  instance.newParentInstance = async () => {
    return Model.newParentInstance({ childInstance: instance });
  };
 
  return instance;
}
export async function createArrayInstanceFrom({
  modelPath: parentModel,
  id: parentId,
  property,
  description,
}: any) {
  let currentData: any = null;
  const emiter = new EventEmiter();
  /**
     emit ('paging data change invalid')
    **/
  let paging: any = {
    page: 1,
    limit: 20,
    select: '',
    sort: {},
    query: {},
  };

  let itemModelPath = '';
  try {
    itemModelPath = description[property][0].ref;
    if (!itemModelPath)
      throw new Error(
        'Cannot create a Array Instance with a following description, modelPath = ' +
          itemModelPath,
      );
  } catch (error: any) {
    throw new Error(error.message);
  }

  const arrayInstance: any = {};
  const refresh = async (
    options?:
      | { remove?: any; addNew?: any; addId?: any; paging?: any; opi?: any }
      | undefined,
  ) => {
    options = options || {};
    let canRefresh = options.remove || options.addNew || options.addId;
    if (options.paging) {
      canRefresh = true;
      options.paging = paging = {
        ...paging,
        ...options.paging,
        ert: 'pagin',
      };

      emiter.emit('paging', paging);
    } else {
      options.paging = paging;
      options.opi = 'node p';
    }
    // console.log('@@@@@@@@@@@@@@@@@@@@@@@option : ', options);
    options.paging.query = {
      __parentModel: parentModel + '_' + parentId + '_' + property,
    };
    // console.log('#####################option : ', options);

    return await new Promise(rev => {
      if (SQuery.socket.connected) {
        SQuery.emitNow(
          'model_' + itemModelPath + ':list',
          {
            ...options,
            property,
          },
          async (res: { error: any; response: any }) => {
            if (res.error) throw new Error('****=> ' + JSON.stringify(res));
            currentData = res.response;
            paging.page = currentData.page;
            paging.limit = currentData.limit;
            emiter.emit('dataAvalaible', currentData);
            if (canRefresh) emiter.emit('refresh', currentData);

            Object.defineProperties(currentData, {
              ['itemsInstance']: {
                get: async () => {
                  if (currentData['#itemsInstance']) {
                    return currentData['#itemsInstance'];
                  }
                  const promises = currentData.items.map(
                    (item: { _id: any }) => {
                      return new Promise(async rev => {
                        const instance = await createInstanceFrom({
                          modelPath: itemModelPath,
                          id: item._id,
                        });
                        rev(instance);
                      });
                    },
                  );
                  const itemsInstance: any = (
                    await Promise.allSettled(promises)
                  )
                    .map((p: any) => {
                      return p.value || null;
                    })
                    .filter(itemInstance => {
                      return !!itemInstance;
                    });
                //   console.log(itemsInstance);
                  return (currentData['#itemsInstance'] = itemsInstance);
                },
                set: async () => {
                  console.error('ReadOnly ArrayData["itemsInstance"] ');
                },
              },
            });
            // console.log('currentData', currentData);

            rev(currentData);
          },
        );
      } else {
        throw new Error('DISCONNECT FROM SERVER');
      }
    });
  };
  const data: any = await refresh();
  arrayInstance.back = async () => {
    // console.log('----back : ');
    if (currentData && currentData.hasPrevPage) {
      paging.page = currentData.prevPage;
      return await refresh();
    } else {
      throw new Error(
        'back() == null; backPage = ' +
          (paging.page - 1) +
          ' ;interval = [ 1 ; ' +
          currentData.totalPages +
          ' ]',
      );
    }
  };
  arrayInstance.next = async () => {
    // console.log('----next : ');
    if (currentData && currentData.hasNextPage) {
      paging.page = currentData.nextPage;
      return await refresh();
    } else {
      throw new Error(
        'next() == null; nextPage = ' +
          (paging.page + 1) +
          ' ;interval = [ 1 ; ' +
          currentData.totalPages +
          ' ]',
      );
    }
  };
  arrayInstance.page = async (page: number) => {
    if (!page) {
      if (currentData) {
        emiter.emit('dataAvalaible', currentData);
        return currentData;
      }
      return await refresh();
    } else if (currentData && page > 0 && page <= currentData.totalPages) {
      paging.page = page;
      return await refresh();
    } else {
      throw new Error(
        'page(' +
          page +
          ') == null; page interval = [ 1 ; ' +
          currentData.totalPages +
          ' ]',
      );
    }
  };
  arrayInstance.__itemModelPath = Promise.resolve(itemModelPath);
  arrayInstance.last = async () => {
    if (paging.page == currentData.totalPages) {
      emiter.emit('dataAvalaible', currentData);
      return currentData;
    }
    paging.page = currentData.totalPages;
    return await refresh();
  };
  arrayInstance.update = async (options: any) => {
    // console.error('**********options********* : ', options);
    return await refresh({ ...options });
  };
  arrayInstance.when = (
    events: string,
    listener: any,
    changeRequired?: boolean | undefined,
  ) => {
    emiter.when(events, listener, changeRequired);
  };
  return arrayInstance;
}
