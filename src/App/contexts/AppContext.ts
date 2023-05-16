import { createContext } from 'react';

import type { CountriesMetadata, PhonesMetadata, TimezonesMetadata } from '@root/types';


export type AppContextType = {
    mode: 'dev' | 'prod';
    isDebug: boolean;
    logInfo: (v: unknown) => void;
    logError: (v: unknown) => void;
    phonesMetadata: PhonesMetadata;
    countriesMetadata: CountriesMetadata;
    timezonesMetadata: TimezonesMetadata;
};

export const AppContext = createContext<AppContextType>(null);
