import { Widget } from '@/components/widgets/Widget.jsx';

export function Hyperlink(props) {
    const {
        text = 'Default Link',
        url = '#',
        fontSize = 12,
        textColor = '#0000ee',
        openInNewTab = true,
    } = props;

    // These styles will be applied to the main div inside the Widget component.
    // This makes the entire widget a flex container to center its contents.
    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    };

    return (
        // We pass our containerStyle to the parent Widget
        <Widget {...props} style={containerStyle}>
        {/* This <a> tag is now a child of a flex container.
            It no longer needs width/height of 100% and will shrink to fit the text,
            leaving empty, clickable space around it inside the widget bounds.
        */}
        <a
            href={url}
            target={openInNewTab ? '_blank' : '_self'}
            rel="noopener noreferrer"
            style={{
            fontSize: `${fontSize}px`,
            color: textColor,
            textDecoration: 'underline',
            fontFamily: 'sans-serif',
            }}
            // This stops the click from deselecting the widget by bubbling up to the canvas
            onClick={(e) => e.stopPropagation()}
        >
            {text}
        </a>
        </Widget>
    );
}