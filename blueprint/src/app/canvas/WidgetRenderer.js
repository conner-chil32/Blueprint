import { Box } from '../components/widgets/Box';

export function WidgetRenderer({ widget, onClick, alertDragStop, isSelected }) {

  /**
   * Render the correct type of widget.
   */
  switch (widget.type) {
    case 'box':
      {/*console.log('Rendering box widget:', widget);*/}
      return <Box key={widget.id} {...widget} onClick={onClick} alertDragStop={alertDragStop} isSelected={isSelected} />;
    default:
      console.log("Warning: Unknown widget type:", widget.type);
      return null;
  }
}