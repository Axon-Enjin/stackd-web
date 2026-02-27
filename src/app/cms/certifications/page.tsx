"use client";

import React, { useState, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Loader2,
  Award,
} from "lucide-react"; 
import { useCreateCertificationMutation } from "@/features/Certifications/hooks/useCreateCertificationMutation";
import { useDeleteCertificationMutation } from "@/features/Certifications/hooks/useDeleteCertificationMutation";
import { usePaginatedCertificationsQuery } from "@/features/Certifications/hooks/usePaginatedCertificationsQuery";
import { useUpdateCertificationMutation } from "@/features/Certifications/hooks/useUpdateCertificationMutation";

// ==========================================
// Types
// ==========================================
export interface Certification {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  rankingIndex: number;
}

// ==========================================
// Main Page Component
// ==========================================
export default function CertificationsAdminPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  // TanStack Query Hooks
  const { data: response, isLoading } = usePaginatedCertificationsQuery(
    page,
    10,
  );
  const deleteMutation = useDeleteCertificationMutation();

  const certifications: Certification[] = response?.data || [];
  const meta = response?.meta;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this certification?"))
      return;
    try {
      await deleteMutation.mutateAsync(id);
      // If we delete the last item on a page, optionally handle page decrementing here
    } catch (error) {
      alert("Failed to delete certification.");
    }
  };

  const openCreate = () => {
    setEditingCert(null);
    setIsModalOpen(true);
  };

  const openEdit = (cert: Certification) => {
    setEditingCert(cert);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
              <Award className="text-indigo-600" size={32} />
              Certifications
            </h1>
            <p className="mt-1 text-gray-500">
              Manage technical and professional certifications.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add Certification
          </button>
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert) => (
                <CertificationCard
                  key={cert.id}
                  certification={cert}
                  onEdit={() => openEdit(cert)}
                  onDelete={() => handleDelete(cert.id)}
                  isDeleting={
                    deleteMutation.isPending &&
                    deleteMutation.variables === cert.id
                  }
                />
              ))}
            </div>

            {/* Empty State */}
            {!isLoading && certifications.length === 0 && (
              <div className="rounded-xl border border-gray-100 bg-white py-12 text-center text-gray-500 shadow-sm">
                No certifications found. Add one to get started!
              </div>
            )}

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <Pagination
                currentPage={meta.currentPage}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CertificationModal
          onClose={() => setIsModalOpen(false)}
          certification={editingCert}
        />
      )}
    </div>
  );
}

// ==========================================
// Sub-Component: Certification Card
// ==========================================
function CertificationCard({
  certification,
  onEdit,
  onDelete,
  isDeleting,
}: {
  certification: Certification;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {isDeleting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <Loader2 className="animate-spin text-red-600" size={24} />
        </div>
      )}
      <div className="mb-4 flex items-start justify-between">
        <img
          src={certification.imageUrl || "/placeholder-cert.png"}
          alt={certification.title}
          className="h-16 w-16 rounded-lg border-2 border-indigo-50 object-cover"
        />
        <div className="flex gap-2 text-gray-400">
          <button
            onClick={onEdit}
            className="transition-colors hover:text-indigo-600"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="transition-colors hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <h3 className="mb-2 text-xl leading-tight font-semibold text-gray-900">
        {certification.title}
      </h3>
      <p className="line-clamp-4 flex-grow text-sm text-gray-600">
        {certification.description}
      </p>
    </div>
  );
}

// ==========================================
// Sub-Component: Pagination
// ==========================================
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border bg-white px-4 py-2 transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm font-medium text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border bg-white px-4 py-2 transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

// ==========================================
// Sub-Component: Form Modal
// ==========================================
function CertificationModal({
  onClose,
  certification,
}: {
  onClose: () => void;
  certification: Certification | null;
}) {
  const isEditing = !!certification;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    certification?.imageUrl || null,
  );

  // Mutations
  const createMutation = useCreateCertificationMutation();
  const updateMutation = useUpdateCertificationMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const rawFormData = new FormData(form);

    // We construct a fresh FormData object specifically for the API
    const apiFormData = new FormData();
    apiFormData.append("title", rawFormData.get("title") as string);
    apiFormData.append("description", rawFormData.get("description") as string);

    const imageFile = rawFormData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      apiFormData.append("image", imageFile);
    }

    try {
      if (isEditing && certification) {
        await updateMutation.mutateAsync({
          id: certification.id,
          formData: apiFormData,
        });
      } else {
        await createMutation.mutateAsync(apiFormData);
      }
      onClose(); // Close modal on success
    } catch (error: any) {
      alert(error.message || "Failed to save certification.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Certification" : "Add New Certification"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center gap-3 md:w-1/3">
              <div
                className="flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon size={32} className="mb-1" />
                    <span className="px-2 text-center text-xs">
                      Upload Badge/Logo
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                required={!isEditing} // Image required on create, optional on update
              />
              <p className="text-center text-xs text-gray-500">
                JPG, PNG or WEBP. Max 2MB.
              </p>
            </div>

            {/* Text Fields Section */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Certification Title *
                </label>
                <input
                  name="title"
                  defaultValue={certification?.title}
                  required
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  defaultValue={certification?.description}
                  required
                  rows={5}
                  className="w-full resize-none rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Describe the skills validated by this certification..."
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg px-5 py-2.5 font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Certification"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
