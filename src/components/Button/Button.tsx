import { /* ButtonProps as LodgifyButtonProps, */ Icon, IconNames } from '@lodgify/ui';
import { fragments } from '@root/util';
import { Button as SemanticButton, StrictButtonProps as SemanticStrictButtonProps } from 'semantic-ui-react';
import classnames from 'classnames';
import { PropsWithStyleBase } from '@root/util.types';

class StrictButtonProps extends PropsWithStyleBase {
    // 
    hasShadow?: boolean;
    icon?: IconNames;
    isCompact?: boolean;
    isDisabled?: boolean;
    isFluid?: boolean;
    isFormSubmit?: boolean;
    isLoading?: boolean;
    isOutlined?: boolean;
    isPositionedRight?: boolean;
    isRounded?: boolean;
    isSecondary?: boolean;
    onClick?: Function;
    size?: string;
};

type ButtonProps = StrictButtonProps & Omit<SemanticStrictButtonProps, 'icon'>; //  & Partial<InputControllerProps>;

export const Button: React.FunctionComponent<ButtonProps> = props => {

    const [ , semanticProps ] = fragments(props, StrictButtonProps);

    const buttonProps: SemanticStrictButtonProps = {
        basic: props.isOutlined,
        circular: props.isRounded,
        className: classnames(props.className, {
            'has-shadow': !!props.hasShadow,
            'has-outline': !!props.isOutlined
        }),
        compact: props.isCompact,
        disabled: props.isDisabled,
        floated: props.isPositionedRight ? 'right' : 'left',
        fluid: props.isFluid,
        loading: props.isLoading,
        onClick: props.onClick,
        secondary: props.isSecondary,
        size: props.size,
        type: props.isFormSubmit ? 'submit' : 'button',
        ...semanticProps
    };

    return (
        <SemanticButton {...buttonProps}>
            {!!props.icon && <Icon name={props.icon} />}
            {props.children}
        </SemanticButton>
    );
};

Button.displayName = 'Button';
