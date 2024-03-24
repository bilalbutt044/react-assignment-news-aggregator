import { useState } from "react";
import { Link } from "react-router-dom";

const Search = ({ value = "" }) => {
  const [query, setQuery] = useState(value);
  return (
    <div className="flex flex-wrap justify-center mt-10 items-center mx-auto">
      <input
        className="shadow appearance-none border rounded w-full max-w-md mr-3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search article"
      />
      <Link to={`/search?q=${query}`}>
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</a>
      </Link>
    </div>
  );
};

export default Search;
