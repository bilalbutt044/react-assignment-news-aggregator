import { Fragment, useEffect, useState } from "react";
import "./App.css";
import Search from "./components/search";
import NewsCard from "./components/newsCard";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import MultiSelect from "./components/multiselect";

function App() {
  const [state, setState] = useState({
    articles: [],
    filteredArticles: [], // this will contains filtered results
    selectedAuthorsResults: [], // this will contains selected authors articles only
    selectedSourcesResults: [], // this will contains selected seources articles only
    // categories: [], not getting categories in API response so not adding this filter
    sources: [],
    authors: [],
  });

  const { filteredArticles, articles, sources, authors, selectedAuthorsResults, selectedSourcesResults } = state;

  useEffect(() => {
    getNewApiArticles();
    getGuadianArticles();
    getNewYourTimesArticles();
  }, []);

  const getNewYourTimesArticles = async () => {
    try {
      var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=czEGGWR42TG7mCBbTscLGBgAO3TKeKCJ";
      const res = await fetch(url);
      const data = await res.json();
      // when rate limit exceeds , we get error here
      if (!data?.fault) {
        console.log(data);
        const results = data?.response?.docs?.map((item) => ({
          ...item,
          publishedAt: item?.pub_date,
          description: item?.lead_paragraph,
          author: item?.byline?.original,
          title: item?.headline?.main,
        }));
        const authors = getAuthors(data?.response?.results, "tags.[0].webTitle");

        setState((prev) => ({
          ...prev,
          articles: [...prev.articles, ...results],
          sources: [...prev.sources, "New Your TImes"],
          authors: [...prev.authors, ...authors],
        }));
      }
    } catch (error) {}
  };
  const getGuadianArticles = async () => {
    try {
      var url = "https://content.guardianapis.com/search?show-tags=contributor&api-key=18e0677c-4348-4c45-a357-a29a2eb04911";
      const res = await fetch(url);
      const data = await res.json();
      const results = data?.response?.results?.map((item) => ({
        ...item,
        source: "Guadian",
        publishedAt: item?.webPublicationDate,
        author: item?.tags?.[0]?.webTitle,
        title: item?.webTitle,
      }));
      const authors = getAuthors(data?.response?.results, "tags.[0].webTitle");
      setState((prev) => ({
        ...prev,
        articles: [...prev.articles, ...results],
        sources: [...prev.sources, "The Guadian"],
        authors: [...prev.authors, ...authors],
      }));
    } catch (error) {}
  };
  const getNewApiArticles = async () => {
    try {
      var url = "https://newsapi.org/v2/everything?" + "q=Apple&" + "sortBy=popularity&" + "apiKey=4879cb53518145099b220a86f4aa3f20";
      const res = await fetch(url);
      const data = await res.json();
      const sources = getSources(data);
      const authors = getAuthors(data?.articles, "author");
      const results = data?.articles?.map((item) => ({ ...item, source: item?.source?.name }));
      setState((prev) => ({
        ...prev,
        articles: [...prev.articles, ...results],
        sources: [...prev.sources, ...sources],
        authors: [...prev.authors, ...authors],
      }));
    } catch (error) {
      console.log("error in news api ", error);
    }
  };

  const getAuthors = (data, key) => {
    const authors = map(data, key).filter((article) => article !== null);
    return new Set([...authors]);
  };
  const getSources = (data) => {
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

  const handleAuthor = (e) => {
    const filteredResults = getFilteredArticles("author", e);
    setState((prev) => ({ ...prev, filteredArticles: [...selectedSourcesResults, ...filteredResults], selectedAuthorsResults: filteredResults }));
  };

  const handleSource = (e) => {
    const filteredResults = getFilteredArticles("source", e);
    setState((prev) => ({ ...prev, filteredArticles: [...selectedAuthorsResults, ...filteredResults], selectedSourcesResults: filteredResults }));
  };

  const getFilteredArticles = (key, options) => {
    const selectedOptions = options.map((item) => item?.value); // this just contains array of strings
    const filteredArticles = articles.filter((article) => selectedOptions.includes(article?.[key]));
    return filteredArticles;
  };

  const authorOptions = state.authors.map((item) => ({ value: item, label: item }));
  const sourcesOptions = state.sources.map((item) => ({ value: item, label: item }));

  return (
    <>
      <header>New Aggregator App</header>
      <Search />
      <div className="flex items-center flex-wrap justify-center  gap-4 my-4">
        <MultiSelect options={authorOptions} placeholder="Select Author" onChange={handleAuthor} />
        <MultiSelect options={sourcesOptions} placeholder="Select Sources" onChange={handleSource} />
      </div>
      <div className="flex items-center justify-between  gap-4 flex-wrap mt-10">
        {/* show filtered results */}
        {!isEmpty(filteredArticles) &&
          filteredArticles.map((article, index) => (
            <Fragment key={index}>{article?.title !== "[Removed]" && <NewsCard key={index} {...article} />}</Fragment>
          ))}

        {/* show all articles  */}
        {isEmpty(filteredArticles) &&
          state.articles?.map((article, index) => (
            <Fragment key={index}>{article?.title !== "[Removed]" && <NewsCard key={index} {...article} />}</Fragment>
          ))}
      </div>
    </>
  );
}

export default App;
