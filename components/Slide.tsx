import React, { useRef, useState, useEffect } from 'react';
import { Slide as SlideType, Theme, Layout } from '../types';
import { PlusIcon, TrashIcon, GripVerticalIcon, SparklesIcon } from './IconComponents';

interface SlideProps {
    slide: SlideType;
    theme: Theme;
    layout: Layout;
    isEditing: boolean;
    onSlideChange: (field: 'title' | 'content' | 'imagePrompt', newText: string, contentIndex?: number) => void;
    onAddItem: () => void;
    onRemoveItem: (index: number) => void;
    onReorderItem: (sourceIndex: number, destinationIndex: number) => void;
    onRegenerateImage: () => void;
}

const AutoResizingTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [props.value]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        if (props.onChange) {
            props.onChange(e);
        }
    };

    return <textarea ref={textareaRef} {...props} onInput={handleInput} />;
};

const Slide: React.FC<SlideProps> = ({ slide, theme, layout, isEditing, onSlideChange, onAddItem, onRemoveItem, onReorderItem, onRegenerateImage }) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
        e.preventDefault(); // Necessary to allow dropping
    };
    
    const handleDrop = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) {
            return;
        }
        onReorderItem(draggedIndex, index);
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const sharedInputStyles = "bg-transparent w-full focus:outline-none resize-none overflow-hidden";
    const titleBaseClasses = "font-bold mb-6";
    const contentBaseClasses = "";

    const renderEditableTitle = (className: string) => (
        isEditing ? (
            <input
                type="text"
                value={slide.title}
                onChange={(e) => onSlideChange('title', e.target.value)}
                className={`${sharedInputStyles} ${className} focus:bg-white/10 rounded px-2 py-1 -mx-2`}
                aria-label="Slide Title"
            />
        ) : (
            <h2 className={className}>{slide.title}</h2>
        )
    );

    const renderEditableContent = (point: string, index: number, className: string) => (
        isEditing ? (
            <AutoResizingTextarea
                value={point}
                onChange={(e) => onSlideChange('content', e.target.value, index)}
                className={`${sharedInputStyles} ${className} focus:bg-white/10 rounded px-2 -mx-2`}
                aria-label={`Bullet point ${index + 1}`}
                rows={1}
            />
        ) : (
            <span className={className}>{point}</span>
        )
    );

    const renderContentList = (textColor: string, bulletColor: string, hoverTextColor: string) => (
        <>
            <ul className="space-y-3">
                {slide.content.map((point, index) => (
                    <li
                        key={index}
                        className={`group/item flex items-start gap-2 transition-opacity duration-300 ${draggedIndex === index ? 'opacity-30' : 'opacity-100'}`}
                        draggable={isEditing}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                    >
                        {isEditing && (
                            <div className="flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                                 <div className="flex items-center h-full">
                                    <button
                                        className={`cursor-grab text-slate-500 hover:${hoverTextColor}`}
                                        title="Drag to reorder"
                                    >
                                        <GripVerticalIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                         <div className="flex-shrink-0 pt-2.5">
                            <span className={`w-2.5 h-2.5 rounded-full block ${bulletColor.startsWith('text-') ? bulletColor.replace('text-','bg-') : 'bg-indigo-400'}`}></span>
                        </div>
                        <div className="flex-grow">
                             {renderEditableContent(point, index, `text-lg md:text-xl ${textColor} ${contentBaseClasses}`)}
                        </div>
                        {isEditing && (
                             <div className="flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                                 <button onClick={() => onRemoveItem(index)} className={`p-1 rounded-full text-slate-500 hover:bg-red-500/20 hover:text-red-400`} title="Remove point">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                             </div>
                        )}
                    </li>
                ))}
            </ul>
             {isEditing && (
                 <button onClick={onAddItem} className="mt-6 flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-lg transition-colors self-start">
                    <PlusIcon className="w-5 h-5" />
                    Add Point
                </button>
            )}
        </>
    );

    const textContent = (
        <div className="flex flex-col justify-center h-full p-8 md:p-12 overflow-hidden">
             {renderEditableTitle(`text-3xl md:text-5xl ${theme.titleColor} ${titleBaseClasses}`)}
             {renderContentList(theme.textColor, theme.bulletColor, 'text-slate-200')}
        </div>
    );
    
    const overlayTextContent = (bgClass: string) => (
        <div className={`relative z-10 flex flex-col justify-center h-full p-8 md:p-12 ${bgClass}`}>
             {renderEditableTitle(`text-3xl md:text-5xl text-white drop-shadow-lg ${titleBaseClasses}`)}
             {renderContentList('text-gray-100 drop-shadow-md', 'bg-indigo-300', 'text-white')}
        </div>
    );

    if (!slide.imageUrl) {
        return (
            <div className={`w-full h-full aspect-video ${theme.background} flex`}>
                {textContent}
            </div>
        )
    }

    const imageContent = (
         <div className="w-full h-full relative group/image">
            <img src={slide.imageUrl} alt={slide.imagePrompt} className="w-full h-full object-cover" />
            {isEditing && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 gap-3 text-center animate-fade-in">
                    <div className="w-full max-w-sm">
                        <label htmlFor={`image-prompt-${slide.title}`} className="block text-xs font-semibold text-slate-300 mb-1 text-left">Image Prompt</label>
                        <textarea
                            id={`image-prompt-${slide.title}`}
                            value={slide.imagePrompt}
                            onChange={(e) => onSlideChange('imagePrompt', e.target.value)}
                            className="w-full bg-slate-900/80 text-white text-sm p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-indigo-500 resize-none"
                            rows={3}
                        />
                    </div>
                    <button onClick={onRegenerateImage} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105 disabled:bg-indigo-800 disabled:cursor-not-allowed" disabled={slide.isImageLoading}>
                        <SparklesIcon className="w-5 h-5" />
                        {slide.isImageLoading ? 'Generating...' : 'Regenerate'}
                    </button>
                </div>
            )}
            {slide.isImageLoading && (
                <div className="absolute inset-0 bg-black/70 flex justify-center items-center backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                </div>
            )}
        </div>
    );

    if (layout.imagePosition.startsWith('overlay')) {
        let textComponent;
        switch (layout.imagePosition) {
            case 'overlay-top':
                textComponent = <div className={layout.textClassName}>{overlayTextContent('bg-black/60 backdrop-blur-sm h-full')}</div>;
                break;
            case 'overlay-bottom':
                textComponent = <div className={layout.textClassName}>{overlayTextContent('bg-black/60 backdrop-blur-sm h-full')}</div>;
                break;
            case 'overlay-center':
            default:
                 textComponent = (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                        <div className={layout.textClassName}>{overlayTextContent('')}</div>
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