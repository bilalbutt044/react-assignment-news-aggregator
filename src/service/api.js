import { getDateWithoutDashes } from "../utils";


const api = {
  getNewYourTimesArticles: async ({ query = "", startDate = "", endDate = "" } = {}) => {
    try {
      const beginDate = getDateWithoutDashes(startDate);
      const toDate = getDateWithoutDashes(endDate);
      var url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}${startDate ? `&begin_date=${beginDate}` : ""}${endDate ? `&end_date=${toDate}` : ""
        }&api-key=czEGGWR42TG7mCBbTscLGBgAO3TKeKCJ`;
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
        }&show-tags=contributor&api-key=18e0677c-4348-4c45-a357-a29a2eb04911`;
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
        "apiKey=4879cb53518145099b220a86f4aa3f20";
      const res = await fetch(url);
      const data = await res.json();
      return data
    } catch (error) {

    }
  }
}

export default api