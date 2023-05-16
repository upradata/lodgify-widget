import { createContext } from 'react';

export type PropertyContextType = {
    websiteId: number;
};

export const PropertyContext = createContext<PropertyContextType>(null);
