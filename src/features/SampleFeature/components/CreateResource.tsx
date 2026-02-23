"use client";

import React from "react";
import { useCreateResourceMutation } from "../hooks/useCreateResourceMutation";
import { sampleResourceInsertDTO } from "../SampleFeature.types";

export const CreateResource = () => {
  const createMutation = useCreateResourceMutation();

  const handleOnSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(
      formData.entries(),
    ) as sampleResourceInsertDTO;

    createMutation.mutate({
      title: data.title,
      description: data.description,
    });
  };

 return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <h3 className="mb-4 text-lg font-semibold border-b pb-2">Create New</h3>
      <form onSubmit={handleOnSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium uppercase text-slate-400">Title</label>
          <input name="title" type="text" className="w-full rounded-lg border bg-slate-50 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Resource name..." />
        </div>
        <div>
          <label className="text-xs font-medium uppercase text-slate-400">Description</label>
          <textarea name="description" className="w-full rounded-lg border bg-slate-50 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Details..." />
        </div>
        <button 
          disabled={createMutation.isPending}
          className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-300"
        >
          {createMutation.isPending ? "Processing..." : "Create Resource"}
        </button>
        {/* Alerts moved to small toast-like boxes */}
        {createMutation.isSuccess && <p className="text-sm text-green-600 bg-green-50 p-2 rounded text-center">Successfully created!</p>}
      </form>
    </div>
  );
};
