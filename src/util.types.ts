type TrimStart<S> = S extends `${infer Char}${infer Rest}`
    ? Char extends ' ' ? TrimStart<Rest> : S :
    S;

// type TestTrimStart = TrimStart<'      ABC'>;

// Better version handling more input in camle case and white spaces (trim also at start and end)
export type KebabCase<S, R extends string = ''> = S extends `${infer Char}${infer Rest}`
    ? Char extends ' ' ? TrimStart<S> extends infer TrimS ? TrimS extends '' ? R : KebabCase<TrimS, R extends '' ? R : `${R}-`> : never :
    // 2 cases: 1) rest=ab... 2) we have rest=Ab....
    Rest extends Uncapitalize<Rest> ? KebabCase<Rest, `${R}${Uncapitalize<Char>}`> : KebabCase<Rest, `${R}${Uncapitalize<Char>}-`>
    : R;


export type PropsWithStyle<P = {}> = P & {
    style?: React.CSSProperties;
    className?: string;
};

export class PropsWithStyleBase {
    style?: React.CSSProperties;
    className?: string;
};


export class DateRange<T = string>{
    startDate: T;
    endDate: T;
}

export type Typify<T> = {
    [ K in keyof T ]: T[ K ]
};


export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
