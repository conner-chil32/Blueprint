"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import { WidgetRenderer } from "./WidgetRenderer";
import { RenderPage } from "./HtmlConverter";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";

export default function CanvasPage() {
  // Pages, each containing widgets
  const [pages, setPages] = useState([{ id: 0, name: "Page 0", widgets: [] }]);
  const [selectedPageID, setSelectedPageID] = useState(0);

  // Page management
  const [nextPageID, setNextPageID] = useState(1);
  const createPage = () => {
    const newPage = { id: nextPageID, name: `Page ${nextPageID}`, widgets: [] };
    setPages((prev) => [...prev, newPage]);
    setSelectedPageID(nextPageID);
    setNextPageID(nextPageID + 1);
  };

  // Find current page
  const currentPage = pages.find((page) => page.id === selectedPageID);

  // Creating widgets
  const widgets = currentPage ? currentPage.widgets : [];
  const [nextWidgetId, setNextWidgetId] = useState(0);

  // Moving and placing widgets
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPlacing, setIsPlacing] = useState(false);
  const [widgetToPlace, setWidgetToPlace] = useState(null);

  // Selected widget container
  const [selectedWidgets, setSelectedWidgets] = useState(null);

  // Keep track of where the canvas page is
  const canvasRef = useRef(null);

  // Visibility
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);

  // Zooming
  const [canZoom, setCanZoom] = useState(true);

  // Update the current page to include new widgets
  const setWidgets = (newWidgets) => {
    setPages((prev) => prev.map((page) => (page.id === selectedPageID ? { ...page, widgets: newWidgets } : page)));
  };

  // Update widget position/size on drag stop
  const updateWidget = (w) => {
    const changedWidgets = widgets.map((widget) => {
      if (widget.id === w.id) {
        return {
          ...widget,
          x: w.x,
          y: w.y,
          width: w.width,
          height: w.height,
          rotation: w.rotation,
          isMoving: false,
          isSelected: false,
        };
      }
      return widget;
    });

    setWidgets(changedWidgets);
  };

  // Change arbitrary prop(s) by id
  const changeWidgetProperty = (widgetId, changes) => {
    const changedWidgets = widgets.map((widget) => {
      if (widget.id === widgetId) {
        return { ...widget, ...changes };
      }
      return widget;
    });

    setWidgets(changedWidgets);
  };

  // Delete widget by id
  const deleteWidget = (widgetId) => {
    const changedWidgets = widgets.filter((widget) => widget.id !== widgetId);
    setWidgets(changedWidgets);
  };

  /**
   * Mouse tracking over the canvas
   */
  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Calculate the position of the canvas
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y });

      // If in placement mode and the canvas area, move the widget with the mouse
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        if (isPlacing && widgetToPlace) {
          setWidgetToPlace((prev) => ({
            ...prev,
            x,
            y,
          }));
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPlacing, widgetToPlace]);

  // Sync selected widgets with latest state
  useEffect(() => {
    if (!selectedWidgets) return;

    const updatedSelection = selectedWidgets.map((sel) => widgets.find((w) => w.id === sel.id)).filter(Boolean);

    setSelectedWidgets(updatedSelection);
  }, [widgets]);

  /**
   * Canvas click handler
   * - drops a widget if in placement mode
   * - deselects all otherwise
   */
  const handleCanvasClick = () => {
    if (isPlacing && widgetToPlace) {
      const placedWidget = {
        ...widgetToPlace,
        isSelected: false,
        isMoving: false,
        pointerEventsNone: false,
      };

      setWidgets([...widgets, placedWidget]);
      setIsPlacing(false);
      widgetToPlace.isSelected = false;
      widgetToPlace.isMoving = false;
      widgetToPlace.pointerEventsNone = false;

      console.log("Added widget", widgetToPlace.id, "to page", selectedPageID);
      return;
    }

    // Deselect all
    setSelectedWidgets(null);
  };

  /**
   * Create a new widget with defaults.
   */
  const createWidget = (typeToMake) => {
    let newWidget = null;
    const nextId = nextWidgetId;

    switch (typeToMake) {
      case "box":
        newWidget = {
          type: "box",
          id: nextId,
          x: mousePos.x,
          y: mousePos.y,
          width: 100,
          height: 100,
          isSelected: false,
          isMoving: true,
          backgroundColor: "#cccccc",
          pointerEventsNone: true,
          rotation: 0,
        };
        break;

      case "video":
        newWidget = {
          type: "video",
          id: nextId,
          x: mousePos.x,
          y: mousePos.y,
          width: 320,
          height: 180,
          isSelected: false,
          isMoving: true,
          backgroundColor: "#000000",
          pointerEventsNone: true,
          rotation: 0,
          // custom props:
          videoUrl: "",
          autoplay: false,
          loop: false,
          muted: false,
          controls: true,
          objectFit: "cover",
        };
        break;

      case "dropdown":
        newWidget = {
          type: "dropdown",
          id: nextId,
          x: mousePos.x,
          y: mousePos.y,
          width: 220,
          height: 50,
          isSelected: false,
          isMoving: true,
          backgroundColor: "#ffffff",
          pointerEventsNone: true,
          rotation: 0,
          // custom props:
          options: ["Option 1", "Option 2", "Option 3"],
          value: "Option 1",
          fontSize: 12,
          textColor: "#111111",
          bgColor: "#ffffff",
        };
        break;

      case "advert":
        newWidget = {
          type: "advert",
          id: nextId,
          x: mousePos.x,
          y: mousePos.y,
          width: 300,
          height: 250, // standard MPU size
          isSelected: false,
          isMoving: true,
          backgroundColor: "#ffffff",
          pointerEventsNone: true,
          rotation: 0,
          // custom props:
          imageUrl: "/images/Blueprint.png",
          linkUrl: "http://localhost:3000/features",
          alt: "Advertisement",
          objectFit: "cover",
          showBorder: true,
          borderColor: "#333333",
        };
        break;

      // --- NEW: Text widget ---
      case "text":
        newWidget = {
          type: "text",
          id: nextId,
          x: mousePos.x,
          y: mousePos.y,
          width: 300,
          height: 80,
          isSelected: false,
          isMoving: true,
          backgroundColor: "transparent",
          pointerEventsNone: true,
          rotation: 0,
          // custom props:
          text: "Edit me",
          fontSize: 18,
          color: "#111111",
          fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
          fontWeight: 400,
          textAlign: "left",
          lineHeight: 1.35,
          letterSpacing: 0,
          padding: 8,
        };
        break;

      // --- NEW: Image widget ---
      case "image":
        newWidget = {
          type: "image",
          id: nextId,
          x: mousePos.x,
          y: mousePos.y,
          width: 320,
          height: 200,
          isSelected: false,
          isMoving: true,
          backgroundColor: "#ffffff",
          pointerEventsNone: true,
          rotation: 0,
          // custom props:
          src: "/images/Blueprint.png",
          alt: "Image",
          objectFit: "cover",
          showBorder: false,
          borderColor: "#cccccc",
          radius: 0,
        };
        break;

      default:
        console.warn("Warning: Unknown widget type: " + typeToMake);
        return;
    }

    console.log("Created new widget: ", newWidget);

    setNextWidgetId((prevId) => prevId + 1);
    setIsPlacing(true);
    setWidgetToPlace(newWidget);
  };

  // Sync selection highlight after any mutation
  useEffect(() => {
    if (!selectedWidgets) return;
    const changedWidgets = widgets.map((widget) => {
      const isSel = selectedWidgets.some((w) => w.id === widget.id);
      return { ...widget, isSelected: isSel };
    });
    setWidgets(changedWidgets);
  }, [selectedWidgets]);

  return (
    <div className={styles.root}>
      {/* Left sidebar */}
      {leftPanelVisible && <LeftPanel createWidget={createWidget} />}

      {/* Canvas area */}
      <div className={styles.canvasArea} ref={canvasRef} onClick={handleCanvasClick}>
        <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0} disabled={true}>
          <TransformComponent>
            <div className={styles.canvasContent} id="canvas">
              {Array.isArray(widgets) &&
                widgets.map((widget) => (
                  <WidgetRenderer
                    key={widget.id}
                    widget={widget}
                    isSelected={selectedWidgets?.some((w) => w.id === widget.id)}
                    onClick={() => {
                      setSelectedWidgets([widget]);
                      console.log("Selected widget: " + widget.id);
                    }}
                    alertDragStop={updateWidget}
                    changeWidgetProperty={changeWidgetProperty}
                  />
                ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* Right sidebar */}
      {rightPanelVisible && (
        <RightPanel
          changeWidgetProperty={changeWidgetProperty}
          selectedWidgets={selectedWidgets}
          widgets={widgets}
          deleteWidget={deleteWidget}
        />
      )}

      {/* Page controls */}
      <RightPagePanel
        pages={pages}
        selectedPageID={selectedPageID}
        setSelectedPageID={setSelectedPageID}
        currentPage={currentPage}
        createPage={createPage}
      />
    </div>
  );
}

function LeftPanel({ createWidget }) {
  return (
    <div>
      <div className={styles.sectionTitle}>Objects</div>
      <button className={styles.categoryItem} onClick={() => createWidget("text")}>
        Text Box
      </button>
      <button className={styles.categoryItem} onClick={() => createWidget("image")}>
        Image
      </button>

      <div className={styles.divider}></div>

      <div className={styles.sectionTitle}>Widgets</div>
      <button className={styles.categoryItem} onClick={() => createWidget("video")}>
        Video
      </button>
      <button className={styles.categoryItem} onClick={() => createWidget("dropdown")}>
        Dropdown
      </button>
      <button className={styles.categoryItem} onClick={() => createWidget("advert")}>
        Advertisement
      </button>

      <div className={styles.divider}></div>

      <div className={styles.sectionTitle}>Shapes</div>
      <button className={styles.categoryItem} onClick={() => createWidget("box")}>
        Box
      </button>
      <button className={styles.categoryItem}>Forms</button>
      <button className={styles.categoryItem}>Images</button>
    </div>
  );
}

function RightPanel({ changeWidgetProperty, selectedWidgets, widgets, deleteWidget }) {
  if (!selectedWidgets || selectedWidgets.length === 0) {
    return <p>Select a widget to view its properties.</p>;
  }

  return (
    <div className={styles.rightPanel}>
      <div>
        <button
          className={styles.deleteButton}
          onClick={() => {
            selectedWidgets.forEach((widget) => {
              console.log("Deleting ", widget);
              deleteWidget(widget.id);
            });
          }}
        >
          Delete Selected Widget
        </button>
      </div>

      {/* Per-widget controls */}
      {selectedWidgets.map((widget) => (
        <div key={widget.id} className={styles.widgetOptions}>
          {/* Common props */}
          <p>Color:</p>
          <input
            type="color"
            value={widget.backgroundColor || "#cccccc"}
            onChange={(e) =>
              changeWidgetProperty(widget.id, {
                backgroundColor: e.target.value,
              })
            }
          />

          <p>Rotation: {widget.rotation}</p>
          <input
            type="number"
            min="0"
            max="360"
            value={widget.rotation || 0}
            onChange={(e) =>
              changeWidgetProperty(widget.id, {
                rotation: parseInt(e.target.value || "0", 10),
              })
            }
          />

          {/* ===== Video controls ===== */}
          {widget.type === "video" && (
            <>
              <p>Video URL:</p>
              <input
                type="text"
                placeholder="/videos/intro.mp4 or https://cdn.example.com/clip.mp4"
                value={widget.videoUrl || ""}
                onChange={(e) =>
                  changeWidgetProperty(widget.id, {
                    videoUrl: e.target.value || null,
                  })
                }
              />
              <p>Object Fit:</p>
              <select
                value={widget.objectFit || "cover"}
                onChange={(e) =>
                  changeWidgetProperty(widget.id, {
                    objectFit: e.target.value,
                  })
                }
              >
                <option value="contain">contain</option>
                <option value="cover">cover</option>
                <option value="fill">fill</option>
                <option value="none">none</option>
                <option value="scale-down">scale-down</option>
              </select>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span>Autoplay</span>
                <input
                  type="checkbox"
                  checked={!!widget.autoplay}
                  onChange={(e) =>
                    changeWidgetProperty(widget.id, {
                      autoplay: e.target.checked,
                    })
                  }
                />
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span>Loop</span>
                <input
                  type="checkbox"
                  checked={!!widget.loop}
                  onChange={(e) => changeWidgetProperty(widget.id, { loop: e.target.checked })}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span>Muted</span>
                <input
                  type="checkbox"
                  checked={!!widget.muted}
                  onChange={(e) => changeWidgetProperty(widget.id, { muted: e.target.checked })}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span>Show controls</span>
                <input
                  type="checkbox"
                  checked={!!widget.controls}
                  onChange={(e) =>
                    changeWidgetProperty(widget.id, {
                      controls: e.target.checked,
                    })
                  }
                />
              </label>
            </>
          )}

          {/* ===== Dropdown controls ===== */}
          {widget.type === "dropdown" &&
            (() => {
              const draft = widget.optionsText ?? (widget.options || []).join(", ");

              const commitOptions = (raw) => {
                const arr = (raw || "")
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                const nextValue = arr.includes(widget.value) ? widget.value : arr[0] || "";
                const normalizedText = arr.join(", ");

                changeWidgetProperty(widget.id, {
                  options: arr,
                  value: nextValue,
                  optionsText: normalizedText,
                });
              };

              return (
                <>
                  <p>Options (comma-separated):</p>
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) =>
                      changeWidgetProperty(widget.id, {
                        optionsText: e.target.value,
                      })
                    }
                    onBlur={(e) => commitOptions(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitOptions(e.currentTarget.value);
                    }}
                  />

                  <p>Selected Value:</p>
                  <input
                    type="text"
                    value={widget.value || ""}
                    onChange={(e) => changeWidgetProperty(widget.id, { value: e.target.value })}
                  />

                  <p>Font Size:</p>
                  <input
                    type="number"
                    min="8"
                    max="32"
                    value={widget.fontSize ?? 12}
                    onChange={(e) =>
                      changeWidgetProperty(widget.id, {
                        fontSize: parseInt(e.target.value || "12", 10),
                      })
                    }
                  />

                  <p>Background:</p>
                  <input
                    type="color"
                    value={widget.bgColor || "#ffffff"}
                    onChange={(e) => changeWidgetProperty(widget.id, { bgColor: e.target.value })}
                  />

                  <p>Text Color:</p>
                  <input
                    type="color"
                    value={widget.textColor || "#111111"}
                    onChange={(e) =>
                      changeWidgetProperty(widget.id, {
                        textColor: e.target.value,
                      })
                    }
                  />
                </>
              );
            })()}

          {/* ===== Advertisement controls ===== */}
          {widget.type === "advert" && (
            <>
              <p>Image URL:</p>
              <input
                type="text"
                placeholder="https://…/banner.jpg"
                value={widget.imageUrl || ""}
                onChange={(e) => changeWidgetProperty(widget.id, { imageUrl: e.target.value })}
              />

              <p>Link URL:</p>
              <input
                type="text"
                placeholder="www.google.com"
                value={widget.linkUrl || ""}
                onChange={(e) => changeWidgetProperty(widget.id, { linkUrl: e.target.value })}
              />

              <p>Alt Text:</p>
              <input
                type="text"
                value={widget.alt || ""}
                onChange={(e) => changeWidgetProperty(widget.id, { alt: e.target.value })}
              />

              <p>Object Fit:</p>
              <select
                value={widget.objectFit || "cover"}
                onChange={(e) =>
                  changeWidgetProperty(widget.id, {
                    objectFit: e.target.value,
                  })
                }
              >
                <option value="contain">contain</option>
                <option value="cover">cover</option>
                <option value="fill">fill</option>
                <option value="none">none</option>
                <option value="scale-down">scale-down</option>
              </select>

              <label>
                <input
                  type="checkbox"
                  checked={!!widget.showBorder}
                  onChange={(e) =>
                    changeWidgetProperty(widget.id, {
                      showBorder: e.target.checked,
                    })
                  }
                />
                Show border
              </label>

              <p>Border Color:</p>
              <input
                type="color"
                value={widget.borderColor || "#333333"}
                onChange={(e) =>
                  changeWidgetProperty(widget.id, {
                    borderColor: e.target.value,
                  })
                }
              />
            </>
          )}

          {/* ===== Text controls ===== */}
          {widget.type === "text" && (
            <>
              <p>Text:</p>
              <textarea
                rows={4}
                value={widget.text || ""}
                onChange={(e) => changeWidgetProperty(widget.id, { text: e.target.value })}
                style={{ width: "100%", resize: "vertical" }}
              />

              <p>Font Size:</p>
              <input
                type="number"
                min="8"
                max="96"
                value={widget.fontSize ?? 18}
                onChange={(e) =>
                  changeWidgetProperty(widget.id, {
                    fontSize: parseInt(e.target.value || "18", 10),
                  })
                }
              />

              <p>Text Color:</p>
              <input
                type="color"
                value={widget.color || "#111111"}
                onChange={(e) => changeWidgetProperty(widget.id, { color: e.target.value })}
              />

              <p>Font Weight:</p>
              <select
                value={widget.fontWeight ?? 400}
                onChange={(e) =>
                  changeWidgetProperty(widget.id, {
                    fontWeight: parseInt(e.target.value, 10),
                  })
                }
              >
                <option value={300}>300</option>
                <option value={400}>400</option>
                <option value={500}>500</option>
                <option value={600}>600</option>
                <option value={700}>700</option>
              </select>

              <p>Align:</p>
              <select
                value={widget.textAlign || "left"}
                onChange={(e) => changeWidgetProperty(widget.id, { textAlign: e.target.value })}
              >
                <option value="left">left</option>
                <option value="center">center</option>
                <option value="right">right</option>
              </select>

              <p>Line Height:</p>
              <input
                type="number"
                step="0.05"
                min="0.8"
                max="3"
                value={widget.lineHeight ?? 1.35}
                onChange={(e) =>
                  changeWidgetProperty(widget.id, {
                    lineHeight: parseFloat(e.target.value || "1.35"),
                  })
                }
              />

              <p>Letter Spacing (px):</p>
              <input
                type="number"
                step="0.1"
                min="-2"
                max="10"
                value={widget.letterSpacing ?? 0}
                onChange={(e) =>
                  changeWidgetProperty(widget.id, {
                    letterSpacing: parseFloat(e.target.value || "0"),
                  })
                }
              />

              <p>Padding (px):</p>
              <input
                type="number"
                min="0"
                max="64"
                value={widget.padding ?? 8}
                onChange={(e) =>
                  changeWidgetProperty(widget.id, {
                    padding: parseInt(e.target.value || "8", 10),
                  })
                }
              />
            </>
          )}

          {/* ===== Image controls ===== */}
          {widget.type === "image" && (
            <>
              <p>Image URL:</p>
              <input
                type="text"
                placeholder="https://…/photo.jpg or /images/pic.png"
                value={widget.src || ""}
                onChange={(e) => changeWidgetProperty(widget.id, { src: e.target.value })}
              />

              <p>Alt Text:</p>
              <input
                type="text"
                value={widget.alt || ""}
                onChange={(e) => changeWidgetProperty(widget.id, { alt: e.target.value })}
              />

              <p>Object Fit:</p>
              <select
                value={widget.objectFit || "cover"}
                onChange={(e) =>
                  changeWidgetProperty(widget.id, {
                    objectFit: e.target.value,
                  })
                }
              >
                <option value="contain">contain</option>
                <option value="cover">cover</option>
                <option value="fill">fill</option>
                <option value="none">none</option>
                <option value="scale-down">scale-down</option>
              </select>

              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>Show Border</span>
                <input
                  type="checkbox"
                  checked={!!widget.showBorder}
                  onChange={(e) =>
                    changeWidgetProperty(widget.id, {
                      showBorder: e.target.checked,
                    })
                  }
                />
              </label>

              <p>Border Color:</p>
              <input
                type="color"
                value={widget.borderColor || "#cccccc"}
                onChange={(e) =>
                  changeWidgetProperty(widget.id, {
                    borderColor: e.target.value,
                  })
                }
              />

              <p>Corner Radius (px):</p>
              <input
                type="number"
                min="0"
                max="64"
                value={widget.radius ?? 0}
                onChange={(e) =>
                  changeWidgetProperty(widget.id, {
                    radius: parseInt(e.target.value || "0", 10),
                  })
                }
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function RightPagePanel({ pages, selectedPageID, setSelectedPageID, currentPage, createPage }) {
  const downloadHTMLPage = (currentPage) => {
    console.log("Downloading page", currentPage);
    const file = new Blob([RenderPage(currentPage)], { type: "text/html" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "Page" + Date.now() + ".html";
    document.body.appendChild(element);
  };

  return (
    <div>
      <select value={selectedPageID} onChange={(e) => setSelectedPageID(Number(e.target.value))}>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            {page.name}
          </option>
        ))}
      </select>

      <button onClick={createPage}>+ New Page</button>
      <button>Download Page</button>
    </div>
  );
}
