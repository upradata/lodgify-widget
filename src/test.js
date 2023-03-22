(() => {
    const mixin = (...classes) => {
        const { prototype, constructors, instance } = classes.reduce((acc, Class) => ({
            prototype: [ ...acc.prototype, Class.prototype ],
            constructors: [ ...acc.constructors, Class ],
            instance: { ...acc.instance, ...new Class() }
        }), { prototype: [], constructors: [], instance: {} });



        function SuperClass() {
            Object.assign(this, instance);
            // constructors.forEach(C => Reflect.construct(C, [], SuperClass));
        }

        Object.setPrototypeOf(SuperClass.prototype, prototype);
        console.log(prototype);
        SuperClass.name = constructors.map(c => c.name).join(', ');

        return SuperClass;
    };

    class A { a = 1; f() { return 'f'; } }
    class B { b = 2; g() { return 'g'; } }

    const C = mixin(A, B);
    const c = new C();
    console.log('caca', C, 'pipi', c, c.a, c.b, /* c.f(), c.g() */);
})();