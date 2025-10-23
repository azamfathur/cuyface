export function retakePhoto(setIsTyping, setIsloading, setErrorMessage, setPhotoDataUrl, setResponseHtml, setTypedHtml) {
        setPhotoDataUrl('');
        setResponseHtml('');
        setTypedHtml('');
        setIsTyping(false);
        setIsloading(false);
        setErrorMessage('');

        window?.scrollTo({top : 0, behavior: "smooth"})
}

