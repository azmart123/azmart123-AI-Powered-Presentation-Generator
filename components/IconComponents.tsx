import React from 'react';
import { Layout } from '../types';

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5a3.375 3.375 0 00-3.375-3.375L12.75 9.75l-1.875.375a3.375 3.375 0 00-3.375 3.375v1.5a3.375 3.375 0 003.375 3.375h1.5a3.375 3.375 0 003.375-3.375v-1.5z" />
    </svg>
);

export const RestartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l4.992-4.993m-4.993 0l3.181-3.183a8.25 8.25 0 0111.664 0l3.181 3.183" />
    </svg>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export const NotesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

export const FullscreenEnterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m-1.5 1.5l-6 6m7.5-3.75v4.5m0-4.5h-4.5m4.5 0L15 15m-4.5 4.5h4.5m-4.5 0v-4.5m0 4.5L9 15" />
    </svg>
);

export const FullscreenExitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L3.75 3.75M3.75 3.75h4.5m-4.5 0v4.5m12 0L9 9m1.5-1.5L15 9m6 6l-5.25-5.25m5.25 5.25v-4.5m0 4.5h-4.5M9 15l-1.5 1.5m1.5-1.5l5.25 5.25" />
    </svg>
);


export const LayoutIcon: React.FC<{ layout: Layout; className?: string }> = ({ layout, className }) => {
    const iconBaseClass = `w-full h-16 rounded-lg bg-slate-700 p-1.5 flex group-hover:bg-slate-600 transition-colors duration-200 ${className}`;
    const imageClass = "bg-indigo-500 rounded";
    const textClass = "bg-slate-500 rounded";

    const renderLayout = () => {
        switch (layout.name) {
            case 'Image Left':
                return <div className={`${iconBaseClass} gap-1`}><div className={`w-1/2 ${imageClass}`}></div><div className={`w-1/2 ${textClass}`}></div></div>;
            case 'Image Right':
                return <div className={`${iconBaseClass} gap-1`}><div className={`w-1/2 ${textClass}`}></div><div className={`w-1/2 ${imageClass}`}></div></div>;
            case 'Image Top':
                return <div className={`${iconBaseClass} flex-col gap-1`}><div className={`h-1/2 w-full ${imageClass}`}></div><div className={`h-1/2 w-full ${textClass}`}></div></div>;
            case 'Image Bottom':
                return <div className={`${iconBaseClass} flex-col gap-1`}><div className={`h-1/2 w-full ${textClass}`}></div><div className={`h-1/2 w-full ${imageClass}`}></div></div>;
            case 'Text Wide Left':
                return <div className={`${iconBaseClass} gap-1`}><div className={`w-2/3 ${textClass}`}></div><div className={`w-1/3 ${imageClass}`}></div></div>;
            case 'Text Wide Right':
                return <div className={`${iconBaseClass} gap-1`}><div className={`w-1/3 ${imageClass}`}></div><div className={`w-2/3 ${textClass}`}></div></div>;
            case 'Image Wide Left':
                return <div className={`${iconBaseClass} gap-1`}><div className={`w-2/3 ${imageClass}`}></div><div className={`w-1/3 ${textClass}`}></div></div>;
            case 'Image Wide Right':
                return <div className={`${iconBaseClass} gap-1`}><div className={`w-1/3 ${textClass}`}></div><div className={`w-2/3 ${imageClass}`}></div></div>;
            case 'Image Top Tall':
                 return <div className={`${iconBaseClass} flex-col gap-1`}><div className={`h-2/3 w-full ${imageClass}`}></div><div className={`h-1/3 w-full ${textClass}`}></div></div>;
            case 'Image Bottom Tall':
                 return <div className={`${iconBaseClass} flex-col gap-1`}><div className={`h-1/3 w-full ${textClass}`}></div><div className={`h-2/3 w-full ${imageClass}`}></div></div>;
            case 'Text Overlay':
                return <div className={`${iconBaseClass} relative`}><div className={`absolute inset-0 ${imageClass}`}></div><div className={`relative w-full h-full border-2 border-dashed border-slate-400 rounded m-1.5`}></div></div>;
            case 'Overlay Top':
                return <div className={`${iconBaseClass} relative`}><div className={`absolute inset-0 ${imageClass}`}></div><div className={`relative h-1/2 w-full border-2 border-dashed border-slate-400 rounded m-1.5 self-start`}></div></div>;
            case 'Overlay Bottom':
                return <div className={`${iconBaseClass} relative`}><div className={`absolute inset-0 ${imageClass}`}></div><div className={`relative h-1/2 w-full border-2 border-dashed border-slate-400 rounded m-1.5 self-end`}></div></div>;
            default:
                return <div className={iconBaseClass}></div>;
        }
    }

    return renderLayout();
};

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const GripVerticalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15" />
    </svg>
);