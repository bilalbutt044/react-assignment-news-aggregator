import { Fragment, useEffect, useState } from "react";
import "./App.css";
import Search from "./components/search";
import NewsCard from "./components/newsCard";
import isEmpty from "lodash/isEmpty";
import MultiSelect from "./components/multiselect";
import api from "./service/api";
import { getAuthors, getFilteredArticles, getSources } from "./utils";

function App() {
  const [state, setState] = useState({
    articles: [],
    filteredArticles: [], // this will contains filtered results
    selectedAuthorsResults: [], // this will contains selected authors articles only
    selectedSourcesResults: [], // this will contains selected seources articles only
    // categories: [], not getting categories in API response so not adding this filter
    sources: ["The New York Times", "The Guadian"],
    authors: [],
    isNytLoading: true,
    isGuardianLoading: true,
    isNewsApiloading: true,
  });

  const {
    filteredArticles,
    articles,
    sources,
    authors,
    selectedAuthorsResults,
    selectedSourcesResults,
    isGuardianLoading,
    isNewsApiloading,
    isNytLoading,
  } = state;

  useEffect(() => {
    getNewApiArticles();
    getGuadianArticles();
    getNewYourTimesArticles();
  }, []);

  const getNewYourTimesArticles = async () => {
    try {
      setState((prev) => ({ ...prev, isNytLoading: true }));
      const data = await api.getNewYourTimesArticles();

      // when rate limit exceeds , we get error here
      if (!data?.fault) {
        const results = data?.response?.docs?.map((item) => ({
          ...item,
          publishedAt: item?.pub_date,
          description: item?.lead_paragraph,
          author: item?.byline?.original,
          title: item?.headline?.main,
        }));
        const authors = getAuthors(data?.response?.docs, "byline.original");

        setState((prev) => ({
          ...prev,
          articles: [...prev.articles, ...results],
          authors: [...prev.authors, ...authors],
          isNytLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isNytLoading: false }));

      console.log(error);
    }
  };
  const getGuadianArticles = async () => {
    try {
      setState((prev) => ({ ...prev, isGuardianLoading: true }));

      const data = await api.getGuadianArticles();
      const results = data?.response?.results?.map((item) => ({
        ...item,
        source: "The Guadian",
        publishedAt: item?.webPublicationDate,
        author: item?.tags?.[0]?.webTitle,
        title: item?.webTitle,
      }));
      const authors = getAuthors(data?.response?.results, "tags.[0].webTitle");
      setState((prev) => ({
        ...prev,
        articles: [...prev.articles, ...results],
        authors: [...prev.authors, ...authors],
        isGuardianLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, isGuardianLoading: false }));
    }
  };
  const getNewApiArticles = async () => {
    try {
      setState((prev) => ({ ...prev, isNewsApiloading: true }));

      const data = await api.getNewApiArticles();
      setState((prev) => ({ ...prev, isNewsApiloading: false }));

      // get this error status when reached limit
      if (data?.status !== "error") {
        const sources = getSources(data);
        const authors = getAuthors(data?.articles, "author");
        const results = data?.articles?.map((item) => ({ ...item, source: item?.source?.name }));
        setState((prev) => ({
          ...prev,
          articles: [...prev.articles, ...results],
          sources: [...prev.sources, ...sources],
          authors: [...prev.authors, ...authors],
        }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isGuardianLoading: false }));

      console.log("error in news api ", error);
    }
  };

  const handleAuthor = (e) => {
    const filteredResults = getFilteredArticles("author", e, articles);
    setState((prev) => ({ ...prev, filteredArticles: [...selectedSourcesResults, ...filteredResults], selectedAuthorsResults: filteredResults }));
  };

  const handleSource = (e) => {
    const filteredResults = getFilteredArticles("source", e, articles);
    setState((prev) => ({ ...prev, filteredArticles: [...selectedAuthorsResults, ...filteredResults], selectedSourcesResults: filteredResults }));
  };

  const authorOptions = authors.map((item) => ({ value: item, label: item }));
  const sourcesOptions = sources.map((item) => ({ value: item, label: item }));

  const isLoading = isGuardianLoading || isNewsApiloading || isNytLoading;

  return (
    <>
      <header>New Aggregator App</header>
      <Search />
      <div className="flex items-center flex-wrap justify-center  gap-4 my-4">
        <MultiSelect options={authorOptions} placeholder="Select Author" onChange={handleAuthor} />
        <MultiSelect options={sourcesOptions} placeholder="Select Sources" onChange={handleSource} />
      </div>
      {isLoading && <p>Loading... </p>}

      <div className="flex items-center justify-between  gap-4 flex-wrap mt-10">
        {/* show filtered results */}
        {!isEmpty(filteredArticles) &&
          filteredArticles.map((article, index) => (
            <Fragment key={index}>{article?.title !== "[Removed]" && <NewsCard key={index} {...article} />}</Fragment>
          ))}

        {/* show all articles  */}
        {!isLoading &&
          isEmpty(filteredArticles) &&
          state.articles?.map((article, index) => (
            <Fragment key={index}>{article?.title !== "[Removed]" && <NewsCard key={index} {...article} />}</Fragment>
          ))}
      </div>
    </>
  );
}

export default App;
