import React from "react";

const statusStyles = {
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-800",
};

const ViewDocuments = () => {
  // Hardcoded sample data
  const documents = [
    {
      name: "Passing Certificate",
      status: "approved",
      uploadedAt: "2024-12-04T18:36:19",
    },
    {
      name: "Aadhar Card",
      status: "pending",
      uploadedAt: "2024-12-12T16:12:03",
    },
    {
      name: "Pan Card",
      status: "rejected",
      uploadedAt: "2024-12-12T07:47:23",
    },
    {
      name: "Voter Card",
      status: "rejected",
      uploadedAt: "2024-12-12T14:38:47",
    },
    {
      name: "School Marksheet",
      status: "approved",
      uploadedAt: "2024-12-11T23:45:04",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-10 text-purple-600">
        My Documents
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
          >
            {/* Top row: Name + Status */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {doc.name}
              </h2>

              <span
                className={`px-3 py-1 text-sm rounded-full capitalize ${
                  statusStyles[doc.status]
                }`}
              >
                {doc.status === "pending"
                  ? "Pending Verification"
                  : doc.status}
              </span>
            </div>

            {/* Upload date */}
            <p className="text-gray-600 text-sm">
              Uploaded on:{" "}
              <span className="font-medium">
                {new Date(doc.uploadedAt).toLocaleString()}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDocuments;
