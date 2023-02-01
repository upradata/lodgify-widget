export class ModalProps {
    style?: React.CSSProperties;
    className?: string;
    children: React.ReactNode;
    closeIcon?: React.ReactNode;
    hasCloseIcon?: boolean;
    hasPadding?: boolean;
    hasRoundedCorners?: boolean;
    header?: React.ReactNode;
    isClosingOnDimmerClick?: boolean;
    isFullscreen?: boolean;
    isOpen?: boolean;
    onClose?: Function;
    size?: 'mini' | 'tiny' | 'small' | 'large';
    trigger?: React.ReactNode;
};
