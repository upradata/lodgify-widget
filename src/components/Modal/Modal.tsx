import './Modal.scss';

import React, { useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
// import { Modal as LodgifyModal, ModalProps as LodgifyModalProps } from '@lodgify/ui';
import { BreakPoint, MediaQuery } from '../MediaQuery/MediaQuery';
import { partition } from '../../util';
import { ModalView, ModalViewProps } from './ModalView';


class _ModalProps {
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onOpenChange?: (isOpen: boolean) => void;
};

export type ModalProps = /* LodgifyModalProps */ ModalViewProps & _ModalProps;


export type ModalPropsImperativeAPI = {
    open: () => void;
    close: () => void;
};


const _Modal: React.ForwardRefRenderFunction<ModalPropsImperativeAPI, ModalProps> = ({ children, ...props }, ref) => {
    const [ _props, modalProps ] = partition(props, _ModalProps);

    const [ isEnabled, setIsEnabled ] = useState(_props.isOpen);

    const _setIsEnabled = useCallback((isEnabled: boolean) => {
        isEnabled ? _props.onOpen?.() : _props.onClose?.();
        _props.onOpenChange?.(isEnabled);
        setIsEnabled(isEnabled);
    }, [ _props, setIsEnabled ]);

    useEffect(() => { _setIsEnabled(_props.isOpen); }, [ _props, _setIsEnabled ]);

    useImperativeHandle(ref, () => ({
        open: () => { _setIsEnabled(true); },
        close: () => { _setIsEnabled(false); }
    }), [ _setIsEnabled ]);

    const onModalClose = useCallback(() => { _setIsEnabled(false); }, [ _setIsEnabled ]);

    const modalViewProps: ModalViewProps /* LodgifyModalProps */ = {
        ...modalProps,
        onClose: onModalClose,
        isOpen: isEnabled
    };


    // type BP = BreakpointRange<{ size: 'small' | 'large'; }>;
    type BP = BreakPoint<never, { size: 'small' | 'large'; }>;
    const breakpoints = useMemo<BP[]>(() => [ { max: 1200, size: 'small' }, { min: 1201, size: 'large' } ], []);

    const [ bp, setBp ] = useState<BP>(null);

    return (
        <MediaQuery breakpoints={breakpoints} onActive={bp => setBp(bp as BP)}>
            {bp && <ModalView {...modalViewProps} isFullscreen={bp.size === 'small'} size="small">
                {children}
            </ModalView>}
        </MediaQuery>
    );
};


_Modal.displayName = 'Modal';

// Because React has a bug in the typing, I have to do it manually.
// Actually, it is easy to fix it using inferce typing
export const Modal = React.forwardRef<ModalPropsImperativeAPI, React.PropsWithChildren<ModalProps>>(_Modal);
