import React, { memo } from "react";
import { Label } from "@/components/ui/label";

const PollFormDescription = memo(({ description, onChange, error }) => (
  <div className="space-y-2">
    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
      Description *
    </Label>
    <textarea
      id="description"
      value={description}
      onChange={(e) => onChange("description", e.target.value)}
      placeholder="Provide more context about your poll"
      rows={3}
      autoComplete="off"
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
        error ? "border-red-500" : ""
      }`}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
));

PollFormDescription.displayName = "PollFormDescription";

export { PollFormDescription };
