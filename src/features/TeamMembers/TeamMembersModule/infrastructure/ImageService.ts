import { FilesModuleController } from "@/features/FileSystem/FileSystemModule";
import { IImageService, ImageUploadResult } from "../domain/IImageService";

export class ImageService implements IImageService {
  constructor(private readonly filesModuleController: FilesModuleController) { }

  async uploadFile(file: File): Promise<ImageUploadResult> {
    const result = await this.filesModuleController.uploadFile(
      await file.arrayBuffer(),
      file.type,
      file.name,
      "This file is uploaded by the teams module.",
      "/teams-module/",
    );

    return {
      url: result.previewUrl,
      url64: result.previewUrl64 ?? undefined,
      url256: result.previewUrl256 ?? undefined,
      url512: result.previewUrl512 ?? undefined,
    };
  }

  async deleteFile(publicUrl: string): Promise<boolean> {
    return await this.filesModuleController.deleteFileByPreviewUrl(publicUrl);
  }
}
