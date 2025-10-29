import { useEffect, useState, useRef } from "react";
import styles from './page.module.css';
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import PageRenderer from "./PageRenderer";
import HTMLExport from "./HtmlExport";

// Helper function to get cookie value by name
const getCookieValue = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

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
    pages, selectedPageID, setSelectedPageID, currentPage, createPage,
    changePageProperty, recordState }) {
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
      {!buttonSelected ? <RightWidgetPanel changeWidgetProperty={changeWidgetProperty} selectedWidgets={selectedWidgets} widgets={widgets} deleteWidget={deleteWidget} recordState={recordState} />
        : <RightPagePanel pages={pages} selectedPageID={selectedPageID} setSelectedPageID={setSelectedPageID} currentPage={currentPage} createPage={createPage} changePageProperty={changePageProperty} />}
    </div>

  );
}

function downloadMediaToDisk(url, filepath) {

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
function RightWidgetPanel({ changeWidgetProperty, selectedWidgets, widgets, deleteWidget, recordState }) {

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
                onMouseDown={e => 
                  recordState()
                }
                onChange={e =>
                  // Change the rotation without updating history
                  changeWidgetProperty(widget.id, { rotation: parseInt(e.target.value || "0", 10) }, true)
                }
              />

              {/* ===== Menu Scroll controls ===== */}
              {widget.type === 'menuScroll' && (() => {
                const draft = widget.itemsText ?? (widget.items || []).join(", ");
                const commitItems = (raw) => {
                  const arr = (raw || "").split(",").map(s => s.trim()).filter(Boolean);
                  const normalizedText = arr.join(", ");
                  changeWidgetProperty(widget.id, { items: arr, itemsText: normalizedText });
                };

                return (
                  <>
                    <p>Menu Items (comma-separated):</p>
                    <textarea
                      value={draft}
                      onChange={e => changeWidgetProperty(widget.id, { itemsText: e.target.value })}
                      onBlur={e => commitItems(e.currentTarget.value)}
                      style={{ width: '100%', minHeight: '80px' }}
                    />

                    <p>Font Size:</p>
                    <input
                      type="number"
                      min="8"
                      value={widget.fontSize || 14}
                      onChange={e => changeWidgetProperty(widget.id, { fontSize: parseInt(e.target.value, 10) })}
                    />

                    <p>Text Color:</p>
                    <input
                      type="color"
                      value={widget.textColor || "#333333"}
                      onChange={e => changeWidgetProperty(widget.id, { textColor: e.target.value })}
                    />

                    <p>Item Padding:</p>
                    <input
                      type="number"
                      min="0"
                      value={widget.itemPadding || 8}
                      onChange={e => changeWidgetProperty(widget.id, { itemPadding: parseInt(e.target.value, 10) })}
                    />
                  </>
                );
              })()}

              {/* ===== Hyperlink controls ===== */}
              {widget.type === 'hyperlink' && (
            <>
              <p>Display Text:</p>
              <input
                type="text"
                value={widget.text || ""}
                onChange={e => changeWidgetProperty(widget.id, { text: e.target.value })}
              />

              <p>URL:</p>
              <input
                type="text"
                placeholder="https://example.com"
                value={widget.url || ""}
                onChange={e => changeWidgetProperty(widget.id, { url: e.target.value })}
              />

              <p>Font Size:</p>
              <input
                type="number"
                min="1"
                max="70"
                value={widget.fontSize || 12}
                onChange={e => changeWidgetProperty(widget.id, { fontSize: parseInt(e.target.value, 10) })}
              />

              <p>Text Color:</p>
              <input
                type="color"
                value={widget.textColor || "#0000ee"}
                onChange={e => changeWidgetProperty(widget.id, { textColor: e.target.value })}
              />

              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>Open in new tab</span>
                <input
                  type="checkbox"
                  checked={!!widget.openInNewTab}
                  onChange={e => changeWidgetProperty(widget.id, { openInNewTab: e.target.checked })}
                />
              </label>
            </>
          )}
  
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

                  <p>Or upload a local video:</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Show loading state with temporary object URL
                        const tempUrl = URL.createObjectURL(file);
                        changeWidgetProperty(widget.id, { videoUrl: tempUrl, uploading: true });

                        try {
                          // Upload to server
                          const formData = new FormData();
                          formData.append('video', file);
                          
                          // Get userId from UserCookie
                          const userId = getCookieValue('UserCookie') || 'user';
                          formData.append('subdirectory', userId); // subdirectory ID = userID

                          const response = await fetch('/api/upload-video', {
                            method: 'POST',
                            body: formData,
                          });

                          if (!response.ok) {
                            throw new Error('Upload failed');
                          }

                          const data = await response.json();
                          
                          // Update with server URL and clear loading state
                          URL.revokeObjectURL(tempUrl);
                          changeWidgetProperty(widget.id, { 
                            videoUrl: data.videoUrl,
                            uploading: false 
                          });

                          console.log('[Video Upload] Success:', data.filename);
                        } catch (error) {
                          console.error('[Video Upload] Error:', error);
                          alert('Failed to upload video. Please try again.');
                          URL.revokeObjectURL(tempUrl);
                          changeWidgetProperty(widget.id, { 
                            videoUrl: widget.videoUrl || null,
                            uploading: false 
                          });
                        }
                      }
                      // Reset file input
                      e.target.value = '';
                    }}
                  />
                  {widget.uploading && <p style={{color: '#4CAF50'}}>Uploading...</p>}
  
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

                <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #555'}}>
                  <p><b>Advanced (Placeholder)</b></p>
                  <p>Ad Service Code Snippet:</p>
                    <textarea
                      placeholder="Paste ad code snippet here (e.g., from Google AdSense)"
                      value={widget.adSnippet || ""}
                      onChange={e => changeWidgetProperty(widget.id, { adSnippet: e.target.value })}
                      style={{ width: '100%', minHeight: '100px', fontFamily: 'monospace', fontSize: '12px' }}
                    />
                </div>

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

  /** Christopher Parsons, 9/20/2025
   * Inputs:
   *  fileBlob: Blob object
   *  name: String
   * 
   * Downloads the inputted file to the user's computer.
   */
  function download(fileBlob, name) {
    const link = document.createElement('a');

    link.href = URL.createObjectURL(fileBlob);
    link.download = name;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  /** Christopher Parsons, 9/20/2025
   * 
   * Takes the given variable and returns a JSON file.
   */
  const returnJSON = (page) => {
    const jsonFile = JSON.stringify(page, null, 2);
    //const blob = new Blob([jsonFile], { type: "application/json" });

    return jsonFile;
  }

  /** Christopher Parsons, 9/22/2025
   * 
   * Takes the given page and returns an HTML file.
   */
  const returnHTML = (page) => {
    const html = HTMLExport(page);

    return html;
  }

  return (
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
          }} />

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

      {/* Download current page as HTML or JSON */}
      <p>Download as:</p>
      <select>
        {/* Download as HTML */}
        <option onClick={() => {
          const htmlFile = returnHTML(currentPage);
          const blob = new Blob([htmlFile], { type: "text/html" });
          download(blob, currentPage.name);
        }}>HTML</option>

        {/* Download as JSON */}
        <option onClick={() => {
          const jsonFile = returnJSON(currentPage);
          const blob = new Blob([jsonFile], { type: "application/json" });
          download(blob, currentPage.name)
        }}>JSON</option>
      </select>
    </div>
  );
}