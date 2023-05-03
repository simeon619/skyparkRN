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
      return (state = action.payload);
    },
  },
});

const contactSlice = createSlice({
  name: 'contact',
  initialState: [],
  reducers: {
    addConatct: (state: any, action) => {
      state = action.payload;
      return state;
    },
  },
});
const postQuarterSlice = createSlice({
  name: 'postQuarter',
  initialState: {},
  reducers: {
    addPostQuarter: (state: any, action) => {
      return (state = action.payload);
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
    postQuarter: postQuarterSlice.reducer,
    contact: contactSlice.reducer,
  },
});

export const { addInfoUser } = userDataSlice.actions;
export const { addComment } = commentSlice.actions;
export const { addPostQuarter } = postQuarterSlice.actions;
export const { addConatct } = contactSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
