import { createContext } from 'react';
import { Direction } from './Container';

export type ContainerContextType = {
    isRow: boolean;
    isColumn: boolean;
    isResponsive: boolean;
    isBarFixed: boolean;
    direction: Direction;
};

export const ContainerContext = createContext<ContainerContextType>(null);
