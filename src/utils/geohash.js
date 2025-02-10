import ngeohash from "ngeohash";

function generateGeohash(lat, lon, precision = 7) {
  return ngeohash.encode(lat, lon, precision);
}

export { generateGeohash };
