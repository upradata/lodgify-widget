import { PropsWithStyleBase } from '../../../util.types';


export class ModalProps extends PropsWithStyleBase {
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


export class SummaryProps extends PropsWithStyleBase {
    propertyName: string;
    locationName: string;
    areOnlyNightPriceAndRatingDisplayed?: boolean;
    isShowingPlaceholder?: boolean;
    periodText?: string;
    pricePerPeriod?: string;
    pricePerPeriodPrefix?: string;
    ratingNumber?: number;
};
