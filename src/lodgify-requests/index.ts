import * as _requests from './requests';

import type { AppContextType } from '../App/contexts/AppContext';
import { map } from '../util';


export * from './requests';
export * from './types';


type Requests = typeof _requests;

type RequestsWithContext = {
    [ K in keyof Requests ]: (options: Parameters<Requests[ K ]>[ 0 ]) => ReturnType<Requests[ K ]>
};

export const requests = (context: AppContextType): RequestsWithContext => {
    return map(_requests, (name, request) => [ name, options => request(options, context.isDebug ? context.logInfo : undefined) ]) as RequestsWithContext;
};
