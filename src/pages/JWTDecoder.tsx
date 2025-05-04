import React, {ChangeEvent, useEffect, useState} from "react";
import {jwtDecode, JwtPayload} from "jwt-decode";
import styles from './jwt-decoder.module.css'

export default function JWTDecoder() {
    const [token, setToken] = useState(defaultToken);
    const [decoded, setDecoded] = useState<JwtPayload>();
    const [error, setError] = useState("");

    const handleDecode = (inputToken = token) => {
        try {
            const decodedToken = jwtDecode(inputToken) as JwtPayload;

            // Check expiration if present
            if (decodedToken.exp) {
                const currentTime = Date.now() / 1000; // seconds
                if (decodedToken.exp < currentTime) {
                    setError("⚠️ Token has expired.");
                    setDecoded(decodedToken);
                    return;
                }
            }

            setDecoded(decodedToken);
            setError("");
        } catch (e) {
            setError("❌ Invalid JWT token");
            setDecoded(undefined);
        }
    };
    useEffect(() => {
        handleDecode(token);
    }, [handleDecode])
    const handlePaste = (e: any) => {
        setToken(e.target.value)
        // const pasted = e.clipboardData.getData("Text");
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>JWT Decoder</h2>

            <div className={styles.jwtDecoderContainer}>
                <div className={styles.encodedContainer}>

                    <h3 className={styles.heading}>Decoded Token:</h3>
                    <textarea
                        className={styles.textareaFull}
                        placeholder="Paste your JWT token here..."
                        value={token}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handlePaste(e)}
                    />

                    {/*<button*/}
                    {/*    className={styles.decodeButton}*/}
                    {/*    onClick={() => handleDecode()}*/}
                    {/*>*/}
                    {/*    Decode*/}
                    {/*</button>*/}

                </div>
                <div>
                    <h3 className={styles.heading}>Decoded Token:</h3>
                    {decoded && (
                        <div className={styles.decodedContainer}>
                        <pre className={styles.preformatted}>
            {JSON.stringify(decoded, null, 2)}
          </pre>
                        </div>
                    )}
                </div>

            </div>
            <div className={styles.error}>
                {error && <p className={styles.textRed500}>{error}</p>}
            </div>
        </div>

    );
}

const defaultToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"