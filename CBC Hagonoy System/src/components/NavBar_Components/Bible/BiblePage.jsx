// src/components/BiblePage.js
import { useState, useEffect } from 'react';
import {
  fetchBooksFromAPI,
  fetchChaptersFromAPI,
  fetchVerseFromESV,
  fetchChapterFromESV
} from '../../../Utility Functions/api/bibleApi'; // Adjust the import path as necessary
import './bible_page.css'; // Import the CSS file

const BiblePage = () => {
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedBook, setSelectedBook] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState('');
  const [fullPassage, setFullPassage] = useState('');
  const [highlightedVerse, setHighlightedVerse] = useState('');

  useEffect(() => {
    const loadBooks = async () => {
      const booksData = await fetchBooksFromAPI();
      setBooks(booksData);
    };
    loadBooks();
  }, []);

  useEffect(() => {
    const loadPassage = async () => {
      if (selectedBook && selectedChapter) {
        // Fetch full chapter
        const chapterData = await fetchChapterFromESV(selectedBook, selectedChapter);
        const formattedText = formatChapterText(chapterData || 'No chapter passage found');
        setFullPassage(formattedText);
  
        // Fetch specific verse if selected
        if (selectedVerse) {
          const verseData = await fetchVerseFromESV(selectedBook, selectedChapter, selectedVerse);
          setHighlightedVerse(verseData || 'No verse passage found');
        } else {
          setHighlightedVerse('');
        }
      }
    };
    loadPassage();
  }, [selectedBook, selectedChapter, selectedVerse]);
  

  useEffect(() => {
    const loadChapters = async () => {
      const book = books.find(book => book.name === selectedBook);
      if (book) {
        const chaptersData = await fetchChaptersFromAPI(book.id);
        setChapters(chaptersData);
      }
    };
    loadChapters();
  }, [selectedBook, books]);

  const formatChapterText = (text) => {
    // Simple formatting assuming each verse is separated by a new line
    const verses = text.split('\n').filter(line => line.trim() !== '');
    return verses.map((verse, index) => (
      `<p key=${index}>${verse}</p>`
    )).join('');
  };

  const handleBookChange = (event) => {
    setSelectedBook(event.target.value);
  };

  const handleChapterChange = (event) => {
    setSelectedChapter(Number(event.target.value));
  };

  const handleVerseChange = (event) => {
    setSelectedVerse(event.target.value);
  };

  const handleGoToVerse = () => {
    if (selectedBook && selectedChapter && selectedVerse) {
      fetchVerseFromESV(selectedBook, selectedChapter, selectedVerse)
        .then(verseData => setHighlightedVerse(verseData || 'No verse passage found'))
        .catch(error => console.error('Error fetching verse:', error));
    }
  };

  const navigateChapter = (direction) => {
    setSelectedChapter(prevChapter => Math.max(1, prevChapter + direction));
  };

  const navigateBook = (direction) => {
    const currentIndex = books.findIndex(book => book.name === selectedBook);
    const newIndex = Math.max(0, Math.min(books.length - 1, currentIndex + direction));
    setSelectedBook(books[newIndex]?.name || 'Genesis');
  };

  return (
    <div className="container_bible">
      <div className="controls">
        <div className="container_book">
            <label>
            Book:
            <select value={selectedBook} onChange={handleBookChange}>
                {books.map(book => (
                <option key={book.id} value={book.name}>{book.name}</option>
                ))}
            </select>
            <div className="buttons_book">
                <button onClick={() => navigateBook(-1)}>Previous Book</button>
                <button onClick={() => navigateBook(1)}>Next Book</button>
            </div>
            </label>
        </div>
        <div className="container_chapter">
            <label>
                Chapter:
                <input type="number" value={selectedChapter} onChange={handleChapterChange} />
                <div className="buttons_chapter">
                    <button onClick={() => navigateChapter(-1)}>Previous Chapter</button>
                    <button onClick={() => navigateChapter(1)}>Next Chapter</button>
                </div>
            </label>
        </div>
        <div className="container_verse">
            <label>
                Verse:
                <input type="number" value={selectedVerse} onChange={handleVerseChange} />
                <div className="buttons_verse">
                    <button className='verse_button' onClick={handleGoToVerse}>Go to Verse</button>
                </div>
            </label>
        </div> 
      </div>
      <div className="verse-section">
        {highlightedVerse && (
          <div>
            <h3>Highlighted Verse</h3>
            <p>{highlightedVerse}</p>
          </div>
        )}
      </div>
      <div className="header">
        <h1>{selectedBook}</h1>
        <h2>Chapter {selectedChapter}</h2>
      </div>
      <div className="chapter-content">
        <h3 className='chapter_content_text'>Chapter Content</h3>
        <div dangerouslySetInnerHTML={{ __html: fullPassage }} />
      </div>
    </div>
  );
};

export default BiblePage;
