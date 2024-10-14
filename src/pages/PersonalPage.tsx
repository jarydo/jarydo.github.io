document.addEventListener("DOMContentLoaded", () => {
  const desktop = document.getElementById("desktop");
  let draggedItem: HTMLElement | null = null;

  document.addEventListener("dragstart", function (e) {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains("folder")) {
      draggedItem = target;
      if (e.dataTransfer) {
        e.dataTransfer.setData("text/plain", target.id);
      }
      setTimeout(() => {
        target.style.opacity = "0.5";
      }, 0);
    }
  });

  document.addEventListener("dragend", function (e) {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains("folder")) {
      target.style.opacity = "";
    }

    console.log(desktop);
  });

  if (desktop) {
    desktop.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    desktop.addEventListener("drop", function (e) {
      e.preventDefault();

      if (draggedItem) {
        const rect = desktop.getBoundingClientRect();
        const x = e.clientX - rect.left - draggedItem.offsetWidth / 2;
        const y = e.clientY - rect.top - draggedItem.offsetHeight / 2;

        draggedItem.style.left = `${x}px`;
        draggedItem.style.top = `${y}px`;
        draggedItem = null;
      }
    });
  }
});

function PersonalPage() {
  return (
    <div className="font-macos" id="desktop">
      <div className="folder" draggable="true" id="folder1">
        <img src="/assets/folder.png" alt="Folder" width="32px" />
        <div className="folder-name">Documents</div>
      </div>
      <div className="folder" draggable="true" id="folder2">
        <img src="folder-icon.png" alt="Folder" />
        <div className="folder-name">Projects</div>
      </div>
    </div>
  );
}

export default PersonalPage;
