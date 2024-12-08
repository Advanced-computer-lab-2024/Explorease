import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const CurrencyContext = createContext();

// Provider component
export const CurrencyProvider = ({ children }) => {
    const [selectedCurrency, setSelectedCurrency] = useState('USD'); // Default currency
    const [exchangeRates, setExchangeRates] = useState({}); // To store exchange rates
    const [availableCurrencies, setAvailableCurrencies] = useState([]); // List of currencies

    const YOUR_API_KEY = "6a52872f2fdad94794ee0bca";

    // Fetch exchange rates and available currencies
    const updateExchangeRates = async () => {
        try {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${YOUR_API_KEY}/latest/USD`);
            const data = await response.json();
            setExchangeRates(data.conversion_rates);
            setAvailableCurrencies(Object.keys(data.conversion_rates)); // Extract available currencies
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    };

    
    useEffect(() => {
        updateExchangeRates(); // Fetch data when the provider is mounted
    }, []);

    return (
        <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency, exchangeRates, availableCurrencies }}>
            {children}
        </CurrencyContext.Provider>
    );
};
