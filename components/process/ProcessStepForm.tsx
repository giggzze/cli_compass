"use client";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IProcessStepFormProps } from "@/app/models/Process";
import { useState } from "react";
import Image from "next/image";

export function ProcessStepForm({
  step,
  onChange,
  onAdd,
}: IProcessStepFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        onChange({ ...step, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Step</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Explanation</label>
          <Textarea
            value={step.stepExplanation || ""}
            onChange={(e) =>
              onChange({
                ...step,
                stepExplanation: e.target.value,
              })
            }
            placeholder="Enter a explanation for this step"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Code Block (Optional)
          </label>
          <Textarea
            value={step.code || ""}
            onChange={(e) => onChange({ ...step, code: e.target.value })}
            placeholder="Enter code if applicable"
            rows={5}
            className="font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
          />
          {previewUrl && (
            <div className="relative w-32 h-32 mt-2">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover rounded-md"
              />
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  onChange({ ...step, image: null });
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <Button onClick={onAdd}>Add Step</Button>
      </div>
    </div>
  );
}
