import React from "react";
import { XCircle, CheckCircle } from "lucide-react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border-t-4 border-teal-500">
        <div className="flex items-center gap-3 mb-4">
          <XCircle className="w-8 h-8 text-teal-600" />
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <CheckCircle className="w-5 h-5" /> Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;