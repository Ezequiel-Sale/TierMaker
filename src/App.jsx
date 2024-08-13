import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const tierList = ["S", "A", "B", "C", "D", "E"];
  const [tier] = useState(tierList);

  useEffect(() => {
    const imageInput = document.querySelector("#image-input");
    const itemsSection = document.querySelector("#selector-items");

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

    imageInput.addEventListener("change", (e) => {
      const [file] = e.target.files;

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          createItem(e.target.result);
        };
        reader.readAsDataURL(file);
      }
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
    };
    const handleDragOver = (e) => {
      e.preventDefault();
      const { currentTarget } = e;
      if (sourceContainer === currentTarget) return;

      currentTarget.classList.add("drag-over");
    };
    const handleDragLeave = (e) => {
      e.preventDefault();
      const { currentTarget } = e;
      currentTarget.classList.remove("drag-over");
    };

    rows.forEach((row) => {
      row.addEventListener("drop", handleDrop);
      row.addEventListener("dragover", handleDragOver);
      row.addEventListener("dragleave", handleDragLeave);
    });

    itemsSection.addEventListener("drop", handleDrop);
    itemsSection.addEventListener("dragover", handleDragOver);
    itemsSection.addEventListener("dragleave", handleDragLeave);

    const handleDragStart = (e) => {
      draggedElement = e.target;
      sourceContainer = draggedElement.parentNode;
      e.dataTransfer.setData("text/plain", draggedElement.src);
    };

    const handleDragEnd = () => {
      draggedElement = null;
      sourceContainer = null;
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
            <input accept="image/*" type="file" id="image-input" hidden />
          </label>
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
              <path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />
            </svg>
          </label>
        </section>
        <div id="selector-items"></div>
      </footer>
    </>
  );
}

export default App;

{
  /* <header className="top-header">
        <img src="https://tiermaker.com/images/tiermaker-logo.png" alt="" />
      </header>

      <section className="tier">
        <div className="row">
          <aside className="label" style={{ "--level": "var(--color-s)" }}>
            <span contentEditable="true">S</span>
          </aside>
        </div>
        <div className="row">
          <aside className="label" style={{ "--level": "var(--color-a)" }}>
            <span contentEditable="true">A</span>
          </aside>
        </div>
        <div className="row">
          <aside className="label" style={{ "--level": "var(--color-b)" }}>
            <span contentEditable="true">B</span>
          </aside>
        </div>
        <div className="row">
          <aside className="label" style={{ "--level": "var(--color-c)" }}>
            <span contentEditable="true">C</span>
          </aside>
        </div>
        <div className="row">
          <aside className="label" style={{ "--level": "var(--color-d)" }}>
            <span contentEditable="true">D</span>
          </aside>
        </div>
        <div className="row">
          <aside className="label" style={{ "--level": "var(--color-e)" }}>
            <span contentEditable="true">E</span>
          </aside>
        </div>
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
            <input type="file" id="image-input" hidden/>
          </label>

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
        </section>
      </footer> */
}
