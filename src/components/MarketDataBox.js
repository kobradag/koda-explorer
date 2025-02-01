import { useEffect, useState } from "react";
import { HiCurrencyDollar } from 'react-icons/hi';
import { numberWithCommas } from "../helper";

const MarketDataBox = () => {
    const [price, setPrice] = useState("-");
    const [marketCap, setMarketCap] = useState("-");
    const [volume, setVolume] = useState("-");
    const [priceChange, setPriceChange] = useState("-"); // Price change state

    const fetchMarketData = async () => {
        try {
            // Fetch market list data from the API
            const response = await fetch("https://api.xeggex.com/api/v2/market/getlist");
            const markets = await response.json();

            // Find the KODA/USDT market data
            const kodaMarket = markets.find(market => market.symbol === "KODA/USDT");

            if (kodaMarket) {
                const lastPrice = parseFloat(kodaMarket.lastPrice || "0");
                const yesterdayPrice = parseFloat(kodaMarket.yesterdayPrice || "0");
                const circSupply = parseFloat(kodaMarket.primaryCirculation || "0");
                const volumeData = parseFloat(kodaMarket.volumeUsdNumber || "0"); // Extract volume in USD

                setPrice(lastPrice.toFixed(6));

                // Calculate Market Cap
                if (lastPrice > 0 && circSupply > 0) {
                    setMarketCap((lastPrice * circSupply).toFixed(2));
                }

                // Update volume
                setVolume(volumeData.toFixed(2));

                // Calculate 24-hour price change percentage
                if (yesterdayPrice > 0) {
                    const changePercent = ((lastPrice - yesterdayPrice) / yesterdayPrice) * 100;
                    setPriceChange(changePercent.toFixed(2));
                }
            } else {
                console.error("Market KODA/USDT not found.");
            }
        } catch (error) {
            console.error("Error fetching market data:", error);
        }
    };

    useEffect(() => {
        // Fetch initial data
        fetchMarketData();

        // Set interval to refresh data every 10 seconds
        const interval = setInterval(() => {
            fetchMarketData();
        }, 10000); // Update every 10 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Determine color for price change
    const priceChangeColor = parseFloat(priceChange) > 0 ? "green" : parseFloat(priceChange) < 0 ? "red" : "black";

    return (
        <div className="cardBox mx-0">
            <table>
                <tbody>
                    <tr>
                        <td colSpan="2" className="text-center" style={{ fontSize: "3.8rem" }}>
                            <HiCurrencyDollar style={{ transform: "translateY(-10px)" }} />
                            <div id="light1" className="cardLight" />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2" className="text-center">
                            <h3>Market Data</h3>
                        </td>
                    </tr>
                    <tr>
                        <td className="cardBoxElement">Price</td>
                        <td>$ {price} / KODA</td>
                    </tr>
                    <tr>
                        <td className="cardBoxElement">Market Cap</td>
                        <td>$ {numberWithCommas(marketCap)}</td>
                    </tr>
                    <tr>
                        <td className="cardBoxElement">Volume 24h</td>
                        <td>$ {numberWithCommas(volume)}</td>
                    </tr>
                    <tr>
                        <td className="cardBoxElement">Price Change 24h</td>
                        <td style={{ color: priceChangeColor }}>{priceChange}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MarketDataBox;
