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
    <>
      <div className="flex flex-col gap-2 border-2">
        <div>GET RESOURCE</div>
        <input className="border-2" ref={inputRef} />
        <button onClick={handleGet}>submit</button>
        {isLoading && <div>loading</div>}
        {isError && <div>{error.message}</div>}

        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </>
  );
};
