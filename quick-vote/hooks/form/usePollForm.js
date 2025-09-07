import { useState, useCallback, useMemo } from "react";

export const usePollForm = (
  initialData = { title: "", description: "", options: ["", ""] },
) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Memoize validation rules
  const validationRules = useMemo(
    () => ({
      title: {
        required: true,
        message: "Poll title is required",
      },
      description: {
        required: true,
        message: "Poll description is required",
      },
      options: {
        minItems: 2,
        message: "At least 2 options are required",
      },
    }),
    [],
  );

  // Optimized input change handler
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => {
      if (prev[field] === value) return prev; // Prevent unnecessary updates
      return { ...prev, [field]: value };
    });

    // Clear field-specific error when user starts typing
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // Optimized option change handler
  const handleOptionChange = useCallback((index, value) => {
    setFormData((prev) => {
      if (prev.options[index] === value) return prev;
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });

    // Clear option-specific error
    const optionErrorKey = `option${index}`;
    setErrors((prev) => {
      if (!prev[optionErrorKey]) return prev;
      const { [optionErrorKey]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // Optimized add option handler
  const addOption = useCallback(() => {
    setFormData((prev) => {
      if (prev.options.length >= 10) return prev;
      return {
        ...prev,
        options: [...prev.options, ""],
      };
    });
  }, []);

  // Optimized remove option handler
  const removeOption = useCallback((index) => {
    setFormData((prev) => {
      if (prev.options.length <= 2) return prev;
      const newOptions = prev.options.filter((_, i) => i !== index);
      return { ...prev, options: newOptions };
    });

    // Clean up any related errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`option${index}`];

      // Reindex remaining option errors
      const optionErrors = {};
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith("option")) {
          const optionIndex = parseInt(key.replace("option", ""), 10);
          if (optionIndex > index) {
            optionErrors[`option${optionIndex - 1}`] = newErrors[key];
          } else if (optionIndex < index) {
            optionErrors[key] = newErrors[key];
          }
        } else {
          optionErrors[key] = newErrors[key];
        }
      });

      return optionErrors;
    });
  }, []);

  // Optimized form validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validate title
    if (!formData.title?.trim()) {
      newErrors.title = validationRules.title.message;
    }

    // Validate description
    if (!formData.description?.trim()) {
      newErrors.description = validationRules.description.message;
    }

    // Validate options
    const validOptions = formData.options.filter((option) => option?.trim());
    if (validOptions.length < validationRules.options.minItems) {
      newErrors.options = validationRules.options.message;
    }

    // Validate individual options
    formData.options.forEach((option, index) => {
      if (!option?.trim()) {
        newErrors[`option${index}`] = "Option cannot be empty";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validationRules]);

  // Optimized reset function
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setSuccessMessage("");
    setIsSubmitting(false);
  }, [initialData]);

  // Batch error clearing
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Batch form data update
  const updateFormData = useCallback((newData) => {
    setFormData((prev) => {
      // Deep comparison to prevent unnecessary updates
      if (JSON.stringify(prev) === JSON.stringify(newData)) {
        return prev;
      }
      return { ...prev, ...newData };
    });
  }, []);

  // Memoized form state
  const formState = useMemo(
    () => ({
      isValid: Object.keys(errors).length === 0,
      hasErrors: Object.keys(errors).length > 0,
      isDirty: JSON.stringify(formData) !== JSON.stringify(initialData),
    }),
    [errors, formData, initialData],
  );

  return {
    // Form data
    formData,
    errors,
    isSubmitting,
    successMessage,
    formState,

    // Handlers
    handleInputChange,
    handleOptionChange,
    addOption,
    removeOption,
    validateForm,
    resetForm,
    clearErrors,

    // Setters (for external use)
    setFormData: updateFormData,
    setErrors,
    setIsSubmitting,
    setSuccessMessage,
  };
};
