/**
 * The uploaded version of file buffer.
 * - we no longer store the arraybuffer.
 * - instead, we note its reference in the storage
 * - we also note a public url to view the file
 */
export class UploadedFileBuffer {
  constructor(
    public storage_reference: string, // anything that identifies the file in the storage
    public public_url: string, // url to view the file
    public preview_url_64?: string,
    public preview_url_256?: string,
    public preview_url_512?: string,
    public storage_ref_64?: string,
    public storage_ref_256?: string,
    public storage_ref_512?: string,
  ) { }
}
