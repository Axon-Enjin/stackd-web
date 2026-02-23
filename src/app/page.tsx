"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

export const HomePage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const response = await fetch("/api/");
      return response.json();
    },
  });

  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
        <div className="text-5xl font-bold">HomePage</div>
        <div className="text-xl">Welcome to stackd-web</div>

        <div className="flex min-w-50 flex-col items-center justify-center gap-2 rounded-2xl border-2 px-8 py-4">
          <div className="text-xl">API Health Check</div>
          <div className="w-full rounded-2xl bg-gray-100 p-4">
            {isLoading && <div>Loading...</div>}
            {isError && <div>{error.message}</div>}
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
