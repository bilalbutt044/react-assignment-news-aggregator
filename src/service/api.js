import { getDateWithoutDashes } from "../utils";
const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY
const GUADIAN_API_KEY = import.meta.env.VITE_GUADIAN_API_KEY
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY

const api = {
  getNewYourTimesArticles: async ({ query = "", startDate = "", endDate = "" } = {}) => {
    try {
      const beginDate = getDateWithoutDashes(startDate);
      const toDate = getDateWithoutDashes(endDate);
      var url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}${startDate ? `&begin_date=${beginDate}` : ""}${endDate ? `&end_date=${toDate}` : ""
        }&api-key=${NYT_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      return data
    } catch (error) {
      console.log("error in new york times api", error);
    }
  },
  getGuadianArticles: async ({ query = "", startDate = "", endDate = "" } = {}) => {
    try {
      var url = `https://content.guardianapis.com/search?q=${query}${startDate ? `&from-date=${startDate}` : ""}${endDate ? `&to-date=${endDate}` : ""
        }&show-tags=contributor&api-key=${GUADIAN_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      return data
    } catch (error) {

    }
  },
  getNewApiArticles: async ({ query = "", startDate = "", endDate = "" } = {}) => {
    try {
      var url =
        "https://newsapi.org/v2/everything?" +
        `q=${query}&` +
        `${startDate ? `from=${startDate}&` : ""}` +
        `${endDate ? `to=${endDate}&` : ""}` +
        "sortBy=popularity&" +
        `apiKey=${NEWS_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      return data
    } catch (error) {

    }
  }
}

export default api