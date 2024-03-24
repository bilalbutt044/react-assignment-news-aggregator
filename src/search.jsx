import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAuthors, getDateWithoutDashes, getFilteredArticles, getSources } from "./utils";
import { isEmpty } from "lodash";
import NewsCard from "./components/newsCard";
import Search from "./components/search";
import MultiSelect from "./components/multiselect";
import ReactDatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";

const SearchPage = (props) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [state, setState] = useState({
    articles: [],
    filteredArticles: [], // this will contains filtered results
    selectedSourcesResults: [], // this will contains selected seources articles only
    // categories: [], not getting categories in API response so not adding this filter
    sources: [],
    startDate: null,
    endDate: null,
  });

  const { filteredArticles, articles, sources, startDate, endDate, selectedSourcesResults } = state;

  useEffect(() => {
    getNewApiArticles();
    getGuadianArticles();
    getNewYourTimesArticles();
  }, [startDate, endDate]);

  const getNewYourTimesArticles = async () => {
    try {
      const beginDate = getDateWithoutDashes(startDate);
      const toDate = getDateWithoutDashes(endDate);
      var url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}${startDate ? `&begin_date=${beginDate}` : ""}${
        endDate ? `&end_date=${toDate}` : ""
      }&api-key=czEGGWR42TG7mCBbTscLGBgAO3TKeKCJ`;
      const res = await fetch(url);
      const data = await res.json();
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
  };
  const getGuadianArticles = async () => {
    try {
      var url = `https://content.guardianapis.com/search?q=${query}${startDate ? `&from-date=${startDate}` : ""}${
        endDate ? `&to-date=${endDate}` : ""
      }&show-tags=contributor&api-key=18e0677c-4348-4c45-a357-a29a2eb04911`;
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

      if (!startDate && !endDate)
        return setState((prev) => ({
          ...prev,
          articles: [...prev.articles, ...results],
          sources: [...prev.sources, "The Guadian"],
        }));

      setState((prev) => ({
        ...prev,
        articles: [...results],
        sources: [...prev.sources, "The Guadian"],
      }));
    } catch (error) {}
  };
  const getNewApiArticles = async () => {
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
      const sources = getSources(data);
      const authors = getAuthors(data?.articles, "author");
      const results = data?.articles?.map((item) => ({ ...item, source: item?.source?.name }));
      if (!startDate && !endDate)
        return setState((prev) => ({
          ...prev,
          articles: [...prev.articles, ...results],
          sources: [...prev.sources, ...sources],
        }));

      setState((prev) => ({
        ...prev,
        articles: [...results],
        sources: [...prev.sources, ...sources],
      }));
    } catch (error) {
      console.log("error in news api ", error);
    }
  };

  const handleSource = (e) => {
    const filteredResults = getFilteredArticles("source", e, articles);
    setState((prev) => ({ ...prev, filteredArticles: [...filteredResults], selectedSourcesResults: filteredResults }));
  };

  const handleDate = (key) => (e) => {
    const date = dayjs(e).format("YYYY-MM-DD");
    setState((prev) => ({ ...prev, [key]: date }));
  };

  const sourcesOptions = state.sources.map((item) => ({ value: item, label: item }));

  return (
    <>
      <header>New Aggregator App</header>
      <Search value={query} />
      <div className="flex items-center flex-wrap justify-center  gap-4 my-4">
        <MultiSelect options={sourcesOptions} placeholder="Select Sources" onChange={handleSource} />
        <div className=" border py-2 px-3">
          <ReactDatePicker
            placeholderText="Start Date:"
            onChange={handleDate("startDate")}
            value={startDate}
            maxDate={new Date()}
            minDate={dayjs().subtract(2, "years").toDate()}
          />
        </div>
        <div className=" border py-2 px-3">
          <ReactDatePicker
            placeholderText="End Date:"
            onChange={handleDate("endDate")}
            value={endDate}
            disabled={!startDate}
            maxDate={new Date()}
            minDate={new Date(startDate)}
          />
        </div>
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
};

export default SearchPage;
