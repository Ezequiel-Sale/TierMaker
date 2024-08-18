import "./App.css";
import { useEffect, useState } from "react";
import html2canvas from 'html2canvas-pro';

function App() {
  const tierList = ["S", "A", "B", "C", "D", "E"];
  const [tier] = useState(tierList);

  useEffect(() => {
    const imageInput = document.querySelector("#image-input");
    const itemsSection = document.querySelector("#selector-items");
    const resetButton = document.querySelector("#reset-tier-button");
    const saveButton = document.querySelector("#save-tier-button");
    const createItem = (src) => {
      const img = document.createElement("img");
      img.draggable = true;
      img.src = src;
      img.className = "item-image";
      img.addEventListener("dragstart", handleDragStart);
      img.addEventListener("dragend", handleDragEnd);
      itemsSection.appendChild(img);
      return img;
    };

    function filesToCreateItems(files) {
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            createItem(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    }

    imageInput.addEventListener("change", (e) => {
      const { files } = e.target;
      filesToCreateItems(files);
    });

    let draggedElement = null;
    let sourceContainer = null;

    const rows = document.querySelectorAll(".tier .row");

    const handleDrop = (e) => {
      e.preventDefault();
      const { currentTarget, dataTransfer } = e;

      if (sourceContainer && draggedElement) {
        sourceContainer.removeChild(draggedElement);
      }
      if (draggedElement) {
        const src = dataTransfer.getData("text/plain");
        const img = createItem(src);
        currentTarget.appendChild(img);
      }
      currentTarget.classList.remove("drag-over");
      currentTarget.querySelector(".drag-preview")?.remove();
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      const { currentTarget } = e;
      if (sourceContainer === currentTarget) return;

      currentTarget.classList.add("drag-over");

      const dragPreview = currentTarget.querySelector(".drag-preview");
      if (draggedElement && !dragPreview) {
        const previewElement = draggedElement.cloneNode(true);
        previewElement.classList.add("drag-preview");
        currentTarget.appendChild(previewElement);
      }
    };
    const handleDragLeave = (e) => {
      e.preventDefault();
      const { currentTarget } = e;
      currentTarget.classList.remove("drag-over");
      currentTarget.classList.remove("drag-files");
      currentTarget.querySelector(".drag-preview")?.remove();
    };

    rows.forEach((row) => {
      row.addEventListener("drop", handleDrop);
      row.addEventListener("dragover", handleDragOver);
      row.addEventListener("dragleave", handleDragLeave);
    });

    itemsSection.addEventListener("drop", handleDrop);
    itemsSection.addEventListener("dragover", handleDragOver);
    itemsSection.addEventListener("dragleave", handleDragLeave);

    itemsSection.addEventListener("drop", handleDropFromDesktop);
    itemsSection.addEventListener("dragover", handleDragOverFromDesktop);

    function handleDragOverFromDesktop(e) {
      e.preventDefault();
      const { currentTarget, dataTransfer } = e;
      if (dataTransfer.types.includes("Files")) {
        currentTarget.classList.add("drag-files");
      }
    }
    // function handleDropFromDesktop(e) {
    //   e.preventDefault();
    //   const { currentTarget, dataTransfer } = e;

    //   if (dataTransfer.types.includes("Files")) {
    //     currentTarget.classList.remove("drag-files");
    //     const { files } = dataTransfer;
    //     filesToCreateItems(files);
    //   }
    // }
    function handleDropFromDesktop(e) {
      e.preventDefault();
      const { currentTarget, dataTransfer } = e;
      
      if (dataTransfer.types.includes("Files")) {
        currentTarget.classList.remove("drag-files");
        const { files } = dataTransfer;
    
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const existingImage = Array.from(itemsSection.querySelectorAll("img")).find(
              (img) => img.src === e.target.result
            );
    
            // Si no existe una imagen con el mismo src, la creamos y agregamos
            if (!existingImage) {
              createItem(e.target.result);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }
    

    const handleDragStart = (e) => {
      draggedElement = e.target;
      sourceContainer = draggedElement.parentNode;
      e.dataTransfer.setData("text/plain", draggedElement.src);
    };

    const handleDragEnd = () => {
      draggedElement = null;
      sourceContainer = null;
    };

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        const items = document.querySelectorAll(".tier .item-image");
        items.forEach((item) => {
          item.remove();
          itemsSection.appendChild(item);
        });
      });
    }

    saveButton.addEventListener("click", () => {
      const tierContainer = document.querySelector(".tier");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      html2canvas(tierContainer).then((canvas) => {
        ctx.drawImage(canvas, 0, 0);
        const imgURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "tier.png";
        link.href = imgURL;
        link.click();
      })
    })


    return () => {
      itemsSection.removeEventListener("dragover", handleDragOverFromDesktop);
      itemsSection.removeEventListener("drop", handleDropFromDesktop);
      rows.forEach((row) => {
        row.removeEventListener("drop", handleDrop);
        row.removeEventListener("dragover", handleDragOver);
        row.removeEventListener("dragleave", handleDragLeave);
      });
    };
  }, []);

  return (
    <>
      <header className="top-header">
        <img src="https://tiermaker.com/images/tiermaker-logo.png" alt="" />
      </header>
      <section className="tier">
        {tier.map((t, i) => (
          <div
            className="row"
            key={i}
            style={{ "--level": `var(--color-${t.toLowerCase()})` }}
          >
            <aside className="label">
              <span>{t}</span>
            </aside>
          </div>
        ))}
      </section>
      <footer id="selector">
        <section id="selector-buttons">
          <label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>
            <input
              multiple
              accept="image/*"
              type="file"
              id="image-input"
              hidden
            />
          </label>
          <label id="reset-tier-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />
            </svg>
          </label>
          <label id="save-tier-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
              <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M14 4l0 4l-6 0l0 -4" />
            </svg>
          </label>
        </section>
        <div id="selector-items"></div>
      </footer>
    </>
  );
}

export default App;
