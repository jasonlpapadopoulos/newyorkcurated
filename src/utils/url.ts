export function generatePlaceUrl(place: { neighborhood_clean: string; place_name: string }) {
  const nameSlug = place.place_name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
  
  return `/place/${place.neighborhood_clean}/${nameSlug}`;
}