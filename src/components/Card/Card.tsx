import './Card.scss';

import React from 'react';
import { Heading, Paragraph } from '@lodgify/ui';
import classnames from 'classnames';
// import Card from 'semantic-ui-react/dist/es/views/Card/Card.js';
import { Card as SemanticCard, Image, StrictCardProps as SemanticStrictCardProps } from 'semantic-ui-react';
import { fragments } from '@root/util';
import { PropsWithStyleBase } from '@root/util.types';
import { wrapWith } from '../../react-util';


export const CardHeader = wrapWith({ as: SemanticCard.Header, props: { className: 'CardHeader' }, Component: Heading });
export const CardSubHeader = wrapWith({ as: SemanticCard.Meta, props: { className: 'CardSubHeader' } });
export const CardContent = wrapWith({ as: SemanticCard.Description, props: { className: 'CardContent' } });


export class StrictCardProps extends PropsWithStyleBase {
    imageUrl?: string;
    header?: React.ReactNode;
    subHeader?: React.ReactNode;
    description?: React.ReactNode;
}

type CardProps = SemanticStrictCardProps & StrictCardProps;

export const Card: React.FunctionComponent<CardProps> = ({ children, ...props }) => {

    const [ { imageUrl, header, subHeader, description, className }, semanticCardProps ] = fragments(props, StrictCardProps);

    return (
        <SemanticCard className={classnames(className, 'Card'/* "has-form" */)} {...semanticCardProps}>
            {imageUrl && <Image src={imageUrl} wrapped ui={false} />}

            {(header || subHeader || description) && <SemanticCard.Content>
                {header && (typeof header === 'string' ? <CardHeader>{header}</CardHeader> : <SemanticCard.Header>{header}</SemanticCard.Header>)}

                {subHeader && <CardSubHeader>{subHeader}</CardSubHeader>}

                {description && <CardContent>
                    {typeof description === 'string' ? <Paragraph>{description}</Paragraph> : description}
                </CardContent>}
            </SemanticCard.Content>}

            <SemanticCard.Content>
                {children}
            </SemanticCard.Content>
        </SemanticCard>
    );
};


Card.displayName = 'Card';
Card.defaultProps = {};
