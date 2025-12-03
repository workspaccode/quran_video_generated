export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING_PROMPTS = 'GENERATING_PROMPTS',
  GENERATING_VIDEO = 'GENERATING_VIDEO',
  GENERATING_METADATA = 'GENERATING_METADATA',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum UploadStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  UPLOADING = 'UPLOADING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  visualPrompt: string; // The prompt sent to Veo
  quranTranslation?: string; // Short translation snippet
}

export interface GeneratedVideo {
  uri: string;
  mimeType: string;
}

export interface VideoConfig {
  topic: string; // e.g., "Surah Al-Mulk", "Patience", "Nature"
  style: string; // e.g., "Cinematic", "Peaceful", "Abstract"
}
