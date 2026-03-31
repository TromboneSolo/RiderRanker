import React, { useState, useCallback } from "react";
import AGITO from "../assets/images/AGITO.png";
import BLADE from "../assets/images/BLADE.png";
import FAIZ from "../assets/images/FAIZ.png";
import KUUGA from "../assets/images/KUUGA.png";
import RYUKI from "../assets/images/RYUKI.png";
import ZERO from "../assets/images/set2/ZERO.svg";
import PHANTOM from "../assets/images/set2/PHANTOM.svg";
import TITAN from "../assets/images/set2/TITAN.svg";
import NOVA from "../assets/images/set2/NOVA.svg";
import SPECTER from "../assets/images/set2/SPECTER.svg";

// Built-in demo set 1 — Kamen Rider characters
const DEMO_IMAGES = [
  { id: "demo_agito", name: "AGITO", src: AGITO },
  { id: "demo_blade", name: "BLADE", src: BLADE },
  { id: "demo_faiz", name: "FAIZ", src: FAIZ },
  { id: "demo_kuuga", name: "KUUGA", src: KUUGA },
  { id: "demo_ryuki", name: "RYUKI", src: RYUKI },
];

// Built-in demo set 2 — Unit fighters
const DEMO_IMAGES_2 = [
  { id: "demo_zero", name: "ZERO", src: ZERO },
  { id: "demo_phantom", name: "PHANTOM", src: PHANTOM },
  { id: "demo_titan", name: "TITAN", src: TITAN },
  { id: "demo_nova", name: "NOVA", src: NOVA },
  { id: "demo_specter", name: "SPECTER", src: SPECTER },
];

// Lets the user build their image set before starting the ranking session.
// Accepts a FileList (from the file picker or drag-and-drop), reads each file
// as a base64 data URL, and appends it to the preview grid.
export default function ImageUpload({ onImagesSelected }) {
  const [previews, setPreviews] = useState([]);

  // Filters a FileList down to image files, reads each one asynchronously
  // with FileReader, and appends the resolved objects to the previews array.
  const loadFiles = useCallback((files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    const readers = imageFiles.map((file, i) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({
          id: `img_${Date.now()}_${i}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          src: e.target.result,
        });
        reader.readAsDataURL(file);
      })
    );
    Promise.all(readers).then(images =>
      setPreviews(prev => [...prev, ...images])
    );
  }, []);

  // Handles the drop event on the drop-zone div; extracts the dropped files
  // and passes them to loadFiles.
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    loadFiles(e.dataTransfer.files);
  }, [loadFiles]);

  // Removes a single image from the preview list by its id.
  const removeImage = (id) => setPreviews(prev => prev.filter(img => img.id !== id));

  const n = previews.length;
  const battleCount = Math.round(n * (n - 1) / 2);
  // Merge sort needs only O(n log n) comparisons rather than the full O(n²) exhaustive count
  const estimatedComparisons = n < 2 ? 0
    : Math.round(n * Math.ceil(Math.log2(Math.max(n, 2))));

  return (
    <div className="upload-container">
      <h1>Image Ranker</h1>
      <p className="upload-subtitle">Upload images to rank them through head-to-head battles</p>

      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("file-input").click()}
      >
        <div className="drop-zone-icon">+</div>
        <p>Drop images here or click to select</p>
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => loadFiles(e.target.files)}
        />
      </div>

      <div className="demo-btn-row">
        <button className="demo-btn" onClick={() => setPreviews(DEMO_IMAGES)}>
          Demo: Kamen Rider
        </button>
        <button className="demo-btn" onClick={() => setPreviews(DEMO_IMAGES_2)}>
          Demo: Unit Fighters
        </button>
      </div>

      {previews.length > 0 && (
        <>
          <div className="preview-grid">
            {previews.map(img => (
              <div key={img.id} className="preview-item">
                <img src={img.src} alt={img.name} />
                <span className="preview-name">{img.name}</span>
                <button className="remove-btn" onClick={() => removeImage(img.id)}>×</button>
              </div>
            ))}
          </div>

          <p className="battle-count">
            {n} images &mdash; ~{estimatedComparisons} comparisons (vs {battleCount} exhaustive)
          </p>

          <button
            className="start-btn"
            onClick={() => onImagesSelected(previews)}
            disabled={previews.length < 2}
          >
            Start Ranking
          </button>
        </>
      )}
    </div>
  );
}
