// src/utils/api.jsx

import axios from 'axios';

// Helper function to fetch book details
const fetchBookDetails = async (title) => {
    try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(title)}`);
        const book = response.data.docs[0];
        return {
            ratings_average: book.rating || 'N/A'
        };
    } catch (error) {
        console.error(`Error fetching book details for title "${title}":`, error);
        return { ratings_average: 'N/A' };
    }
};

// Helper function to fetch author details
const fetchAuthorDetails = async (authorName) => {
    try {
        const response = await axios.get(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)}`);
        const author = response.data.docs[0];
        return {
            author_birth_date: author.birth_date || 'N/A',
            author_top_work: author.top_work || 'N/A'
        };
    } catch (error) {
        console.error(`Error fetching author details for author "${authorName}":`, error);
        return { author_birth_date: 'N/A', author_top_work: 'N/A' };
    }
};

export const fetchBooks = async (limit = 50) => {
    const response = await axios.get(`https://openlibrary.org/subjects/science_fiction.json?limit=50`);
    const books = response.data.works;

    // Fetch additional details for each book
    const booksWithDetails = await Promise.all(books.map(async (book) => {
        // const bookDetails = await fetchBookDetails(book.title);
        // const authorDetails = await fetchAuthorDetails(book.authors[0]?.name || 'Unknown');
        return {
            title: book.title,
            author_name: book.authors[0]?.name || 'Unknown',
            first_publish_year: book.first_publish_year || 'N/A',
            subject: book.subject ? book.subject.join(', ') : 'N/A',
            ratings_average: 'N/A',
            author_birth_date: 'N/A',
            author_top_work: 'N/A'
        };
    }));

    return booksWithDetails;
};
