
export interface ClickDetail {
  timestamp: string;
  source: string;
  location: string;
}

export interface ShortenedURL {
  id: string; // The short code
  longUrl: string;
  shortUrl: string; // The full short URL with hash
  createdAt: string;
  expiresAt: string;
  clicks: number;
  clickDetails: ClickDetail[];
}

export interface URLInput {
  id: number;
  longUrl: string;
  customCode: string;
  validity: string; // In minutes, as a string from input
}
