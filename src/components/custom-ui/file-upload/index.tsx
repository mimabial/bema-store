"use client";

import {
  type AxiosProgressEvent,
  type CancelTokenSource
} from "axios";
import {
  useState,
  useEffect,
  useTransition,
  useRef,
  useMemo
} from "react";
import {createId} from "@paralleldrive/cuid2";
import { toast } from "sonner";

import DropzoneComponent from "./dropzone";
import { api } from "@/trpc/react";
import { type NewFile } from "@/server/db/schema/files";
import { useFile } from "@/context/file-provider";

enum FileStatus {
  Uploading = "uploading",
  Uploaded = "uploaded",
  Error = "error",
}

interface FileUploadProgress {
  error?: unknown;
  progress: number;
  file: File;
  source: CancelTokenSource | null;
  status: FileStatus;
  newFileName?: string;
  accessUrl?: string;
}

export interface FileUploadConfig {
  maxTotalFiles: number;
  maxSize: number;
  acceptedFileTypes: Record<string, string[]>;
}

export interface FileUploadProps {
  config: FileUploadConfig;
  dirInBucket?: string | null;
}

const FileUploadConfig = {
  maxTotalFiles: 10,
  maxSize: 10485760,
  acceptedFileTypes: {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    "application/pdf": [".pdf"],
    "audio/*": [".mp3", ".wav", ".ogg"],
    "video/*": [".mp4", ".mov", ".avi", ".mkv"],
  },
};

export default function FileUpload () {
  const { setFilesIDsAUpload } = useFile()
  const create = api.file.createList.useMutation(                  {
    onSuccess: () => {
      toast.success("File uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
  const remove = api.file.deleteList.useMutation({
    onSuccess: () => {
      toast.success("File deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const [isPending, startTransaction] = useTransition();

  const createFiles = (values: NewFile[]) => {
    startTransaction(async () => {
        const filesIds = await create.mutateAsync(values)
        setFilesIDsAUpload(filesIds)
    })
  }

  const deleteFile = (fileListToDelete: FileToUpsert) => {
    const id = fileListToDelete.map((file) => file.id)
    startTransaction(async () => {
        await remove.mutateAsync({id})
    })
  }

  const config = FileUploadConfig;
  const dirInBucket = null;

  const { maxTotalFiles, maxSize, acceptedFileTypes } = config;
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);
  const [uploadUrls, setUploadUrls] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  const filesToUpsert = useMemo(() => {
    return filesToUpload
      .filter(file => file.status === FileStatus.Uploaded && file.accessUrl)
      .map(file => ({
        id: createId(),
        name: file.file.name,
        format: file.file.type.split('/')[0]!,
        extension: file.file.type.split('/')[1]!,
        size: file.file.size,
        url: `https://${file.accessUrl!}`,
        updatedAt: new Date().toUTCString(),
      }), [])
  }, [filesToUpload])

  type FileToUpsert = typeof filesToUpsert

  const filesToUpsertRef = useRef(filesToUpsert)

  const onUploadProgress = (
    progressEvent: AxiosProgressEvent,
    file: File,
    cancelSource: CancelTokenSource,
    fileStatus: FileStatus
  ) => {
    const progress = Math.round(
      (progressEvent.loaded / (progressEvent.total ?? 1)) * 100
    );

    setFilesToUpload((prevUploadProgress) =>
      prevUploadProgress.map((item) =>
        item.file.name === file.name
          ? { ...item, progress, source: cancelSource, status: fileStatus }
          : item
      )
    );
    if (progress === 100) {
      setFilesToUpload((prevUploadProgress) =>
        prevUploadProgress.map((item) =>
          item.file.name === file.name
            ? { ...item, status: FileStatus.Uploaded }
            : item
        )
      );
    }
  };

  const removeFile = (file: File) => {
    setFilesToUpload((prevUploadProgress) => {
      const updatedUploadProgress = prevUploadProgress.map((item) =>
        item.file === file && item.status !== FileStatus.Uploading
          ? { ...item, status: FileStatus.Error }
          : item
      );
      return updatedUploadProgress.filter((item) => item.file !== file);
    });

    setUploadUrls((prevUrls) => {
      const newUrls = { ...prevUrls };
      delete newUrls[file.name];
      return newUrls;
    });
  };

  useEffect(() => {
    if (filesToUpsert.length === 0 && filesToUpsertRef.current.length === 0) return
    else if (filesToUpsert.length > filesToUpsertRef.current.length) createFiles(filesToUpsert)
    else if (filesToUpsert.length < filesToUpsertRef.current.length) {
      const fileListToDelete = filesToUpsert.filter((file) => !filesToUpsertRef.current.includes(file))
      deleteFile(fileListToDelete)
    }
    filesToUpsertRef.current = filesToUpsert
  }, [filesToUpsert.length]);

  return (
      <DropzoneComponent
        maxTotalFiles={maxTotalFiles}
        maxSize={maxSize}
        acceptedFileTypes={acceptedFileTypes}
        filesToUpload={filesToUpload}
        setFilesToUpload={setFilesToUpload}
        uploadUrls={uploadUrls}
        setUploadUrls={setUploadUrls}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        onUploadProgress={onUploadProgress}
        removeFile={removeFile}
        dirInBucket={dirInBucket}
      />
  );
}
