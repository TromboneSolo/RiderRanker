import React, { useState, useCallback } from "react";
import AGITO from "../assets/images/heisei/AGITO.svg";
import BLADE from "../assets/images/heisei/BLADE.svg";
import FAIZ from "../assets/images/heisei/FAIZ.svg";
import KUUGA from "../assets/images/heisei/KUUGA.svg";
import RYUKI from "../assets/images/heisei/RYUKI.svg";
import ZERO from "../assets/images/set2/ZERO.svg";
import PHANTOM from "../assets/images/set2/PHANTOM.svg";
import TITAN from "../assets/images/set2/TITAN.svg";
import NOVA from "../assets/images/set2/NOVA.svg";
import SPECTER from "../assets/images/set2/SPECTER.svg";
import HIBIKI from "../assets/images/heisei/HIBIKI.svg";
import KABUTO from "../assets/images/heisei/KABUTO.svg";
import DENO from "../assets/images/heisei/DEN-O.svg";
import KIVA from "../assets/images/heisei/KIVA.svg";
import DECADE from "../assets/images/heisei/DECADE.svg";
import DOUBLE from "../assets/images/heisei/DOUBLE.svg";
import OOO from "../assets/images/heisei/OOO.svg";
import FOURZE from "../assets/images/heisei/FOURZE.svg";
import WIZARD from "../assets/images/heisei/WIZARD.svg";
import GAIM from "../assets/images/heisei/GAIM.svg";
import DRIVE from "../assets/images/heisei/DRIVE.svg";
import GHOST from "../assets/images/heisei/GHOST.svg";
import EXAID from "../assets/images/heisei/EX-AID.svg";
import BUILD from "../assets/images/heisei/BUILD.svg";
import ZIO from "../assets/images/heisei/ZI-O.svg";
import ZEROONE from "../assets/images/reiwa/ZERO-ONE.svg";
import SABER from "../assets/images/reiwa/SABER.svg";
import REVICE from "../assets/images/reiwa/REVICE.svg";
import GEATS from "../assets/images/reiwa/GEATS.svg";
import GOTCHARD from "../assets/images/reiwa/GOTCHARD.svg";
import GAVV from "../assets/images/reiwa/GAVV.svg";
import ZEZTZ from "../assets/images/reiwa/ZEZTZ.svg";


// Built-in demo set 3 — all Heisei and Reiwa Kamen Riders
const DEMO_IMAGES_3 = [
  { id: "demo_kuuga",   name: "KUUGA",   src: KUUGA   },
  { id: "demo_agito",   name: "AGITO",   src: AGITO   },
  { id: "demo_ryuki",   name: "RYUKI",   src: RYUKI   },
  { id: "demo_faiz",    name: "FAIZ",    src: FAIZ    },
  { id: "demo_blade",   name: "BLADE",   src: BLADE   },
  { id: "demo_hibiki",  name: "HIBIKI",  src: HIBIKI  },
  { id: "demo_kabuto",  name: "KABUTO",  src: KABUTO  },
  { id: "demo_deno",    name: "DEN-O",   src: DENO    },
  { id: "demo_kiva",    name: "KIVA",    src: KIVA    },
  { id: "demo_decade",  name: "DECADE",  src: DECADE  },
  { id: "demo_double",  name: "DOUBLE",  src: DOUBLE  },
  { id: "demo_ooo",     name: "OOO",     src: OOO     },
  { id: "demo_fourze",  name: "FOURZE",  src: FOURZE  },
  { id: "demo_wizard",  name: "WIZARD",  src: WIZARD  },
  { id: "demo_gaim",    name: "GAIM",    src: GAIM    },
  { id: "demo_drive",   name: "DRIVE",   src: DRIVE   },
  { id: "demo_ghost",   name: "GHOST",   src: GHOST   },
  { id: "demo_exaid",   name: "EX-AID",  src: EXAID   },
  { id: "demo_build",   name: "BUILD",   src: BUILD   },
  { id: "demo_zio",     name: "ZI-O",    src: ZIO     },
  { id: "demo_zeroone", name: "ZERO-ONE", src: ZEROONE},
  { id: "demo_saber",   name: "SABER",   src: SABER   },
  { id: "demo_revice",  name: "REVICE",  src: REVICE  },
  { id: "demo_geats",   name: "GEATS",   src: GEATS   },
  { id: "demo_gotchard",name: "GOTCHARD",src: GOTCHARD},
  { id: "demo_gavv",    name: "GAVV",    src: GAVV    },
  { id: "demo_zeztz",   name: "ZEZTZ",   src: ZEZTZ   },
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
        <button className="demo-btn" onClick={() => setPreviews(DEMO_IMAGES_2)}>
          Demo: Unit Fighters
        </button>
        <button className="demo-btn" onClick={() => setPreviews(DEMO_IMAGES_3)}>
          Demo: Heisei &amp; Reiwa Riders
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
