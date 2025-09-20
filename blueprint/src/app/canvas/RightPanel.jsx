import { useEffect, useState, useRef } from "react";
import styles from './page.module.css';
import { RenderPage } from "./HtmlConverter";

/** Christopher Parsons, 9/18/2025
 * Inputs:
 *  selectedWidgets: array
 *  changePageProperty: function
 *  widgets: array
 *  deleteWidget: function
 *  pages: array
 *  selectedPageID: number
 *  setSelectedPageID: function
 *  currentPage: Page
 *  createpage: function
 *  changePageProperty: function
 * 
 * A panel on the right side of the screen that allows
 * for the manipulation of existing widgets and pages.
 */
export function RightPanel({
    changeWidgetProperty, selectedWidgets, widgets, deleteWidget,
    pages, selectedPageID, setSelectedPageID, currentPage, createPage, changePageProperty
   }) {
    const [buttonSelected, setButtonSelected] = useState(false);

    /** Christopher Parsons, 9/18/2025
     * If a button is clicked, flip the buttonSelected boolean.
     * The buttonSelected variable controls what the RightPanel
     * is displaying.
     */
    const handleButtonClick = () => {
      setButtonSelected(!buttonSelected);
      console.log(`Canvas status: ${!buttonSelected}`);
    }

    /** Christopher Parsons, 9/18/2025
     * Return a button to switch between the page controls and the widget controls.
     * Also return the controls.
     */
    return (
      <div>
        {/* Button to switch, always rendered. When clicked, invert buttonSelected */}
        <button className={styles.switchButton} onClick={handleButtonClick}>Switch</button>

        {/* False = widget properties. True = page properties */}
        {!buttonSelected ? <RightWidgetPanel changeWidgetProperty={changeWidgetProperty} selectedWidgets={selectedWidgets} widgets={widgets} deleteWidget={deleteWidget} />
          : <RightPagePanel pages={pages} selectedPageID={selectedPageID} setSelectedPageID={setSelectedPageID} currentPage={currentPage} createPage={createPage} changePageProperty={changePageProperty} />}
      </div>

    );
  }

  /** Christopher Parsons, 9/18/2025
   * Inputs:
   *  chagneWidgetProperty: function
   *  selectedWidgets: array
   *  widgets: array
   *  deleteWidget: function
   * 
   * Returns a series of controls for the manipulation of
   * widgets.
   */
  function RightWidgetPanel({ changeWidgetProperty, selectedWidgets, widgets, deleteWidget }) {
    // Render the selected widgets panel
    if (selectedWidgets && selectedWidgets.length > 0) {
    // If something is selected
      return (
        <div>
          <div>
            {/* Button for deleting widgets */}
            <button
              className={styles.deleteButton}
              onClick={() => {
                selectedWidgets.forEach(widget => {
                  console.log('Deleting ', widget)
                  deleteWidget(widget.id);
                })
              }}
            >Delete Selected Widget</button>
          </div>
  
          {/* Menu to change widgets */}
          {selectedWidgets.map((widget) => (
            <div key={widget.id} className={styles.widgetOptions}>
              {/* Inputs to change widget properties */}
              <p>Color:</p>
              <input
                type="color"
                value={widget.backgroundColor || "#cccccc"}
                onChange={e => changeWidgetProperty(widget.id, { backgroundColor: e.target.value })}
              />
  
              {/* Two rotation inputs, one as an editable display and the other as a slider */}
              <p>Rotation: {widget.rotation}</p>
              <input
                type="number"
                min="0"
                max="360"
                value={widget.rotation || 0}
                onChange={e =>
                  changeWidgetProperty(widget.id, { rotation: parseInt(e.target.value, 10) })
                }/>
              <input
                type="range"
                min="0"
                max="360"
                value={widget.rotation || 0}
                onChange={e =>
                  changeWidgetProperty(widget.id, { rotation: parseInt(e.target.value || "0", 10) })
                }
              />
  
              {/* ===== Video controls ===== */}
              {widget.type === 'video' && (
                <>
                  <p>Video URL:</p>
                  <input
                    type="text"
                    placeholder="/videos/intro.mp4 or https://cdn.example.com/clip.mp4"
                    value={widget.videoUrl || ""}
                    onChange={e =>
                      changeWidgetProperty(widget.id, { videoUrl: e.target.value || null })
                    }
                  />
  
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
                    onChange={e => changeWidgetProperty(widget.id, { loop: e.target.checked })}
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
                    onChange={e => changeWidgetProperty(widget.id, { muted: e.target.checked })}
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
                      changeWidgetProperty(widget.id, { controls: e.target.checked })
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
                  <span>Autoplay</span>
                  <input
                    type="checkbox"
                    checked={!!widget.autoplay}
                    onChange={(e) =>
                      changeWidgetProperty(widget.id, { autoplay: e.target.checked })
                    }
                  />
                </label>
                </>
              )}
  
              {/* ===== Dropdown controls ===== */}
              {widget.type === 'dropdown' && (() => {
                // Use a draft string while typing; default to current options joined with ", "
                const draft = widget.optionsText ?? (widget.options || []).join(", ");

                // Commit helper: turn the draft string into an options array and normalize it
                const commitOptions = (raw) => {
                  const arr = (raw || "")
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean); // drop empty tokens on commit only

                  const nextValue = arr.includes(widget.value) ? widget.value : (arr[0] || "");
                  // Save normalized text too so the input shows tidy commas + spaces
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
                      onChange={e => {
                        // While typing, only update the draft string; don't parse/sanitize yet.
                        changeWidgetProperty(widget.id, { optionsText: e.target.value });
                      }}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitOptions(e.currentTarget.value);
                          // keep focus if you want: e.currentTarget.blur();
                        }
                      }}
                      onBlur={e => commitOptions(e.currentTarget.value)}
                    />

                    <p>Selected Value:</p>
                    <input
                      type="text"
                      value={widget.value || ""}
                      onChange={e => changeWidgetProperty(widget.id, { value: e.target.value })}
                    />

                    <p>Font Size:</p>
                    <input
                      type="number"
                      min="10"
                      max="48"
                      value={widget.fontSize || 14}
                      onChange={e =>
                        changeWidgetProperty(
                          widget.id,
                          { fontSize: parseInt(e.target.value || "14", 10) }
                        )
                      }
                    />

                    <p>Text Color:</p>
                    <input
                      type="color"
                      value={widget.textColor || "#111111"}
                      onChange={e => changeWidgetProperty(widget.id, { textColor: e.target.value })}
                    />
                  </>
                );
              })()}

  
              {/* ===== Advertisement controls ===== */}
              {widget.type === 'advert' && (
                <>
                  <p>Image URL:</p>
                  <input
                    type="text"
                    placeholder="https://…/banner.jpg"
                    value={widget.imageUrl || ""}
                    onChange={e => changeWidgetProperty(widget.id, { imageUrl: e.target.value })}
                  />
  
                  <p>Link URL:</p>
                  <input
                    type="text"
                    placeholder="www.google.com"
                    value={widget.linkUrl || ""}
                    onChange={e => changeWidgetProperty(widget.id, { linkUrl: e.target.value })}
                  />
  
                  <p>Object Fit:</p>
                  <select
                    value={widget.objectFit || "cover"}
                    onChange={e => changeWidgetProperty(widget.id, { objectFit: e.target.value })}
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
                      onChange={e => changeWidgetProperty(widget.id, { showBorder: e.target.checked })}
                    />
                    Show border
                  </label>
  
                  <p>Border Color:</p>
                  <input
                    type="color"
                    value={widget.borderColor || "#333333"}
                    onChange={e => changeWidgetProperty(widget.id, { borderColor: e.target.value })}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      );
    }
  else {
      // If something is not selected
      return (
      <p>Select a widget to view its properties.</p>
    );
    }
  }  

  /** Christopher Parsons, 9/18/2025
   * Inputs:
   *  pages: array
   *  selectedPageID: number
   *  setSelectedID: number
   *  currentPage: Page
   *  createPage: function
   *  changePageProperty: function
   * 
   * Returns an interface for creating and modifying pages.
   */
function RightPagePanel({ pages, selectedPageID, setSelectedPageID, currentPage, createPage, changePageProperty }) {

  const downloadHTMLPage = (currentPage) => {
    console.log("Downloading page", currentPage);

    const file = new Blob([RenderPage(currentPage)], {type: 'text/html'});

    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "Page" + Date.now() + ".html";

    document.body.appendChild(element);
  }

  return(
    <div className={styles.widgetOptions}>
      {/* A view of all pages */}
      <select value={selectedPageID} onChange={e => setSelectedPageID(Number(e.target.value))}>
        {pages.map(page => (
          <option key={page.id} value={page.id}>{page.name}</option>
        ))}
      </select>
      
      {/* Buttons for editing pages */}
      <button onClick={createPage}>+ New Page</button>

      {/** Christopher Parsons, 9/18/2025
       * An interface for changing the width, height, and background color
       * of the currently selected page.
       */}
      <div>
        <p>Width</p>
        <input 
          type="input"
          min="0"
          autoComplete="off"
          value={currentPage.width}
          onChange={e => {
            if (e?.target.value === "") {
              changePageProperty(selectedPageID, { width: 0 })
            } else {
              changePageProperty(selectedPageID, { width: parseInt(e.target.value, 10) })
            }
          }}/>

        <p>Height</p>
        <input 
          type="input"
          min="0"
          autoComplete="off"
          value={currentPage.height}
          onChange={e => {
            if (e?.target.value === "") {
              changePageProperty(selectedPageID, { height: 0 })
            } else {
              changePageProperty(selectedPageID, { height: parseInt(e.target.value, 10) })
            }
          }}
          />

          <p>Background Color</p>
          <input 
            type="color"
            onChange={e => {
              if (e?.target.value === "") {
                changePageProperty(selectedPageID, { backgroundColor: '#ffffff' })
              } else {
                changePageProperty(selectedPageID, { backgroundColor: e.target.value })
              }
            }}
          />
      </div>

      {/* Download current page as HTML. IN PROGRESS */}
      <button >Download Page</button>
    </div>
  );
}