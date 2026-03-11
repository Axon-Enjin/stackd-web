import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FileBuffer } from "../domain/FileBuffer";
import { IFileStorage } from "../domain/IFileStorage";
import { UploadedFileBuffer } from "../domain/UploadedFileBuffer";
import { configs } from "@/configs/configs";
import sharp from "sharp";

export class SupabaseFileStorage implements IFileStorage {
  private readonly BUCKET_NAME = configs.supabase.storageBucket;

  async uploadFileBuffer(file: FileBuffer): Promise<UploadedFileBuffer> {
    // 1. Generate a unique path/reference for the storage
    const fileExtension = file.name.split(".").pop();
    const baseName = `${Date.now()}-${crypto.randomUUID()}`;
    const fileName = `${baseName}.${fileExtension}`;
    const storagePath = `uploads/${fileName}`;

    // 2. Upload the original ArrayBuffer to Supabase Storage
    const supabase = await createSupabaseServerClient();
    const { data: originalData, error: originalError } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(storagePath, file.arraybuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (originalError) {
      throw new Error(
        `Failed to upload file to Supabase: ${originalError.message}`,
      );
    }

    // 3. Get the Public URL for the original
    const { data: publicUrlData } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(originalData.path);

    // 4. Generate resized copies if it is an image
    let copiesInfo:
      | Record<string, { url: string; ref: string }>
      | undefined = undefined;

    if (file.type.startsWith("image/")) {
      copiesInfo = {};
      const sizes = [1024, 64, 128, 256, 512];

      try {
        const imageBuffer = Buffer.from(file.arraybuffer);
        const metadata = await sharp(imageBuffer).metadata();
        const originalWidth = metadata.width || 0;
        const originalHeight = metadata.height || 0;

        await Promise.all(
          sizes.map(async (size) => {
            let pipeline = sharp(imageBuffer);

            // Resize only if original is larger than target size
            if (Math.max(originalWidth, originalHeight) > size) {
              const isLandscape = originalWidth >= originalHeight;
              pipeline = pipeline.resize({
                width: isLandscape ? size : undefined,
                height: !isLandscape ? size : undefined,
                withoutEnlargement: true,
              });
            }

            // Convert to webp with 90% quality
            const webpBuffer = await pipeline
              .webp({ quality: 90 })
              .toBuffer();

            const copyFileName = `${baseName}_${size}.webp`;
            const copyStoragePath = `uploads/${copyFileName}`;

            // Upload the copy
            const { data: copyData, error: copyError } =
              await supabase.storage
                .from(this.BUCKET_NAME)
                .upload(copyStoragePath, webpBuffer, {
                  contentType: "image/webp",
                  upsert: false,
                });

            if (!copyError && copyData && copiesInfo) {
              const { data: copyUrlData } = supabase.storage
                .from(this.BUCKET_NAME)
                .getPublicUrl(copyData.path);

              copiesInfo[size.toString()] = {
                url: copyUrlData.publicUrl,
                ref: copyData.path,
              };
            }
          }),
        );
      } catch (error) {
        console.error(
          "Failed to process image copies in SupabaseFileStorage:",
          error,
        );
      }
    }

    // 5. Return the domain object
    // The "default" preview_url is the 1024 copy if available, otherwise the original
    const defaultUrl = copiesInfo?.["1024"]?.url ?? publicUrlData.publicUrl;
    const defaultRef = copiesInfo?.["1024"]?.ref ?? originalData.path;

    return new UploadedFileBuffer(
      defaultRef, // storage_reference (1024 copy as default)
      defaultUrl, // public_url (1024 copy as default)
      copiesInfo?.["64"]?.url,
      copiesInfo?.["256"]?.url,
      copiesInfo?.["512"]?.url,
      copiesInfo?.["64"]?.ref,
      copiesInfo?.["256"]?.ref,
      copiesInfo?.["512"]?.ref,
    );
  }

  async deleteFile(storageReferences: string[]): Promise<boolean> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove(storageReferences);

    if (error) {
      throw new Error(
        `Failed to delete file from Supabase: ${error.message}`,
      );
    }

    return true;
  }
}
