
import classnames from 'classnames';
import React from 'react';
import type { GetPropsFromReactElement } from './util.types';

export const wrapWith = <Child extends React.ElementType, AS extends React.ElementType = 'div'>(
    options: { as?: AS; props?: GetPropsFromReactElement<AS>; Component?: Child; componentProps?: Partial<GetPropsFromReactElement<Child>>; } = {}
): React.FunctionComponent<GetPropsFromReactElement<Child>> => {

    const { as: _as = 'div', props: wrapperProps, Component, componentProps } = options;
    const As = _as as React.ElementType;

    const Wrapper: React.FunctionComponent<GetPropsFromReactElement<Child>> = props => {
        const child = Component ? <Component {...componentProps} {...props as any} /> : <React.Fragment>{props.children}</React.Fragment>;
        return <As {...wrapperProps}>{child}</As>;
    };

    Wrapper.displayName = `wrapWith(${(Component as React.ComponentType)?.displayName || 'Component'})`;
    return Wrapper;
};

/* export const wrapWith = <A extends React.ElementType = 'div'>(options: { as?: A; props?: GetPropsFromReactElement<A>; } = {}) => {
    const { as: _as = 'div', props: wrapperProps } = options;
    const As = _as as React.ElementType;

    const Wrapper: React.FunctionComponent = ({ children }) => {
        return <As {...wrapperProps}>{children}</As>;
    };

    return Wrapper;
}; */


export const bindProps = <E extends React.ElementType, P = {}>(
    Component: E,
    props: GetPropsFromReactElement<E> & P
): React.FunctionComponent<GetPropsFromReactElement<E> & P> => {

    const Wrapper: React.FunctionComponent<GetPropsFromReactElement<E> & P> = _props => {
        const className = classnames(_props.className, props.className);
        return <Component {..._props as any} {...props} className={className} />;
    };

    Wrapper.displayName = `bindProps(${(Component as React.ComponentType).displayName || 'Component'})`;
    return Wrapper;
};

export const ForwardProps: React.FunctionComponent<{ element: React.ElementType; } & Record<string, unknown>> = ({ element: Element, ...props }) => {
    return <Element {...props} />;
};

// export const withStyle = <P = {}>(Component: React.ElementType<P>) => addProps(Component, {});


/* export const createFC = <P = {}>(Component: React.ElementType<P>) => wrapWith({
    Component,
    props: { className: (Component as React.ComponentType).displayName || 'FC' },
    as: 'div'
});
 */
