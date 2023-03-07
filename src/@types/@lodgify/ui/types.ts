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





export var ICON_NAMES = {
    ARROW_DOWN: 'arrow down',
    ARROW_LEFT: 'arrow left',
    ARROW_RIGHT: 'arrow right',
    ARROW_UP: 'arrow up',
    BABY_CRIB: 'baby crib',
    BARS: 'bars',
    BATHROOM: 'bathroom',
    BEDROOM_DOOR: 'bedroom door',
    BED_LINEN: 'bed linen',
    BLOG: 'blog',
    BUS: 'bus',
    CALENDAR: 'calendar',
    CARET_DOWN: 'caret down',
    CARET_LEFT: 'caret left',
    CARET_RIGHT: 'caret right',
    CARET_UP: 'caret up',
    CHECKMARK: 'checkmark',
    CHECKMARK_CIRCLE: 'checkmark circle',
    CHECK_IN: 'check in',
    CHECK_OUT: 'check out',
    CHEVRON_LEFT: 'chevron left',
    CHEVRON_RIGHT: 'chevron right',
    CLOCK: 'clock',
    CLOSE: 'close',
    COFFEE: 'coffee',
    COOKING: 'cooking',
    COUCH: 'couch',
    CREDIT_CARD: 'credit card',
    DOUBLE_BED: 'double bed',
    ENTERTAINMENT: 'entertainment',
    FACEBOOK: 'facebook',
    FILTER: 'filter',
    FIRE: 'fire',
    FURTHER_INFO: 'further info',
    GOOGLE_PLUS: 'google plus',
    GUESTS: 'guests',
    HEATING: 'heating',
    HOME: 'home',
    INFO: 'info',
    INSTAGRAM: 'instagram',
    LAUNDRY: 'laundry',
    LEAF: 'leaf',
    LINKEDIN: 'linkedin',
    LIST: 'list',
    LOCATION: 'location',
    LOFT_BED: 'loft bed',
    MAP_PIN: 'map pin',
    MINUS: 'minus',
    NO_CHILDREN: 'no children',
    PARKING: 'parking',
     PAW: 'paw',
    PHONE: 'phone',
    PINTEREST: 'pinterest',
    PLACEHOLDER: 'placeholder',
    PLANE: 'plane',
    PLUS: 'plus',
    PORT: 'port',
    QUESTION_MARK: 'question mark',
    ROAD: 'road',
    SEARCH: 'search',
    SINGLE_BED: 'single bed',
    SPINNER: 'spinner',
    SQUARE: 'square',
    STAR: 'star',
    SUN: 'sun',
    TRAIN: 'train',
    TWITTER: 'twitter',
    UNDERGROUND: 'underground',
    USERS: 'users',
    WHEELCHAIR: 'wheelchair',
    WIFI: 'wifi',
    YOUTUBE: 'youtube' 
} as const;
