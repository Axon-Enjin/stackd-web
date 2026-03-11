export type ImageUploadResult = {
  url: string;
  url64?: string;
  url256?: string;
  url512?: string;
};

export abstract class IImageService {
  abstract uploadFile(file: File): Promise<ImageUploadResult>;

  abstract deleteFile(publicUrl: string): Promise<boolean>;
}
