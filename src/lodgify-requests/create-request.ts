import { map, toCasedObject } from '../util';
import { RequestErrors } from './requests.error';

import type { CamelObject, SelectType } from '../util.types';


// API at https://docs.lodgify.com/reference/

export const arrayToOption = <T extends {}>(options: T[], baseKey: string, mapping?: (key: keyof T) => string) => {
    if (!options)
        return {};

    const keyMapping = mapping || ((k: string) => k);

    return options.reduce<{}>((o, item, i) => {
        const option = map(item, (k, v) => [ `${baseKey}[${i}].${keyMapping(k as keyof T & string)}`, v ]);

        return {
            ...o,
            ...option
        };
    }, {});
};


export type LodgifyVersion = 'v1' | 'v2';

const corsProxy = `http://localhost:8080`;
const lodgifyApi = (version: LodgifyVersion) => `https://api.lodgify.com/${version}`;

export const getLodgifyOptions = (body?: string): RequestInit => ({
    method: !!body ? 'POST' : 'GET',
    headers: {
        accept: 'application/json',
        ...(!!body ? { 'content-type': 'application/*+json' } : {}),
        'X-ApiKey': '+BvSxGGZ/ay5H3lVshlgJvyDwSqRXAnhU4/kjvRdECoPHGTbKZ3pngf3MgEVv2K/',
        // mode: 'same-origin'
    },
    body
});



export type RequestSuccess<T = unknown> = {
    type: 'success';
    json: T;
};

export type RequestError = {
    type: 'error';
    error: Error;
};

export type LodgifyError = {
    message: string;
    code: keyof typeof RequestErrors;
    correlation_id: string;
    event_id: string;
};

type Primitive = boolean | string | number;
export type Options = { propertyId?: number; roomTypeId?: number; } & (
    { type: 'url-parameters'; } & Record<string, Primitive> |
    { type: 'body-parameters'; } & Record<string, unknown>
);


const join = (sep: string, ...paths: Primitive[]) => paths.filter(s => !!s).join(sep);



const lodgifyREST = (verb: string, options: Record<string, Primitive> = {}) => {
    const { propertyId, roomTypeId, ...opts } = options;

    const opt = Object.entries(opts).reduce((s, [ k, v ]) => join('&', s, `${k}=${v}`), '');
    return join('?', join('/', verb, propertyId, roomTypeId), opt);
};

type DebugFn = (data: { requestUrl: string, body: string; }) => void;
type CreateRequestReturn<T = unknown> = Promise<RequestSuccess<T> | RequestError>;


export const createRequest = <T = unknown>(verb: string, options: Options, version: LodgifyVersion) => (debug?: DebugFn): CreateRequestReturn<T> => {
    const { type, ...opts } = options || {};

    const requestUrl = join('/',
        corsProxy,
        lodgifyApi(version),
        !type || type === 'url-parameters' ? lodgifyREST(verb, opts as SelectType<Options, 'url-parameters'>) : lodgifyREST(verb)
    );

    const body = type === 'body-parameters' ? JSON.stringify(opts) : undefined;

    debug?.({ requestUrl, body });

    return fetch(
        requestUrl,
        getLodgifyOptions(body)
    ).then(response => response.json()).then(json => {
        if (json.code) {
            const { code, message } = json as LodgifyError;
            const codeName = RequestErrors[ code ];

            const errorMessage = `Lodgify request error "${message}" with code (${code}: ${codeName})`;

            console.error(`${errorMessage} -> ${requestUrl}`);
            console.error(json);

            return { type: 'error' as const, error: new Error(errorMessage) };
        }

        return { type: 'success' as const, json };
    }).catch(e => {
        console.error(`Lodgify request error. Request -> ${requestUrl}`);
        console.error(e);
        return { type: 'error' as const, error: e instanceof Error ? e : new Error(JSON.stringify(e)) };
    });
};


export const createRequestV1 = <T = unknown>(verb: string, options?: Options) => createRequest<T>(verb, options, 'v1');
export const createRequestV2 = <T = unknown>(verb: string, options?: Options) => createRequest<T>(verb, options, 'v2');

type CreateRequest<T = any> = (verb: string, options: Options, version: LodgifyVersion) => (debug?: DebugFn) => CreateRequestReturn<T>;
type InferRequestReturn<R> = R extends (options: {}) => ReturnType<CreateRequest<infer T>> ? T : never;

export const makeRequest = <R extends (options: {}) => ReturnType<CreateRequest>>(request: R) => {
    type Return = InferRequestReturn<R>;

    return (options: Parameters<R>[ 0 ], debug?: DebugFn) => {
        return request(options)(debug).then(res => toCasedObject(res, 'camel')) as CreateRequestReturn<CamelObject<Awaited<Return>>>;
    };
};
