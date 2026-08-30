
import { extractText, extractLinks, getDocumentProxy } from "unpdf";

export default async function pdfParser(buffer: Buffer): Promise<string> {
  try {
    // 1. Convert Buffer to Uint8Array (required for unpdf/pdf.js)
    const pdf = await getDocumentProxy(new Uint8Array(buffer));

    // 2. Extract Text and Links in parallel
    const [{ text }, { links }] = await Promise.all([
      extractText(pdf),
      extractLinks(pdf)
    ]);

    // 3. Clean up the text (unpdf text extraction is very clean)
    let combinedRes = Array.isArray(text) ? text.join("\n") : text;
    // 4. Append links at the end to keep your response as a single string
    if (links && links.length > 0) {
      // De-duplicate links (e.g. same link in header/footer)
      const uniqueLinks = [
        ...new Set(
          links
            .map((link: string | { uri?: string } | undefined) =>
              typeof link === "string" ? link : link?.uri
            )
            .filter((uri): uri is string => Boolean(uri))
        )
      ];
      combinedRes += "\n\nLinks found in PDF:\n" + uniqueLinks.join("\n");
    }

    return combinedRes;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    return "Error parsing PDF content.";
  }
}
