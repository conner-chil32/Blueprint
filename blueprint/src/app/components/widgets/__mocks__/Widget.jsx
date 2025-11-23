// Mock Widget for testing
export const Widget = ({ children, style, onDoubleClick, header, ...props }) => {
  return (
    <div data-testid="widget" style={style} onDoubleClick={onDoubleClick}>
      {header}
      {children}
    </div>
  );
};
