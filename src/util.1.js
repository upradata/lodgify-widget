



const isClass = (v) => {
    const names = Object.getOwnPropertyNames(v);
    return names.includes('prototype') && !names.includes('arguments');
};

const fragments = (obj, ...parts) => {
    const keys = (part) => {
        if (Array.isArray(part))
            return part;

        if (isClass(part))
            return Reflect.ownKeys(new part());

        return Reflect.ownKeys(part);
    };

    const fragments = parts.reduce((arr, part) => {
        const fragment = Object.fromEntries(keys(part).map(key => [ key, obj[ key ] ]));
        return [ ...arr, fragment ];
    }, []);

    return fragments;
};

console.log(fragments({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }, [ 'a', 'c' ], [ 'b' ], { d: undefined }, class { e; f; }));
/* const o = fragments({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } as const, [ 'a', 'c' ] as const, [ 'b' ] as const, { d: undefined } as const, class { e; f; });

o[ 0 ].a === 1;
// o[ 0 ].b === 1;
o[ 0 ].c === 3;

o[ 1 ].b === 2;

o[ 2 ].d === 4;

o[ 3 ].e === 5;
o[ 3 ].f === 6; */


// const o2 = fragments({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } as const, [ 'a', 'c' ], [ 'b' ], { d: undefined }, class { e; f; });



const partition = (o, p) => {
    const [ oP ] = fragments(o, p);
    const opKeys = Reflect.ownKeys(oP);

    const rest = Object.keys(o).reduce((rest, k) => opKeys.includes(k) ? rest : { ...rest, [ k ]: o[ k ] }, {});

    return [ oP, rest ];
};


console.log(partition({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }, [ 'a', 'c' ]));
