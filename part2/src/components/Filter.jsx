import React from 'react';

const SearchFilter = ({ searchTerm, handleSearchTerm }) => (
  <div>
    filter shown with: <input value={searchTerm} onChange={handleSearchTerm} />
  </div>
);

export default SearchFilter;
