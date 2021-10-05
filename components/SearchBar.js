const SearchBar = () => (
    <form className="search" id="search-bar">
        <button className="icon" type='submit'><i className="fas fa-search"></i></button>
        <input placeholder="Search" spellCheck="false" type="search"/>
    </form>
)

export default SearchBar