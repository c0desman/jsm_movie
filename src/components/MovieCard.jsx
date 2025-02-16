const MovieCard = ({movie: {id, title, vote_average, poster_path, release_date, original_language}}) => {
  return (
    <div>
        <div className="movie-card">
            <img src={poster_path? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png' } alt={title}/>
            <div className="mt-4">
                <h3 className="text-left">{title}</h3>
                <div className="content text-white">
                    <div className="rating">
                        <img src="/star.svg" alt="Review Star" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
                    <span>•</span>
                    <p className="lang">{original_language ? original_language.charAt(0).toUpperCase() + original_language.slice(1) : "N/A"}</p>
                    <span>•</span>
                    <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MovieCard