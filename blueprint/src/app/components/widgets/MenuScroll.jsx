import { Widget } from '@/components/widgets/Widget.jsx';

export function MenuScroll(props) {
    const {
        items = [],
        fontSize = 14,
        textColor = '#333333',
        itemPadding = 8,
        backgroundColor,
        selectedValue,
        changeWidgetProperty,
        id,
    } = props;

    const scrollContainerClass = `menu-scroll-container-${id}`;

    const handleItemClick = (e, item) => {
        e.stopPropagation();
        changeWidgetProperty(id, { selectedValue: item });
    };

    return (
        <Widget {...props} style={{ backgroundColor: backgroundColor || '#f0f0f0' }}>
        {/* These are the styles that were accidentally removed. They are now restored. */}
        <style>{`
            .${scrollContainerClass}::-webkit-scrollbar {
            width: 12px;
            }
            .${scrollContainerClass}::-webkit-scrollbar-track {
            background: #e0e0e0;
            border-radius: 10px;
            }
            .${scrollContainerClass}::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
            border: 3px solid #e0e0e0;
            }
            .${scrollContainerClass}::-webkit-scrollbar-thumb:hover {
            background: #555;
            }
        `}</style>
        
        <div
            className={scrollContainerClass}
            style={{
            width: '100%',
            height: '100%',
            overflowY: 'scroll',
            fontFamily: 'sans-serif',
            fontSize: `${fontSize}px`,
            }}
            onWheel={(e) => e.stopPropagation()}
            //onMouseDown={(e) => e.stopPropagation()}
        >
            {items.map((item, index) => {
            const isSelected = selectedValue === item;

            return (
                <div
                key={index}
                style={{
                    padding: `${itemPadding}px`,
                    borderBottom: '1px solid #ddd',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#a0c4ff' : 'transparent',
                    color: isSelected ? '#001d3d' : textColor,
                    fontWeight: isSelected ? 'bold' : 'normal',
                }}
                onClick={(e) => handleItemClick(e, item)}
                >
                {item}
                </div>
            );
            })}
        </div>
        </Widget>
    );
}