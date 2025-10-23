export const cleanUpHTML = (html) => 
    String(html ?? "")
    .replace(/\bundefined\b\s*$/i, "")
    .replace(/<\/section>\s*undefined\s*$/i, "</section>")

export const removeHtmlMarkdownWrapper = (text) => {
    if(typeof text !== 'string' || text.length === 0){
        return ''
    }

    //regex
    const regex = /^\s*```(?:html)?\s*([\s\S]*?)\s*```\s*$/s;

    const match = text.match(regex);

    //jadi bagian akan ada 3 section yang akan di split (1)```html (2)text (3)``` kalau match setelahnya akan return (2)text yang telah di trim 
    if (match && match[1] !== undefined ){
        return match[1].trim();
    }

    // kalau ga match ya balikin textnya lagi
    return text;
}