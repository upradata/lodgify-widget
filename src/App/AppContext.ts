import { createContext } from 'react';

export type AppContextType = {
    mode: 'dev' | 'prod';
    isDebug: boolean;
    log: (v: unknown) => void;
};

export const AppContext = createContext<AppContextType>(null);
