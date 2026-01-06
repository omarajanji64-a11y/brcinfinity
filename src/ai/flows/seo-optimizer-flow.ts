
'use server';
/**
 * @fileOverview An AI flow for optimizing product SEO.
 *
 * - optimizeProductSeo - A function that takes product data and returns SEO-optimized content.
 * - SeoOptimizationInput - The input type for the optimizeProductSeo function.
 * - SeoOptimizationOutput - The return type for the optimizeProductSeo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProductInfoSchema = z.object({
  id: z.string(),
  name: z.string().describe('The current name of the product.'),
  description: z.string().describe('The current detailed description of the product.'),
  category: z.string().describe('The category of the product (e.g., Living Room).'),
  style: z.string().describe('The style of the product (e.g., Classic, Modern).'),
  currentKeywords: z.array(z.string()).optional().describe('An optional list of current SEO keywords for the product.'),
});

export const SeoOptimizationInputSchema = z.object({
  product: ProductInfoSchema,
});
export type SeoOptimizationInput = z.infer<typeof SeoOptimizationInputSchema>;

export const SeoOptimizationOutputSchema = z.object({
  productId: z.string().describe('The unique ID of the product that was optimized.'),
  optimizedKeywords: z.array(z.string()).describe('A new list of 5-7 highly relevant SEO keywords for the product.'),
  optimizedMetaDescription: z.string().describe('A new, compelling meta description (150-160 characters) for the product.'),
  changelog: z.string().describe('A brief, user-friendly summary of the optimizations performed.'),
});
export type SeoOptimizationOutput = z.infer<typeof SeoOptimizationOutputSchema>;

export async function optimizeProductSeo(input: SeoOptimizationInput): Promise<SeoOptimizationOutput> {
  return optimizeProductSeoFlow(input);
}

const seoPrompt = ai.definePrompt({
  name: 'seoOptimizerPrompt',
  input: { schema: SeoOptimizationInputSchema },
  output: { schema: SeoOptimizationOutputSchema },
  prompt: `You are a world-class SEO expert specializing in e-commerce for luxury furniture.
Your task is to optimize the provided product information for maximum search engine visibility and click-through rate.

Analyze the following product:
- Product Name: {{{product.name}}}
- Product Description: {{{product.description}}}
- Product Category: {{{product.category}}}
- Product Style: {{{product.style}}}
- Current Keywords: {{#if product.currentKeywords}}{{#each product.currentKeywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}

Your response MUST be in the specified JSON format.

Optimization Tasks:
1.  **Generate Keywords**: Create a new list of 5 to 7 highly relevant and specific SEO keywords. Think about what a potential buyer would search for. Include long-tail keywords.
2.  **Generate Meta Description**: Write a new, compelling meta description for the product. It must be between 150 and 160 characters. It should be engaging and encourage clicks.
3.  **Create Changelog**: Briefly summarize the changes you made in a friendly and easy-to-understand way. For example: "Generated a new set of targeted keywords and crafted a more persuasive meta description to improve search ranking."

Set the 'productId' field in your response to '{{{product.id}}}'.
`,
});

const optimizeProductSeoFlow = ai.defineFlow(
  {
    name: 'optimizeProductSeoFlow',
    inputSchema: SeoOptimizationInputSchema,
    outputSchema: SeoOptimizationOutputSchema,
  },
  async (input) => {
    const { output } = await seoPrompt(input);
    return output!;
  }
);
