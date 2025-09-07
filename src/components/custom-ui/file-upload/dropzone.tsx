"use client";

import
  axios,
  {
    type AxiosProgressEvent,
    type CancelTokenSource
  } from "axios";
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react";
import {HardDriveUploadIcon} from "lucide-react";

import {useDropzone} from "../dropzone/react";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {fetchPutPreSignedUrl} from "@/lib/utils/s3";
import {FileStatus, type FileUploadProgress} from "./types";
import {
  generateThumbnails,
  getFileUrl,
  revokeThumbnails
} from "./fileUtils";
import FileCard from "./file-card";

interface DropzoneComponentProps {
  maxTotalFiles: number;
  maxSize: number;
  acceptedFileTypes: Record<string, string[]>;
  filesToUpload: FileUploadProgress[];
  setFilesToUpload: Dispatch<SetStateAction<FileUploadProgress[]>>;
  uploadUrls: Record<string, string>;
  setUploadUrls: Dispatch<SetStateAction<Record<string, string>>>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  onUploadProgress: (
    progressEvent: AxiosProgressEvent,
    file: File,
    cancelSource: CancelTokenSource,
    fileStatus: FileStatus
  ) => void;
  removeFile: (file: File) => void;
  dirInBucket: string | null;
}

const DropzoneComponent: FC<DropzoneComponentProps> = ({
  maxTotalFiles,
  maxSize,
  acceptedFileTypes,
  filesToUpload,
  setFilesToUpload,
  uploadUrls,
  setUploadUrls,
  errorMessage,
  setErrorMessage,
  onUploadProgress,
  removeFile,
  dirInBucket,
}) => {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    const newThumbnails = generateThumbnails(filesToUpload.map((f) => f.file));
    setThumbnails(newThumbnails);

    return () => {
      revokeThumbnails(newThumbnails);
    };
  }, [filesToUpload]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setErrorMessage("");
      if (
        !maxTotalFiles ||
        filesToUpload.length + acceptedFiles.length > maxTotalFiles
      ) {
        setErrorMessage(
          `You can only upload a maximum of ${maxTotalFiles} files.`
        );
        return;
      }
      const fileUploadBatch = acceptedFiles.map(async (file) => {
        try {
          const presignedUrlResponse = await fetchPutPreSignedUrl(
            file.name,
            file.type,
            dirInBucket
          );
          const { url, newFileName, accessUrl } = presignedUrlResponse;

          setUploadUrls((prevUrls) => {
            const updatedUrls = { ...prevUrls };
            updatedUrls[file.name] = url;
            return updatedUrls;
          });

          const source = axios.CancelToken.source();
          setFilesToUpload((prev) => [
            ...prev,
            { progress: 0, file, source, status: FileStatus.Uploading },
          ]);

          await axios.put(url, file, {
            headers: { "Content-Type": file.type },
            cancelToken: source.token,
            onUploadProgress: (progressEvent: AxiosProgressEvent) =>
              onUploadProgress(
                progressEvent,
                file,
                source,
                FileStatus.Uploading
              ),
          });

          setFilesToUpload((prevUploadProgress) =>
            prevUploadProgress.map((item) =>
              item.file.name === file.name
                ? { ...item, status: FileStatus.Uploaded, newFileName, accessUrl }
                : item
            )
          )
        } catch (error) {
          console.error("Error uploading file:", file.name, error);
          setFilesToUpload((prevUploadProgress) =>
            prevUploadProgress.map((item) =>
              item.file.name === file.name
                ? { ...item, status: FileStatus.Error, error: error }
                : item
            )
          );
        }
      });

      try {
        await Promise.all(fileUploadBatch);
      } catch (error) {
        console.error("Error uploading files:", error);
      }
      setErrorMessage("");
    },
    [filesToUpload, maxTotalFiles, onUploadProgress, setFilesToUpload, setUploadUrls, setErrorMessage ]
  );

  const { getRootProps, getInputProps } = useDropzone({
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxSize,
  });

  return (
        <div
          className="flex flex-col items-center justify-center p-4 md:p-8 border border-gray-200 rounded-lg shadow-md bg-gray-100 hover:bg-gray-200 transition duration-300" {...getRootProps()}>
    <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4">
            <HardDriveUploadIcon size={24} className="text-gray-500 md:text-xl"/>
            <div className="flex flex-col items-center space-y-2">
              <p className="text-base md:text-lg font-bold text-gray-800">Drag and drop files here</p>
              <p className="text-xs md:text-sm text-gray-600 font-semibold">or click to browse</p>
            </div>
          </div>
          <Input {...getInputProps()} className="hidden"/>
          {errorMessage && <div className="mt-2 md:mt-4 text-xs md:text-sm text-red-600">{errorMessage}</div>}
          {filesToUpload.length > 0 && (
            <div className="mt-4 w-full">
              <ScrollArea className="max-h-64 md:max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                  {filesToUpload.map((fileUploadProgress, index) => (
                    <FileCard
                      key={index}
                      fileUploadProgress={fileUploadProgress}
                      getFileUrl={getFileUrl}
                      removeFile={removeFile}
                      thumbnails={thumbnails}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
  );
  
};

export default DropzoneComponent;
