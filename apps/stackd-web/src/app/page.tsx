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
      <div className="w-full h-screen flex justify-center items-center flex-col gap-2">
        <div className="text-5xl font-bold">HomePage</div>
        <div className="text-xl ">Welcome to stackd-web</div>

        <div className="min-w-50 flex justify-center items-center flex-col gap-2 border-2 py-4 px-8 rounded-2xl">
          <div className="text-xl ">API Health Check</div>
          <div className="w-full p-4 rounded-2xl bg-gray-100">
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
