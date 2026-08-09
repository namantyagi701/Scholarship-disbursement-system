import React, { useState } from 'react';
import { Upload, CheckCircle, Eye, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Tesseract from 'tesseract.js';

// ── Levenshtein distance & similarity ──────────────────────────────────
function levenshteinDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Slides a window of `name.length` over `text` and returns the best
 * similarity score (0–1) found. Case-insensitive comparison.
 */
function bestNameSimilarity(name, text) {
  const n = name.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!n || !t) return 0;

  const windowLen = n.length;
  if (t.length < windowLen) {
    // Text shorter than name — compare directly
    const dist = levenshteinDistance(n, t);
    return Math.max(0, 1 - dist / Math.max(n.length, t.length));
  }

  let bestScore = 0;
  for (let i = 0; i <= t.length - windowLen; i++) {
    const slice = t.substring(i, i + windowLen);
    const dist = levenshteinDistance(n, slice);
    const score = 1 - dist / windowLen;
    if (score > bestScore) bestScore = score;
    if (bestScore >= 1) break; // Perfect match, stop early
  }
  return bestScore;
}

/**
 * DOB matching — client-side hint only, NOT persisted to backend or shown to SAG.
 *
 * Aadhaar cards render dates in inconsistent formats (DD/MM/YYYY, DD-MM-YYYY,
 * spelled-out months, etc.) versus however formData.dateOfBirth is stored,
 * making DOB pattern-matching meaningfully less reliable than the name
 * similarity check. Rather than persist an unreliable signal that SAG might
 * over-trust, we keep DOB as a lightweight client-side hint for the student
 * only. The stored/SAG-facing OCR signal is limited to the name match, which
 * has been validated to be reasonably reliable.
 */
function findDobInText(dob, text) {
  if (!dob || !text) return false;

  // Try to parse the DOB into day, month, year components
  const dateObj = new Date(dob);
  if (isNaN(dateObj.getTime())) return false;

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = String(dateObj.getFullYear());

  // Search for common date patterns: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const patterns = [
    `${day}/${month}/${year}`,
    `${day}-${month}-${year}`,
    `${day}.${month}.${year}`,
    `${year}-${month}-${day}`,       // ISO format
    `${day}/${month}/${year.slice(2)}`, // 2-digit year
    `${day}-${month}-${year.slice(2)}`,
  ];

  const normalizedText = text.replace(/\s+/g, ' ');
  return patterns.some(p => normalizedText.includes(p));
}

const DocumentUploadStep = ({
  REQUIRED_DOCUMENTS,
  uploadedDocs,
  uploadingDoc,
  handleDocUpload,
  setUploadedDocs,
  setCurrentStep,
  allDocsUploaded,
  formData,
  handleSaveApplication
}) => {
  const [ocrStatus, setOcrStatus] = useState({});   // doc.type → 'scanning' | 'done'
  const [ocrResults, setOcrResults] = useState({});  // doc.type → { text, nameScore, dobFound }

  const handleFileSelect = async (docType, file) => {
    const isAadhaar = docType === 'aadhaar';
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';

    if (isAadhaar && isImage) {
      // Sequential: OCR first, then upload with results
      setOcrStatus(prev => ({ ...prev, [docType]: 'scanning' }));

      let ocrResult = null;
      try {
        const { data: ocrData } = await Tesseract.recognize(file, 'eng');
        const rawText = ocrData.text || '';
        const nameScore = bestNameSimilarity(formData?.name || '', rawText);
        const dobFound = findDobInText(formData?.dateOfBirth || '', rawText);

        ocrResult = { text: rawText, nameScore };
        setOcrResults(prev => ({ ...prev, [docType]: { text: rawText, nameScore, dobFound } }));
      } catch (err) {
        console.error('OCR failed for Aadhaar:', err);
        // OCR failure is non-blocking — proceed with upload, no OCR data
        ocrResult = null;
      }

      setOcrStatus(prev => ({ ...prev, [docType]: 'done' }));

      // Upload fires only after OCR has fully resolved
      handleDocUpload(docType, file, ocrResult);
    } else {
      // Non-Aadhaar or PDF: skip OCR, upload immediately
      handleDocUpload(docType, file, null);
    }
  };

  return (
    <div>
      <h2 className="font-serif-display text-2xl sm:text-3xl font-normal text-[#16213E] mb-2 flex items-center gap-3">
        <Upload className="w-6 h-6 text-[#16213E]" strokeWidth={1.5} />
        Upload Required Documents
      </h2>
      <p className="text-[#6B6558] mb-8">Upload the required documents before submission</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REQUIRED_DOCUMENTS.map((doc) => {
          const isUploaded = !!uploadedDocs[doc.type];
          const isUploading = uploadingDoc === doc.type;
          const isScanning = ocrStatus[doc.type] === 'scanning';
          const ocrDone = ocrStatus[doc.type] === 'done';
          const ocrResult = ocrResults[doc.type];

          return (
            <div
              key={doc.type}
              className={`border rounded-sm p-4 transition ${isUploaded
                  ? 'border-[#2F6F4F] bg-[#FAF8F3]'
                  : 'border-[#DCD6C8] bg-transparent hover:border-[#B8860B]'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#16213E] text-sm">
                  {doc.label}{' '}
                  {doc.optional && (
                    <span className="text-[#B7B0A0] font-normal text-xs">
                      ({doc.type === 'caste_certificate' ? 'Not required for general category' : ''})
                    </span>
                  )}
                </span>
                {isUploaded && <CheckCircle className="w-5 h-5 text-[#2F6F4F]" />}
              </div>

              {isUploaded ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#2F6F4F] truncate flex-1 font-mono-data tracking-wide">
                    {uploadedDocs[doc.type].name}
                  </span>
                  <div className="flex items-center gap-2 ml-2">
                    <a
                      href={uploadedDocs[doc.type].url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#16213E] hover:text-[#B8860B] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() =>
                        setUploadedDocs((prev) => {
                          const copy = { ...prev };
                          delete copy[doc.type];
                          return copy;
                        })
                      }
                      className="text-[#8B2E2E] hover:text-[#5C3A3A] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="border border-dashed border-[#DCD6C8] rounded-sm py-4 text-center hover:border-[#B8860B] transition">
                    {isScanning ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-[#B8860B]" />
                        <span className="text-xs text-[#16213E] font-medium">Scanning document…</span>
                      </div>
                    ) : isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-[#16213E] mx-auto" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-[#B7B0A0] mx-auto mb-1" strokeWidth={1.5} />
                        <span className="text-xs text-[#8A8374]">Click to upload</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    disabled={isUploading || isScanning}
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleFileSelect(doc.type, e.target.files[0]);
                      }
                    }}
                  />
                </label>
              )}

              {/* OCR match indicators — Aadhaar only, after OCR completes */}
              {doc.type === 'aadhaar' && ocrDone && ocrResult && (
                <div className="mt-2 pt-2 border-t border-[#DCD6C8] space-y-1">
                  {ocrResult.nameScore >= 0.8 ? (
                    <p className="text-xs text-[#2F6F4F] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Name matches document
                    </p>
                  ) : (
                    <p className="text-xs text-[#8B2E2E] flex items-center gap-1">
                      <span>⚠</span>
                      Name on document doesn't quite match what you entered — please double-check
                    </p>
                  )}
                  {ocrResult.dobFound && (
                    <p className="text-xs text-[#2F6F4F] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Date of birth found in document
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 border border-[#DCD6C8] text-[#16213E] font-medium rounded-sm hover:bg-[#FAF8F3] transition flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSaveApplication}
            className="px-6 py-3 border border-[#16213E] text-[#16213E] font-medium rounded-sm hover:bg-[#16213E]/5 transition flex items-center gap-2"
          >
            Save Progress
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            disabled={!allDocsUploaded}
            className="px-8 py-3 bg-[#16213E] hover:bg-[#0F1729] text-[#FFFEFB] font-medium rounded-sm shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Review & Submit <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
