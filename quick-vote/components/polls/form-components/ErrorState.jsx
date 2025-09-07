import React from 'react';
import { Button } from "@/components/ui/button";

export const ErrorState = ({ title, message, onBack }) => (
  <div className="text-center py-12">
    <div className="text-red-500 text-6xl mb-4">⚠️</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      {title}
    </h3>
    <p className="text-gray-600 mb-6">{message}</p>
    <Button
      onClick={onBack}
      className="bg-blue-600 hover:bg-blue-700"
    >
      Back to Polls
    </Button>
  </div>
);
