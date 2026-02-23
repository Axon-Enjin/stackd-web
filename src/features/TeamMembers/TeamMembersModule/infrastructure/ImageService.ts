import { FilesModuleController } from "@/features/FileSystem/FileSystemModule";
import { IImageService } from "../domain/IImageService";

export class ImageService implements IImageService {
  constructor(private readonly filesModuleController: FilesModuleController) {}

  async uploadFile(file: File): Promise<string> {
    const result = await this.filesModuleController.uploadFile(
      await file.arrayBuffer(),
      file.type,
      file.name,
      "This file is uploaded by the teams module.",
      "/teams-module/",
    );

    return result.previewUrl;
  }
  async deleteFile(publicUrl: string): Promise<boolean> {
    return await this.filesModuleController.deleteFileByPreviewUrl(publicUrl);
  }
}
