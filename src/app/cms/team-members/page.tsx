"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Loader2,
  MoreVertical,
  Eye,
  Users,
  ZoomIn,
  ArrowUpDown,
} from "lucide-react";

import { Pagination } from "@/components/cms/Pagination";
import { SortContentsModal } from "@/components/cms/SortContentsModal";

// Types based on your domain
interface Member {
  id: string;
  imageUrl?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: string;
  bio: string;
}

interface PaginationMeta {
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export default function TeamAdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [photoViewerUrl, setPhotoViewerUrl] = useState<string | null>(null);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const API_URL = "/api/team-members";

  const fetchMembers = async (page = 1, size = pageSize) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?pageNumber=${page}&pageSize=${size}`);
      if (res.ok) {
        const { data, meta } = await res.json();
        setMembers(data || []);
        setMeta(meta);
      }
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMembers(meta?.currentPage || 1);
      } else {
        alert("Failed to delete member.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openCreate = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const openEdit = (member: Member) => {
    setEditingMember(member);
    setViewingMember(null);
    setIsModalOpen(true);
  };

  const getFullName = (member: Member) => {
    const middle = member.middleName ? `${member.middleName.charAt(0)}.` : "";
    return `${member.firstName} ${middle} ${member.lastName}`.replace(/\s+/g, " ").trim();
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            <Users className="shrink-0 text-[#2F80ED]" size={28} />
            Team Members
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your organization's team directory.
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <button
            onClick={() => setIsSortModalOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:flex-initial"
          >
            <ArrowUpDown size={18} />
            Sort
          </button>
          <button
            onClick={openCreate}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2F80ED] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#2570d4] sm:flex-initial"
          >
            <Plus size={20} />
            Add Member
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-[#2F80ED]" size={40} />
        </div>
      ) : (
        <>
          {/* Row List */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {members.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <Users className="mx-auto mb-3 text-gray-300" size={48} />
                <h3 className="text-lg font-medium text-gray-900">
                  No team members yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Add your first team member to get started!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {members.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    fullName={getFullName(member)}
                    onView={() => setViewingMember(member)}
                    onEdit={() => openEdit(member)}
                    onDelete={() => handleDelete(member.id)}
                    onPhotoClick={(url) => setPhotoViewerUrl(url)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {meta && (
            <Pagination
              currentPage={meta.currentPage}
              totalPages={meta.totalPages}
              pageSize={pageSize}
              totalRecords={meta.totalRecords}
              onPageChange={(page) => fetchMembers(page)}
              onPageSizeChange={(size) => {
                setPageSize(size);
                fetchMembers(1, size);
              }}
            />
          )}
        </>
      )}

      {/* Detail View Modal */}
      {viewingMember && (
        <MemberDetailModal
          member={viewingMember}
          fullName={getFullName(viewingMember)}
          onClose={() => setViewingMember(null)}
          onEdit={() => openEdit(viewingMember)}
          onDelete={() => {
            handleDelete(viewingMember.id);
            setViewingMember(null);
          }}
          onPhotoClick={(url) => setPhotoViewerUrl(url)}
        />
      )}

      {/* Create/Edit Form Modal */}
      {isModalOpen && (
        <MemberModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          member={editingMember}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchMembers(meta?.currentPage || 1);
          }}
          apiUrl={API_URL}
        />
      )}

      {/* Photo Viewer Lightbox */}
      {photoViewerUrl && (
        <PhotoViewer
          imageUrl={photoViewerUrl}
          onClose={() => setPhotoViewerUrl(null)}
        />
      )}

      {/* Sort Modal */}
      {isSortModalOpen && (
        <SortContentsModal
          apiPath="/api/team-members"
          labelKey="firstName"
          subLabelKey="role"
          imageKey="imageUrl"
          title="Sort Team Members"
          onClose={() => setIsSortModalOpen(false)}
          onSortComplete={() => fetchMembers(meta?.currentPage || 1)}
        />
      )}
    </div>
  );
}

// ==========================================
// Sub-Component: Row Item
// ==========================================
function MemberRow({
  member,
  fullName,
  onView,
  onEdit,
  onDelete,
  onPhotoClick,
}: {
  member: Member;
  fullName: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPhotoClick: (url: string) => void;
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
      className="group flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
      onClick={() => onView()}
    >
      {/* Avatar */}
      <div
        className="group/avatar relative shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          if (member.imageUrl) onPhotoClick(member.imageUrl);
        }}
      >
        <img
          src={member.imageUrl || "/placeholder-avatar.png"}
          alt={fullName}
          className="h-11 w-11 rounded-full border border-gray-200 object-cover transition-shadow group-hover/avatar:ring-2 group-hover/avatar:ring-[#2F80ED] group-hover/avatar:ring-offset-1"
        />
        {member.imageUrl && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover/avatar:bg-black/30">
            <ZoomIn size={14} className="text-white opacity-0 transition-opacity group-hover/avatar:opacity-100" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-gray-900">
          {fullName}
        </h3>
        <p className="mt-0.5 truncate text-xs text-gray-500">{member.role}</p>
      </div>

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
function MemberDetailModal({
  member,
  fullName,
  onClose,
  onEdit,
  onDelete,
  onPhotoClick,
}: {
  member: Member;
  fullName: string;
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
          <h2 className="text-xl font-bold text-gray-900">Member Details</h2>
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
              className={`group/avatar relative ${member.imageUrl ? "cursor-pointer" : ""}`}
              onClick={() => { if (member.imageUrl) onPhotoClick(member.imageUrl); }}
            >
              <img
                src={member.imageUrl || "/placeholder-avatar.png"}
                alt={fullName}
                className="h-28 w-28 rounded-full border-2 border-gray-100 object-cover shadow-sm transition-shadow group-hover/avatar:ring-2 group-hover/avatar:ring-[#2F80ED] group-hover/avatar:ring-offset-2"
              />
              {member.imageUrl && (
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
                Full Name
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">{fullName}</p>
            </div>
            {member.middleName && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Middle Name
                </label>
                <p className="mt-1 text-sm text-gray-700">{member.middleName}</p>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Role / Job Title
              </label>
              <p className="mt-1 text-sm font-medium text-[#2F80ED]">{member.role}</p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Bio
              </label>
              <p className="mt-1 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {member.bio}
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
              className="flex items-center gap-2 rounded-lg bg-[#2F80ED] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2570d4]"
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
// Form Modal Sub-Component
// ==========================================
function MemberModal({ isOpen, onClose, member, onSuccess, apiUrl }: any) {
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    member?.imageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!member;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const rawFormData = new FormData(form);
    const apiFormData = new FormData();
    const imageFile = rawFormData.get("image") as File;

    if (isEditing) {
      apiFormData.append("firstName", rawFormData.get("firstname") as string);
      apiFormData.append("lastName", rawFormData.get("lastname") as string);
      apiFormData.append("middleName", rawFormData.get("middlename") as string);
      apiFormData.append("role", rawFormData.get("role") as string);
      apiFormData.append("bio", rawFormData.get("bio") as string);
      if (imageFile && imageFile.size > 0) {
        apiFormData.append("image", imageFile);
      }
    } else {
      apiFormData.append("firstname", rawFormData.get("firstname") as string);
      apiFormData.append("lastname", rawFormData.get("lastname") as string);
      apiFormData.append("middlename", rawFormData.get("middlename") as string);
      apiFormData.append("role", rawFormData.get("role") as string);
      apiFormData.append("bio", rawFormData.get("bio") as string);
      if (imageFile && imageFile.size > 0) {
        apiFormData.append("image", imageFile);
      }
    }

    try {
      const res = await fetch(isEditing ? `${apiUrl}/${member.id}` : apiUrl, {
        method: isEditing ? "PATCH" : "POST",
        body: apiFormData,
      });

      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        alert(err.error || err.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error.");
    } finally {
      setSubmitting(false);
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
        <div className="flex items-center justify-between border-b p-5 sm:p-6">
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Team Member" : "Add New Member"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center gap-3 md:w-1/3">
              <div
                className="flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 transition hover:bg-gray-100"
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
                    <span className="text-xs">Upload Photo</span>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    name="firstname"
                    defaultValue={member?.firstName}
                    required
                    className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-[#2F80ED]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    name="lastname"
                    defaultValue={member?.lastName}
                    required
                    className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-[#2F80ED]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Middle Name (Optional)
                </label>
                <input
                  name="middlename"
                  defaultValue={member?.middleName}
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-[#2F80ED]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Role/Job Title *
                </label>
                <input
                  name="role"
                  defaultValue={member?.role}
                  required
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-[#2F80ED]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Bio *
                </label>
                <textarea
                  name="bio"
                  defaultValue={member?.bio}
                  required
                  rows={3}
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-[#2F80ED]"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-5 py-2.5 font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-[#2F80ED] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#2570d4] disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Member"
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
      >
        <X size={24} />
      </button>

      {/* Image */}
      <img
        src={imageUrl}
        alt="Full view"
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
