import React from 'react';
import { Theme, Layout } from '../types';
import { THEMES, LAYOUTS } from '../constants';
import { LayoutIcon, XMarkIcon } from './IconComponents';

interface DesignPanelProps {
    isOpen: boolean;
    onClose: () => void;
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
    layout: Layout;
    onLayoutChange: (layout: Layout) => void;
}

const DesignPanel: React.FC<DesignPanelProps> = ({ isOpen, onClose, theme, onThemeChange, layout, onLayoutChange }) => {
    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Panel */}
            <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-slate-800 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Design</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label="Close design panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-8 overflow-y-auto h-[calc(100%-65px)]">
                    <div>
                        <h3 className="block text-lg font-semibold text-slate-100 mb-4">Theme</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {THEMES.map((t) => (
                                <button key={t.name} onClick={() => onThemeChange(t)} className={`text-left p-1.5 rounded-lg cursor-pointer border-2 transition-all duration-200 group ${theme.name === t.name ? 'border-indigo-500 scale-105' : 'border-slate-600 hover:border-slate-500'}`}>
                                    <div className={`w-full h-12 rounded ${t.background} group-hover:opacity-90 transition-opacity`}></div>
                                    <p className={`mt-2 font-semibold text-xs truncate ${theme.name === t.name ? 'text-indigo-300' : 'text-slate-300'}`}>{t.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="block text-lg font-semibold text-slate-100 mb-4">Layout</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {LAYOUTS.map((l) => (
                                <button key={l.name} onClick={() => onLayoutChange(l)} className={`p-1.5 rounded-lg cursor-pointer border-2 transition-all duration-200 group ${layout.name === l.name ? 'border-indigo-500 scale-105' : 'border-slate-600 hover:border-slate-500'}`} title={l.name}>
                                    <LayoutIcon layout={l} className="h-12" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default DesignPanel;