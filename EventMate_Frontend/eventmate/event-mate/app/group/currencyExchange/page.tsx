'use client'
import { useState, useEffect } from 'react';

const CurrencyConverter = () => {
    const [rates, setRates] = useState<{ [key: string]: number }>({});
    const [fromCurrency, setFromCurrency] = useState<string>('USD');
    const [toCurrency, setToCurrency] = useState<string>('VND');
    const [amount, setAmount] = useState<number>(1);
    const [convertedAmount, setConvertedAmount] = useState<number>(0);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=1c3e65a2e1c14ec0befe72aa667451f3`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json(); // Correctly parse the JSON response
                if (data && data.rates) {
                    setRates(data.rates);
                }
            } catch (error) {
                console.error('Error fetching currency rates:', error);
            }
        };

        fetchRates();
    }, []);

    const handleConvert = () => {
        let converted = 0;
        if (fromCurrency === 'USD') {
            converted = amount * rates[toCurrency]; // Convert from USD to target currency
        } else if (toCurrency === 'USD') {
            converted = amount / rates[fromCurrency]; // Convert from source currency to USD
        } else {
            const rateFrom = rates[fromCurrency];
            const rateTo = rates[toCurrency];
            converted = (amount / rateFrom) * rateTo; // Convert from source to target currency
        }
        setConvertedAmount(converted);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Currency Converter</h2>
            <div className="flex gap-4 mb-4">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="border border-gray-300 rounded-md p-2"
                />
                <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                >
                    <option value="USD">USD</option>
                    <option value="VND">VND</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                </select>
                <span className="self-center">to</span>
                <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                >
                    <option value="USD">USD</option>
                    <option value="VND">VND</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                </select>
            </div>
            <button
                onClick={handleConvert}
                className="bg-blue-500 text-white rounded-md px-4 py-2"
            >
                Convert
            </button>
            {convertedAmount > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold">Converted Amount:</h3>
                    <p>{convertedAmount.toFixed(2)} {toCurrency}</p>
                </div>
            )}
        </div>
    );
};

export default CurrencyConverter; 