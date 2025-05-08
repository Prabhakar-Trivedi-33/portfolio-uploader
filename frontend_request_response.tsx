import React, { useState } from "react";
import axios from "axios";

// TypeScript interfaces
export interface MediaUploadItem {
  type: "image";
  fileName: string;
  requestId: string;
  description: string;
}

export interface MediaUploadRequest {
  sessionId: string;
  customerId: number;
  medias: MediaUploadItem[];
}

export interface UploadedMediaItem {
  type: string;
  requestId: string;
  url: string;
  description: string;
}

export interface MediaUploadResponse {
  status: string;
  errorCode: string;
  message: string;
  timestamp: number;
  uploadedMedia: UploadedMediaItem[];
}

export interface ChatMediaItem {
  type: string;
  url: string;
  description: string;
}

export interface ChatAnalysisRequest {
  sessionId: string;
  customerId: number;
  message: string;
  medias: ChatMediaItem[];
}

export interface SuggestedFollowUp {
  content: string;
}

export interface ChatAnalysisBody {
  message: string;
  medias: ChatMediaItem[];
  suggestedFollowUps: SuggestedFollowUp[];
}

export interface ChatAnalysisResponse {
  timestamp: number;
  body?: ChatAnalysisBody;
  message: string;
  errorCode: string;
  status: string;
}

const API_BASE = "https://co.inwealthera.com/api/user/chat";

function randomRequestId() {
  return Math.floor(Math.random() * 1e9).toString();
}

// Add a function to retrieve the token dynamically
const getAuthToken = () => {
  // Replace with actual token retrieval logic (e.g., from localStorage or a context)
  return localStorage.getItem("authToken") || "";
};

const PortfolioUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMediaItem[]>([]);
  const [analysis, setAnalysis] = useState<ChatAnalysisBody | null>(null);
  const [loading, setLoading] = useState(false);

  // Replace with your actual session/customer IDs
  const sessionId = "session123";
  const customerId = 123456;

  // 1. Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // 2. Upload images to get S3 URLs
  const handleUpload = async () => {
    setLoading(true);
    const medias: MediaUploadItem[] = files.map((file) => ({
      type: "image",
      fileName: file.name,
      requestId: randomRequestId(),
      description: "Portfolio screenshot",
    }));

    // Step 1: Get S3 upload URLs from backend
    const uploadReq: MediaUploadRequest = {
      sessionId,
      customerId,
      medias,
    };

    const { data: uploadRes } = await axios.post<MediaUploadResponse>(
      `${API_BASE}/media/upload`,
      uploadReq,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    setUploadedMedia(uploadRes.uploadedMedia);
    setLoading(false);
  };

  // 3. Send S3 URLs for analysis
  const handleAnalyze = async () => {
    setLoading(true);
    const medias: ChatMediaItem[] = uploadedMedia.map((media) => ({
      type: media.type,
      url: media.url,
      description: media.description,
    }));

    const analysisReq: ChatAnalysisRequest = {
      sessionId,
      customerId,
      message: "Can you analyze this image for me?",
      medias,
    };

    const { data: analysisRes } = await axios.post<ChatAnalysisResponse>(
      API_BASE.replace("/chat", "/chat"), // "/api/user/chat"
      analysisReq,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    setAnalysis(analysisRes.body || null);
    setLoading(false);
  };

  return (
    <div>
      <h2>Upload Portfolio Images</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={loading}
      />
      <button onClick={handleUpload} disabled={loading || files.length === 0}>
        Upload
      </button>

      {uploadedMedia.length > 0 && (
        <div>
          <h3>Uploaded Images</h3>
          <ul>
            {uploadedMedia.map((media) => (
              <li key={media.requestId}>
                <a href={media.url} target="_blank" rel="noopener noreferrer">
                  {media.url}
                </a>
              </li>
            ))}
          </ul>
          <button onClick={handleAnalyze} disabled={loading}>
            Analyze Portfolio
          </button>
        </div>
      )}

      {analysis && (
        <div>
          <h3>Analysis Result</h3>
          <p>{analysis.message}</p>
          {analysis.medias.map((media, idx) => (
            <div key={idx}>
              <img src={media.url} alt={media.description} width={200} />
              <p>{media.description}</p>
            </div>
          ))}
          <h4>Suggested Follow Ups</h4>
          <ul>
            {analysis.suggestedFollowUps.map((s, idx) => (
              <li key={idx}>{s.content}</li>
            ))}
          </ul>
        </div>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default PortfolioUploader;
