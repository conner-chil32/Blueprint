import { Box } from '../components/widgets/Box';
import { Video } from "../components/widgets/video";
import { Dropdown } from "../components/widgets/Dropdown";
import { Advert } from "../components/widgets/Advert";

export function WidgetRenderer({ widget, onClick, alertDragStop, isSelected, changeWidgetProperty }) {

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
    case "box":
      return <Box {...common} />;
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