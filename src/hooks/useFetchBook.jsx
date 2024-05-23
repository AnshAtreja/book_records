// src/hooks/useFetchBooks.js

import { useState, useEffect } from 'react';
import { fetchBooks } from '../utils/api';

const useFetchBooks = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const books = await fetchBooks();
                setData(books);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };
        getData();
    }, []);

    return { data, loading };
};

export default useFetchBooks;
