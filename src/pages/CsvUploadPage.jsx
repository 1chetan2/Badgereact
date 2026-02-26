// import { useState } from "react";
// import axios from "axios";

// export default function CsvUploadPage() {
//   const [file, setFile] = useState(null);
//   const [previewData, setPreviewData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [jobId, setJobId] = useState(null);
//   const [mapping, setMapping] = useState({});

//   const token = localStorage.getItem("token");

//   // Must match backend Badge model
//   const badgeFields = ["Title", "Subtitle", "BgColor", "TextColor"];

//   // ---------------- UPLOAD ----------------
//   const handleUpload = async () => {
//     if (!file) {
//       alert("Select CSV file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("templateId", 1);

//     try {
//       const uploadRes = await axios.post(
//         "https://localhost:7016/api/csv/upload",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const newJobId = uploadRes.data.jobId;
//       if (!newJobId) {
//         alert("Backend did not return JobId");
//         return;
//       }

//       console.log("Upload Success. JobId:", newJobId);
//       setJobId(newJobId);

//       // Preview
//       const previewRes = await axios.get(
//         `https://localhost:7016/api/csv/${newJobId}/preview`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setPreviewData(previewRes.data);
//       setColumns(Object.keys(previewRes.data[0] || {}));

//     } catch (err) {
//       console.error(err.response?.data || err);
//       alert("Upload failed");
//     }
//   };

//   // ---------------- MAPPING ----------------
//   const handleMappingChange = (badgeField, csvColumn) => {
//     setMapping((prev) => ({
//       ...prev,
//       [csvColumn]: badgeField,
//     }));
//   };

//   const saveMapping = async () => {
//     if (!jobId) {
//       alert("Upload CSV first");
//       return;
//     }

//     if (Object.keys(mapping).length === 0) {
//       alert("Please select mapping fields");
//       return;
//     }

//     console.log("Saving Mapping:", mapping);

//     try {
//       await axios.post(
//         `https://localhost:7016/api/csv/${jobId}/mapping`,
//         mapping,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       alert("Mapping saved successfully");
//     } catch (err) {
//       console.error(err.response?.data || err);
//       alert("Mapping failed");
//     }
//   };

//   // ---------------- GENERATE BADGES ----------------
//  const generateBadges = async () => {
//   if (!jobId) {
//     alert("Upload CSV first");
//     return;
//   }

//   console.log("Generating badges for JobId:", jobId);

//   try {
//     await axios.post(
//       `https://localhost:7016/api/csv/generate/${jobId}`, // <-- Corrected URL
//       {},
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     alert("Badges generated successfully!");
//   } catch (err) {
//     console.error(err.response?.data || err);
//     alert("Generation failed: " + err.response?.data);
//   }
// };

//   return (
//     <div style={{ padding: 40 }}>
//       <h2>CSV Upload & Mapping</h2>

//       {/* Upload Section */}
//       <input
//         type="file"
//         accept=".csv"
//         onChange={(e) => setFile(e.target.files[0])}
//       />
//       <br /><br />

//       <button type="button" onClick={handleUpload}>
//         Upload CSV
//       </button>

//       {/* Preview Section */}
//       {previewData.length > 0 && (
//         <>
//           <h3 style={{ marginTop: 30 }}>
//             Preview (First 5 Rows)
//           </h3>

//           <table border="1" cellPadding="8">
//             <thead>
//               <tr>
//                 {columns.map((col) => (
//                   <th key={col}>{col}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {previewData.map((row, index) => (
//                 <tr key={index}>
//                   {columns.map((col) => (
//                     <td key={col}>{row[col]}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Mapping Section */}
//           <h3 style={{ marginTop: 30 }}>
//             Map CSV Columns to Badge Fields
//           </h3>

//           {columns.map((col) => (
//             <div key={col} style={{ marginBottom: 10 }}>
//               <label>{col} → </label>

//               <select
//                 onChange={(e) =>
//                   handleMappingChange(e.target.value, col)
//                 }
//               >
//                 <option value="">Select Badge Field</option>
//                 {badgeFields.map((field) => (
//                   <option key={field} value={field}>
//                     {field}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           ))}

//           <br />

//           <button type="button" onClick={saveMapping}>
//             Save Mapping
//           </button>

//           <button
//             type="button"
//             onClick={generateBadges}
//             style={{ marginLeft: 15 }}
//           >
//             Generate Badges
//           </button>
//         </>
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import axios from "axios";

export default function CsvUploadPage() {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [mapping, setMapping] = useState({});

  const token = localStorage.getItem("token");

  const badgeFields = ["Title", "Subtitle", "BgColor", "TextColor"];

  // ---------------- UPLOAD ----------------
  const handleUpload = async () => {
    if (!file) { alert("Select CSV file"); return; }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("templateId", 1);

    try {
      const uploadRes = await axios.post(
        "https://localhost:7016/api/csv/upload",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newJobId = uploadRes.data.jobId;
      setJobId(newJobId);

      // Preview
      const previewRes = await axios.get(
        `https://localhost:7016/api/csv/${newJobId}/preview`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPreviewData(previewRes.data);
      setColumns(Object.keys(previewRes.data[0] || {}));

    } catch (err) {
      console.error(err.response?.data || err);
      alert("Upload failed");
    }
  };

  // ---------------- MAPPING ----------------
  const handleMappingChange = (badgeField, csvColumn) => {
    setMapping((prev) => ({ ...prev, [csvColumn]: badgeField }));
  };

  const saveMapping = async () => {
    if (!jobId) { alert("Upload CSV first"); return; }
    if (Object.keys(mapping).length === 0) { alert("Please select mapping fields"); return; }

    try {
      await axios.post(
        `https://localhost:7016/api/csv/${jobId}/mapping`,
        mapping,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Mapping saved successfully");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Mapping failed");
    }
  };

  // ---------------- GENERATE BADGES ----------------
  const generateBadges = async () => {
    if (!jobId) { alert("Upload CSV first"); return; }

    try {
      await axios.post(
        `https://localhost:7016/api/csv/generate/${jobId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Badges generated successfully!");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Generation failed: " + err.response?.data);
    }
  };

  // ---------------- DOWNLOAD PDF ----------------
  const downloadPdf = async () => {
    if (!jobId) { alert("Generate badges first"); return; }

    try {
      const res = await axios.get(
        `https://localhost:7016/api/pdfbadge/generate/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob" // important for file download
        }
      );

      // Create a URL for the blob and download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Badges.pdf"); // file name
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error(err.response?.data || err);
      alert("PDF download failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>CSV Upload & Mapping</h2>

      {/* Upload Section */}
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />
      <button type="button" onClick={handleUpload}>Upload CSV</button>

      {/* Preview & Mapping Section */}
      {previewData.length > 0 && (
        <>
          <h3 style={{ marginTop: 30 }}>Preview (First 5 Rows)</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
            </thead>
            <tbody>
              {previewData.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => <td key={col}>{row[col]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: 30 }}>Map CSV Columns to Badge Fields</h3>
          {columns.map((col) => (
            <div key={col} style={{ marginBottom: 10 }}>
              <label>{col} → </label>
              <select onChange={(e) => handleMappingChange(e.target.value, col)}>
                <option value="">Select Badge Field</option>
                {badgeFields.map((field) => <option key={field} value={field}>{field}</option>)}
              </select>
            </div>
          ))}

          <br />
          <button type="button" onClick={saveMapping}>Save Mapping</button>
          <button type="button" onClick={generateBadges} style={{ marginLeft: 15 }}>Generate Badges</button>
          <button type="button" onClick={downloadPdf} style={{ marginLeft: 15 }}>Download PDF</button>
        </>
      )}
    </div>
  );
}