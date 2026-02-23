import { useDeleteResourceMutation } from "../hooks/useDeleteResourceMutation";

export const DeleteResource = () => {
  const deleteMutation = useDeleteResourceMutation();

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = formData.get("itemId") as string;

    if (confirm("Are you sure you want to delete this?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <form
      onSubmit={handleDelete}
      className="rounded border border-red-200 bg-red-50 p-4"
    >
      <label className="block text-sm font-bold text-red-700">
        Delete by ID
      </label>
      <input
        name="itemId"
        type="text"
        className="mb-2 w-full border p-2"
        placeholder="Enter ID to delete"
        required
      />
      <button
        type="submit"
        disabled={deleteMutation.isPending}
        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400"
      >
        {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
      </button>

      {deleteMutation.isSuccess && (
        <p className="mt-2 text-green-600">Deleted!</p>
      )}
    </form>
  );
};
