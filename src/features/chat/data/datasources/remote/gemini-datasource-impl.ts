import { AiResponseDto } from "../../../application/dtos/ai-response-dto";
import { GeminiDatasource } from "../../../domain/datasources/remote/gemini-datasource";

export class GeminiDatasourceImpl implements GeminiDatasource{
    private readonly API_KEY = 'AIzaSyBvtF2e8EVOPtVXJrPitW8S4DIc7EuKI_c';
    private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent';

    async getResponse(prompt: string): Promise<AiResponseDto> {
        const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        return AiResponseDto.fromJson(await response.json());
    
    }

}


/*
* try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=AIzaSyBvtF2e8EVOPtVXJrPitW8S4DIc7EuKI_c', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });
            const data = await response.json();
            return { text: data.candidates[0].content.parts[0].text };
        } catch (error) {
            console.error('Error:', error);
            return { text: 'Error: Could not get response from AI' };
        }
*
*
* */