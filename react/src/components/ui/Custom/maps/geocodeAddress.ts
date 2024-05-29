export interface Coordinates {
    lat: number;
    lon: number;
    address : string;
  }

  const geocodeAddress = async (address: string): Promise<Coordinates> => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon), address : address };
    } else {
      throw new Error('Address not found');
    }
  };

  export default geocodeAddress;
