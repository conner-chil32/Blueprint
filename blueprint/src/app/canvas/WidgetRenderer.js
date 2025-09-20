import { Box } from '../components/widgets/Box';
import { Video } from "../components/widgets/video";
import { Dropdown } from "../components/widgets/Dropdown";
import { Advert } from "../components/widgets/Advert";

/** Christopher Parsons, 9/18/2025
 *  Angel Ramirez
 * Inputs:
 *  widget: Widget
 *  onClick: function
 *  alertDragStop: function
 *  isSelected: Boolean
 *  onDragStart: function
 *  onDragStop: function
 *  scale: number
 *  changeWidgetProperty: function
 * 
 * Updates the current state of the inputted widget in React.
 */
export function WidgetRenderer({ widget, onClick, alertDragStop, isSelected, onDragStart, onDragStop, scale, changeWidgetProperty }) {

  /**
   * Render the correct type of widget.
   */

  const { key: _ignoredKey, ...w } = widget;

  const common = {
    ...widget,
    onClick,
    alertDragStop,
    isSelected,
  };

  switch (widget.type) {
    case 'box':
      return <Box key={widget.id} {...widget} onClick={onClick} alertDragStop={alertDragStop} isSelected={isSelected} onDragStart={onDragStart} onDragStop={onDragStop} scale={scale} />;
    case "video":
      return <Video {...common} />;
    case "dropdown":
      return <Dropdown 
                {...common}
                onValueChange={(v) => changeWidgetProperty(widget.id, { value: v })}
                changeWidgetProperty={changeWidgetProperty}
            />;
    case "advert":
      return <Advert {...common} />;
    default:
      console.warn("Warning: Unknown widget type:", widget.type);
      return null;
  }
}