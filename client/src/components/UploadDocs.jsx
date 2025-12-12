import React, { useState } from "react";

const UploadDocs = () => {
  const [selectedDocType, setSelectedDocType] = useState("Aadhar Card");
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Allowed formats
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    alert("Files uploaded successfully (stored in state).");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-r from-blue-100 to-purple-100 p-6">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-8">
        
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Upload Your Documents
        </h1>

        {/* Document Type Dropdown */}
        <label className="block text-gray-700 font-medium mb-2">
          Select Document Type
        </label>
        <select
          value={selectedDocType}
          onChange={(e) => setSelectedDocType(e.target.value)}
          className="w-full p-3 border rounded-lg mb-5 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
        >
          <option>Aadhar Card</option>
          <option>Pan Card</option>
          <option>Voter Card</option>
          <option>School Marksheet</option>
          <option>Passing Certificate</option>
        </select>

        {/* Drag & Drop Zone */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-600 cursor-pointer hover:border-purple-400 transition"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("hiddenFileInput").click()}
        >
          <p className="text-lg">Drag & drop some files here, or click to select files</p>
          <p className="text-sm mt-2 text-gray-500">Supported formats: Images, PDF</p>

          <input
            id="hiddenFileInput"
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Display Uploaded Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-5">
            <h3 className="font-semibold text-gray-700 mb-2">Selected Files:</h3>
            <ul className="space-y-2">
              {selectedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                >
                  <span>{file.name}</span>
                  <span className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Button */}
        <button
          className="w-full bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 mt-6 rounded-lg shadow-md transition"
          onClick={handleUpload}
        >
          Upload Files
        </button>
      </div>
    </div>
  );
};

export default UploadDocs;
