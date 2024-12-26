import React, { useState, useEffect, useRef } from "react";

const SpeechToText = ({ onTranscribe }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            const recognition =
                new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.continuous = true;
            recognition.interimResults = false; // Only finalized results
            recognition.lang = "en-US";

            recognition.onstart = () => {
                console.log("Speech recognition started...");
            };

            recognition.onresult = (event) => {
                const finalTranscript = Array.from(event.results)
                    .map((result) => result[0].transcript)
                    .join("");
                console.log("Final Transcript in SpeechToText:", finalTranscript);
                setTranscript(finalTranscript);
                if (onTranscribe) {
                    console.log("Calling onTranscribe with:", finalTranscript); // Log before calling parent
                    onTranscribe(finalTranscript); // Pass transcription to parent
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
            };

            recognition.onend = () => {
                console.log("Speech recognition stopped.");
                if (isListening) {
                    console.log("Restarting speech recognition...");
                    recognition.start(); // Restart for continuous input if still listening
                }
            };

            recognitionRef.current = recognition;
        } else {
            console.error("Speech recognition not supported in this browser.");
        }
    }, [onTranscribe, isListening]);

    const startListening = () => {
        if (recognitionRef.current) {
            setTranscript(""); // Clear previous transcription
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            setIsListening(false);
            recognitionRef.current.stop();
        }
    };

    return (
        <div>
            <button onClick={startListening} disabled={isListening}>
                {isListening ? "Listening..." : "Start Listening"}
            </button>
            <button onClick={stopListening} disabled={!isListening}>
                Stop Listening
            </button>
            <p>
                <strong>Transcript:</strong> {transcript}
            </p>
        </div>
    );
};

export default SpeechToText;
