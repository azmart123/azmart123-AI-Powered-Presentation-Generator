import React from 'react';
import { Slide as SlideType, Theme, Layout } from '../types';

interface SlideProps {
    slide: SlideType;
    theme: Theme;
    layout: Layout;
    isEditing: boolean;
    onSlideChange: (field: 'title' | 'content', newText: string, contentIndex?: number) => void;
}

const Slide: React.FC<SlideProps> = ({ slide, theme, layout, isEditing, onSlideChange }) => {
    const editableStyles = isEditing 
        ? 'cursor-text rounded-md px-1 transition-all duration-200 hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500'
        : 'px-1';
    
    const handleBlur = (e: React.FocusEvent<HTMLElement>, field: 'title' | 'content', index?: number) => {
        onSlideChange(field, e.currentTarget.textContent || '', index);
    };

    const textContent = (
        <div className="flex flex-col justify-center h-full p-8 md:p-12 overflow-hidden">
            <h2 
                className={`text-3xl md:text-5xl font-bold mb-6 ${theme.titleColor} ${editableStyles}`}
                contentEditable={isEditing}
                onBlur={(e) => handleBlur(e, 'title')}
                suppressContentEditableWarning={true}
            >
                {slide.title}
            </h2>
            <ul className="space-y-4">
                {slide.content.map((point, index) => (
                    <li key={index} className={`flex items-start text-lg md:text-xl ${theme.textColor}`}>
                        <span className={`mr-4 mt-2 flex-shrink-0 w-2.5 h-2.5 rounded-full ${theme.bulletColor.startsWith('text-') ? theme.bulletColor.replace('text-','bg-') : 'bg-indigo-400'}`}></span>
                        <span
                            className={`w-full ${editableStyles}`}
                            contentEditable={isEditing}
                            onBlur={(e) => handleBlur(e, 'content', index)}
                            suppressContentEditableWarning={true}
                        >
                            {point}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );

    const overlayTextContent = (
         <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-12">
            <h2 
                className={`text-3xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg ${editableStyles}`}
                contentEditable={isEditing}
                onBlur={(e) => handleBlur(e, 'title')}
                suppressContentEditableWarning={true}
            >
                {slide.title}
            </h2>
            <ul className="space-y-4">
                {slide.content.map((point, index) => (
                    <li key={index} className={`flex items-start text-lg md:text-xl text-gray-100 drop-shadow-md`}>
                        <span className={`mr-4 mt-2 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-300`}></span>
                        <span
                            className={`w-full ${editableStyles}`}
                            contentEditable={isEditing}
                            onBlur={(e) => handleBlur(e, 'content', index)}
                            suppressContentEditableWarning={true}
                        >
                            {point}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
    
    const overlayPartialTextContent = (
         <div className="p-8 md:p-12 bg-black/60 backdrop-blur-sm h-full flex flex-col justify-center">
            <h2 
                className={`text-2xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg ${editableStyles}`}
                contentEditable={isEditing}
                onBlur={(e) => handleBlur(e, 'title')}
                suppressContentEditableWarning={true}
            >
                {slide.title}
            </h2>
            <ul className="space-y-2">
                {slide.content.map((point, index) => (
                    <li key={index} className={`flex items-start text-base md:text-lg text-gray-100 drop-shadow-md`}>
                        <span className={`mr-3 mt-2 flex-shrink-0 w-2 h-2 rounded-full bg-indigo-300`}></span>
                        <span
                            className={`w-full ${editableStyles}`}
                            contentEditable={isEditing}
                            onBlur={(e) => handleBlur(e, 'content', index)}
                            suppressContentEditableWarning={true}
                        >
                            {point}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );

    // If there's no image URL, render a text-only, full-width slide
    if (!slide.imageUrl) {
        return (
            <div className={`w-full h-full aspect-video ${theme.background} flex`}>
                {textContent}
            </div>
        )
    }

    const imageContent = (
        <div className="w-full h-full">
            <img src={slide.imageUrl} alt={slide.imagePrompt} className="w-full h-full object-cover" />
        </div>
    );

    if (layout.imagePosition.startsWith('overlay')) {
        let textComponent;
        switch (layout.imagePosition) {
            case 'overlay-top':
                textComponent = <div className={layout.textClassName}>{overlayPartialTextContent}</div>;
                break;
            case 'overlay-bottom':
                textComponent = <div className={layout.textClassName}>{overlayPartialTextContent}</div>;
                break;
            case 'overlay-center':
            default:
                 textComponent = (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                        <div className={layout.textClassName}>{overlayTextContent}</div>
                    </>
                 );
                 break;
        }

        return (
            <div className={`w-full h-full aspect-video ${theme.background} ${layout.className}`}>
                <div className={layout.imageClassName}>{imageContent}</div>
                {textComponent}
            </div>
        );
    }
    
    const styledImageContent = <div className={layout.imageClassName}>{imageContent}</div>;
    const styledTextContent = <div className={layout.textClassName}>{textContent}</div>;

    const renderOrder = () => {
        switch (layout.imagePosition) {
            case 'left':
                return <>{styledImageContent}{styledTextContent}</>;
            case 'right':
                return <>{styledTextContent}{styledImageContent}</>;
            case 'top':
                return <>{styledImageContent}{styledTextContent}</>;
            case 'bottom':
                return <>{styledTextContent}{styledImageContent}</>;
            default:
                return <>{styledTextContent}{styledImageContent}</>; // Default to right
        }
    }

    return (
        <div className={`w-full h-full aspect-video ${theme.background} ${layout.className} overflow-hidden`}>
           {renderOrder()}
        </div>
    );
};

export default Slide;