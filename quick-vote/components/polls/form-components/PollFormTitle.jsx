import React, { memo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PollFormTitle = memo(({ title, onChange, error }) => (
  <div className="space-y-2">
    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
      Poll Title *
    </Label>
    <Input
      id="title"
      type="text"
      value={title}
      onChange={(e) => onChange("title", e.target.value)}
      placeholder="Enter your poll question"
      className={error ? "border-red-500" : ""}
      autoComplete="off"
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
));

PollFormTitle.displayName = "PollFormTitle";

export { PollFormTitle };
