function Search({searchTerm, setsearchTerm}) {
    return (
        <div className="search">
            <div>
                <img src="/search.svg" alt="search" />
                <input type="text" placeholder="Search through thousands of movies" value={searchTerm} onChange={(event)=>setsearchTerm(event.target.value)} />
            </div>
        </div>
    )
}

export default Search;