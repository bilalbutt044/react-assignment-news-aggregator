import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getFilteredArticles, getSources } from "./utils";
import isEmpty from "lodash/isEmpty";
import NewsCard from "./components/newsCard";
import Search from "./components/search";
import MultiSelect from "./components/multiselect";
import ReactDatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import api from "./service/api";

const SearchPage = (props) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [state, setState] = useState({
    articles: [],
    filteredArticles: [], // this will contains filtered results
    selectedSourcesResults: [], // this will contains selected seources articles only
    // categories: [], not getting categories in API response so not adding this filter
    sources: ["New Your TImes", "The Guadian"],
    startDate: null,
    endDate: null,
    isNytLoading: true,
    isGuardianLoading: true,
    isNewsApiloading: true,
  });

  const { filteredArticles, articles, sources, startDate, endDate, isGuardianLoading, isNewsApiloading, isNytLoading } = state;

  useEffect(() => {
    getNewApiArticles();
    getGuadianArticles();
    getNewYourTimesArticles();

    // resetting this state, when query change or date changes
    setState((prev) => ({ ...prev, articles: [] }));
  }, [startDate, endDate, query]);

  const getNewYourTimesArticles = async () => {
    try {
      setState((prev) => ({ ...prev, isNytLoading: true }));
      const data = await api.getNewYourTimesArticles({ startDate, endDate, query });
      setState((prev) => ({ ...prev, isNytLoading: false }));

      // when rate limit exceeds , we get error here
      if (!data?.fault) {
        const results = data?.response?.docs?.map((item) => ({
          ...item,
          publishedAt: item?.pub_date,
          description: item?.lead_paragraph,
          author: item?.byline?.original,
          title: item?.headline?.main,
        }));

        handleState({ results });
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isNytLoading: false }));
      console.log("error in new york times api", error);
    }
  };
  const getGuadianArticles = async () => {
    try {
      setState((prev) => ({ ...prev, isGuardianLoading: true }));
      const data = await api.getGuadianArticles({ startDate, endDate, query });
      setState((prev) => ({ ...prev, isGuardianLoading: false }));

      const results = data?.response?.results?.map((item) => ({
        ...item,
        source: "The Guadian",
        publishedAt: item?.webPublicationDate,
        author: item?.tags?.[0]?.webTitle,
        title: item?.webTitle,
      }));

      handleState({ results });
    } catch (error) {
      setState((prev) => ({ ...prev, isGuardianLoading: false }));
    }
  };
  const getNewApiArticles = async () => {
    try {
      setState((prev) => ({ ...prev, isNewsApiloading: true }));

      const data = await api.getNewApiArticles({ startDate, endDate, query });
      setState((prev) => ({ ...prev, isNewsApiloading: false }));

      const sources = getSources(data);
      const results = data?.articles?.map((item) => ({ ...item, source: item?.source?.name }));
      handleState({ results, sources });
    } catch (error) {
      setState((prev) => ({ ...prev, isNewsApiloading: false }));
      console.log("error in news api ", error);
    }
  };

  // sources array is coming only from getNewsArticle function
  const handleState = ({ results, sources = [] }) => {
    setState((prev) => ({
      ...prev,
      articles: [...results, ...prev.articles],
      sources: [...prev.sources, ...sources],
    }));
  };
  const handleSource = (e) => {
    const filteredResults = getFilteredArticles("source", e, articles);
    setState((prev) => ({ ...prev, filteredArticles: [...filteredResults], selectedSourcesResults: filteredResults }));
  };

  const handleDate = (key) => (e) => {
    const date = dayjs(e).format("YYYY-MM-DD");
    setState((prev) => ({ ...prev, [key]: date }));
  };

  // resetting article state on new search
  const handleSearch = () => setState((prev) => ({ ...prev }));

  const sourcesOptions = state.sources.map((item) => ({ value: item, label: item }));
  const isLoading = isGuardianLoading || isNewsApiloading || isNytLoading;

  return (
    <>
      <header>New Aggregator App</header>
      <Search value={query} handleSearch={handleSearch} />
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

        {!isLoading && isEmpty(articles) && <p>No record found</p>}
      </div>
    </>
  );
};

export default SearchPage;
