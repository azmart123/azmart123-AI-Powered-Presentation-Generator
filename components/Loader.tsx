import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './IconComponents';

const loadingMessages = [
    'Brewing creativity...',
    'Gathering inspiration...',
    'Painting with pixels...',
    'Composing content...',
    'Assembling slides...',
    'Almost there...',
];

interface LoaderProps {
    message: string; // Keep this for the initial message from App.tsx
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
    const [dynamicMessage, setDynamicMessage] = useState(message);

    useEffect(() => {
        setDynamicMessage(message); // Set initial message
        const interval = setInterval(() => {
            setDynamicMessage(prev => {
                const currentIndex = loadingMessages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(interval);
    }, [message]);


    return (
        <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
            <div className="relative flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-500"></div>
                <div className="absolute">
                     <SparklesIcon className="w-16 h-16 text-indigo-400 animate-pulse" />
                </div>
            </div>
            <h2 className="text-3xl font-bold text-white mt-8">Generating Your Masterpiece</h2>
            <p className="text-slate-300 mt-2 text-lg min-h-[28px]">{dynamicMessage}</p>
        </div>
    );
};

export default Loader;