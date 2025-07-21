// Mock OCR service for document verification
// In a real implementation, this would integrate with services like:
// - Google Vision API
// - AWS Textract
// - Azure Form Recognizer
// - Tesseract.js for client-side OCR

interface NameMatch {
  extractedName: string;
  confidence: number;
  matched: boolean;
}

interface OCRResult {
  extractedText: string;
  confidence: number;
  nameMatches: NameMatch[];
}

// Mock OCR function that simulates text extraction and name matching
export async function performOCR(
  filePath: string,
  userNames: string[], // Main name + alternative names
  documentType: "marksheet" | "degree" | "certificate"
): Promise<OCRResult> {
  
  // Simulate OCR processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock extracted text based on document type
  const mockTexts = {
    marksheet: `
      UNIVERSITY OF EDUCATION
      TRANSCRIPT OF RECORDS
      
      Student Name: ${userNames[0]}
      Roll Number: 2021001234
      Course: Bachelor of Science
      Year: Third Year (2023-2024)
      
      Subject           Grade    Credits
      Mathematics        A        4
      Physics            B+       4
      Chemistry          A-       3
      Biology            B        3
      
      Total Credits: 14
      CGPA: 8.5/10
      
      This transcript is issued on [Date]
      Registrar Signature
    `,
    degree: `
      UNIVERSITY DEGREE CERTIFICATE
      
      This is to certify that ${userNames[0]}
      has successfully completed the requirements for
      Bachelor of Science in ${Math.random() > 0.5 ? 'Biology' : 'Chemistry'}
      
      Graduation Year: ${2020 + Math.floor(Math.random() * 4)}
      
      Conferred this day: [Date]
      Chancellor Signature
      University Seal
    `,
    certificate: `
      PROFESSIONAL CERTIFICATION
      
      This certifies that ${userNames[0]}
      has successfully completed the requirements for
      Advanced Professional Development Program
      
      Issued by: Professional Council
      Certificate ID: CERT-${Math.random().toString(36).substr(2, 9)}
      Valid until: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}
      
      Director Signature
    `
  };

  const extractedText = mockTexts[documentType];
  
  // Simulate name matching with different confidence levels
  const nameMatches: NameMatch[] = userNames.map(name => {
    const nameInText = extractedText.toLowerCase().includes(name.toLowerCase());
    const confidence = nameInText ? 
      0.85 + (Math.random() * 0.15) : // High confidence if name found
      0.3 + (Math.random() * 0.4);   // Lower confidence if not found
    
    return {
      extractedName: name,
      confidence: Math.round(confidence * 100) / 100,
      matched: nameInText && confidence > 0.7
    };
  });

  // Overall confidence based on name matches
  const avgConfidence = nameMatches.length > 0 
    ? nameMatches.reduce((sum, match) => sum + match.confidence, 0) / nameMatches.length
    : 0.5;

  return {
    extractedText,
    confidence: Math.round(avgConfidence * 100) / 100,
    nameMatches
  };
}

// Helper function to validate document authenticity
export function validateDocumentAuthenticity(ocrResult: OCRResult): {
  isValid: boolean;
  issues: string[];
  confidence: number;
} {
  const issues: string[] = [];
  let confidence = ocrResult.confidence;

  // Check if any names matched
  const hasMatchedNames = ocrResult.nameMatches.some(match => match.matched);
  if (!hasMatchedNames) {
    issues.push("No matching names found in the document");
    confidence -= 0.3;
  }

  // Check overall confidence
  if (ocrResult.confidence < 0.6) {
    issues.push("Low OCR confidence - document may be unclear or corrupted");
  }

  // Check for common document elements
  const requiredElements = ['signature', 'seal', 'date', 'university', 'college', 'institution'];
  const foundElements = requiredElements.filter(element => 
    ocrResult.extractedText.toLowerCase().includes(element)
  );
  
  if (foundElements.length < 2) {
    issues.push("Missing expected document elements (signature, seal, etc.)");
    confidence -= 0.2;
  }

  const finalConfidence = Math.max(0, Math.min(1, confidence));
  
  return {
    isValid: finalConfidence > 0.6 && hasMatchedNames,
    issues,
    confidence: Math.round(finalConfidence * 100) / 100
  };
}