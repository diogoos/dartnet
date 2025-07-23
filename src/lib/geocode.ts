import axios from "axios";
import memoize from "memoize";

export async function _geocode(place: string) {
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: place,
        format: 'json',
        limit: 1,
      },
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'dartnet/1.0', // required by Nominatim policy
      },
    });

    if (res.data.length > 0) {
      const { lat, lon, display_name } = res.data[0];
      return {
        name: place,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        displayName: display_name,
      }
    }
  } catch (err) {
    console.error(`Failed to fetch geocode for: ${place}`, err);
    return null
  }
}

export const cache = new Map();

export const geocode = memoize(_geocode, {
  cache
});
