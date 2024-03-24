import dayjs from "dayjs";
import React from "react";

const NewsCard = (props) => {
  const { source, author, title, description, urlToImage, publishedAt } = props;
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md mx-auto">
      {/* <img className="w-full h-48 object-cover object-center" src={urlToImage} alt="News Image" /> */}
      <div className="p-6">
        <div className="text-gray-600 text-sm mb-2">Source: {source?.name || source}</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-700 leading-relaxed mb-4">{description}</p>
        <div className="flex items-center">
          <div>
            <p className="text-gray-900 font-semibold">{author}</p>
            <p className="text-gray-600 text-sm">Author</p>
          </div>
          <div className="ml-auto">
            <p className="text-gray-600 text-sm">Published on {dayjs(publishedAt).format("dddd-MM-YYYY")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
