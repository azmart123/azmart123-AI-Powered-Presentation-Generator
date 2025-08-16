import React, { useState } from 'react';
import { Theme, Layout, AdvancedOptions } from '../types';
import { THEMES, LAYOUTS, DETAIL_LEVELS, PRESENTATION_STYLES } from '../constants';
import { 
    SparklesIcon, LayoutIcon, ChevronLeftIcon, ChevronRightIcon,
    ChevronDownIcon, DocumentTextIcon, UsersIcon, PhotoIcon 
} from './IconComponents';

interface LandingViewProps {
    topic: string;
    setTopic: (topic: string) => void;
    selectedTheme: Theme;
    setSelectedTheme: (theme: Theme) => void;
    selectedLayout: Layout;
    setSelectedLayout: (layout: Layout) => void;
    onGenerate: () => void;
    error: string | null;
    advancedOptions: AdvancedOptions;
    setAdvancedOptions: (options: AdvancedOptions) => void;
}

const ProgressIndicator: React.FC<{ step: number }> = ({ step }) => {
    const steps = ['Topic', 'Style', 'Details'];
    return (
        <div className="flex items-center justify-center w-full max-w-md mx-auto mb-8">
            {steps.map((name, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                step > index ? 'bg-indigo-500' : 'bg-slate-700'
                            } ${step === index + 1 ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-indigo-500' : ''}`}
                        >
                            <span className="font-bold text-white">{index + 1}</span>
                        </div>
                        <p className={`mt-2 text-sm font-semibold transition-colors duration-300 ${step >= index + 1 ? 'text-white' : 'text-slate-400'}`}>{name}</p>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-auto h-1 mx-2 transition-colors duration-300 ${step > index + 1 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};


const LandingView: React.FC<LandingViewProps> = ({
    topic,
    setTopic,
    selectedTheme,
    setSelectedTheme,
    selectedLayout,
    setSelectedLayout,
    onGenerate,
    error,
    advancedOptions,
    setAdvancedOptions,
}) => {
    const [step, setStep] = useState(1);
    const [openAccordion, setOpenAccordion] = useState<'content' | 'audience' | 'visuals' | null>('content');

    const handleAdvancedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newValue = e.target.type === 'range' ? parseInt(value, 10) : value;
        setAdvancedOptions({ ...advancedOptions, [name]: newValue });
    };

    const handleToggleChange = (name: keyof AdvancedOptions, value: boolean) => {
        setAdvancedOptions({ ...advancedOptions, [name]: value });
    };
    
    const handleAccordionToggle = (accordion: 'content' | 'audience' | 'visuals') => {
        setOpenAccordion(openAccordion === accordion ? null : accordion);
    };

    const inputClass = "w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-base placeholder-slate-400 disabled:bg-slate-800/50 disabled:cursor-not-allowed";
    const buttonClass = "flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-lg";

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const AccordionItem: React.FC<{
        id: 'content' | 'audience' | 'visuals';
        title: string;
        icon: React.ReactNode;
        children: React.ReactNode;
    }> = ({ id, title, icon, children }) => (
        <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800/40 backdrop-blur-sm">
            <h2>
                <button
                    type="button"
                    onClick={() => handleAccordionToggle(id)}
                    className={`flex items-center justify-between w-full p-5 font-semibold text-left text-white transition-colors duration-200 hover:bg-slate-700/50 ${openAccordion === id ? 'bg-slate-700/50' : ''}`}
                    aria-expanded={openAccordion === id}
                    aria-controls={`accordion-body-${id}`}
                >
                    <div className="flex items-center gap-3">
                        {icon}
                        <span className="text-lg">{title}</span>
                    </div>
                    <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-300 ${openAccordion === id ? 'rotate-180' : ''}`} />
                </button>
            </h2>
            <div
                id={`accordion-body-${id}`}
                className={`grid transition-all duration-500 ease-in-out ${openAccordion === id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-6 border-t border-slate-700">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
                    AI Presentation Generator
                </h1>
                <p className="text-lg md:text-xl text-slate-400">
                    Turn your ideas into stunning presentations in seconds.
                </p>
            </div>
            
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg relative my-6" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700">
                <ProgressIndicator step={step} />

                {/* Step 1: Topic */}
                {step === 1 && (
                     <div className="animate-fade-in">
                        <label htmlFor="topic" className="block text-xl font-semibold text-slate-100 mb-3 text-center">
                           What is your presentation about?
                        </label>
                        <textarea
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., The Future of Renewable Energy"
                            className="w-full p-4 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-lg resize-none"
                            rows={4}
                        />
                        <div className="mt-6 flex justify-end">
                            <button onClick={nextStep} disabled={!topic.trim()} className={buttonClass}>
                                Continue <ChevronRightIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Style */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <div className="mb-8">
                            <h3 className="block text-xl font-semibold text-slate-100 mb-4">Choose a theme</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {THEMES.slice(0, 8).map((theme) => (
                                    <button key={theme.name} onClick={() => setSelectedTheme(theme)} className={`text-left p-2 rounded-lg cursor-pointer border-2 transition-all duration-200 group ${selectedTheme.name === theme.name ? 'border-indigo-500 scale-105' : 'border-slate-600 hover:border-slate-500'}`}>
                                        <div className={`w-full h-12 rounded ${theme.background} group-hover:opacity-90 transition-opacity`}></div>
                                        <p className={`mt-2 font-semibold text-sm ${selectedTheme.name === theme.name ? 'text-indigo-300' : 'text-slate-300'}`}>{theme.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-8">
                            <h3 className="block text-xl font-semibold text-slate-100 mb-4">Choose a layout</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {LAYOUTS.slice(0, 10).map((layout) => (
                                    <button key={layout.name} onClick={() => setSelectedLayout(layout)} className={`p-1.5 rounded-lg cursor-pointer border-2 transition-all duration-200 group ${selectedLayout.name === layout.name ? 'border-indigo-500 scale-105' : 'border-slate-600 hover:border-slate-500'}`} title={layout.name}>
                                        <LayoutIcon layout={layout} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between">
                            <button onClick={prevStep} className={`${buttonClass} bg-slate-600 hover:bg-slate-700`}>
                                <ChevronLeftIcon className="w-5 h-5"/> Back
                            </button>
                            <button onClick={nextStep} className={buttonClass}>
                                Next <ChevronRightIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Step 3: Details */}
                {step === 3 && (
                     <div className="space-y-4 animate-fade-in">
                        <AccordionItem id="content" title="Content & Structure" icon={<DocumentTextIcon className="w-6 h-6 text-indigo-400" />}>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="slideCount" className="block text-sm font-medium text-slate-300 mb-2">Slide Count: <span className="font-bold text-white">{advancedOptions.slideCount}</span></label>
                                    <input type="range" id="slideCount" name="slideCount" min="3" max="15" value={advancedOptions.slideCount} onChange={handleAdvancedChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Detail Level</label>
                                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-900/70 p-1">
                                        {DETAIL_LEVELS.map(level => (
                                            <button key={level} type="button" onClick={() => setAdvancedOptions({ ...advancedOptions, detailLevel: level })} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 ${advancedOptions.detailLevel === level ? 'bg-indigo-600 text-white shadow-md' : 'bg-transparent text-slate-300 hover:bg-slate-700'}`}>
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="keyTakeaway" className="block text-sm font-medium text-slate-300 mb-2">Key Takeaway <span className="text-slate-400">(Optional)</span></label>
                                    <input type="text" id="keyTakeaway" name="keyTakeaway" value={advancedOptions.keyTakeaway} onChange={handleAdvancedChange} placeholder="The main message to leave with the audience" className={inputClass} />
                                </div>
                            </div>
                        </AccordionItem>
                        
                        <AccordionItem id="audience" title="Audience & Tone" icon={<UsersIcon className="w-6 h-6 text-indigo-400" />}>
                             <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Presentation Style</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {PRESENTATION_STYLES.map(style => (
                                            <button key={style} type="button" onClick={() => setAdvancedOptions({ ...advancedOptions, presentationStyle: style })} className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 ${advancedOptions.presentationStyle === style ? 'bg-indigo-600 border-transparent text-white scale-105 shadow-lg' : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-500'}`}>
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-300 mb-2">Target Audience <span className="text-slate-400">(Optional)</span></label>
                                        <input type="text" id="targetAudience" name="targetAudience" value={advancedOptions.targetAudience} onChange={handleAdvancedChange} placeholder="e.g., University students" className={inputClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-2">Tone of Voice <span className="text-slate-400">(Optional)</span></label>
                                        <input type="text" id="tone" name="tone" value={advancedOptions.tone} onChange={handleAdvancedChange} placeholder="e.g., enthusiastic, witty" className={inputClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="brandName" className="block text-sm font-medium text-slate-300 mb-2">Brand Name <span className="text-slate-400">(Optional)</span></label>
                                        <input type="text" id="brandName" name="brandName" value={advancedOptions.brandName} onChange={handleAdvancedChange} placeholder="Your company name" className={inputClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="additionalKeywords" className="block text-sm font-medium text-slate-300 mb-2">Keywords <span className="text-slate-400">(Optional)</span></label>
                                        <input type="text" id="additionalKeywords" name="additionalKeywords" value={advancedOptions.additionalKeywords} onChange={handleAdvancedChange} placeholder="Comma-separated" className={inputClass} />
                                    </div>
                                </div>
                            </div>
                        </AccordionItem>
                        
                        <AccordionItem id="visuals" title="Visuals" icon={<PhotoIcon className="w-6 h-6 text-indigo-400" />}>
                            <div className="flex justify-between items-center mb-6">
                                <label htmlFor="includeImagesToggle" className="text-sm font-medium text-slate-300">Generate Slide Images</label>
                                <button id="includeImagesToggle" type="button" role="switch" aria-checked={advancedOptions.includeImages} onClick={() => handleToggleChange('includeImages', !advancedOptions.includeImages)} className={`${advancedOptions.includeImages ? 'bg-indigo-600' : 'bg-slate-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800`}>
                                    <span aria-hidden="true" className={`${advancedOptions.includeImages ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                                </button>
                            </div>
                             <div className={`transition-all duration-500 ease-in-out ${advancedOptions.includeImages ? 'opacity-100 max-h-40' : 'opacity-50 pointer-events-none'}`}>
                                <div>
                                    <label htmlFor="imageStyle" className="block text-sm font-medium text-slate-300 mb-2">Image Style</label>
                                    <input type="text" id="imageStyle" name="imageStyle" value={advancedOptions.imageStyle} onChange={handleAdvancedChange} placeholder="e.g., photorealistic, minimalist, abstract" className={inputClass} disabled={!advancedOptions.includeImages} />
                                    <p className="text-xs text-slate-400 mt-2">Describe the visual aesthetic for the generated images.</p>
                                </div>
                            </div>
                        </AccordionItem>
                        
                        <div className="mt-8 flex justify-between items-center">
                            <button onClick={prevStep} className={`${buttonClass} bg-slate-600 hover:bg-slate-700`}>
                                <ChevronLeftIcon className="w-5 h-5"/> Back
                            </button>
                            <button onClick={onGenerate} disabled={!topic.trim()} className={`${buttonClass} w-auto`}>
                                <SparklesIcon className="w-6 h-6" />
                                Generate Presentation
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingView;