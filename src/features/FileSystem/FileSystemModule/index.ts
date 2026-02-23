import { FilesModuleController } from "./FilesModuleController";
import { MockFileRepository } from "./infrastructure/MockFileRepository";
import { MockFileStorage } from "./infrastructure/MockFileStorage";
import { DeleteFileById } from "./useCases/DeleteFileById";
import { DeleteFileByPreviewUrl } from "./useCases/DeleteFileByPreviewUrl";
import { GetOneFileById } from "./useCases/GetOneFileById";
import { ListFIlesWithPagination } from "./useCases/ListFIlesWithPagination";
import { UpdateFileById } from "./useCases/UpdateFileById";
import { UploadFile } from "./useCases/UploadFile";

/**
 * infrastructure dependencies
 */
const fileRepository = new MockFileRepository();
const fileStorage = new MockFileStorage();

/**
 * use cases
 */
export const deleteFileByIdUseCase: DeleteFileById = new DeleteFileById(
  fileRepository,
  fileStorage,
);
export const getOneFileByIdUseCase: GetOneFileById = new GetOneFileById(
  fileRepository,
);
export const listFIlesWithPaginationUseCase: ListFIlesWithPagination =
  new ListFIlesWithPagination(fileRepository);
export const updateFileByIdUseCase: UpdateFileById = new UpdateFileById(
  fileRepository,
);
export const uploadFileUseCase: UploadFile = new UploadFile(
  fileStorage,
  fileRepository,
);
export const deleteFileByPreviewUrlUseCase: DeleteFileByPreviewUrl =
  new DeleteFileByPreviewUrl(fileRepository, fileStorage);

/**
 * exporting default controller
 */
export const filesModuleController = new FilesModuleController(
  deleteFileByIdUseCase,
  getOneFileByIdUseCase,
  listFIlesWithPaginationUseCase,
  updateFileByIdUseCase,
  uploadFileUseCase,
  deleteFileByPreviewUrlUseCase,
);
export * from "./FilesModuleController";
