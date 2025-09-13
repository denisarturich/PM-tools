import SearchBar from '../SearchBar';

export default function SearchBarExample() {
  return (
    <div className="p-4 space-y-4">
      <SearchBar 
        onSearch={(query) => console.log('Search query:', query)}
        placeholder="Поиск промптов..."
      />
    </div>
  );
}