export interface Slide {
    title: string;
    content: string[];
    imagePrompt: string;
    imageUrl: string;
    speakerNotes: string;
    isImageLoading?: boolean;
}

export interface Theme {
    name: string;
    background: string;
    textColor: string;
    titleColor: string;
    bulletColor: string;
}

export interface Layout {
    name: string;
    className: string;
    imagePosition: 'left' | 'right' | 'top' | 'bottom' | 'overlay-center' | 'overlay-top' | 'overlay-bottom';
    imageClassName: string;
    textClassName: string;
}

export type AppState = 'INPUT' | 'LOADING' | 'PRESENTATION' | 'ERROR';

export interface AdvancedOptions {
    slideCount: number;
    detailLevel: 'Basic' | 'Standard' | 'Detailed';
    presentationStyle: 'Professional' | 'Conversational' | 'Academic' | 'Business' | 'Casual' | 'Technical';
    targetAudience: string;
    brandName: string;
    keyTakeaway: string;
    additionalKeywords: string;
    tone: string;
    imageStyle: string;
    includeImages: boolean;
}