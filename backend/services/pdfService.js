import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
export const uploadToSupabase = async (file, userId) => {
  const filePath = `user-${userId}/${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from("documents")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error(error.message);
  }

  return filePath;
};

export const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const strings = content.items.map(item => item.str);
      text += strings.join(" ") + "\n";
    }

    return text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw error;
  }
};

export const getSignedUrl = async (filePath) => {
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, 60 * 60);

  if (error) throw new Error(error.message);

  return data.signedUrl;
};