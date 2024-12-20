import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  // variables for input fields and results
  const [pdfFile, setPdfFile] = useState(null);
  const [bucketKey, setBucketKey] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [contributorId, setContributorId] = useState("");
  const [startCycle, setStartCycle] = useState("");
  const [endCycle, setEndCycle] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // get AWS API Gateway URL
  const baseUrl = process.env.AWS_BASE_URL;

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  // upload and compress PDF
  const uploadAndCompress = async () => {
    if (!pdfFile) {
      alert("Please select a PDF file.");
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64File = btoa(reader.result);
        const response = await axios.post(`${baseUrl}/upload/`, {
          filename: pdfFile.name,
          data: base64File,
        });

        alert("File uploaded!");
        console.log("Upload Response:", response.data);
      };
      reader.readAsBinaryString(pdfFile);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  // OCR and download results
  const ocrAndDownload = async () => {
    if (!bucketKey) {
      alert("Enter a bucket key.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/download`, {
        params: { bucketkey: bucketKey },
      });

      setResults(response.data); 
    } catch (error) {
      console.error("Error downloading results:", error);
    } finally {
      setLoading(false);
    }
  };

  // calculate contribution percentages
  const calculateContributions = async () => {
    if (!candidateId || !contributorId || !startCycle || !endCycle) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/compute/`, {
        params: { candidateId, contributorId, startCycle, endCycle },
      });

      // store results in state
      setResults(response.data);
    } catch (error) {
      console.error("Error calculating contributions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>ElecShenanigans</h1>
      <h3>An FEC Statement of Organization Tool</h3>

      {/* Upload and Compress */}
      <section>
        <h2>Upload and Compress PDF</h2>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button onClick={uploadAndCompress} disabled={loading}>
          {loading ? "Processing..." : "Upload and Compress"}
        </button>
      </section>

      {/* OCR and Download */}
      <section>
        <h2>OCR and Download Results</h2>
        <input
          type="text"
          placeholder="Bucket Key"
          value={bucketKey}
          onChange={(e) => setBucketKey(e.target.value)}
        />
        <button onClick={ocrAndDownload} disabled={loading}>
          {loading ? "Processing..." : "OCR and Download"}
        </button>
      </section>

      {/* Contribution Calculator */}
      <section>
        <h2>Contribution Calculator</h2>
        <input
          type="text"
          placeholder="Candidate ID"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Contributor ID"
          value={contributorId}
          onChange={(e) => setContributorId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Start Cycle"
          value={startCycle}
          onChange={(e) => setStartCycle(e.target.value)}
        />
        <input
          type="number"
          placeholder="End Cycle"
          value={endCycle}
          onChange={(e) => setEndCycle(e.target.value)}
        />
        <button onClick={calculateContributions} disabled={loading}>
          {loading ? "Processing..." : "Calculate Contributions"}
        </button>
      </section>

      {/* Results Section */}
      {results && (
        <section>
          <h2>Results</h2>
          <div className="results">
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </div>
        </section>
      )}
    </main>
  );
};

export default App;
