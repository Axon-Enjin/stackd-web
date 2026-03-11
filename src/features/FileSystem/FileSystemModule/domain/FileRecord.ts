export type FileRecordPrototypeProps = {
  fileName: string;
  fileDescription: string;
  filePath: string;
  previewUrl: string;
  storageReference: string;
  previewUrl64?: string | null;
  previewUrl256?: string | null;
  previewUrl512?: string | null;
  storageRef64?: string | null;
  storageRef256?: string | null;
  storageRef512?: string | null;
};

export type FileRecordMetadataProps = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type FileRecordUpdateProps = Partial<
  Omit<FileRecordPrototypeProps, "previewUrl" | "storageReference" | "previewUrl64" | "previewUrl256" | "previewUrl512" | "storageRef64" | "storageRef256" | "storageRef512">
>;

export class FileRecordPrototype {
  constructor(public props: FileRecordPrototypeProps) { }
}

/**
 *
 */
export class FileRecord {
  private constructor(
    public props: FileRecordPrototypeProps & FileRecordMetadataProps,
  ) { }

  static hydrate(props: FileRecordPrototypeProps & FileRecordMetadataProps) {
    return new FileRecord(props);
  }

  update(props: FileRecordUpdateProps) {
    // merge update to avoid nulling out props
    this.props = {
      ...this.props,
      ...props,
    };
  }
}
