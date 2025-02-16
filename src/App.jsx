import { useState, useEffect } from 'react'
import './App.css'
import Search from './components/Search'
import Loading from './components/Loading';
import MovieCard from './components/movieCard';
import { useDebounce } from "react-use"
import { getTrandingMovies, updateSearchCount } from './appwrite';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = import.meta.env.VITE_TMDB_API_BASE_URI;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [searchTerm, setsearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');

  //Debounce the search term to prevent making too many requests
  //By waiting for the user to stop typing for 500ms
  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm])
  
  const fetchMovies = async(query = '') => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      
      if(!response.ok) {
        throw new Error("Failed to Fetch Movie");
      }

      const data = await response.json();

      if(data.response == 'false') {
        setErrorMsg(data.error || 'Failed to Fetch Movies')
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      if(query && data.results.length>0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch(error) {
      console.log(`Error fetching Movies: ${error}`);
      setErrorMsg('Error Fetching Movies. Please see the console for details.')
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async() => {
    try {
      const movies = await getTrandingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(`Error fetching Movies: ${error}`);
    }
  }

  useEffect(()=> {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm])

  useEffect(()=> {
    loadTrendingMovies();
  }, [])

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src='/hero.png' alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You will enjoy without hassle!</h1>
        <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
        </header>

        {trendingMovies.length>0 && (
          <section className="trending mt-10">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index+1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies mt-10'>
          <h2>All Movies</h2>

          {isLoading ? (
            <Loading />
          ) : errorMsg ? (
            <p className="text-red-500">{errorMsg}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
