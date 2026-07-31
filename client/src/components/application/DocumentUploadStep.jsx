import React from 'react';
import { Upload, CheckCircle, Eye, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const DocumentUploadStep = ({
  REQUIRED_DOCUMENTS,
  uploadedDocs,
  uploadingDoc,
  handleDocUpload,
  setUploadedDocs,
  setCurrentStep,
  allDocsUploaded
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <Upload className="w-6 h-6 text-blue-600" />
        Upload Required Documents
      </h2>
      <p className="text-gray-500 mb-6">All 6 documents are required before submission</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REQUIRED_DOCUMENTS.map((doc) => {
          const isUploaded = !!uploadedDocs[doc.type];
          const isUploading = uploadingDoc === doc.type;

          return (
            <div
              key={doc.type}
              className={`border-2 rounded-xl p-4 transition ${
                isUploaded
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800 text-sm">{doc.label}</span>
                {isUploaded && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>

              {isUploaded ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 truncate flex-1">
                    {uploadedDocs[doc.type].name}
                  </span>
                  <div className="flex items-center gap-2 ml-2">
                    <a
                      href={uploadedDocs[doc.type].url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-700"
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
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg py-4 text-center hover:border-blue-400 transition">
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500 mx-auto" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">Click to upload</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleDocUpload(doc.type, e.target.files[0]);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          disabled={!allDocsUploaded}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Review & Submit <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
