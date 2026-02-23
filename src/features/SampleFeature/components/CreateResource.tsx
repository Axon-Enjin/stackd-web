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
    <>
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-2">
        <label>title</label>
        <input name="title" type="text" className="border" />
        <label>description</label>
        <input name="description" type="text" className="border" />
        <button type="submit">submit</button>
        {createMutation.isError && (
          <div className="text-red-500">{createMutation.error.message}</div>
        )}

        {createMutation.isSuccess && (
          <div className="text-green-500">{createMutation.data.message}</div>
        )}
      </form>
    </>
  );
};
