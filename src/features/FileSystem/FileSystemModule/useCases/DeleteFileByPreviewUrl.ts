import { IFileRepository } from "../domain/IFileRepository";
import { IFileStorage } from "../domain/IFileStorage";

export class DeleteFileByPreviewUrl {
  constructor(
    private fileRepository: IFileRepository,
    private fileStorage: IFileStorage,
  ) { }

  async execute(publicUrl: string): Promise<boolean> {
    const fileRecord = await this.fileRepository.findByPreviewUrl(publicUrl);

    if (!fileRecord) {
      return true;
    }

    const storageRefsToDelete = [
      fileRecord.props.storageReference,
      fileRecord.props.storageRef64,
      fileRecord.props.storageRef256,
      fileRecord.props.storageRef512,
    ].filter((ref): ref is string => !!ref);

    const storageRes = await this.fileStorage.deleteFile(storageRefsToDelete);
    const repositoryRes = await this.fileRepository.deleteById(
      fileRecord.props.id,
    );

    return storageRes && repositoryRes;
  }
}
