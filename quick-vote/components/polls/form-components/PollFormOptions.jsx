import React, { memo, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PollFormOptions = memo(
  ({ options, onOptionChange, onAddOption, onRemoveOption, errors }) => {
    // Memoize button states
    const canAddOption = useMemo(() => options.length < 10, [options.length]);
    const canRemoveOption = useMemo(() => options.length > 2, [options.length]);

    // Memoize the options list to prevent unnecessary re-renders
    const optionInputs = useMemo(() => {
      return options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            type="text"
            value={option}
            onChange={(e) => onOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            autoComplete="off"
            className={`flex-1 ${errors[`option${index}`] ? "border-red-500" : ""}`}
          />
          {canRemoveOption && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRemoveOption(index)}
              className="text-red-600 border-red-300 hover:text-red-700 hover:bg-red-50 hover:border-red-400 px-3 py-1 min-w-[80px]"
              tabIndex={-1}
            >
              ✕ Remove
            </Button>
          )}
          {errors[`option${index}`] && (
            <p className="text-sm text-red-600 absolute mt-12">
              {errors[`option${index}`]}
            </p>
          )}
        </div>
      ));
    }, [options, errors, onOptionChange, onRemoveOption, canRemoveOption]);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">
            Poll Options *
          </Label>
          {canAddOption && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddOption}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
              tabIndex={-1}
            >
              + Add Option
            </Button>
          )}
        </div>

        {errors.options && (
          <p className="text-sm text-red-600">{errors.options}</p>
        )}

        <div className="space-y-3">{optionInputs}</div>

        {options.length >= 10 && (
          <p className="text-sm text-gray-500 text-center">
            Maximum of 10 options allowed
          </p>
        )}
      </div>
    );
  },
);

PollFormOptions.displayName = "PollFormOptions";

export { PollFormOptions };
