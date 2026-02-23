"use client";

import React from "react";
import { useUpdateResourceMutation } from "../hooks/useUpdateResourceMutation";

export const UpdateResourceById = () => {
  const updateMutation = useUpdateResourceMutation();

  const handleOnSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Extracting the ID and the data fields
    const targetId = data.itemId as string;
    const title = data.title as string;
    const description = data.description as string;

    if (!targetId) {
      alert("Please enter a valid Item ID");
      return;
    }

    updateMutation.mutate({
      id: targetId,
      title,
      description,
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm max-w-md">
      <h3 className="font-bold mb-4 text-lg">Update Resource by ID</h3>
      
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
        {/* --- ID Input Section --- */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">Resource ID</label>
          <input 
            name="itemId" 
            type="text" 
            placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
            className="border p-2 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <hr className="my-2" />

        {/* --- Data Fields --- */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">New Title</label>
          <input 
            name="title" 
            type="text" 
            className="border p-2 rounded outline-none focus:border-blue-500" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">New Description</label>
          <textarea 
            name="description" 
            className="border p-2 rounded outline-none focus:border-blue-500" 
            rows={3}
          />
        </div>

        <button 
          type="submit" 
          disabled={updateMutation.isPending}
          className="bg-black text-white p-2 rounded font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {updateMutation.isPending ? "Updating..." : "Push Changes"}
        </button>

        {/* --- Feedback UI --- */}
        {updateMutation.isError && (
          <div className="p-2 text-sm bg-red-50 border border-red-200 text-red-600 rounded">
            <strong>Error:</strong> {updateMutation.error.message}
          </div>
        )}

        {updateMutation.isSuccess && (
          <div className="p-2 text-sm bg-green-50 border border-green-200 text-green-600 rounded">
            Successfully updated item!
          </div>
        )}
      </form>
    </div>
  );
};