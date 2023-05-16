import React from 'react';
import { HorizontalGutters, Icon, ModalProps } from '@lodgify/ui';
import { ICON_NAMES } from '@lodgify/ui/lib/es/components/elements/Icon/constants';
import classnames from 'classnames';
import { Modal as SemanticModal, StrictModalProps as SemanticModalProps } from 'semantic-ui-react';

import type { Omit } from '@root/util.types';


export type ModalViewProps = SemanticModalProps & Omit<ModalProps, 'hasCloseIcon' | 'size'>;

export const ModalView: React.FunctionComponent<ModalViewProps> = ({
    children, header, className, hasPadding, hasRoundedCorners, closeIcon, isClosingOnDimmerClick, isOpen, size, isFullscreen,
    ...props
}) => {

    const modalProps: SemanticModalProps = {
        className: classnames(className, {
            'has-padding': hasPadding,
            'has-rounded-corners': hasRoundedCorners
        }),
        closeIcon: !!closeIcon && closeIcon,
        closeOnDimmerClick: isClosingOnDimmerClick,
        // dimmer: 'inverted',
        open: isOpen,
        size: isFullscreen ? 'fullscreen' : size,
        ...props
    };

    return (
        <SemanticModal {...modalProps} className="Modal">
            {!!header && (
                <SemanticModal.Header>
                    <HorizontalGutters>{header}</HorizontalGutters>
                </SemanticModal.Header>
            )}

            <SemanticModal.Content>{children}</SemanticModal.Content>
        </SemanticModal>
    );

};

ModalView.displayName = 'ModalView';

ModalView.defaultProps = {
    closeIcon: React.createElement(Icon, {
        name: ICON_NAMES.CLOSE
    }),
    className: null,
    header: null,
    hasPadding: false,
    hasRoundedCorners: false,
    isFullscreen: false,
    isOpen: undefined,
    onClose: () => { },
    trigger: null,
    size: 'tiny',
    isClosingOnDimmerClick: true
};
