import { Dayjs } from "dayjs";

export interface Attachment {
  id?: string;
  fileName?: string;
  filePath?: string;
  fileType?: string;
  uploadedAt?: Dayjs;
}