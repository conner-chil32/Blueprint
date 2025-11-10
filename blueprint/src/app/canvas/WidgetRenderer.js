import { Box } from '../components/widgets/Box';
import { Circle } from '../components/widgets/Circle';
import { Polygon } from '../components/widgets/Polygon';
import { Triangle } from '../components/widgets/Triangle';
import { Video } from "../components/widgets/video";
import { Dropdown } from "../components/widgets/Dropdown";
import { Advert } from "../components/widgets/Advert";
import { Hyperlink } from '../components/widgets/Hyperlink';
import { MenuScroll } from "../components/widgets/MenuScroll";
import { CustomHTML } from "../components/widgets/CustomHTML";

/** Christopher Parsons, 9/18/2025
 *  Angel Ramirez
 * Inputs:
 *  staticRender: Boolean
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
export function WidgetRenderer({ staticRender=false, widget, onClick, recordState, alertDragStop, isSelected, onDragStart, onDrag, onDragStop, scale = 1, changeWidgetProperty, style, pageWidth, pageHeight  }) {
  const { key: _ignoredKey, ...w } = widget;

  const common = {
    ...widget,
    onClick,
    alertDragStop,
    onDragStart,
    onDrag,
    onDragStop,
    isSelected,
    staticRender,
    recordState,
    scale,
    style,
    pageWidth,
    pageHeight,
  };

  switch (widget.type) {
    case 'box':
      return <Box key={widget.id} {...common} />;
    case 'circle':
      return <Circle key={widget.id} {...common} />;
    case 'triangle':
      return <Triangle key={widget.id} {...common} />;
    case 'polygon':
      return <Polygon key={widget.id} {...common} />;
    case "video":
      return <Video key={widget.id} {...common} />;
    case "dropdown":
      return <Dropdown 
                key={widget.id} {...common}
                {...common}
                onValueChange={(v) => changeWidgetProperty(widget.id, { value: v })}
                changeWidgetProperty={changeWidgetProperty}
            />;
    case "advert":
      return <Advert key={widget.id} {...common} />;
    
    case "hyperlink":
      return <Hyperlink key={widget.id} {...common} />;

    case "menuScroll":
      return <MenuScroll key={widget.id} {...common} changeWidgetProperty={changeWidgetProperty} />;
    case "html":
      return (
        <CustomHTML
          key={widget.id}
          {...common}
          html={widget.html}
          sandbox={!!widget.sandbox}
        />
      );
    default:
      console.warn("Warning: Unknown widget type:", widget.type);
      return null;
  }
}
