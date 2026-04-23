import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post('http://localhost:5000/scan', formData);
    setResult(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>CodeFortify Scanner</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Scan</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
