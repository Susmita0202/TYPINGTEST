import React, { useState, useRef, useEffect } from 'react';
import './style.css';

const paragraph = "A plant is one of the most important living things that develop on the earth and is made up of stems, leaves, roots, and so on. Parts of Plants: The part of the plant that developed beneath the soil is referred to as root and the part that grows outside the soil is known as shoot. The shoot consists of stems, branches, leaves, fruits and flowers. Plants are made up of six main parts: roots, stems, leaves, flowers, fruits, and seeds.";

const TypingTest = () => {
    const maxTime = 60;
    const [timeLeft, setTimeLeft] = useState(maxTime);
    const [charIndex, setCharIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [WPM, setWPM] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [charStatus, setCharStatus] = useState(Array(paragraph.length).fill(""));

    const inputRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (isTyping && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isTyping]);

    useEffect(() => {
        if (timeLeft === 0) {
            setIsTyping(false);
        }
    }, [timeLeft]);

    const handleChange = (e) => {
        if (!isTyping) {
            setIsTyping(true);
        }

        const value = e.target.value;
        setInputValue(value);

        if (charIndex < paragraph.length && timeLeft > 0) {
            let newCharStatus = [...charStatus];

            if (value[value.length - 1] === paragraph[charIndex]) {
                newCharStatus[charIndex] = "correct";
            } else {
                newCharStatus[charIndex] = "wrong";
                setMistakes(prev => prev + 1);
            }

            setCharStatus(newCharStatus);
            setCharIndex(prev => prev + 1);

            if (charIndex === paragraph.length - 1) {
                setIsTyping(false);
            }
        }

        const wordsTyped = charIndex / 5;
        const minutesPassed = (maxTime - timeLeft) / 60;
        setWPM(minutesPassed > 0 ? Math.round(wordsTyped / minutesPassed) : 0);
    };

    const handleRestart = () => {
        setTimeLeft(maxTime);
        setCharIndex(0);
        setMistakes(0);
        setWPM(0);
        setInputValue("");
        setIsTyping(false);
        setCharStatus(Array(paragraph.length).fill(""));
        inputRef.current.focus();
    };

    return (
        <div className="container">
            <div className="test">
                <input
                    type="text"
                    className="input-field"
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleChange}
                />
                <div className="paragraph">
                    {paragraph.split('').map((char, index) => (
                        <span
                            key={index}
                            className={`char ${charStatus[index]} ${index === charIndex ? "active" : ""}`}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            </div>
            <div className="result">
                <p>Time Left: <strong>{timeLeft}s</strong></p>
                <p>Mistakes: <strong>{mistakes}</strong></p>
                <p>WPM: <strong>{WPM}</strong></p>
                <button className="btn" onClick={handleRestart}>Try Again</button>
            </div>
        </div>
    );
};

export default TypingTest;
