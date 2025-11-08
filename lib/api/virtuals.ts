import { VirtualsResponse, SortOption } from "@/lib/types";

const VIRTUALS_API_BASE = "https://api2.virtuals.io/api/virtuals";

export async function fetchVirtuals(
  sortBy: SortOption = "volume24h",
  page: number = 1,
  pageSize: number = 100
): Promise<VirtualsResponse> {
  let sortParam = "";
  
  switch (sortBy) {
    case "volume24h":
      sortParam = "sort[0]=volume24h%3Adesc&sort[1]=createdAt%3Adesc";
      break;
    case "priceChangePercent24h":
      sortParam = "sort[0]=priceChangePercent24h%3Adesc&sort[1]=createdAt%3Adesc";
      break;
    case "age":
      sortParam = "sort[0]=age%3Adesc&sort[1]=createdAt%3Adesc";
      break;
  }

  const url = `${VIRTUALS_API_BASE}?filters[status]=5&filters[chain]=BASE&${sortParam}&populate[0]=image&populate[1]=genesis&populate[2]=creator&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

  const response = await fetch(url, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch virtuals: ${response.statusText}`);
  }

  return response.json();
}

