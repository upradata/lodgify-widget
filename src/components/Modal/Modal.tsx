import React, { useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Modal as LodgifyModal, ModalProps as LodgifyModalProps } from '@lodgify/ui';
import { BreakpointRange, BreakPoints } from '../MediaQuery';
import './Modal.scss';


export type ModalProps = LodgifyModalProps & {
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onOpenChange?: (isOpen: boolean) => void;
};


export type ModalPropsImperativeAPI = {
    open: () => void;
    close: () => void;
};


const _Modal: React.ForwardRefRenderFunction<ModalPropsImperativeAPI, ModalProps> = (props, ref) => {
    const { children, isOpen, onOpen, onClose, onOpenChange, ...modalProps } = props;

    const [ isEnabled, setIsEnabled ] = useState(isOpen);

    const _setIsEnabled = (isEnabled: boolean) => {
        isEnabled ? onOpen?.() : onClose?.();
        onOpenChange?.(isEnabled);
        setIsEnabled(isEnabled);
    };

    useEffect(() => { _setIsEnabled(isOpen); }, [ isOpen ]);

    useImperativeHandle(ref, () => ({
        open: () => { _setIsEnabled(true); },
        close: () => { _setIsEnabled(false); }
    }));

    const onModalClose = useCallback(() => { _setIsEnabled(false); }, [ /* setIsEnabled */ ]);

    const lodgifyModalProps: LodgifyModalProps = {
        ...modalProps,
        onClose: onModalClose,
        isOpen: isEnabled
    };

    {/* <React.Fragment>
        <BreakPoint max={1200}><LodgifyModal {...bookingModalProps} isFullscreen >{children}</LodgifyModal></BreakPoint>
        <BreakPoint min={1201}><LodgifyModal {...bookingModalProps} size="small" >{children}</LodgifyModal></BreakPoint>
    </React.Fragment> */}
    type BP = BreakpointRange<{ size: 'small' | 'large'; }>;
    const breakpoints = useMemo<BP[]>(() => [ { max: 1200, data: { size: 'small' } }, { min: 1201, data: { size: 'large' } } ], []);

    const [ bp, setBp ] = useState<BP>(null);

    return (
        <BreakPoints breakpoints={breakpoints} onActive={bp => setBp(bp as BP)} /* childrenProps={props} */>
            {bp && <LodgifyModal {...lodgifyModalProps} isFullscreen={bp.data.size === 'small'} size="small">
                {children}
            </LodgifyModal>}
        </BreakPoints>
    );
};


_Modal.displayName = 'Modal';

// Because React has a bug in the typing, I have to do it manually.
// Actually, it is easy to fix it using inferce typing
export const Modal = React.forwardRef<ModalPropsImperativeAPI, React.PropsWithChildren<ModalProps>>(_Modal);
