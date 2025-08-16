import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Slide as SlideType, Theme, Layout } from '../types';
import Slide from './Slide';
import DesignPanel from './DesignPanel';
import { 
    ArrowLeftIcon, ArrowRightIcon, DownloadIcon, RestartIcon, EditIcon, 
    CheckIcon, SparklesIcon, NotesIcon, FullscreenEnterIcon, FullscreenExitIcon,
    PaintBrushIcon
} from './IconComponents';

interface PresentationViewProps {
    slides: SlideType[];
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
    layout: Layout;
    onLayoutChange: (layout: Layout) => void;
    onDownload: () => void;
    onRestart: () => void;
    onSlidesUpdate: (slides: SlideType[]) => void;
    generationTime: number | null;
    onRegenerateImage: (slideIndex: number) => void;
    onAiTextModification: (slideIndex: number, target: 'title' | 'content', action: string, contentIndex?: number) => Promise<void>;
}

const AiAssistantMenu: React.FC<{
    anchorElement: HTMLElement | null;
    options: { key: string; label: string }[];
    onSelect: (action: string) => void;
    onClose: () => void;
}> = ({ anchorElement, options, onSelect, onClose }) => {
    if (!anchorElement) return null;

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const rect = anchorElement.getBoundingClientRect();
    const style = {
        top: `${rect.bottom + window.scrollY + 8}px`,
        left: `${rect.left + window.scrollX}px`,
    };

    return ReactDOM.createPortal(
        <div ref={menuRef} style={style} className="absolute z-50 bg-slate-700 rounded-lg shadow-2xl border border-slate-600 animate-fade-in-up-fast overflow-hidden">
            <ul className="py-1">
                {options.map(option => (
                    <li key={option.key}>
                        <button
                            onClick={() => onSelect(option.key)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-indigo-600 transition-colors duration-150"
                        >
                            {option.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>,
        document.body
    );
};


const PresentationView: React.FC<PresentationViewProps> = ({ 
    slides, theme, onThemeChange, layout, onLayoutChange, onDownload, 
    onRestart, onSlidesUpdate, generationTime, onRegenerateImage, onAiTextModification
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isNotesVisible, setIsNotesVisible] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDesignPanelOpen, setIsDesignPanelOpen] = useState(false);
    const presentationContainerRef = useRef<HTMLDivElement>(null);
    
    const [aiAssistant, setAiAssistant] = useState<{
        isOpen: boolean;
        target: 'title' | 'content';
        contentIndex?: number;
        anchorElement: HTMLElement | null;
    }>({ isOpen: false, target: 'title', anchorElement: null });

    const [activeAiModification, setActiveAiModification] = useState<{
        target: 'title' | 'content';
        contentIndex?: number;
    } | null>(null);


    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);
    
    const handleSlideContentChange = (field: 'title' | 'content' | 'speakerNotes', newText: string, contentIndex?: number) => {
        const newSlides = slides.map((s, i) => {
            if (i !== currentSlide) return s;

            const slideToUpdate = { ...s };
            if (field === 'title') {
                slideToUpdate.title = newText;
            } else if (field === 'speakerNotes') {
                slideToUpdate.speakerNotes = newText;
            } else if (field === 'content' && contentIndex !== undefined) {
                const newContent = [...slideToUpdate.content];
                newContent[contentIndex] = newText;
                slideToUpdate.content = newContent;
            }
            return slideToUpdate;
        });
        onSlidesUpdate(newSlides);
    };

    const handleAddContentItem = () => {
        const newSlides = [...slides];
        const slideToUpdate = { ...newSlides[currentSlide] };
        slideToUpdate.content = [...slideToUpdate.content, 'New bullet point'];
        newSlides[currentSlide] = slideToUpdate;
        onSlidesUpdate(newSlides);
    };

    const handleRemoveContentItem = (contentIndex: number) => {
        const newSlides = [...slides];
        const slideToUpdate = { ...newSlides[currentSlide] };
        const newContent = [...slideToUpdate.content];
        newContent.splice(contentIndex, 1);
        slideToUpdate.content = newContent;
        newSlides[currentSlide] = slideToUpdate;
        onSlidesUpdate(newSlides);
    };

    const handleReorderContentItem = (sourceIndex: number, destinationIndex: number) => {
        const newSlides = [...slides];
        const slideToUpdate = { ...newSlides[currentSlide] };
        const newContent = Array.from(slideToUpdate.content);
        const [removed] = newContent.splice(sourceIndex, 1);
        newContent.splice(destinationIndex, 0, removed);
        slideToUpdate.content = newContent;
        newSlides[currentSlide] = slideToUpdate;
        onSlidesUpdate(newSlides);
    };
    
     const handleMagicButtonClick = (anchorElement: HTMLElement, target: 'title' | 'content', contentIndex?: number) => {
        setAiAssistant({ isOpen: true, anchorElement, target, contentIndex });
    };

    const handleAiActionSelect = async (action: string) => {
        const { target, contentIndex } = aiAssistant;
        setAiAssistant(prev => ({ ...prev, isOpen: false }));
        setActiveAiModification({ target, contentIndex });

        await onAiTextModification(currentSlide, target, action, contentIndex);

        setActiveAiModification(null);
    };

    const titleActionOptions = [
        { key: 'Suggest 3 alternatives', label: 'Suggest alternatives' },
        { key: 'Make it shorter', label: 'Make it shorter' },
        { key: 'Make it more engaging', label: 'Make it more engaging' },
    ];
    
    const contentActionOptions = [
        { key: 'Rephrase this point', label: 'Rephrase' },
        { key: 'Expand on this point', label: 'Expand' },
        { key: 'Make this point more concise', label: 'Make more concise' },
        { key: 'Simplify the language', label: 'Simplify language' },
    ];


    const handleFullscreenToggle = useCallback(() => {
        if (!document.fullscreenElement) {
            presentationContainerRef.current?.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }, []);

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center animate-fade-in">
             {/* This container wraps the presentation and controls to enable fullscreen editing */}
            <div ref={presentationContainerRef} className="w-full relative group/presentation fullscreen:bg-slate-900 flex flex-col justify-center items-center">
                {/* Main Slide Preview */}
                <div className="w-full aspect-video shadow-2xl rounded-xl overflow-hidden border-4 border-slate-700 bg-slate-900 relative">
                    {slides.map((slide, index) => (
                        <div 
                            key={index} 
                            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                            <Slide
                                slide={slide}
                                theme={theme}
                                layout={layout}
                                isEditing={isEditing}
                                onSlideChange={handleSlideContentChange}
                                onAddItem={handleAddContentItem}
                                onRemoveItem={handleRemoveContentItem}
                                onReorderItem={handleReorderContentItem}
                                onRegenerateImage={() => onRegenerateImage(currentSlide)}
                                onMagicButtonClick={handleMagicButtonClick}
                                activeAiModification={activeAiModification}
                            />
                        </div>
                    ))}
                </div>

                {/* Controls - dynamically positioned for normal and fullscreen views */}
                <div className={`w-full max-w-5xl transition-all duration-300 z-10
                    ${isFullscreen 
                        ? 'absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/presentation:opacity-100 focus-within:opacity-100' 
                        : 'mt-4'
                    }`}>
                    <div className="p-3 bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-700 flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-2">
                             <button onClick={onRestart} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200" title="Start Over">
                                <RestartIcon className="w-5 h-5" />
                                New
                            </button>
                            <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`} title={isEditing ? 'Finish Editing' : 'Edit Slide Content'}>
                                {isEditing ? <CheckIcon className="w-5 h-5" /> : <EditIcon className="w-5 h-5" />}
                                {isEditing ? 'Done' : 'Edit'}
                            </button>
                            <button onClick={() => setIsDesignPanelOpen(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200" title="Customize Design">
                                <PaintBrushIcon className="w-5 h-5" />
                                Design
                            </button>
                             <button onClick={onDownload} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200" title="Download as PPTX">
                                <DownloadIcon className="w-5 h-5" />
                                Download
                            </button>
                        </div>
                        
                         {generationTime && !isEditing && (
                            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
                               <SparklesIcon className="w-5 h-5 text-indigo-400" />
                               <p>Generated in {generationTime.toFixed(2)}s</p>
                            </div>
                        )}


                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsNotesVisible(!isNotesVisible)} className={`p-3 rounded-lg transition duration-200 ${isNotesVisible ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`} title="Toggle Speaker Notes">
                                <NotesIcon className="w-5 h-5" />
                            </button>
                             <button onClick={handleFullscreenToggle} className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition duration-200" title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
                                {isFullscreen ? <FullscreenExitIcon className="w-5 h-5" /> : <FullscreenEnterIcon className="w-5 h-5" />}
                            </button>
                            <button onClick={prevSlide} className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isEditing}>
                                <ArrowLeftIcon className="w-5 h-5" />
                            </button>
                            <span className="text-lg font-semibold text-slate-300 w-16 text-center">
                                {currentSlide + 1} / {slides.length}
                            </span>
                            <button onClick={nextSlide} className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isEditing}>
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thumbnail Filmstrip */}
            <div className="w-full py-2">
                <div className="flex items-center gap-4 overflow-x-auto pb-2 px-2">
                    {slides.map((slide, index) => (
                         <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 transform hover:scale-105
                                ${currentSlide === index ? 'border-indigo-500' : 'border-slate-700 hover:border-slate-500'}
                                ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isEditing}
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            <div className={`w-full h-full relative ${theme.background} text-white text-xs p-1`}>
                                {slide.imageUrl && <img src={slide.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
                                <div className="relative z-10 truncate font-bold">{slide.title}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            
            {aiAssistant.isOpen && (
                <AiAssistantMenu
                    anchorElement={aiAssistant.anchorElement}
                    options={aiAssistant.target === 'title' ? titleActionOptions : contentActionOptions}
                    onSelect={handleAiActionSelect}
                    onClose={() => setAiAssistant(prev => ({ ...prev, isOpen: false }))}
                />
            )}


            {/* Speaker Notes Section */}
            {isNotesVisible && (
                <div className="w-full max-w-5xl mt-2 p-4 bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-700 shadow-lg animate-fade-in-up">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Speaker Notes</h3>
                    {isEditing ? (
                        <textarea
                            value={slides[currentSlide].speakerNotes}
                            onChange={(e) => handleSlideContentChange('speakerNotes', e.target.value)}
                            className="w-full h-32 p-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200 text-slate-300 resize-y"
                            placeholder="Edit speaker notes..."
                        />
                    ) : (
                        <p className="text-slate-300 text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">
                            {slides[currentSlide].speakerNotes || 'No speaker notes for this slide.'}
                        </p>
                    )}
                </div>
            )}
             <DesignPanel 
                isOpen={isDesignPanelOpen}
                onClose={() => setIsDesignPanelOpen(false)}
                theme={theme}
                onThemeChange={onThemeChange}
                layout={layout}
                onLayoutChange={onLayoutChange}
            />
        </div>
    );
};

export default PresentationView;