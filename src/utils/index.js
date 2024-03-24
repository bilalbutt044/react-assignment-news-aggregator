import map from "lodash/map";


export const getAuthors = (data, key) => {
  const authors = map(data, key).filter((article) => article !== null && article !== undefined);
  return new Set([...authors]);
};
export const getSources = (data) => {
  const sources = data?.articles?.reduce((sources, article) => {
    // Check for valid source name (not "[Removed]")
    if (article?.source?.name !== "[Removed]") {
      // Add the source name to the accumulator
      sources.push(article?.source?.name);
    }
    return sources;
  }, []); // Initial empty array as accumulator

  return new Set([...sources]);
};

export const getFilteredArticles = (key, options, data) => {
  console.log(data)
  const selectedOptions = options.map((item) => item?.value); // this just contains array of strings
  const filteredArticles = data.filter((article) => selectedOptions.includes(article?.[key]));
  return filteredArticles;
};

export const getDateWithoutDashes = date => date && date.split("-").reduce((acc, date) => String(acc + date), "") 