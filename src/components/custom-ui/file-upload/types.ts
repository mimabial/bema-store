import { type CancelTokenSource } from "axios";

export enum FileStatus {
  Uploading = "uploading",
  Uploaded = "uploaded",
  Error = "error",
}

export interface FileUploadProgress {
  error?: unknown
  progress: number;
  file: File;
  source: CancelTokenSource | null;
  status: FileStatus;
  newFileName?: string;
  accessUrl?: string;
}
