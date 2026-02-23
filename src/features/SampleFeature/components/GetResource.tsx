"use client";

import React from "react";
import { useResourceQuery } from "../hooks/useResourceQuery";

export const GetResource = () => {
  const [id, setId] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { data, isLoading, isError, error } = useResourceQuery(id);

  const handleGet = async () => {
    const newid = inputRef.current?.value;
    if (!newid) return;
    setId(newid);
  };

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Resource Inspector</h3>
      <div className="mb-4 flex gap-2">
        <input
          ref={inputRef}
          placeholder="Paste UUID..."
          className="flex-1 rounded-lg border px-3 py-1 text-sm outline-none focus:border-blue-500"
        />
        <button
          onClick={handleGet}
          className="rounded-lg bg-slate-900 px-4 py-1 text-sm text-white hover:bg-slate-800"
        >
          Inspect
        </button>
      </div>

      {data && (
        <div className="space-y-2 rounded-lg bg-slate-900 p-4 font-mono text-xs text-blue-300">
          <div className="flex justify-between">
            <span className="text-slate-500">ID:</span> {data.id}
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">TITLE:</span> {data.title}
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">STATUS:</span>{" "}
            <span className="text-green-400">ONLINE</span>
          </div>
        </div>
      )}
    </div>
  );
};
