// src/app/canvas/payload.js
export function buildPagePayload(page) {
    const safeWidgets = (page?.widgets || []).map(w => {
      const {
        id, type, x, y, width, height, rotation, backgroundColor,
        // text
        text, fontSize, color, fontFamily, fontWeight, textAlign, lineHeight, letterSpacing, padding,
        // image
        imageUrl, alt, objectFit, showBorder, borderRadius, borderColor,
        // video
        videoUrl, autoplay, controls, loop, muted,
        // dropdown
        options, value, textColor, bgColor,
        // advert
        linkUrl,
      } = w;
  
      const base = { id, type, x, y, width, height, rotation, backgroundColor };
  
      switch (type) {
        case "text":
          return { ...base, text, fontSize, color, fontFamily, fontWeight, textAlign, lineHeight, letterSpacing, padding };
        case "image":
          return { ...base, imageUrl, alt, objectFit, showBorder, borderRadius, borderColor };
        case "video":
          return { ...base, videoUrl, autoplay, controls, loop, muted, objectFit };
        case "dropdown":
          return { ...base, options, value, fontSize, textColor, bgColor };
        case "advert":
          return { ...base, imageUrl, linkUrl, alt, objectFit, showBorder, borderColor };
        case "box":
        default:
          return { ...base };
      }
    });
  
    return {
      schemaVersion: 1,
      app: "blueprint",
      exportedAt: new Date().toISOString(),
      page: {
        id: page?.id ?? 0,
        name: page?.name ?? "Untitled",
        meta: {
          width: page?.width ?? 1440,
          height: page?.height ?? 1024,
          backgroundColor: page?.backgroundColor ?? "#ffffff",
        },
        widgets: safeWidgets,
      },
      assets: {},
    };
  }
  
  export function createPayloadString(page) {
    return JSON.stringify(buildPagePayload(page), null, 2);
  }
  