import { Slide, Theme, Layout } from '../types';

declare var PptxGenJS: any;

// A map from Tailwind text color class to a hex code
const tailwindToHex: { [key: string]: string } = {
    // Original colors
    'text-indigo-400': '818CF8', // Replaced purple
    'text-teal-300': '5EEAD4',
    'text-yellow-200': 'FDE047',
    'text-blue-600': '2563EB',

    // Generic text colors
    'text-white': 'FFFFFF',
    'text-slate-300': 'CBD5E1', // Replaced gray-200
    'text-gray-200': 'E5E7EB',
    'text-blue-100': 'DBEAFE',
    'text-gray-600': '4B5563',
    'text-gray-800': '1F2937',
    'text-black': '000000',
    'text-gray-300': 'D1D5DB',
    'text-rose-100': 'FFE4E6',
    'text-gray-700': '374151',
    'text-yellow-900': '78350F',
    'text-cyan-300': '67E8F9',
    'text-lime-100': 'ECFCCB',
    'text-sky-900': '0C4A6E',
    'text-indigo-200': 'C7D2FE',
    'text-red-200': 'FECACA',

    // New bullet colors
    'text-emerald-400': '34D399',
    'text-rose-300': 'FDA4AF',
    'text-gray-400': '9CA3AF',
    'text-gray-500': '6B7281',
    'text-yellow-800': '92400E',
    'text-cyan-400': '22D3EE',
    'text-lime-400': 'A3E635',
    'text-sky-800': '075985',
    'text-yellow-400': 'FACC15',
    'text-red-400': 'F87171',
    'text-purple-500': 'A855F7',
    
    // Title colors
    'text-fuchsia-500': 'D946EF',
    'text-yellow-300': 'FBBF24',
    'text-purple-800': '6B21A8',
};

// A map from Tailwind background class to a hex code.
// We typically use the `from-` color for gradients.
const bgClassToHex: { [key: string]: string } = {
    'from-slate-900': '0F172A',
    'from-indigo-900': '312E81',
    'from-gray-900': '111827',
    'from-blue-900': '1E40AF',
    'from-red-500': 'EF4444',
    'bg-white': 'FFFFFF',
    'from-emerald-800': '065F46',
    'from-red-800': '991B1B',
    'bg-gray-800': '1F2937',
    'bg-gray-100': 'F3F4F6',
    'bg-yellow-50': 'FEFCE8',
    'bg-black': '000000',
    'from-green-900': '14532D',
    'from-sky-200': 'BAE6FD',
    'from-red-900': '7F1D1D',
    'from-pink-200': 'FECDD3',
};

interface PptxCoords {
    title: any;
    content: any;
    image?: any;
    overlayBox?: any;
}

const layoutCoords: { [key: string]: PptxCoords } = {
    'Image Right': {
        image: { x: '52%', y: '15%', w: '45%', h: '70%' },
        title: { x: '5%', y: '15%', w: '45%', h: '15%' },
        content: { x: '5%', y: '35%', w: '45%', h: '50%' },
    },
    'Image Left': {
        image: { x: '5%', y: '15%', w: '45%', h: '70%' },
        title: { x: '52%', y: '15%', w: '45%', h: '15%' },
        content: { x: '52%', y: '35%', w: '45%', h: '50%' },
    },
    'Image Top': {
        image: { x: '5%', y: '10%', w: '90%', h: '45%' },
        title: { x: '5%', y: '60%', w: '90%', h: '10%' },
        content: { x: '5%', y: '70%', w: '90%', h: '25%' },
    },
    'Image Bottom': {
        title: { x: '5%', y: '10%', w: '90%', h: '10%' },
        content: { x: '5%', y: '20%', w: '90%', h: '25%' },
        image: { x: '5%', y: '50%', w: '90%', h: '45%' },
    },
    'Text Wide Left': { // Text 2/3, Image 1/3
        image: { x: '68%', y: '15%', w: '27%', h: '70%' },
        title: { x: '5%', y: '15%', w: '60%', h: '15%' },
        content: { x: '5%', y: '35%', w: '60%', h: '50%' },
    },
    'Text Wide Right': { // Image 1/3, Text 2/3
        image: { x: '5%', y: '15%', w: '27%', h: '70%' },
        title: { x: '35%', y: '15%', w: '60%', h: '15%' },
        content: { x: '35%', y: '35%', w: '60%', h: '50%' },
    },
    'Image Wide Left': { // Image 2/3, Text 1/3
        image: { x: '5%', y: '15%', w: '60%', h: '70%' },
        title: { x: '68%', y: '15%', w: '27%', h: '15%' },
        content: { x: '68%', y: '35%', w: '27%', h: '50%' },
    },
    'Image Wide Right': { // Text 1/3, Image 2/3
        image: { x: '35%', y: '15%', w: '60%', h: '70%' },
        title: { x: '5%', y: '15%', w: '27%', h: '15%' },
        content: { x: '5%', y: '35%', w: '27%', h: '50%' },
    },
    'Image Top Tall': {
        image: { x: '5%', y: '10%', w: '90%', h: '60%' },
        title: { x: '5%', y: '75%', w: '90%', h: '8%' },
        content: { x: '5%', y: '83%', w: '90%', h: '15%' },
    },
    'Image Bottom Tall': {
        title: { x: '5%', y: '10%', w: '90%', h: '8%' },
        content: { x: '5%', y: '18%', w: '90%', h: '15%' },
        image: { x: '5%', y: '35%', w: '90%', h: '60%' },
    },
    'Text Overlay': {
        image: { x: 0, y: 0, w: '100%', h: '100%' },
        overlayBox: { x: 0, y: 0, w: '100%', h: '100%', fill: { color: '000000', transparency: 50 } },
        title: { x: '5%', y: '25%', w: '90%', h: '20%', color: 'FFFFFF' },
        content: { x: '5%', y: '45%', w: '90%', h: '45%', color: 'F1F5F9' },
    },
    'Overlay Top': {
        image: { x: 0, y: 0, w: '100%', h: '100%' },
        overlayBox: { x: 0, y: 0, w: '100%', h: '50%', fill: { color: '000000', transparency: 30 } },
        title: { x: '5%', y: '5%', w: '90%', h: '15%', color: 'FFFFFF' },
        content: { x: '5%', y: '20%', w: '90%', h: '25%', color: 'F1F5F9' },
    },
    'Overlay Bottom': {
        image: { x: 0, y: 0, w: '100%', h: '100%' },
        overlayBox: { x: 0, y: '50%', w: '100%', h: '50%', fill: { color: '000000', transparency: 30 } },
        title: { x: '5%', y: '55%', w: '90%', h: '15%', color: 'FFFFFF' },
        content: { x: '5%', y: '70%', w: '90%', h: '25%', color: 'F1F5F9' },
    },
    'full-width': {
        title: { x: '5%', y: '10%', w: '90%', h: '15%' },
        content: { x: '5%', y: '30%', w: '90%', h: '60%' },
    }
};


const getHexFromTailwind = (classes: string, map: { [key: string]: string }, defaultColor: string): string => {
    const classList = classes.split(' ');
    for (const c of classList) {
        if (map[c]) {
            return map[c];
        }
    }
    return defaultColor;
};

export const downloadAsPptx = (slides: Slide[], theme: Theme, layout: Layout, includeImages: boolean) => {
    if (typeof PptxGenJS === 'undefined') {
        alert('Presentation library is not loaded. Please try again.');
        return;
    }

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';

    const themeTitleColor = getHexFromTailwind(theme.titleColor, tailwindToHex, '333333');
    const themeTextColor = getHexFromTailwind(theme.textColor, tailwindToHex, '6c757d');
    const themeBulletColor = getHexFromTailwind(theme.bulletColor, tailwindToHex, '007BFF');
    const themeBgColor = getHexFromTailwind(theme.background.split(' ').find(c => c.startsWith('from-') || c.startsWith('bg-')) || '', bgClassToHex, '1A202C');

    slides.forEach((slideData) => {
        const slide = pptx.addSlide();
        slide.background = { color: themeBgColor };
        
        if (slideData.speakerNotes) {
            slide.addNotes(slideData.speakerNotes);
        }

        const contentText = slideData.content.map(point => ({
            text: point,
            options: {
                fontSize: 18,
                bullet: { code: '25CF' },
            }
        }));

        let currentLayoutName = layout.name;
        if (!includeImages) {
            currentLayoutName = 'full-width';
        } else if (layout.name.includes('Overlay')) {
             currentLayoutName = layout.name;
        }

        const coords = layoutCoords[currentLayoutName] || layoutCoords['Image Right'];

        if (includeImages && slideData.imageUrl && coords.image) {
             slide.addImage({
                data: slideData.imageUrl,
                ...coords.image
            });
            if (coords.overlayBox) {
                slide.addShape(pptx.shapes.RECTANGLE, coords.overlayBox);
            }
        }
        
        slide.addText(slideData.title, {
            ...coords.title,
            fontSize: coords.title.fontSize || 36, 
            bold: true,
            color: coords.title.color || themeTitleColor,
            align: 'left',
            valign: 'top',
        });
        
        // Customizing text options for content
        const contentOptions = {
            ...coords.content,
            align: 'left',
            valign: 'top',
        };

        const themedContentText = contentText.map(item => ({
            ...item,
            options: {
                ...item.options,
                color: coords.content.color || themeTextColor,
                bullet: { ...item.options.bullet, color: coords.title.color ? 'FFFFFF' : themeBulletColor }
            }
        }));

        slide.addText(themedContentText, contentOptions);
    });

    pptx.writeFile({ fileName: 'AI-Generated-Presentation.pptx' });
};