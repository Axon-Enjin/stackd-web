"use client";

import React from "react";
import { usePaginatedResourceQuery } from "../hooks/useResourceListQuery";

export const ListResources = () => {
  const [pagination, setPagination] = React.useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const { data, isLoading, isError, error } = usePaginatedResourceQuery(
    pagination.pageNumber,
    pagination.pageSize,
  );

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b px-6 py-4">
        <h3 className="font-semibold">Resource Registry</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={3} className="px-6 py-4 bg-slate-50/50 h-12"></td>
                </tr>
              ))
            ) : (
              data?.data?.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-blue-600">{item.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 font-medium">{item.title}</td>
                  <td className="px-6 py-4 text-slate-500">{item.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
