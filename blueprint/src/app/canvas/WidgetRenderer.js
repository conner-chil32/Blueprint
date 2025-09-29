import { Box } from "../components/widgets/Box";
import { Video } from "../components/widgets/video";
import { Dropdown } from "../components/widgets/Dropdown";
import { Advert } from "../components/widgets/Advert";
import { Image as ImageWidget } from "../components/widgets/Image";
import { Text } from "../components/widgets/Text";
import { Hyperlink } from "../components/widgets/Hyperlink";
import { MenuScroll } from "../components/widgets/MenuScroll";

export function WidgetRenderer({
  widget,
  onClick,
  alertDragStop,
  isSelected,
  onDragStart,
  onDragStop,
  scale,
  changeWidgetProperty,
}) {
  /**
   * Render the correct type of widget.
   */

  const { key: _ignoredKey, ...w } = widget;

  const common = {
    ...widget,
    ...w,
    onClick,
    alertDragStop,
    isSelected,
    changeWidgetProperty,
    onDragStart,
    onDragStop,
    scale,
  };

  switch (widget.type) {
    case "box":
      {/*console.log('Rendering box widget:', widget);*/}
      return (
        <Box
          key={widget.id}
          {...widget}
          onClick={onClick}
          alertDragStop={alertDragStop}
          isSelected={isSelected}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          scale={scale}
        />
      );

    case "video":
      return <Video {...common} />;

    case "dropdown":
      return (
        <Dropdown
          {...common}
          onValueChange={(v) => changeWidgetProperty(widget.id, { value: v })}
          changeWidgetProperty={changeWidgetProperty}
        />
      );

    case "advert":
      return <Advert {...common} />;

    case "text":
      return (
        <Text
          {...common}
          onTextChange={(t) => changeWidgetProperty(widget.id, { text: t })}
          onDoubleClick={() =>
            changeWidgetProperty(widget.id, { isEditing: true })
          }
        />
      );

    case "image":
      return (
        <ImageWidget
          {...common}
          onImageUrlChange={(u) =>
            changeWidgetProperty(widget.id, { imageUrl: u })
          }
        />
      );

    case "hyperlink":
      return <Hyperlink {...common} />;

    case "menuScroll":
      return (
        <MenuScroll
          {...common}
          changeWidgetProperty={changeWidgetProperty}
        />
      );

    default:
      console.warn("Warning: Unknown widget type:", widget.type);
      return null;
  }
}
