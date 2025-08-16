import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AdvancedOptions } from '../types';

interface SlideContent {
    title: string;
    content: string[];
    imagePrompt: string;
    speakerNotes: string;
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
3.  Detailed speaker notes for the presenter to read during the presentation. These should expand on the bullet points and provide a conversational script.`;

    const schemaProperties: any = {
        title: {
            type: Type.STRING,
            description: 'A short, engaging title for the slide.'
        },
        content: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: 'An array of 3-4 concise bullet points for the slide content.'
        },
        speakerNotes: {
            type: Type.STRING,
            description: 'Detailed speaker notes for the presenter, expanding on the bullet points.'
        }
    };
    const requiredFields = ["title", "content", "speakerNotes"];

    if (options.includeImages) {
        slideInstructions += `\n4.  A descriptive image prompt for an AI image generator. This prompt should create a relevant visual for the slide. The desired visual style is: **${options.imageStyle}**.`;
        schemaProperties.imagePrompt = {
            type: Type.STRING,
            description: 'A descriptive prompt for an AI image generator to create a relevant visual for the slide.'
        };
        requiredFields.push("imagePrompt");
    }
    
    prompt += slideInstructions;
    prompt += `

Return ONLY the raw JSON array based on the provided schema. Do not include any other text or explanations.
    `;

    const presentationSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: schemaProperties,
            required: requiredFields
        }
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: presentationSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        
        if (Array.isArray(parsedData)) {
            return parsedData.map(slide => ({
                title: slide.title || '',
                content: slide.content || [],
                imagePrompt: slide.imagePrompt || '', // Ensure imagePrompt exists
                speakerNotes: slide.speakerNotes || '',
            }));
        }
        return [];

    } catch (error) {
        console.error("Error generating presentation content:", error);
        throw new Error("Failed to parse presentation content from AI. The response might be malformed.");
    }
};


export const generateSlideImage = async (ai: GoogleGenAI, prompt: string, imageStyle: string): Promise<string> => {
     const fullPrompt = `${imageStyle}, cinematic, high-detail, professional photograph of: ${prompt}`;
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '16:9',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error generating image:", error);
        // Return a placeholder image on failure
        return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1280/720`;
    }
};