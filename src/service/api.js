import { getDateWithoutDashes } from "../utils";


const api = {
  getNewYourTimesArticles: async ({ query, startDate, endDate }) => {
    try {
      const beginDate = getDateWithoutDashes(startDate);
      const toDate = getDateWithoutDashes(endDate);
      var url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}${startDate ? `&begin_date=${beginDate}` : ""}${endDate ? `&end_date=${toDate}` : ""
        }&api-key=czEGGWR42TG7mCBbTscLGBgAO3TKeKCJ`;
      const res = await fetch(url);
      const data = await res.json();
      return data
      // when rate limit exceeds , we get error here
      if (!data?.fault) {
        const results = data?.response?.docs?.map((item) => ({
          ...item,
          publishedAt: item?.pub_date,
          description: item?.lead_paragraph,
          author: item?.byline?.original,
          title: item?.headline?.main,
        }));
        const authors = getAuthors(data?.response?.results, "tags.[0].webTitle");

        if (!startDate && !endDate)
          return setState((prev) => ({
            ...prev,
            articles: [...prev.articles, ...results],
            sources: [...prev.sources, "New Your TImes"],
          }));
        setState((prev) => ({
          ...prev,
          articles: [...results],
          sources: [...prev.sources, "New Your TImes"],
        }));
      }
    } catch (error) {
      console.log("error in new york times api", error);
    }
  }
}

export default api