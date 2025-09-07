"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePolls } from "@/hooks/usePolls";
import { useAuth } from "@/hooks/useAuth";

export default function EditPollForm({ pollId }) {
  const router = useRouter();
  const { editPoll, getPollById, fetchPollById } = usePolls();
  const { user } = useAuth();

  const [poll, setPoll] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    options: ["", ""],
  });

  const [loadingPoll, setLoadingPoll] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadPoll = async () => {
      let pollData = getPollById(pollId);

      // If not found in local state, fetch from database
      if (!pollData) {
        pollData = await fetchPollById(pollId);
      }

      if (pollData) {
        setPoll(pollData);
        if (pollData.created_by !== user?.id) {
          setErrors({ access: "You do not have permission to edit this poll" });
        } else {
          setFormData({
            title: pollData.title,
            description: pollData.description,
            options: pollData.options.map((option) => option.text),
          });
        }
      } else {
        setErrors({
          load: "Poll data not found. Please go back and try again.",
        });
      }
      setLoadingPoll(false);
    };

    if (pollId && user) {
      loadPoll();
    }
  }, [pollId, user, getPollById, fetchPollById]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));

    if (errors[`option${index}`]) {
      setErrors((prev) => ({ ...prev, [`option${index}`]: "" }));
    }
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, ""],
      }));
    }
  };

  const removeOption = (index) => {
    console.log("Attempting to remove option at index:", index);
    console.log("Current options:", formData.options);
    console.log("Options length:", formData.options.length);

    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      console.log("New options after removal:", newOptions);
      setFormData((prev) => ({ ...prev, options: newOptions }));

      // Clear error for removed option
      const newErrors = { ...errors };
      delete newErrors[`option${index}`];
      setErrors(newErrors);
    } else {
      console.log("Cannot remove - minimum 2 options required");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Poll title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Poll description is required";
    }

    const validOptions = formData.options.filter(
      (option) => option.trim() !== "",
    );
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    formData.options.forEach((option, index) => {
      if (option.trim() === "") {
        newErrors[`option${index}`] = "Option cannot be empty";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        options: formData.options.filter((option) => option.trim() !== ""),
      };

      console.log("Submitting poll data:", submitData);
      console.log("Form options before filtering:", formData.options);
      console.log("Valid options after filtering:", submitData.options);

      const result = await editPoll(pollId, submitData);

      if (result.success) {
        setSuccessMessage(result.message || "Poll updated successfully!");
        setTimeout(() => {
          router.push("/polls");
        }, 1500);
      } else {
        setErrors({ submit: result.error || "Failed to update poll" });
      }
    } catch (error) {
      setErrors({ submit: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingPoll) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading poll data...</p>
        </div>
      </div>
    );
  }

  if (errors.access) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-600 mb-6">{errors.access}</p>
        <Button
          onClick={() => router.push("/polls")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Back to Polls
        </Button>
      </div>
    );
  }

  if (errors.load) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Poll
        </h3>
        <p className="text-gray-600 mb-6">{errors.load}</p>
        <Button
          onClick={() => router.push("/polls")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Back to Polls
        </Button>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Edit Poll
        </CardTitle>
        <CardDescription className="text-gray-600">
          Update your poll question and options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Poll Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Poll Title *
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter your poll question"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Poll Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description *
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Provide more context about your poll"
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Poll Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Poll Options *
              </Label>
              {formData.options.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  + Add Option
                </Button>
              )}
            </div>

            {errors.options && (
              <p className="text-sm text-red-600">{errors.options}</p>
            )}

            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className={`flex-1 ${errors[`option${index}`] ? "border-red-500" : ""}`}
                  />
                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="text-red-600 border-red-300 hover:text-red-700 hover:bg-red-50 hover:border-red-400 px-3 py-1"
                    >
                      ✕ Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Info about editing polls with votes */}
          {poll && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> If this poll has received votes, only the
                title and description can be updated to preserve voting
                integrity.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              {isSubmitting ? "Updating..." : "Update Poll"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
