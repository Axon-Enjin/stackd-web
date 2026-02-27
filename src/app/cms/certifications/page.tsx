"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Loader2,
  Award,
  MoreVertical,
  Eye,
  ZoomIn,
} from "lucide-react";
import { useCreateCertificationMutation } from "@/features/Certifications/hooks/useCreateCertificationMutation";
import { useDeleteCertificationMutation } from "@/features/Certifications/hooks/useDeleteCertificationMutation";
import { usePaginatedCertificationsQuery } from "@/features/Certifications/hooks/usePaginatedCertificationsQuery";
import { useUpdateCertificationMutation } from "@/features/Certifications/hooks/useUpdateCertificationMutation";
import { Pagination } from "@/components/cms/Pagination";

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
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [viewingCert, setViewingCert] = useState<Certification | null>(null);
  const [photoViewerUrl, setPhotoViewerUrl] = useState<string | null>(null);

  // TanStack Query Hooks
  const { data: response, isLoading } = usePaginatedCertificationsQuery(
    page,
    pageSize,
  );
  const deleteMutation = useDeleteCertificationMutation();

  const certifications: Certification[] = response?.data || [];
  const meta = response?.meta;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this certification?"))
      return;
    try {
      await deleteMutation.mutateAsync(id);
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
    setViewingCert(null);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            <Award className="shrink-0 text-indigo-600" size={28} />
            Certifications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage technical and professional certifications.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 sm:w-auto"
        >
          <Plus size={20} />
          Add Certification
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
            {certifications.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <Award className="mx-auto mb-3 text-gray-300" size={48} />
                <h3 className="text-lg font-medium text-gray-900">
                  No certifications yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Add one to get started!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {certifications.map((cert) => (
                  <CertificationRow
                    key={cert.id}
                    certification={cert}
                    onView={() => setViewingCert(cert)}
                    onEdit={() => openEdit(cert)}
                    onDelete={() => handleDelete(cert.id)}
                    onPhotoClick={(url) => setPhotoViewerUrl(url)}
                    isDeleting={
                      deleteMutation.isPending &&
                      deleteMutation.variables === cert.id
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {meta && (
            <Pagination
              currentPage={meta.currentPage}
              totalPages={meta.totalPages}
              pageSize={pageSize}
              totalRecords={meta.totalRecords}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          )}
        </>
      )}

      {/* Detail View Modal */}
      {viewingCert && (
        <CertificationDetailModal
          certification={viewingCert}
          onClose={() => setViewingCert(null)}
          onEdit={() => openEdit(viewingCert)}
          onDelete={() => {
            handleDelete(viewingCert.id);
            setViewingCert(null);
          }}
          onPhotoClick={(url) => setPhotoViewerUrl(url)}
        />
      )}

      {/* Create/Edit Form Modal */}
      {isModalOpen && (
        <CertificationModal
          onClose={() => setIsModalOpen(false)}
          certification={editingCert}
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
function CertificationRow({
  certification,
  onView,
  onEdit,
  onDelete,
  onPhotoClick,
  isDeleting,
}: {
  certification: Certification;
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
      {/* Thumbnail */}
      <div
        className="group/avatar relative shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          if (certification.imageUrl) onPhotoClick(certification.imageUrl);
        }}
      >
        <img
          src={certification.imageUrl || "/placeholder-cert.png"}
          alt={certification.title}
          className="h-12 w-12 rounded-lg border border-gray-200 object-cover transition-shadow group-hover/avatar:ring-2 group-hover/avatar:ring-indigo-400 group-hover/avatar:ring-offset-1"
        />
        {certification.imageUrl && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover/avatar:bg-black/30">
            <ZoomIn size={14} className="text-white opacity-0 transition-opacity group-hover/avatar:opacity-100" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-gray-900">
          {certification.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-gray-500">
          {certification.description}
        </p>
      </div>

      {/* Loading spinner for delete */}
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
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onView();
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye size={15} className="text-gray-400" />
              View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onEdit();
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Edit2 size={15} className="text-gray-400" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 size={15} />
              Delete
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
function CertificationDetailModal({
  certification,
  onClose,
  onEdit,
  onDelete,
  onPhotoClick,
}: {
  certification: Certification;
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
          <h2 className="text-xl font-bold text-gray-900">Certification Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Image */}
          <div className="mb-6 flex justify-center">
            <div
              className={`group/avatar relative ${certification.imageUrl ? "cursor-pointer" : ""}`}
              onClick={() => { if (certification.imageUrl) onPhotoClick(certification.imageUrl); }}
            >
              <img
                src={certification.imageUrl || "/placeholder-cert.png"}
                alt={certification.title}
                className="h-28 w-28 rounded-xl border-2 border-gray-100 object-cover shadow-sm transition-shadow group-hover/avatar:ring-2 group-hover/avatar:ring-indigo-400 group-hover/avatar:ring-offset-2"
              />
              {certification.imageUrl && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition-colors group-hover/avatar:bg-black/20">
                  <ZoomIn size={20} className="text-white opacity-0 transition-opacity group-hover/avatar:opacity-100" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Title
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {certification.title}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Description
              </label>
              <p className="mt-1 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {certification.description}
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
      onClose();
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between border-b p-5 sm:p-6">
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
                required={!isEditing}
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
