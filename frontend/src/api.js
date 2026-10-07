export const API_BASE_URL = 'http://localhost:5000'; 
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/hotel1-1.jpg';
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('blob:') ||
    imagePath.startsWith('data:')
  ) {
    return imagePath;
  }
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  return `${API_BASE_URL}/${imagePath}`;
};

 
export const fetchHotelsApi = async () => {
  const res = await fetch(`${API_BASE_URL}/api/hotels`);
  if (!res.ok) {
    throw new Error(`Failed to fetch hotels: ${res.statusText}`);
  }
  return await res.json();
};

 
export const fetchHotelByIdApi = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/hotels/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch hotel details: ${res.statusText}`);
  }
  return await res.json();
};

 
export const createHotelApi = async (formDataOrJson) => {
  const isFormData = formDataOrJson instanceof FormData;
  const options = {
    method: 'POST',
    body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson),
  };

  if (!isFormData) {
    options.headers = { 'Content-Type': 'application/json' };
  }

  const res = await fetch(`${API_BASE_URL}/api/hotels`, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to create hotel: ${res.statusText}`);
  }
  return await res.json();
};

 
export const updateHotelApi = async (id, formDataOrJson) => {
  const isFormData = formDataOrJson instanceof FormData;
  const options = {
    method: 'PUT',
    body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson),
  };

  if (!isFormData) {
    options.headers = { 'Content-Type': 'application/json' };
  }

  const res = await fetch(`${API_BASE_URL}/api/hotels/${id}`, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update hotel: ${res.statusText}`);
  }
  return await res.json();
};


export const deleteHotelApi = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/hotels/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to delete hotel: ${res.statusText}`);
  }
  return await res.json();
};
