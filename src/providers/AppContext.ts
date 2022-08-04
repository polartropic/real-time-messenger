import { createContext, type Dispatch } from 'react';


const AppState = createContext({
  appState: {
    user: null,
    userData: null,
  },
  setState: (() => undefined) as Dispatch<any>,
});

export default AppState;
