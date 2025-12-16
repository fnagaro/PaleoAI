export interface TranscriptionState {
  status: 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
  text: string | null;
  error: string | null;
}

export interface ImageFile {
  file: File | null;
  previewUrl: string | null;
}

export interface TranscriptionRequest {
  base64Image: string;
  mimeType: string;
}

export enum ViewMode {
  SPLIT = 'SPLIT',
  IMAGE_ONLY = 'IMAGE_ONLY',
  TEXT_ONLY = 'TEXT_ONLY',
}