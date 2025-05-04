import React, {useState} from "react";
import  {jwtDecode, JwtPayload} from "jwt-decode";
import styles  from './jwt-decoder.module.less'

export default function JWTDecoder() {
    const [token, setToken] = useState("");
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

    const handlePaste = (e: any) => {
        const pasted = e.clipboardData.getData("Text");
        setToken(pasted);
        setTimeout(() => handleDecode(pasted), 100); // slight delay to wait for state update
    };

    return (
        <div style={{display: "flex", flexDirection: "row", gap: "1rem"}}>
            <div className={styles.test}>
                <h2 className="text-xl font-bold">JWT Decoder</h2>

                <textarea
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="Paste your JWT token here..."
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    onPaste={handlePaste}
                />

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleDecode()}
                >
                    Decode
                </button>

                {error && <p className="text-red-500">{error}</p>}
            </div>
            <div>
                {decoded && (
                    <div className="mt-4 bg-gray-100 p-3 rounded">
                        <h3 className="font-semibold">Decoded Token:</h3>
                        <pre className="text-sm overflow-auto">
            {JSON.stringify(decoded, null, 2)}
          </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
