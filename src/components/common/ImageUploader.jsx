import React, { useRef } from "react";
import { Image as ImageIcon, X, Upload } from "lucide-react";

export default function ImageUploader({ image, onImageChange }) {
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-uploader-wrapper">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFile}
        accept="image/*"
        style={{ display: "none" }}
      />

      {!image ? (
        <div
          className="image-upload-box"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <div className="image-upload-content">
            <ImageIcon size={20} className="image-upload-icon" />
            <span className="image-upload-text">Choose an image...</span>
          </div>
        </div>
      ) : (
        <div className="image-preview-container">
          <img src={image} alt="Issue preview" className="image-preview-img" />
          <button
            type="button"
            className="image-remove-btn"
            onClick={() => onImageChange(null)}
            aria-label="Remove image"
          >
            <X size={16} color="#ffffff" />
          </button>
        </div>
      )}
    </div>
  );
}
