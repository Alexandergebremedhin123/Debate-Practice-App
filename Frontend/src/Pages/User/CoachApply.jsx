import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { axiosInstance } from "../../axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const steps = ["1", "2", "3", "4"];


const CoachApplication = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm({ mode: "onChange" });
  const formData = watch();

  const nextStep = async () => {
    let fieldsToValidate = [];
    switch (currentStep) {
      case 0:
        fieldsToValidate = ["name", "email", "password"];
        break;
      case 1:
        fieldsToValidate = ["address", "about"];
        break;
      case 2:
        fieldsToValidate = ["name", "email", "password", "address", "about"];
        break;
      default:
        break;
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToFirstStep = () => {
    setCurrentStep(0);
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem("Token");

    if (!token) {
      navigate("/login");
      toast.error("Please log in to apply for a coach position.");
      return;
    }
    setIsSubmitting(true);
    try {
      let imageBase64 = null;
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        imageBase64 = await convertImageToBase64(file);
      }

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address,
        about: data.about,
        image: imageBase64,
      };

      const response = await axiosInstance.post("/user/apply", payload);
      toast.success(response.data.message || "Application submitted successfully!");
      setCurrentStep(0);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit application. Please try again.";
      toast.error(errorMessage);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-aos="zoom-in" className="min-h-screen mt-12 py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <style>
        {`
          @keyframes iconBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .animate-iconBounce {
            animation: iconBounce 0.5s ease-in-out infinite;
          }
          .input-container {
            position: relative;
          }
          .input-container label {
            position: absolute;
            top: 50%;
            left: 12px;
            transform: translateY(-50%);
            color: #6B7280;
            font-size: 0.9rem;
            transition: all 0.2s ease;
            pointer-events: none;
          }
          .input-container input:not(:placeholder-shown) + label,
          .input-container textarea:not(:placeholder-shown) + label,
          .input-container select:not(:placeholder-shown) + label,
          .input-container input:focus + label,
          .input-container textarea:focus + label,
          .input-container select:focus + label {
            top: -10px;
            left: 10px;
            font-size: 0.75rem;
            color: #007E85;
            background: white;
            padding: 0 4px;
          }
          .input-container input,
          .input-container textarea,
          .input-container select {
            transition: all 0.2s ease;
          }
          .input-container input:focus,
          .input-container textarea:focus,
          .input-container select:focus {
            border-color: #007E85;
            box-shadow: 0 0 0 3px rgba(0, 126, 133, 0.1);
          }
        `}
      </style>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 py-10">
          <h1 className="text-4xl sm:text-5xl text-[#007E85] font-extrabold tracking-tight">
            Become a Coach
          </h1>
        </div>

        <div className=" overflow-hidden flex flex-col md:flex-row justify-center">
      

          <div className="w-full md:w-1/2 p-8 md:p-10 bg-gray-100">
            <div className="flex flex-wrap items-center mb-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center w-[18%] sm:w-[18%]">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white font-bold text-lg shadow-md ${
                      index <= currentStep ? "bg-[#007E85]" : "bg-gray-200"
                    }`}
                  >
                    {step}
                  </div>
                  {index < steps.length - 1 && (
                    <motion.div
                      className="flex-1 h-1 bg-gray-200"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: index < currentStep ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{
                        background: index < currentStep ? "linear-gradient(to right, #007E85, #00A3AD)" : "#D1D5DB",
                        transformOrigin: "left",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                      Personal Information
                    </h2>
                    <div className="space-y-6">
                      <div className="input-container">
                        <input
                          {...register("name", {
                            required: "Full name is required",
                            minLength: { value: 2, message: "Name must be at least 2 characters" },
                            maxLength: { value: 50, message: "Name must not exceed 50 characters" },
                            pattern: {
                              value: /^[A-Za-z\s]+$/,
                              message: "Name can only contain letters and spaces",
                            },
                          })}
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="name"
                        />
                        <label htmlFor="name">Full Name</label>
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                      </div>
                      <div className="input-container">
                        <input
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="email"
                        />
                        <label htmlFor="email">Email</label>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                      </div>
                      <div className="input-container">
                        <input
                          {...register("password", {
                            required: "Password is required",
                            minLength: { value: 8, message: "Password must be at least 8 characters" },
                            maxLength: { value: 50, message: "Password must not exceed 50 characters" },
                            pattern: {
                              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                              message: "Password must include uppercase, lowercase, number, and special character",
                            },
                          })}
                          type="password"
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="password"
                        />
                        <label htmlFor="password">Password</label>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
             
               
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                      Additional Information
                    </h2>
                    <div className="space-y-6">
                      <div className="input-container">
                        <input
                          {...register("address", {
                            required: "Address is required",
                            minLength: { value: 5, message: "Address must be at least 5 characters" },
                            maxLength: { value: 200, message: "Address must not exceed 200 characters" },
                          })}
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="address"
                        />
                        <label htmlFor="address">Address</label>
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                      </div>
                      <div className="input-container">
                        <textarea
                          {...register("about", {
                            required: "About section is required",
                            minLength: { value: 10, message: "About must be at least 10 characters" },
                            maxLength: { value: 500, message: "About must not exceed 500 characters" },
                          })}
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          rows="4"
                          id="about"
                        />
                        <label htmlFor="about">About</label>
                        {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about.message}</p>}
                      </div>
                      <div className="input-container">
                        <input
                          {...register("image", {
                            validate: (files) => {
                              if (!files || files.length === 0) return true; // Image is optional
                              const file = files[0];
                              const validTypes = ["image/jpeg", "image/png", "image/gif"];
                              if (!validTypes.includes(file.type)) {
                                return "Image must be JPG, PNG, or GIF";
                              }
                              if (file.size > 5 * 1024 * 1024) {
                                return "Image size must not exceed 5MB";
                              }
                              return true;
                            },
                          })}
                          type="file"
                          accept="image/*"
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="image"
                        />
                        <label htmlFor="image">Profile Image (Optional)</label>
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                      Review & Submit
                    </h2>
                    <div className="space-y-4 text-gray-700 bg-gray-100 p-6 rounded-lg">
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">Name:</strong> <span>{formData.name || "Not provided"}</span></p>
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">Email:</strong> <span>{formData.email || "Not provided"}</span></p>
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">Address:</strong> <span>{formData.address || "Not provided"}</span></p>
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">About:</strong> <span>{formData.about || "Not provided"}</span></p>
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">Image:</strong> <span>{formData.image?.[0]?.name || "Not provided"}</span></p>
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-full hover:from-gray-600 hover:to-gray-700 transition-all w-full sm:w-auto shadow-md"
                  >
                    Previous
                  </button>
                )}
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={(currentStep === 0 && (errors.name || errors.email || errors.password))||
                              (currentStep === 1 && () ||
                              (currentStep === 2 && () ||
                              (currentStep === 3&& (errors.address || errors.about))}
                    className={`px-8 py-3 bg-gradient-to-r from-[#007E85] to-[#00A3AD] text-white font-semibold rounded-full transition-all w-full sm:w-auto sm:ml-auto shadow-md ${
                      (currentStep === 0 && (errors.name || errors.email || errors.password)) ||
                      (currentStep === 1 && (errors.address)||(errors.about)) ||
                      (currentStep === 2) 
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:from-[#006668] hover:to-[#008A93]"
                    }`}
                  >
                    Next
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className={`px-8 py-3 bg-gradient-to-r from-[#007E85] to-[#00A3AD] text-white font-semibold rounded-full transition-all flex items-center justify-center w-full sm:w-auto shadow-md ${
                        isSubmitting || !isValid ? "opacity-50 cursor-not-allowed" : "hover:from-[#006668] hover:to-[#008A93]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-iconBounce mr-2" size={20} />
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={goToFirstStep}
                      className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-full hover:from-gray-600 hover:to-gray-700 transition-all w-full sm:w-auto shadow-md"
                    >
                      Go Back to First Step
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachApplication;
