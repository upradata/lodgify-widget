import React, { useCallback, useEffect, useState } from 'react';
import { TABLET_BREAKPOINT } from '@lodgify/ui/lib/commonjs/utils/with-responsive/constants';

const windowDimension = () => ({
    windowWidth: global.innerWidth,
    windowHeight: global.innerHeight
});

type WindowDimension = ReturnType<typeof windowDimension>;

export type ComponentWithResponsiveProps<P = {}> = { isUserOnMobile?: boolean; } & Partial<WindowDimension> & P;

export const withResponsive = function <P = {}>(
    WrappedComponent: React.ComponentType<ComponentWithResponsiveProps<P>>,
    options: { fireOnMount?: boolean; } = {}
) {

    const WrapperComponent: React.FunctionComponent<P> = props => {
        const [ state, setState ] = useState(windowDimension());

        const handleResize = useCallback((/* event: UIEvent */) => {
            setState(windowDimension());
        }, [ setState ]);


        useEffect(() => {
            global.addEventListener('resize', handleResize);

            if (options.fireOnMount)
                handleResize();

            return () => {
                global.removeEventListener('resize', handleResize);
            };
        }, []);
        const { children, ...restProps } = props;

        const C = WrappedComponent as React.ComponentType<ComponentWithResponsiveProps>;

        return (
            <C
                isUserOnMobile={state.windowWidth < TABLET_BREAKPOINT}
                {...state}
                {...restProps}>
                {children}
            </C>
        );
    };

    WrapperComponent.displayName = `WithResponsive(${WrappedComponent.displayName})`;
    return WrapperComponent;
};
