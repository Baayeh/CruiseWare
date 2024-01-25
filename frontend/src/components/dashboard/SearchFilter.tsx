/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { useSearch } from '../../hooks';

interface SearchFilterProps {
  title: string;
  url: string;
  dispatchAction: ActionCreatorWithPayload<any, string>;
  resetMethod: () => Promise<void>;
}

/**
 * Renders a search filter component.
 *
 * @param {SearchFilterProps} title - The title of the filter.
 * @param {function} setQuery - The function to set the search query.
 * @return {JSX.Element} A section containing a search bar for filtering.
 */
const SearchFilter: React.FC<SearchFilterProps> = ({
  title,
  resetMethod,
  dispatchAction,
  url,
}) => {
  const searchRef = useRef<HTMLInputElement | any>();
  const { fetchData, loading, error } = useSearch(dispatchAction);

  useEffect(() => {
    if (searchRef) {
      fromEvent(searchRef?.current, 'keyup')
        .pipe(
          map((event: any) => (event.target as HTMLInputElement)?.value),
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value) => {
          const newUrl = `${url}?search=${value}`;
          fetchData(newUrl);
        });
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="search-bar sm:w-[14rem] lg:w-[20rem] relative">
      <div>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            )}
          </div>
          <input
            type="search"
            ref={searchRef}
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={`Search ${title}`}
            aria-label={`Search ${title}`}
          />
          <button
            type="button"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => {
              resetMethod();
              searchRef.current.value = '';
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
export default SearchFilter;
