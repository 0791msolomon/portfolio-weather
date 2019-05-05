import axios from "axios";
let baseUrl = process.env.REACT_APP_BASEURL || "";
baseUrl += "/api";

export const forecast = async (zip, unit) => {
  let response = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?zip=${zip},us&units=${unit}&APPID=${
      process.env.REACT_APP_WEATHER_API_KEY
    }`
  );
  return response;
};

export const findCity = async zip => {
  try {
    let response = axios.get(`${baseUrl}/weather`, { params: { zip } });
    return response;
  } catch (err) {
    return err;
  }
};
