import { IFileRepository } from "../domain/IFileRepository";
import { IFileStorage } from "../domain/IFileStorage";

export class DeleteFileById {
  constructor(
    private fileRepository: IFileRepository,
    private fileStorage: IFileStorage,
  ) { }

  async execute(fileId: string): Promise<boolean> {
    /**
     * STEPS:
     * - get file from repo
     * - check if it exists
     * - get the storage reference
     * - use the reference to delete file
     * - after deleting file, delete the file record
     */

    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      return true;
    }

    const storageRefsToDelete = [
      file.props.storageReference,
      file.props.storageRef64,
      file.props.storageRef256,
      file.props.storageRef512,
    ].filter((ref): ref is string => !!ref);

    await this.fileStorage.deleteFile(storageRefsToDelete);

    await this.fileRepository.deleteById(fileId);

    return true;
  }
}
