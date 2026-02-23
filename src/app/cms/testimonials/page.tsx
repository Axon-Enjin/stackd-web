"use client";

import React, { useState, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Loader2,
  MessageSquareQuote,
} from "lucide-react";
// Adjust these imports to match your actual file structure
import { useCreateTestimonialMutation } from "@/features/Testimonials/hooks/useCreateTestimonialMutation";
import { useDeleteTestimonialMutation } from "@/features/Testimonials/hooks/useDeleteTestimonialMutation";
import { usePaginatedTestimonialsQuery } from "@/features/Testimonials/hooks/usePaginatedTestimonialsQuery";
import { useUpdateTestimonialMutation } from "@/features/Testimonials/hooks/useUpdateTestimonialMutation";

// ==========================================
// Types
// ==========================================
export interface Testimonial {
  id: string;
  imageUrl: string;
  name: string;
  role: string;
  body: string;
  rankingIndex: number;
}

// ==========================================
// Main Page Component
// ==========================================
export default function TestimonialsAdminPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);

  // TanStack Query Hooks
  const { data: response, isLoading } = usePaginatedTestimonialsQuery(page, 10);
  const deleteMutation = useDeleteTestimonialMutation();

  // Map the backend API response (which might still use title/description) to our new UI model
  const rawTestimonials = response?.data || [];
  const testimonials: Testimonial[] = rawTestimonials.map((t: any) => ({
    ...t,
    name: t.name || t.title,
    role: t.role || t.description,
  }));

  const meta = response?.meta;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?"))
      return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      alert("Failed to delete testimonial.");
    }
  };

  const openCreate = () => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };

  const openEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
              <MessageSquareQuote className="text-indigo-600" size={32} />
              Testimonials
            </h1>
            <p className="mt-1 text-gray-500">
              Manage client feedback, quotes, and success stories.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add Testimonial
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
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  onEdit={() => openEdit(testimonial)}
                  onDelete={() => handleDelete(testimonial.id)}
                  isDeleting={
                    deleteMutation.isPending &&
                    deleteMutation.variables === testimonial.id
                  }
                />
              ))}
            </div>

            {/* Empty State */}
            {!isLoading && testimonials.length === 0 && (
              <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
                <MessageSquareQuote
                  className="mx-auto mb-3 text-gray-300"
                  size={48}
                />
                <h3 className="text-lg font-medium text-gray-900">
                  No testimonials yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Add some client feedback to build trust with your audience.
                </p>
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
        <TestimonialModal
          onClose={() => setIsModalOpen(false)}
          testimonial={editingTestimonial}
        />
      )}
    </div>
  );
}

// ==========================================
// Sub-Component: Testimonial Card
// ==========================================
function TestimonialCard({
  testimonial,
  onEdit,
  onDelete,
  isDeleting,
}: {
  testimonial: Testimonial;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      {isDeleting && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <Loader2 className="animate-spin text-red-600" size={24} />
        </div>
      )}

      {/* Header Row: Quote Icon + Actions */}
      <div className="mb-4 flex items-start justify-between">
        <MessageSquareQuote className="text-indigo-100" size={32} />

        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 lg:opacity-100">
          <button
            onClick={onEdit}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Quote Body (No more absolute positioning or weird padding needed) */}
      <div className="flex-grow">
        <p className="line-clamp-4 leading-relaxed font-medium text-gray-700 italic">
          "{testimonial.body}"
        </p>
      </div>

      {/* Author Info */}
      <div className="mt-auto flex items-center gap-4 border-t border-gray-100 pt-5">
        <img
  src={testimonial.imageUrl || "/placeholder-avatar.png"}
  alt={testimonial.name}
  // aspect-square + object-cover + shrink-0 = Perfect circle
  className="h-12 w-12 aspect-square shrink-0 rounded-full border border-gray-200 object-cover shadow-sm"
/>
        <div className="flex flex-col">
          <h3 className="text-sm leading-tight font-bold text-gray-900">
            {testimonial.name}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-gray-500">
            {testimonial.role}
          </p>
        </div>
      </div>
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
function TestimonialModal({
  onClose,
  testimonial,
}: {
  onClose: () => void;
  testimonial: Testimonial | null;
}) {
  const isEditing = !!testimonial;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    testimonial?.imageUrl || null,
  );

  // Mutations
  const createMutation = useCreateTestimonialMutation();
  const updateMutation = useUpdateTestimonialMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const rawFormData = new FormData(form);

    const apiFormData = new FormData();

    // Safety Net: Append both the new terms (name/role) and the old terms
    // (title/description) so the backend API accepts it either way!
    const nameVal = rawFormData.get("name") as string;
    const roleVal = rawFormData.get("role") as string;

    apiFormData.append("name", nameVal);
    apiFormData.append("title", nameVal);

    apiFormData.append("role", roleVal);
    apiFormData.append("description", roleVal);

    apiFormData.append("body", rawFormData.get("body") as string);

    const imageFile = rawFormData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      apiFormData.append("image", imageFile);
    }

    try {
      if (isEditing && testimonial) {
        await updateMutation.mutateAsync({
          id: testimonial.id,
          formData: apiFormData,
        });
      } else {
        await createMutation.mutateAsync(apiFormData);
      }
      onClose(); // Close modal on success
    } catch (error: any) {
      alert(error.message || "Failed to save testimonial.");
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
        <div className="flex shrink-0 items-center justify-between border-b bg-gray-50/50 p-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center gap-3 md:w-1/3">
              <label className="w-full text-center text-sm font-medium text-gray-700">
                Client Photo
              </label>
              <div
                // shrink-0 fixes the oval stretching issue entirely
                className="flex h-32 w-32 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-indigo-400 hover:bg-gray-100"
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
                    <ImageIcon size={32} className="mb-1 text-gray-300" />
                    <span className="px-2 text-center text-xs">
                      Upload Avatar
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
                required={!isEditing}
              />
              <p className="text-center text-xs text-gray-500">
                Square image recommended.
                <br />
                Max 2MB.
              </p>
            </div>

            {/* Text Fields Section */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    name="name"
                    defaultValue={testimonial?.name}
                    required
                    className="w-full rounded-lg border border-gray-300 p-2.5 transition-shadow outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Jane Doe"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Role / Company *
                  </label>
                  <input
                    name="role"
                    defaultValue={testimonial?.role}
                    required
                    className="w-full rounded-lg border border-gray-300 p-2.5 transition-shadow outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. CEO at TechCorp"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Quote / Testimonial *
                </label>
                <textarea
                  name="body"
                  defaultValue={testimonial?.body}
                  required
                  rows={5}
                  className="w-full resize-none rounded-lg border border-gray-300 p-2.5 transition-shadow outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="What did they say about your service?..."
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
              className="flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Testimonial"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
