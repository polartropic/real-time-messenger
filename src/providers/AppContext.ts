import { createContext, type Dispatch } from 'react';


const AppContext = createContext({
  appState: {
    user: null,
    userData: null,
  },
  setState: (() => undefined) as Dispatch<any>,
});

export default AppContext;
