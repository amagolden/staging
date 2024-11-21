import React, { useState } from "react";
import axios from "axios";

export default function ImageForm() {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null); // Store the uploaded image
  const [editedImageUrl, setEditedImageUrl] = useState(''); // Store the DALL-E edited image URL
  const [loading, setLoading] = useState(false);

  const preferences = [
    "Modern",
    "Industrial",
    "Traditional",
    "Coastal",
    "Scandinavian",
  ];

  const standardPrompt = `Edit the living room space in this image to include a modern couch, a coffee table, and minimalistic wall art, arranged to stage the home for sale. The style should be: `;


  const handleCheckboxChange = (option) => {
    setSelectedPreferences((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option) // Remove if already selected
        : [...prev, option] // Add if not selected
    );
  };

  const handleImageUpload = (e) => {
    setUploadedImage(e.target.files[0]); // Store the uploaded image file
  };

  const fetchOpenAiResponse = async () => {
    if (!uploadedImage) {
      alert("Please upload an image.");
      return;
    }

    const preferencesString = selectedPreferences.join(', ');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage);
      formData.append("prompt", `${standardPrompt}${preferencesString}`);

      const response = await axios.post(`http://localhost:8000/api/edit-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Extract the DALL-E edited image URL
      setEditedImageUrl(response.data.editedImageUrl);
    } catch (error) {
      console.error("Error fetching data from OpenAI API:", error);
      alert("Something went wrong while editing the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="border-b border-gray-900/10 pb-6">
        <h2 className="text-center text-xl font-semibold text-gray-900">
          Welcome to our Home Staging Editor
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          Upload a photo and select staging preferences to get started.
        </p>
      </div>

      {/* Form and Output Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Form Column */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOpenAiResponse();
          }}
          className="space-y-6"
        >
          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Home Photo</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
          </div>

          {/* Preferences Checkboxes */}
          <div className="border-b border-gray-900/10 pb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Staging Style Preferences
            </h3>
            <fieldset className="mt-4 space-y-2">
              {preferences.map((preference) => (
                <label key={preference} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="preferences"
                    value={preference}
                    checked={selectedPreferences.includes(preference)}
                    onChange={() => handleCheckboxChange(preference)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <span>{preference}</span>
                </label>
              ))}
            </fieldset>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 text-white rounded-md px-3 py-2 hover:bg-indigo-500"
            disabled={loading}
          >
            {loading ? "Loading..." : "Stage My Room"}
          </button>
        </form>

        {/* Display Updated Photo */}
        {editedImageUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Edited Staged Photo
            </h2>
            <img
              src={editedImageUrl}
              alt="Edited Room"
              className="mt-4 max-w-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
