"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

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

  // API route mapping - Adjust this to match your Next.js route structure
  const API_URL = "/api/team-members";

  // Fetch Members
  const fetchMembers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?pageNumber=${page}&pageSize=10`);
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

  // Delete Member
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

  // Open Modal Helpers
  const openCreate = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const openEdit = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="mt-1 text-gray-500">
            Manage your organization's team directory.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

        {/* Member Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <img
                      src={member.imageUrl || "/placeholder-avatar.png"}
                      alt={member.firstName}
                      className="h-16 w-16 rounded-full border-2 border-indigo-50 object-cover"
                    />
                    <div className="flex gap-2 text-gray-400">
                      <button
                        onClick={() => openEdit(member)}
                        className="transition-colors hover:text-indigo-600"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="transition-colors hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {member.firstName}{" "}
                    {member.middleName ? `${member.middleName.charAt(0)}.` : ""}{" "}
                    {member.lastName}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-indigo-600">
                    {member.role}
                  </p>
                  <p className="mb-4 line-clamp-3 flex-grow text-sm text-gray-600">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  disabled={meta.currentPage === 1}
                  onClick={() => fetchMembers(meta.currentPage - 1)}
                  className="rounded-lg border bg-white px-4 py-2 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="py-2 text-gray-600">
                  Page {meta.currentPage} of {meta.totalPages}
                </span>
                <button
                  disabled={meta.currentPage === meta.totalPages}
                  onClick={() => fetchMembers(meta.currentPage + 1)}
                  className="rounded-lg border bg-white px-4 py-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

      {/* Reusable Form Modal */}
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

    // Handle Form Data Formatting based on API expectations
    if (isEditing) {
      // PATCH expects camelCase: firstName, lastName
      apiFormData.append("firstName", rawFormData.get("firstname") as string);
      apiFormData.append("lastName", rawFormData.get("lastname") as string);
      apiFormData.append("middleName", rawFormData.get("middlename") as string);
      apiFormData.append("role", rawFormData.get("role") as string);
      apiFormData.append("bio", rawFormData.get("bio") as string);
      if (imageFile && imageFile.size > 0) {
        apiFormData.append("image", imageFile);
      }
    } else {
      // POST expects lowercase: firstname, lastname
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-6">
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
                    <ImageIcon size={32} mb-1 />
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
                required={!isEditing} // Image is required on create, optional on edit
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
                    className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
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
                    className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
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
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
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
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
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
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
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
              className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-70"
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
