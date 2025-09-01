"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePolls } from "@/hooks/usePolls";
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

export default function CreatePollForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    options: ["", ""],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { createPoll, isLoading } = usePolls();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData({
        ...formData,
        options: [...formData.options, ""],
      });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        options: newOptions,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Please enter a poll title");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a poll description");
      return;
    }

    const validOptions = formData.options.filter(
      (option) => option.trim() !== "",
    );
    if (validOptions.length < 2) {
      setError("Please add at least 2 options");
      return;
    }

    const result = await createPoll({
      title: formData.title.trim(),
      description: formData.description.trim(),
      options: validOptions,
    });

    if (result.success) {
      setSuccess("Poll created successfully!");
      // Redirect to the polls page after a brief delay
      setTimeout(() => {
        router.push("/polls");
      }, 1000);
    } else {
      setError(result.error || "Failed to create poll");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-lg">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Create New Poll
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          Create a new poll for the community to vote on
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="title"
              className="text-base font-semibold text-gray-900"
            >
              Poll Title *
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter your poll question..."
              value={formData.title}
              onChange={handleChange}
              className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="description"
              className="text-base font-semibold text-gray-900"
            >
              Description *
            </Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Provide context for your poll..."
              value={formData.description}
              onChange={handleChange}
              className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-gray-900">
                Poll Options *
              </Label>
              <span className="text-sm text-gray-500">
                {formData.options.length}/10
              </span>
            </div>

            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="h-11 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="h-11 px-4 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {formData.options.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full h-11 text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 font-medium"
              >
                + Add Another Option
              </Button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">{success}</p>
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Creating Poll..." : "Create Poll"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
