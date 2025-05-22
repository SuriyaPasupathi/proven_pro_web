import React, { useRef, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import toast from "react-hot-toast";

const TOTAL_STEPS = 8;
const CURRENT_STEP = 7;

const Licenses: React.FC = () => {
  const [form, setForm] = useState({
    certifications_name: "",
    certifications_issuer: "",
    certifications_issued_date: "",
    certifications_expiration_date: "",
    certifications_id: "",
    certifications_image: null as File | null,
    certifications_image_url: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.createProfile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm((prev) => ({ 
        ...prev, 
        certifications_image: file,
        certifications_image_url: URL.createObjectURL(file)
      }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const profileData = {
        subscription_type: "premium" as const,
        certifications_name: form.certifications_name,
        certifications_issuer: form.certifications_issuer,
        certifications_issued_date: form.certifications_issued_date,
        certifications_expiration_date: form.certifications_expiration_date,
        certifications_id: form.certifications_id,
        certifications_image: form.certifications_image,
        certifications_image_url: form.certifications_image_url,
      };

      const result = await dispatch(createUserProfile(profileData)).unwrap();
      
      if (result) {
        toast.success("Licenses and certifications saved successfully!");
        navigate("/create-profile/video-intro");
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save licenses and certifications");
    }
  };

  const progressPercent = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-6 flex flex-col">
      {/* Step Progress */}
      <div className="mb-8 w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Step {CURRENT_STEP} of {TOTAL_STEPS}
          </h2>
          <span className="text-gray-500 text-sm">{progressPercent}% Complete</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-[#3C5979] rounded transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-sm flex flex-col gap-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Licenses & Certifications
        </h1>

        <div>
          <label htmlFor="certifications_name" className="block text-sm font-medium text-gray-700 mb-1">
            Certification Name
          </label>
          <Input
            id="certifications_name"
            name="certifications_name"
            placeholder="Enter certification name"
            value={form.certifications_name}
            onChange={handleChange}
            className="bg-gray-50"
            required
          />
        </div>

        <div>
          <label htmlFor="certifications_issuer" className="block text-sm font-medium text-gray-700 mb-1">
            Issuing Organization
          </label>
          <Input
            id="certifications_issuer"
            name="certifications_issuer"
            placeholder="Enter organization name"
            value={form.certifications_issuer}
            onChange={handleChange}
            className="bg-gray-50"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="certifications_issued_date" className="block text-sm font-medium text-gray-700 mb-1">
              Issue Date
            </label>
            <Input
              id="certifications_issued_date"
              name="certifications_issued_date"
              type="date"
              value={form.certifications_issued_date}
              onChange={handleChange}
              className="bg-gray-50"
              required
            />
          </div>
          <div>
            <label htmlFor="certifications_expiration_date" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date (Optional)
            </label>
            <Input
              id="certifications_expiration_date"
              name="certifications_expiration_date"
              type="date"
              value={form.certifications_expiration_date}
              onChange={handleChange}
              className="bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="certifications_id" className="block text-sm font-medium text-gray-700 mb-1">
            Credential ID
          </label>
          <Input
            id="certifications_id"
            name="certifications_id"
            placeholder="Enter credential ID"
            value={form.certifications_id}
            onChange={handleChange}
            className="bg-gray-50"
          />
        </div>

        {/* Certificate Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-8 px-4 sm:px-8">
          <input
            type="file"
            accept=".pdf,image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            className="mb-2"
            onClick={handleUploadClick}
          >
            Upload Certificate
          </Button>
          <p className="text-gray-500 text-sm text-center">
            Upload your certification document (PDF or image)
          </p>
          {form.certifications_image && (
            <div className="mt-2 text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded break-all max-w-full text-center">
              {form.certifications_image.name}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error.message}
          </div>
        )}

        {/* Button Group */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto hover:bg-[#5A8DB8] hover:text-white transition"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Licenses;
