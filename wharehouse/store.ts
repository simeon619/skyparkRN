import { configureStore, createSlice } from '@reduxjs/toolkit';

const userDataSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    addInfoUser: (state: any, action) => {
      let newState = {};
      newState = action.payload;
      state = newState;
      return state;
    },
  },
});

const commentSlice = createSlice({
  name: 'comment',
  initialState: {},
  reducers: {
    addComment: (state: any, action) => {
      console.log(action.payload, 'ttttttttttttttt');
      return (state = action.payload);
    },
  },
});

const postDataBServerSlice = createSlice({
  name: 'postB',
  initialState: [],
  reducers: {
    addPostBServer: (state: any, action) => {
      state = action.payload;
      return state;
    },
  },
});
const postDataQServerSlice = createSlice({
  name: 'postQ',
  initialState: [],
  reducers: {
    addPostQServer: (state: any, action) => {
      state = action.payload;
      return state;
    },
  },
});

// const statutSlice = createSlice({
//   name: 'statut',
//   initialState: {},
//   reducers: {
//     getStaut: (state) => {
//       return state;
//     },
//     set_statut: (state: any, action) => {
//       state.etat = action.payload
//       console.log(state);

//     },
//   },
// });

export const store = configureStore({
  reducer: {
    dataUser: userDataSlice.reducer,
    commentPost: commentSlice.reducer,
    postDataQServer: postDataQServerSlice.reducer,
    postDataBServer: postDataBServerSlice.reducer,
  },
});

export const { addInfoUser } = userDataSlice.actions;
export const { addComment } = commentSlice.actions;
export const { addPostQServer } = postDataQServerSlice.actions;
export const { addPostBServer } = postDataBServerSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
