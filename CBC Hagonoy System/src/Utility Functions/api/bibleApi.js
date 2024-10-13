// src/api.js
const API_KEY = 'abf727ec45b4b0b47990a7e49fcd2b8f'; // Your API.Bible key
const BIBLE_ID = 'de4e12af7f28f599-02'; // Replace this with your preferred Bible version ID
const BASE_URL = 'https://api.scripture.api.bible/v1/bibles';

// Fetch list of books from the API.Bible
export const fetchBooksFromAPI = async () => {
    try {
        const response = await fetch(`${BASE_URL}/${BIBLE_ID}/books`, {
            headers: {
                'api-key': API_KEY,
            },
        });
        const data = await response.json();
        return data.data; // List of books
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
};

// Fetch chapters for a selected book from the API.Bible
export const fetchChaptersFromAPI = async (bookId) => {
    try {
        const response = await fetch(`${BASE_URL}/${BIBLE_ID}/books/${bookId}/chapters`, {
            headers: {
                'api-key': API_KEY,
            },
        });
        const data = await response.json();
        return data.data; // List of chapters
    } catch (error) {
        console.error('Error fetching chapters:', error);
        return [];
    }
};

// Fetch verses for a selected chapter from the API.Bible
export const fetchVersesFromAPI = async (chapterId) => {
    try {
        const url = `${BASE_URL}/${BIBLE_ID}/chapters/${chapterId}/verses`;
        const response = await fetch(url, {
            headers: {
                'api-key': API_KEY,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorText}`);
        }

        const data = await response.json();
        return data.data || [];  // Verses are likely stored in `data.data`
    } catch (error) {
        console.error('Error fetching verses:', error.message);
        return [];
    }
};

// Use API.Bible daily verse feature (if available)
export const fetchDailyVerse = async () => {
    try {
        const response = await fetch(`${BASE_URL}/daily`, {
            headers: {
                'api-key': API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.data.content || 'No daily verse found';  // Assuming `content` field contains the verse text
    } catch (error) {
        console.error('Error fetching daily verse:', error.message);
        throw error;
    }
};

// Fetch specific verse content by ID
export const fetchVerseContent = async (verseId) => {
    try {
        const response = await fetch(`${BASE_URL}/${BIBLE_ID}/verses/${verseId}`, {
            headers: {
                'api-key': API_KEY,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data || 'No verse found';
    } catch (error) {
        console.error('Error fetching verse content:', error.message);
        throw error;
    }
};

const apiKey = import.meta.env.VITE_ESV_API_KEY; // ESV API Key

// Fetch entire book from ESV
export const fetchBookFromESV = async (book) => {
    const query = `${book}`;
    const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(query)}&include-passage-references=true&include-verse-numbers=true&include-first-verse-numbers=true`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Token ${apiKey}` },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch book from ESV API');
        }

        const data = await response.json();
        return data.passages ? data.passages[0] : 'No book passage found';
    } catch (error) {
        console.error('Error fetching book:', error.message);
        throw error;
    }
};

// Fetch specific chapter from ESV
export const fetchChapterFromESV = async (book, chapter) => {
    const query = `${book} ${chapter}`;
    const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(query)}&include-passage-references=true&include-verse-numbers=true&include-first-verse-numbers=true`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Token ${apiKey}` },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch chapter from ESV API');
        }

        const data = await response.json();
        return data.passages ? data.passages[0] : 'No chapter passage found';
    } catch (error) {
        console.error('Error fetching chapter:', error.message);
        throw error;
    }
};

// Fetch specific verse from ESV
export const fetchVerseFromESV = async (book, chapter, verse) => {
    const query = `${book} ${chapter}:${verse}`;
    const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(query)}&include-passage-references=true&include-verse-numbers=true&include-first-verse-numbers=true`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Token ${apiKey}` },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch verse from ESV API');
        }

        const data = await response.json();
        return data.passages ? data.passages[0] : 'No verse passage found';
    } catch (error) {
        console.error('Error fetching verse:', error.message);
        throw error;
    }
};
