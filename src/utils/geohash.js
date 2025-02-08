import ngeohash from "ngeohash";

function generateGeohash(lat, lon, precision = 7) {
  return ngeohash.encode(lat, lon, precision);
}

export { generateGeohash };

// Minha casa
// lati = -2.532442625724486
// long = -44.284024198277365

// Fundação
// -2.5330916929147436
// -44.284253091638234

// Casa dos primos
// -2.539188866766546
// -44.283904471248995
