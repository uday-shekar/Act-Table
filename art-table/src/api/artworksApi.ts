import type { Artwork } from '../types/artwork';

const BASE_URL = 'https://api.artic.edu/api/v1/artworks';

export interface ArtworksApiResponse {
  data: Artwork[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
}

// 🚫 NO prefetching
// 🚫 NO caching other pages
// ✅ Fetch ONLY requested page (server-side pagination)
export const fetchArtworks = async (
  page: number,
  limit: number = 12
): Promise<ArtworksApiResponse> => {
  const response = await fetch(
    `${BASE_URL}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch artworks (page ${page})`);
  }

  const json = await response.json();

  return {
    data: json.data as Artwork[],
    pagination: json.pagination,
  };
};