import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { ArrowLeft, Loader } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ScholarshipApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scholarship } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    registrationNumber: "",
    schoolName: "",
    fatherName: "",
    address: "",
    annualIncome: "",
    dateOfBirth: null,
    gpa: "",
    extracurriculars: "",
    courseOfStudy: "",
    contactNumber: "",
    documents: {},
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const handleFileChange = (event, documentName) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentName]: event.target.files[0],
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Validate required documents
    for (let doc of requiredDocuments) {
      if (!formData.documents[doc.trim()]) {
        toast.error(`Please upload ${doc.trim()}`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const processedDocuments = {};

      // Process documents
      for (const [docName, file] of Object.entries(formData.documents)) {
        try {
          const fileData = new FormData();
          fileData.append("file", file);

          const cloudinaryResponse = await axios.post(
            "http://172.16.11.157:5007/upload",
            fileData
          );

          const uploadedUrl = cloudinaryResponse.data.file.url;

          const blurCheckResponse = await axios.post(
            "http://172.16.11.157:5001/analyze-blur",
            { image_url: uploadedUrl }
          );

          if (blurCheckResponse.data.is_blurry === "True") {
            toast.warning(`${docName} is too blurry. Please upload a clearer image.`, {
              position: "top-right",
              autoClose: 3000,
            });
            setIsSubmitting(false);
            return;
          }

          processedDocuments[docName] = {
            url: uploadedUrl,
            uploadTimestamp: new Date().toISOString(),
            status: 1,
            blurScore: blurCheckResponse.data.blur_score,
          };
        } catch (uploadError) {
          console.error(`Error processing ${docName}:`, uploadError);
          toast.error(`Failed to upload ${docName}. Please try again.`);
          setIsSubmitting(false);
          return;
        }
      }

      const applicationPayload = {
        ...formData,
        documents: processedDocuments,
        dateOfBirth: formData.dateOfBirth?.toISOString(),
        submittedAt: new Date().toISOString(),
        reviewStatus: "pending",
      };

      // 🔥 REPLACE WITH YOUR BACKEND ENDPOINT
      await axios.post("http://your-backend-url.com/submitApplication", applicationPayload);

      toast.success("Application submitted successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const additionalDocuments = [];
  const requiredDocuments =
    (scholarship?.requiredDocuments || [])
      .flatMap((doc) => doc.split(";").map((item) => item.trim()))
      .concat(additionalDocuments) || [];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Apply for {scholarship?.name}
            </h2>

            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ArrowLeft className="mr-2" size={20} /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <InputField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
                <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />

                <InputField label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} required />
                <InputField label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} required />

                <InputField label="School Name" name="schoolName" value={formData.schoolName} onChange={handleInputChange} required />
                <InputField label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} required />

                <div className="md:col-span-2">
                  <InputField label="Address" name="address" textarea value={formData.address} onChange={handleInputChange} required />
                </div>

                <InputField label="Annual Income" name="annualIncome" type="number" value={formData.annualIncome} onChange={handleInputChange} required />

                <div className="flex flex-col">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <DatePicker
                    selected={formData.dateOfBirth}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="w-full p-3 border rounded-md"
                    required
                  />
                </div>

                <InputField label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required />
                <InputField label="GPA" name="gpa" type="number" value={formData.gpa} onChange={handleInputChange} required />
                <InputField label="Course of Study" name="courseOfStudy" value={formData.courseOfStudy} onChange={handleInputChange} required />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Extracurricular Activities</label>
                  <textarea
                    name="extracurriculars"
                    value={formData.extracurriculars}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                    rows="4"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Upload Required Documents</h3>
              <div className="space-y-4">
                {requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <input type="file" id={`file-${doc}`} className="hidden"
                      onChange={(e) => handleFileChange(e, doc)} />

                    <label htmlFor={`file-${doc}`} className="cursor-pointer text-blue-600">
                      {doc}
                    </label>

                    {formData.documents[doc] && (
                      <span className="text-green-600 text-sm">
                        {formData.documents[doc].name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-6 py-3 rounded-lg flex items-center`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const InputField = ({ label, name, value, onChange, required, type = "text", textarea }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>

    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 border rounded-md"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 border rounded-md"
      />
    )}
  </div>
);

export default ScholarshipApplication;
