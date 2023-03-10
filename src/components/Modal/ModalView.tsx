import React from 'react';
import { HorizontalGutters, Icon, ModalProps } from '@lodgify/ui';
import { ICON_NAMES } from '@lodgify/ui/lib/es/components/elements/Icon/constants';
import classnames from 'classnames';
import { Modal as SemanticModal, ModalProps as SemanticModalProps } from 'semantic-ui-react';
import { partition } from '../../util';


export type ModalViewProps = SemanticModalProps & ModalProps;

export const ModalView: React.FunctionComponent<ModalViewProps> = ({ children, header, ...props }) => {

    const modalProps: SemanticModalProps = {
        className: classnames(props.className, {
            'has-padding': props.hasPadding,
            'has-rounded-corners': props.hasRoundedCorners
        }),
        closeIcon: props.hasCloseIcon && props.closeIcon,
        closeOnDimmerClick: props.isClosingOnDimmerClick,
        // dimmer: 'inverted',
        onClose: props.onClose,
        open: props.isOpen,
        size: props.isFullscreen ? 'fullscreen' : props.size,
        trigger: props.trigger
    };

    const [ , rest ] = partition(props, modalProps);

    return (
        <SemanticModal {...modalProps} {...rest} className="Modal">
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
    hasCloseIcon: true,
    hasPadding: false,
    hasRoundedCorners: false,
    isFullscreen: false,
    isOpen: undefined,
    onClose: () => { },
    trigger: null,
    size: 'tiny',
    isClosingOnDimmerClick: true
};
