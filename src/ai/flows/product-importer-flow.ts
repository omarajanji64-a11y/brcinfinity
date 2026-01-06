
'use server';
/**
 * @fileOverview An AI flow for importing products from unstructured text.
 *
 * - importProductsWithAi - A function that takes a raw string of product data and returns a structured list of products.
 * - ProductImportInput - The input type for the importProductsWithAi function.
 * - ProductImportOutput - The return type for the importProductsWithAi function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const localizedStringSchema = z.object({
  en: z.string(),
  fr: z.string(),
  tr: z.string(),
});

const productSchema = z.object({
  id: z.string(),
  name: localizedStringSchema,
  category: localizedStringSchema,
  style: z.enum(['Modern', 'Classic']),
  shortDescription: localizedStringSchema,
  description: localizedStringSchema,
  price: z.number(),
  stock: z.number(),
  imageId: z.string(),
});

export const ProductImportInputSchema = z.object({
  productText: z.string().describe('A raw, unstructured string of text containing a list of products and their details.'),
});
export type ProductImportInput = z.infer<typeof ProductImportInputSchema>;

export const ProductImportOutputSchema = z.object({
  products: z.array(productSchema),
});
export type ProductImportOutput = z.infer<typeof ProductImportOutputSchema>;

export async function importProductsWithAi(input: ProductImportInput): Promise<ProductImportOutput> {
  return importProductsFlow(input);
}

const productImportPrompt = ai.definePrompt({
  name: 'productImporterPrompt',
  input: { schema: ProductImportInputSchema },
  output: { schema: ProductImportOutputSchema },
  prompt: `You are an expert data entry specialist for a luxury furniture company.
Your task is to parse the following raw text, identify each product, and extract its details into a structured JSON format.

RULES:
1.  **Extract All Products**: Identify every distinct product in the text.
2.  **Assign IDs**: Generate a unique UUID for each new product's 'id' field.
3.  **Translate**: For 'name', 'category', 'shortDescription', and 'description', you MUST provide a translation for English (en), French (fr), and Turkish (tr). If the source text is in one language, translate it to the other two.
4.  **Determine Style**: Set the 'style' field to either "Modern" or "Classic" based on the product's description.
5.  **Sanitize Numbers**: 'price' and 'stock' must be numbers. Remove any currency symbols or commas.
6.  **Generate imageId**: Create a simple, URL-friendly 'imageId' from the English product name. For example, "Royal Armchair" becomes "prod-royal-armchair". Use the 'prod-' prefix.
7.  **Handle Missing Data**: If a field is missing (e.g., no description), generate appropriate, professional-sounding content based on the product's name and category. The 'shortDescription' should be a single, compelling sentence.

Here is the raw product data:
---
{{{productText}}}
---

Your response MUST be in the specified JSON format and include all identified products.
`,
});

const importProductsFlow = ai.defineFlow(
  {
    name: 'importProductsFlow',
    inputSchema: ProductImportInputSchema,
    outputSchema: ProductImportOutputSchema,
  },
  async (input) => {
    const { output } = await productImportPrompt(input);
    if (!output) {
      return { products: [] };
    }
    // Post-process to ensure IDs are truly unique, as the model might occasionally repeat them.
    const uniqueProducts = output.products.map(p => ({...p, id: uuidv4()}));
    return { products: uniqueProducts };
  }
);
