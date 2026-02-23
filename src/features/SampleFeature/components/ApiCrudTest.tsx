"use client";

import { CreateResource } from "./CreateResource";
import { DeleteResource } from "./DeleteResource";
import { GetResource } from "./GetResource";
import { ListResources } from "./ListResources";
import { UpdateResourceById } from "./UpdateResource";

const ApiCrudTest = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Resource Management</h1>
          <p className="text-slate-500">Manage your test resources with full CRUD capabilities.</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CreateResource />
          <UpdateResourceById />
          <DeleteResource />
          <GetResource />
          <div className="md:col-span-2 lg:col-span-3">
             <ListResources />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ApiCrudTest;
