"use client";

import { CreateResource } from "./CreateResource";
import { DeleteResource } from "./DeleteResource";
import { GetResource } from "./GetResource";
import { ListResources } from "./ListResources";
import { UpdateResourceById } from "./UpdateResource";

const ApiCrudTest = () => {
  return (
    <>
      <div className="mx-auto flex min-w-200 flex-col gap-4 rounded-2xl border-2 p-8">
        <div>hello world</div>

        <div className="flex flex-col gap-4">
          <CreateResource></CreateResource>
          <ListResources />
          <GetResource />
          <UpdateResourceById />
          <DeleteResource />
        </div>
      </div>
    </>
  );
};

export default ApiCrudTest;
