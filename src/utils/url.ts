export function generatePlaceUrl(place: { neighborhood_clean: string; place_name_clean: string }) {
  return `/place/${place.neighborhood_clean}/${place.place_name_clean}`;
}