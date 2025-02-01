import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useContext, useEffect, useState } from "react";
import { numberWithCommas } from "../helper";
import { getCoinSupply, getHalving } from '../kobrad-api-client';
import PriceContext from "./PriceContext";
import { apiAddress } from "../addresses";

const CBox = () => {
    const [circCoins, setCircCoins] = useState("-");
    const [blockReward, setBlockReward] = useState("-");
    const [halvingDate, setHalvingDate] = useState("-");
    const [halvingAmount, setHalvingAmount] = useState("-");
    const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const initBox = async () => {
        const coinSupplyResp = await getCoinSupply();
        getBlockReward();

        getHalving().then((d) => {
            setHalvingDate(moment(d.nextHalvingTimestamp * 1000).format("YYYY-MM-DD HH:mm"));
            setHalvingAmount((d.nextHalvingAmount * 0.98).toFixed(2));
            startCountdown(d.nextHalvingTimestamp * 1000); // Start countdown
        });

        setCircCoins(Math.round(coinSupplyResp.circulatingSupply / 100000000));
    };

    const startCountdown = (halvingTimestamp) => {
        const updateCountdown = setInterval(() => {
            const now = new Date().getTime();
            const distance = halvingTimestamp - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(updateCountdown);
                setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeRemaining({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(updateCountdown);
    };

    useEffect(() => {
        initBox();

        const updateCircCoins = setInterval(async () => {
            const coinSupplyResp = await getCoinSupply();
            setCircCoins(Math.round(coinSupplyResp.circulatingSupply / 100000000));
        }, 10000);

        return () => {
            clearInterval(updateCircCoins);
        };
    }, []);

    async function getBlockReward() {
        await fetch(`https://api.k0bradag.com/info/blockreward`)
            .then((response) => response.json())
            .then(d => {
                setBlockReward((d.blockreward * 0.98).toFixed(2));
            })
            .catch(err => console.log("Error", err));
    }

    useEffect(() => {
        document.getElementById('coins').animate([
            { opacity: '1' },
            { opacity: '0.6' },
            { opacity: '1' },
        ], {
            duration: 300
        });
    }, [circCoins]);

    return (
        <>
            <div className="cardBox mx-0">
                <table style={{ fontSize: "1rem" }}>
                    <tr>
                        <td colspan='2' className="text-center" style={{ "fontSize": "4rem" }}>
                            <FontAwesomeIcon icon={faCoins} />
                            <div id="light1" className="cardLight" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" className="text-center">
                            <h3>Coin supply</h3>
                        </td>
                    </tr>
                    <tr>
                        <td className="cardBoxElement align-top">Total</td>
                        <td className="">
                            <div id="coins">{numberWithCommas(circCoins)} KODA</div>
                        </td>
                    </tr>
                    <tr>
                        <td className="cardBoxElement align-top">Max <span className="approx">(approx.)</span></td>
                        <td className="pt-1">500,000,000 KODA</td>
                    </tr>
                    <tr>
                        <td className="cardBoxElement align-top">Mined</td>
                        <td className="pt-1">{(circCoins / 500000000 * 100).toFixed(2)} %</td>
                    </tr>
                    <tr>
                        <td className="cardBoxElement align-top">Block reward</td>
                        <td className="pt-1">{blockReward} KODA</td>
                    </tr>
                    <tr>
                        <td className="cardBoxElement align-top">Reward reduction</td>
                        <td className="pt-1">
                            {halvingDate}
                            <br />
                            <div className="text-end w-100 pe-3 pt-1" style={{ fontSize: "small" }}>
                                to {halvingAmount} KODA
                            </div>
                            {/* Countdown Timer */}
                            <div className="text-end w-100 pe-3 pt-1" style={{ fontSize: "small" }}>
                                <div>{timeRemaining.days} D, {timeRemaining.hours} H, {timeRemaining.minutes} M, {timeRemaining.seconds} S</div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </>
    );
};

export default CBox;
