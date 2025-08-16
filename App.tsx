import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Slide, AppState, Theme, Layout, AdvancedOptions } from './types';
import { THEMES, LAYOUTS } from './constants';
import { generatePresentationContent, generateSlideImage } from './services/geminiService';
import LandingView from './components/LandingView';
import Loader from './components/Loader';
import PresentationView from './components/PresentationView';
import { downloadAsPptx } from './services/presentationService';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('INPUT');
    const [topic, setTopic] = useState('');
    const [slides, setSlides] = useState<Slide[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);
    const [selectedLayout, setSelectedLayout] = useState<Layout>(LAYOUTS[0]);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [generationTime, setGenerationTime] = useState<number | null>(null);
    const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
        slideCount: 7,
        detailLevel: 'Standard',
        presentationStyle: 'Professional',
        targetAudience: '',
        brandName: '',
        keyTakeaway: '',
        additionalKeywords: '',
        tone: 'informative',
        imageStyle: 'photorealistic',
        includeImages: true,
    });

    const handleGenerate = useCallback(async () => {
        if (!topic.trim()) {
            setError('Please enter a topic for your presentation.');
            return;
        }
        setError(null);
        setAppState('LOADING');
        const startTime = performance.now();

        try {
            // Step 1: Generate presentation content
            setLoadingMessage('Crafting presentation outline...');
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const presentationData = await generatePresentationContent(ai, topic, advancedOptions);

            if (!presentationData || presentationData.length === 0) {
                throw new Error("The AI failed to generate presentation content. Please try a different topic.");
            }
            
            let slidesWithVisuals: Slide[];

            if (advancedOptions.includeImages) {
                // Step 2: Generate images for each slide
                setLoadingMessage('Designing slide visuals...');
                slidesWithVisuals = await Promise.all(
                    presentationData.map(async (slideContent, index) => {
                        setLoadingMessage(`Designing slide visuals... (${index + 1}/${presentationData.length})`);
                        const imageUrl = await generateSlideImage(ai, slideContent.imagePrompt, advancedOptions.imageStyle);
                        return { ...slideContent, imageUrl };
                    })
                );
            } else {
                // Skip image generation
                slidesWithVisuals = presentationData.map(slideContent => ({
                    ...slideContent,
                    imageUrl: '', // Set image URL to empty
                }));
            }

            const endTime = performance.now();
            const durationInSeconds = (endTime - startTime) / 1000;
            setGenerationTime(durationInSeconds);

            setSlides(slidesWithVisuals);
            setLoadingMessage('Assembling your presentation...');
            setAppState('PRESENTATION');

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate presentation. ${errorMessage}`);
            setAppState('ERROR');
        }
    }, [topic, advancedOptions]);
    
    const handleDownload = useCallback(() => {
        downloadAsPptx(slides, selectedTheme, selectedLayout, advancedOptions.includeImages);
    }, [slides, selectedTheme, selectedLayout, advancedOptions.includeImages]);

    const handleRestart = () => {
        setTopic('');
        setSlides([]);
        setError(null);
        setAppState('INPUT');
        setGenerationTime(null);
    };
    
    const handleRegenerateImage = useCallback(async (slideIndex: number) => {
        const slideToUpdate = slides[slideIndex];
        if (!slideToUpdate || !slideToUpdate.imagePrompt) return;
        
        setSlides(currentSlides =>
            currentSlides.map((s, i) =>
                i === slideIndex ? { ...s, isImageLoading: true } : s
            )
        );

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const imageUrl = await generateSlideImage(ai, slideToUpdate.imagePrompt, advancedOptions.imageStyle);
            
            setSlides(currentSlides =>
                currentSlides.map((s, i) =>
                    i === slideIndex ? { ...s, imageUrl, isImageLoading: false } : s
                )
            );
        } catch (err) {
            console.error("Failed to regenerate image:", err);
            setSlides(currentSlides =>
                currentSlides.map((s, i) =>
                    i === slideIndex ? { ...s, isImageLoading: false } : s
                )
            );
        }
    }, [slides, advancedOptions.imageStyle]);


    const renderContent = () => {
        switch (appState) {
            case 'LOADING':
                return <Loader message={loadingMessage} />;
            case 'PRESENTATION':
                return (
                    <PresentationView
                        slides={slides}
                        onSlidesUpdate={setSlides}
                        theme={selectedTheme}
                        onThemeChange={setSelectedTheme}
                        layout={selectedLayout}
                        onLayoutChange={setSelectedLayout}
                        onDownload={handleDownload}
                        onRestart={handleRestart}
                        generationTime={generationTime}
                        onRegenerateImage={handleRegenerateImage}
                    />
                );
            case 'ERROR':
            case 'INPUT':
            default:
                return (
                    <LandingView
                        topic={topic}
                        setTopic={setTopic}
                        selectedTheme={selectedTheme}
                        setSelectedTheme={setSelectedTheme}
                        selectedLayout={selectedLayout}
                        setSelectedLayout={setSelectedLayout}
                        onGenerate={handleGenerate}
                        error={error}
                        advancedOptions={advancedOptions}
                        setAdvancedOptions={setAdvancedOptions}
                    />
                );
        }
    };

    return (
        <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-500">
            {renderContent()}
        </main>
    );
};

export default App;