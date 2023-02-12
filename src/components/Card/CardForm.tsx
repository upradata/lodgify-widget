import { Heading, Paragraph } from '@lodgify/ui';
import React from 'react';
// import Card from 'semantic-ui-react/dist/es/views/Card/Card.js';
import { Card as SemanticCard, Image } from 'semantic-ui-react';
import { PropsWithStyleBase } from '../../util.types';
import './CardForm.scss';

class CardProps extends PropsWithStyleBase {
    imageUrl?: string;
    header?: React.ReactNode;
    subHeader?: React.ReactNode;
    description?: React.ReactNode;
}

export const Card: React.FunctionComponent<CardProps> = props => {

    const { imageUrl, header, subHeader, description, children } = props;

    return (
        <SemanticCard className="has-form" fluid>
            {imageUrl && <Image src={imageUrl} wrapped ui={false} />}

            <SemanticCard.Content>
                {header && <SemanticCard.Header>
                    {typeof header === 'string' ? <Heading>{header}</Heading> : header}
                </SemanticCard.Header>}

                {subHeader && <SemanticCard.Meta>
                    <span className="sub-header">{subHeader}</span>
                </SemanticCard.Meta>}

                {description && <SemanticCard.Description>
                    {typeof description === 'string' ? <Paragraph>{description}</Paragraph> : description}
                </SemanticCard.Description>}
            </SemanticCard.Content>

            <SemanticCard.Content>
                {children}
            </SemanticCard.Content>
        </SemanticCard>
    );
};


Card.displayName = 'Card';
Card.defaultProps = {};
