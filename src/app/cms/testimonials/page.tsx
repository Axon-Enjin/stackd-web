"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Loader2,
  MessageSquareQuote,
  MoreVertical,
  Eye,
  ZoomIn,
} from "lucide-react";
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
  const [viewingTestimonial, setViewingTestimonial] =
    useState<Testimonial | null>(null);
  const [photoViewerUrl, setPhotoViewerUrl] = useState<string | null>(null);

  // TanStack Query Hooks
  const { data: response, isLoading } = usePaginatedTestimonialsQuery(page, 10);
  const deleteMutation = useDeleteTestimonialMutation();

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
    setViewingTestimonial(null);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            <MessageSquareQuote className="shrink-0 text-indigo-600" size={28} />
            Testimonials
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage client feedback, quotes, and success stories.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 sm:w-auto"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      ) : (
        <>
          {/* Row List */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {testimonials.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
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
            ) : (
              <div className="divide-y divide-gray-100">
                {testimonials.map((testimonial) => (
                  <TestimonialRow
                    key={testimonial.id}
                    testimonial={testimonial}
                    onView={() => setViewingTestimonial(testimonial)}
                    onEdit={() => openEdit(testimonial)}
                    onDelete={() => handleDelete(testimonial.id)}
                    onPhotoClick={(url) => setPhotoViewerUrl(url)}
                    isDeleting={
                      deleteMutation.isPending &&
                      deleteMutation.variables === testimonial.id
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                disabled={meta.currentPage === 1}
                onClick={() => setPage(meta.currentPage - 1)}
                className="rounded-lg border bg-white px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-gray-600">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
              <button
                disabled={meta.currentPage === meta.totalPages}
                onClick={() => setPage(meta.currentPage + 1)}
                className="rounded-lg border bg-white px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail View Modal */}
      {viewingTestimonial && (
        <TestimonialDetailModal
          testimonial={viewingTestimonial}
          onClose={() => setViewingTestimonial(null)}
          onEdit={() => openEdit(viewingTestimonial)}
          onDelete={() => {
            handleDelete(viewingTestimonial.id);
            setViewingTestimonial(null);
          }}
          onPhotoClick={(url) => setPhotoViewerUrl(url)}
        />
      )}

      {/* Create/Edit Form Modal */}
      {isModalOpen && (
        <TestimonialModal
          onClose={() => setIsModalOpen(false)}
          testimonial={editingTestimonial}
        />
      )}

      {/* Photo Viewer Lightbox */}
      {photoViewerUrl && (
        <PhotoViewer
          imageUrl={photoViewerUrl}
          onClose={() => setPhotoViewerUrl(null)}
        />
      )}
    </div>
  );
}

// ==========================================
// Sub-Component: Row Item
// ==========================================
function TestimonialRow({
  testimonial,
  onView,
  onEdit,
  onDelete,
  onPhotoClick,
  isDeleting,
}: {
  testimonial: Testimonial;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPhotoClick: (url: string) => void;
  isDeleting: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`group relative flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50 ${isDeleting ? "opacity-50" : "cursor-pointer"}`}
      onClick={() => !isDeleting && onView()}
    >
      {/* Avatar */}
      <div
        className="group/avatar relative shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          if (testimonial.imageUrl) onPhotoClick(testimonial.imageUrl);
        }}
      >
        <img
          src={testimonial.imageUrl || "/placeholder-avatar.png"}
          alt={testimonial.name}
          className="h-11 w-11 rounded-full border border-gray-200 object-cover transition-shadow group-hover/avatar:ring-2 group-hover/avatar:ring-indigo-400 group-hover/avatar:ring-offset-1"
        />
        {testimonial.imageUrl && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover/avatar:bg-black/30">
            <ZoomIn size={14} className="text-white opacity-0 transition-opacity group-hover/avatar:opacity-100" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-gray-900">
          {testimonial.name}
        </h3>
        <p className="mt-0.5 truncate text-xs text-gray-500">
          {testimonial.role} — "{testimonial.body}"
        </p>
      </div>

      {/* Loading spinner */}
      {isDeleting && (
        <Loader2 className="shrink-0 animate-spin text-red-500" size={18} />
      )}

      {/* Menu */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onView(); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye size={15} className="text-gray-400" /> View
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Edit2 size={15} className="text-gray-400" /> Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Sub-Component: Detail View Modal
// ==========================================
function TestimonialDetailModal({
  testimonial,
  onClose,
  onEdit,
  onDelete,
  onPhotoClick,
}: {
  testimonial: Testimonial;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPhotoClick: (url: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold text-gray-900">Testimonial Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Avatar */}
          <div className="mb-6 flex justify-center">
            <div
              className={`group/avatar relative ${testimonial.imageUrl ? "cursor-pointer" : ""}`}
              onClick={() => { if (testimonial.imageUrl) onPhotoClick(testimonial.imageUrl); }}
            >
              <img
                src={testimonial.imageUrl || "/placeholder-avatar.png"}
                alt={testimonial.name}
                className="h-24 w-24 rounded-full border-2 border-gray-100 object-cover shadow-sm transition-shadow group-hover/avatar:ring-2 group-hover/avatar:ring-indigo-400 group-hover/avatar:ring-offset-2"
              />
              {testimonial.imageUrl && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover/avatar:bg-black/20">
                  <ZoomIn size={20} className="text-white opacity-0 transition-opacity group-hover/avatar:opacity-100" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Name
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {testimonial.name}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Role / Company
              </label>
              <p className="mt-1 text-sm font-medium text-indigo-600">
                {testimonial.role}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Testimonial Quote
              </label>
              <p className="mt-1 text-sm leading-relaxed text-gray-700 italic whitespace-pre-wrap">
                "{testimonial.body}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <Edit2 size={16} />
              Update
            </button>
          </div>
        </div>
      </div>
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

  const createMutation = useCreateTestimonialMutation();
  const updateMutation = useUpdateTestimonialMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const rawFormData = new FormData(form);

    const apiFormData = new FormData();

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
      onClose();
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between border-b bg-gray-50/50 p-5 sm:p-6">
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

// ==========================================
// Sub-Component: Photo Viewer Lightbox
// ==========================================
function PhotoViewer({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
      >
        <X size={24} />
      </button>
      <img
        src={imageUrl}
        alt="Full view"
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
