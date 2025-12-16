const API_BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:8084/api";

export const fetchDailyEnergy = async (plantId, startDate, endDate) => {
  try {
    const startDateISO = new Date(startDate).toISOString();
    const endDateISO = new Date(endDate).toISOString();

    const url = `${API_BASE_URL}/plants/daily-energy?plantId=${plantId}&startDate=${startDateISO}&endDate=${endDateISO}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching daily energy:", error);
    throw error;
  }
};

export const fetchDevicesByPlant = async (plantId) => {
  if (!plantId) {
    console.log("No plantId provided to fetchDevicesByPlant");
    return [];
  }
  try {
    const url = `${API_BASE_URL}/devices?plantId=${plantId}`;
    console.log("Fetching devices from:", url);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log("Devices API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
};

const formatApiDate = (date, endOfDay = false) => {
  const d = new Date(date);
  if (endOfDay) {
    d.setUTCHours(23, 59, 59, 999);
  } else {
    d.setUTCHours(0, 0, 0, 0);
  }
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}Z`;
};

export const fetchDailyEnergyByPlant = async (startDate, endDate) => {
  try {
    const startDateISO = formatApiDate(startDate, false);
    const endDateISO = formatApiDate(endDate, true);

    const url = `${API_BASE_URL}/plants/daily-energy-by-plant?startDate=${startDateISO}&endDate=${endDateISO}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching daily energy by plant:", error);
    throw error;
  }
};

export const fetchFilteredMeasures = async (
  plantId,
  deviceId,
  variable,
  startDate,
  endDate
) => {
  try {
    if (!plantId || !deviceId || !variable) {
      console.log("Missing required parameters for fetchFilteredMeasures:", {
        plantId,
        deviceId,
        variable,
      });
      return [];
    }

    const startDateISO = formatApiDate(startDate, false);
    const endDateISO = formatApiDate(endDate, true);

    const url = `${API_BASE_URL}/measures/filtered?plantId=${plantId}&deviceId=${deviceId}&variable=${variable}&startDate=${startDateISO}&endDate=${endDateISO}`;

    console.log("Fetching measures from:", url);

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("Measures API error response:", data);
      return data;
    }

    if (data.error || data.status === 500) {
      console.error("Measures API error in response:", data);
      return data;
    }

    console.log("Measures API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching filtered measures:", error);
    throw error;
  }
};
