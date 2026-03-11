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
  AlertTriangle,
  Linkedin,
  Trophy,
} from "lucide-react";

import { Pagination } from "@/components/cms/Pagination";
import { SortContentsModal } from "@/components/cms/SortContentsModal";
import { usePaginatedTeamMembersQuery } from "@/features/TeamMembers/hooks/usePaginatedTeamMembersQuery";
import { useCreateTeamMemberMutation } from "@/features/TeamMembers/hooks/useCreateTeamMemberMutation";
import { useUpdateTeamMemberMutation } from "@/features/TeamMembers/hooks/useUpdateTeamMemberMutation";
import { useDeleteTeamMemberMutation } from "@/features/TeamMembers/hooks/useDeleteTeamMemberMutation";
import { useQueryClient } from "@tanstack/react-query";
import { truncateWithEllipsis } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

// Types based on your domain
interface Member {
  id: string;
  imageUrl?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: string;
  bio: string;
  linkedinProfile?: string | null;
  achievements?: string[];
}

export default function TeamAdminPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <TeamAdminPageContent />
    </React.Suspense>
  );
}

function TeamAdminPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setPageSize = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", newPageSize.toString());
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [photoViewerUrl, setPhotoViewerUrl] = useState<string | null>(null);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // TanStack Query Hooks
  const { data: response, isLoading, isFetching } = usePaginatedTeamMembersQuery(page, pageSize);
  const deleteMutation = useDeleteTeamMemberMutation();

  const members: Member[] = response?.data || [];
  const meta = response?.meta;

  useEffect(() => {
    if (!isLoading && highlightId) {
      const found = members.find((m) => m.id === highlightId);
      if (found) {
        const el = document.getElementById(`row-${highlightId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => setHighlightId(null), 3000);
        }
      }
    }
  }, [isLoading, highlightId, members]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    setPageError(null);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Team member successfully deleted.", {
        className: "!bg-white border !border-gray-200 !text-gray-900 !rounded-sm shadow-xl",
        progressClassName: "!bg-[#2F80ED]",
        icon: <Trash2 className="text-red-500" size={20} />,
      });
    } catch (error: any) {
      setPageError(error.message || "Failed to delete member.");
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
        <div className="flex w-full gap-2 sm:w-auto max-sm:flex-col-reverse max-sm:items-start">
          <button
            onClick={() => setIsSortModalOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:flex-initial"
          >
            <ArrowUpDown size={18} />
            Sort
          </button>
          <button
            onClick={openCreate}
            className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#2F80ED] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#2570d4] sm:flex-initial"
          >
            <Plus size={20} />
            Add Member
          </button>
        </div>
      </div>

      {/* Page Error Banner */}
      {pageError && (
        <div className="mb-6 flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 p-4">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-500" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-red-800">Couldn&apos;t complete action</p>
            <p className="mt-0.5 whitespace-pre-wrap text-sm text-red-600">{pageError}</p>
          </div>
          <button onClick={() => setPageError(null)} className="shrink-0 text-red-400 hover:text-red-600">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-[#2F80ED]" size={40} />
        </div>
      ) : (
        <>
          {/* Row List */}
          <div className="relative rounded border border-gray-200 bg-white shadow-sm">
            {isFetching && !isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded bg-white/50 backdrop-blur-[1px]">
                <Loader2 className="animate-spin text-[#2F80ED]" size={32} />
              </div>
            )}
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
                    isDeleting={
                      deleteMutation.isPending &&
                      deleteMutation.variables === member.id
                    }
                    isHighlighted={highlightId === member.id}
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
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
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
          onClose={(createdId?: string) => {
            setIsModalOpen(false);
            if (createdId && meta) {
              const newTotalRecords = meta.totalRecords + 1;
              const targetPage = Math.ceil(newTotalRecords / pageSize) || 1;
              setPage(targetPage);
              setHighlightId(createdId);
            }
          }}
          member={editingMember}
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
          onSortComplete={() => {
            queryClient.invalidateQueries({ queryKey: ["team-members"] });
          }}
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
  isDeleting,
  isHighlighted,
}: {
  member: Member;
  fullName: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPhotoClick: (url: string) => void;
  isDeleting: boolean;
  isHighlighted?: boolean;
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
      id={`row-${member.id}`}
      className={`group relative flex items-center gap-4 px-5 py-4 transition-all duration-500 hover:bg-gray-50 ${isDeleting ? "opacity-50" : "cursor-pointer"} ${isHighlighted ? "bg-blue-50/50" : ""}`}
      onClick={() => !isDeleting && onView()}
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
        <h3 className="text-sm font-semibold text-gray-900">
          {truncateWithEllipsis(fullName, 30)}
        </h3>
        <p className="mt-0.5 text-xs text-gray-500">{truncateWithEllipsis(member.role, 30)}</p>
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
          className="rounded-sm p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded border border-gray-100 bg-white py-1 shadow-xl">
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
      <div className="flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-sm border border-gray-200 bg-white shadow-2xl sm:max-h-[90vh] sm:max-w-lg sm:rounded-sm" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#2F80ED]/10">
              <Users size={16} className="text-[#2F80ED]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Member Details</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
          >
            <X size={20} />
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
          <div className="space-y-3">
            <div className="rounded-sm border border-gray-100 bg-gray-50/50 px-4 py-3">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Full Name
              </label>
              <p className="mt-1 text-sm font-medium text-gray-900">{fullName}</p>
            </div>
            {member.middleName && (
              <div className="rounded-sm border border-gray-100 bg-gray-50/50 px-4 py-3">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Middle Name
                </label>
                <p className="mt-1 text-sm text-gray-700">{member.middleName}</p>
              </div>
            )}
            <div className="rounded-sm border border-gray-100 bg-gray-50/50 px-4 py-3">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Role / Job Title
              </label>
              <p className="mt-1 text-sm font-medium text-[#2F80ED]">{member.role}</p>
            </div>
            <div className="rounded-sm border border-gray-100 bg-gray-50/50 px-4 py-3">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Bio
              </label>
              <p className="mt-1 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {member.bio}
              </p>
            </div>

            {/* LinkedIn Profile */}
            {member.linkedinProfile && (
              <div className="rounded-sm border border-gray-100 bg-gray-50/50 px-4 py-3">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  LinkedIn Profile
                </label>
                <a
                  href={member.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1.5 text-sm text-[#0A66C2] hover:underline break-all"
                >
                  <Linkedin size={14} className="shrink-0" />
                  {member.linkedinProfile}
                </a>
              </div>
            )}

            {/* Achievements */}
            {member.achievements && member.achievements.length > 0 && (
              <div className="rounded-sm border border-gray-100 bg-gray-50/50 px-4 py-3">
                <label className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  <Trophy size={11} className="text-amber-500" />
                  Achievements
                </label>
                <ul className="space-y-1.5">
                  {member.achievements.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-6 py-3">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 rounded-sm border border-transparent px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-200 hover:bg-red-50"
          >
            <Trash2 size={15} />
            Delete
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-2 rounded-sm bg-[#0B1F3B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0B1F3B]/90"
            >
              <Edit2 size={15} />
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
function MemberModal({
  onClose,
  member,
}: {
  onClose: (id?: string) => void;
  member: Member | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    member?.imageUrl || null,
  );
  const [formError, setFormError] = useState<string | null>(null);

  // Achievements are managed as a list of strings
  const [achievements, setAchievements] = useState<string[]>(
    member?.achievements && member.achievements.length > 0 ? member.achievements : [],
  );
  const [newAchievement, setNewAchievement] = useState("");

  const isEditing = !!member;

  // Mutations
  const createMutation = useCreateTeamMemberMutation();
  const updateMutation = useUpdateTeamMemberMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const addAchievement = () => {
    const trimmed = newAchievement.trim();
    if (!trimmed) return;
    setAchievements((prev) => [...prev, trimmed]);
    setNewAchievement("");
  };

  const removeAchievement = (index: number) => {
    setAchievements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAchievementKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAchievement();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

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
      apiFormData.append("linkedinProfile", rawFormData.get("linkedinProfile") as string);
      apiFormData.append("achievements", JSON.stringify(achievements));
      if (imageFile && imageFile.size > 0) {
        apiFormData.append("image", imageFile);
      }
    } else {
      apiFormData.append("firstname", rawFormData.get("firstname") as string);
      apiFormData.append("lastname", rawFormData.get("lastname") as string);
      apiFormData.append("middlename", rawFormData.get("middlename") as string);
      apiFormData.append("role", rawFormData.get("role") as string);
      apiFormData.append("bio", rawFormData.get("bio") as string);
      apiFormData.append("linkedinProfile", rawFormData.get("linkedinProfile") as string);
      apiFormData.append("achievements", JSON.stringify(achievements));
      if (imageFile && imageFile.size > 0) {
        apiFormData.append("image", imageFile);
      }
    }

    try {
      if (isEditing && member) {
        await updateMutation.mutateAsync({
          id: member.id,
          formData: apiFormData,
        });
        onClose();
        toast.success("Team member successfully updated.", {
          className: "!bg-white border !border-gray-200 !text-gray-900 !rounded-sm shadow-xl",
          progressClassName: "!bg-[#2F80ED]",
          icon: <Users className="text-[#2F80ED]" size={20} />,
        });
      } else {
        const result = await createMutation.mutateAsync(apiFormData);
        onClose(result?.id || result?.data?.id);
        toast.success("Team member successfully created.", {
          className: "!bg-white border !border-gray-200 !text-gray-900 !rounded-sm shadow-xl",
          progressClassName: "!bg-[#2F80ED]",
          icon: <Users className="text-[#2F80ED]" size={20} />,
        });
      }
    } catch (error: any) {
      setFormError(error.message || "Failed to save team member.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4" onClick={() => onClose()}>
      <div className="flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-sm border border-gray-200 bg-white shadow-2xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#2F80ED]/10">
              <Users size={16} className="text-[#2F80ED]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Team Member" : "Add New Member"}
            </h2>
          </div>
          <button
            onClick={() => onClose()}
            className="rounded-sm p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6">
          {formError && (
            <div className="mb-6 flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 p-4">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-red-800">Couldn&apos;t save changes</p>
                <p className="mt-0.5 whitespace-pre-wrap text-sm text-red-600">{formError}</p>
              </div>
              <button type="button" onClick={() => setFormError(null)} className="shrink-0 text-red-400 hover:text-red-600">
                <X size={18} />
              </button>
            </div>
          )}

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
                    className="w-full rounded-sm border p-2.5 outline-none focus:ring-2 focus:ring-[#2F80ED]"
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
                    className="w-full rounded-sm border p-2.5 outline-none focus:ring-2 focus:ring-[#2F80ED]"
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
                  className="w-full rounded-sm border p-2.5 outline-none focus:ring-2 focus:ring-[#2F80ED]"
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
                  className="w-full rounded-sm border p-2.5 outline-none focus:ring-2 focus:ring-[#2F80ED]"
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
                  className="w-full rounded-sm border p-2.5 outline-none focus:ring-2 focus:ring-[#2F80ED]"
                ></textarea>
              </div>

              {/* LinkedIn Profile */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  LinkedIn Profile URL (Optional)
                </label>
                <input
                  name="linkedinProfile"
                  type="url"
                  defaultValue={member?.linkedinProfile ?? ""}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-sm border p-2.5 outline-none focus:ring-2 focus:ring-[#2F80ED]"
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Achievements (Optional)
                </label>

                {/* Achievement List */}
                {achievements.length > 0 && (
                  <ul className="mb-3 space-y-1.5">
                    {achievements.map((a, i) => (
                      <li key={i} className="flex items-center gap-2 rounded-sm border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        <span className="flex-1 break-all">{a}</span>
                        <button
                          type="button"
                          onClick={() => removeAchievement(i)}
                          className="shrink-0 text-gray-400 transition-colors hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Add Achievement Input */}
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  onKeyDown={handleAchievementKeyDown}
                  placeholder="e.g. Best Innovator Award 2024"
                  className="w-full rounded-sm border p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2F80ED]"
                />
                <div className="mt-1.5 flex justify-end">
                  <button
                    type="button"
                    onClick={addAchievement}
                    disabled={!newAchievement.trim()}
                    className="rounded-sm border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div className="mt-8 flex justify-end gap-2 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => onClose()}
              disabled={isPending}
              className="rounded-sm border border-gray-200 bg-white px-5 py-2.5 font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex min-w-[120px] items-center justify-center gap-2 rounded-sm bg-[#0B1F3B] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#0B1F3B]/90 disabled:opacity-70"
            >
              {isPending ? (
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
        className="max-h-[85vh] max-w-[90vw] rounded-sm object-contain shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
