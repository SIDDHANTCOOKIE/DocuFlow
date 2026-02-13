export enum ConversionMode {
  MD_TO_DOCX = 'MD_TO_DOCX',
  DOCX_TO_MD = 'DOCX_TO_MD',
}

export interface FileData {
  name: string;
  content: ArrayBuffer | string;
  type: string;
}

export interface ConversionResult {
  fileName: string;
  blob: Blob;
  previewText?: string;
}