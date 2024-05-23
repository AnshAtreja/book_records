import axios from 'axios';

// Helper function to fetch book details
const fetchBookDetails = async (title) => {
    try {
         console.log("Fetching books ... ")
        const response = await axios.get(`/search.json?q=${encodeURIComponent(title)}`);
         console.log("Fetched Book ... ")
        const book = response.data.docs[0];
        return {
            ratings_average: book.ratings_average || 'N/A'
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
        console.log(`Calling for https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)}`)
        const docs = response.data.docs;

        let birthDate = 'N/A';
        let topWork = 'N/A';

        for (let doc of docs) {
            if (doc.birth_date) {
                birthDate = doc.birth_date;
                break; 
            }
        }

        for (let doc of docs) {
            if (doc.top_work) {
                topWork = doc.top_work;
                break; 
            }
        }

        return {
            author_birth_date: birthDate,
            author_top_work: topWork
        };
    } catch (error) {
        console.error(`Error fetching author details for author "${authorName}":`, error);
        return { author_birth_date: 'N/A', author_top_work: 'N/A' };
    }
};

export const fetchBooks = async (limit = 50) => {
    const response = await axios.get(`/subjects/science_fiction.json?limit=${limit}`);
    const books = response.data.works;

    // Fetch additional details for each book
    const booksWithDetails = await Promise.all(books.map(async (book) => {
        const bookDetails = await fetchBookDetails(book.title);
        const authorDetails = await fetchAuthorDetails(book.authors[0]?.name || 'Unknown');
        return {
            title: book.title,
            author_name: book.authors[0]?.name || 'Unknown',
            first_publish_year: book.first_publish_year || 'N/A',
            subject: book.subject ? book.subject.join(', ') : 'N/A',
            ratings_average: bookDetails.ratings_average || 'N/A',
            author_birth_date: authorDetails.author_birth_date || 'N/A',
            author_top_work: authorDetails.author_top_work || 'N/A'
        };
    }));

    return booksWithDetails;
};
