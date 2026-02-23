export abstract class IImageService {
  abstract uploadFile(file: File): Promise<string>; // takes file, returns public url of image

  abstract deleteFile(publicUrl: string): Promise<boolean>;
}
