import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AdvancedOptions } from '../types';

interface SlideContent {
    title: string;
    content: string[];
    speakerNotes: string;
}

interface SlideContextForImage {
    title: string;
    content: string[];
}

export const generatePresentationContent = async (ai: GoogleGenAI, topic: string, options: AdvancedOptions): Promise<SlideContent[]> => {
    let prompt = `
        You are an expert presentation creator. Your task is to generate a ${options.slideCount}-slide presentation structure for the topic: "${topic}".
        The presentation must follow this structure:
        1. A compelling Title Slide.
        2. ${options.slideCount - 2} distinct Content Slides that explore the topic in a logical sequence.
        3. A final summary/conclusion slide, which could be a "Thank You" or "Q&A" slide.

        Please adhere to the following guidelines for content generation:
        - **Detail Level**: Create content with a '${options.detailLevel}' level of detail.
        - **Presentation Style**: The style should be '${options.presentationStyle}'.`;

    if (options.targetAudience) {
        prompt += `\n- **Target Audience**: The content should be tailored for '${options.targetAudience}'.`;
    }
    if (options.brandName) {
        prompt += `\n- **Brand Name**: Subtly incorporate the brand name '${options.brandName}' where it feels natural.`;
    }
    if (options.keyTakeaway) {
        prompt += `\n- **Key Takeaway**: The presentation should build towards this key takeaway: '${options.keyTakeaway}'. Make sure the final slide reinforces this.`;
    }
    if (options.additionalKeywords) {
        prompt += `\n- **Keywords**: Weave in the following keywords: '${options.additionalKeywords}'.`;
    }
    if (options.tone) {
        prompt += `\n- **Tone**: The overall tone should be '${options.tone}'.`;
    }
    
    let slideInstructions = `

For each slide, you must provide:
1.  A short, engaging title.
2.  An array of 3-4 concise bullet points for the slide content, matching the requested detail level and style.
3.  Detailed speaker notes for the presenter to read during the presentation. These should expand on the bullet points and provide a conversational script.
`;

    if (options.includeImages) {
        // No special instructions needed for image prompt generation anymore.
    } else {
        // No change needed here
    }

    prompt += slideInstructions;

    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                content: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
                speakerNotes: { type: Type.STRING }
            },
            required: ["title", "content", "speakerNotes"]
        }
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        },
    });

    try {
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as SlideContent[];
    } catch (e) {
        console.error("Failed to parse JSON response:", response.text);
        throw new Error("The AI returned an invalid presentation format. Please try again.");
    }
};

export const generateSlideImage = async (ai: GoogleGenAI, context: SlideContextForImage, imageStyle: string): Promise<string> => {
    const detailedPrompt = `
        Generate a professional, high-quality image for a presentation slide with the following topic.
        The image must be directly relevant to the slide's content and visually engaging.
        The desired style is "${imageStyle}".

        Slide Title: "${context.title}"
        Slide Content:
        - ${context.content.join('\n- ')}

        Based on the title and content, create a powerful visual metaphor or a literal representation of the core message.
        Do not include any text, logos, or watermarks in the image. The image should be suitable for a professional presentation.
    `;
    
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: detailedPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed. No images were returned.");
    }

    return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
};

export const modifyTextWithAI = async (
    ai: GoogleGenAI,
    text: string,
    action: string,
    context: { title: string; surroundingPoints?: string[] }
): Promise<string> => {
    const prompt = `
        You are an AI writing assistant helping to refine presentation content.
        The user is working on a slide with the title: "${context.title}".
        ${context.surroundingPoints ? `Other points on the slide are: ${context.surroundingPoints.join(', ')}` : ''}

        The user wants to modify this piece of text: "${text}"
        The requested action is: "${action}"

        Perform the action and return only the modified text, without any introductory phrases or quotation marks.
        If suggesting alternatives, provide them as a single string, separated by newlines.
    `;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text.trim();
};
