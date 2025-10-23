import React, { useState, useEffect, useRef, useCallback } from "react";
import { analyzeAction } from "@/action/analyzeAction";
import { removeHtmlMarkdownWrapper } from "@/app/utils/html";

export function useAnalysisLogic(photoDataUrl, setPhotoDataUrl, setErrorMessage, resultRef){
    const [state, formAction] = React.useActionState(analyzeAction, {
        ok: false,
        html: '',
        rid: ''
    })//panggil action yang akan dipakai dan set initial state yang akan digunakan

    const ridRef = useRef("");
    const ridInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typedHtml, setTypedHtml] = useState('');
    const [responseHtml, setResponseHtml] = useState('');
    
    const retakePhotoAnalysis = useCallback(() => {
        //apus/reset yang berhubungan dengan state analysis
        setResponseHtml('');
        setTypedHtml('');
        setIsTyping(false);
        setIsLoading(false);
        window?.scrollTo({top:0, behavior:'smooth'})
    }, []);

    const onSubmit = useCallback((e) => {
        if(!photoDataUrl){
            e.preventDefault();
            setErrorMessage('Belum ada foto. Ambil foto dulu gih..');
            return;
        }

        const rid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        ridRef.current = rid;
        if(ridInputRef.current) ridInputRef.current.value = rid;

        setIsLoading(true);
        setTypedHtml('');
        setIsTyping(true);
        setErrorMessage('')
    }, [photoDataUrl, setErrorMessage]);

    useEffect(() => {
        //effect for processing analysis state change
        if(!state.ok || String(state?.rid ?? "") !== String(ridRef.current)) return;

        let raw = typeof state.html === "string" ? state.html : "";
        
        raw = removeHtmlMarkdownWrapper(raw)

        setIsLoading(false);

        if(!raw.trim()){
            setResponseHtml('');
            setTypedHtml('');
            setIsTyping(false);
            return;
        }

        setResponseHtml(raw);
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "start"});

        //typing effect logic
        const parts = raw.split(/(?=<section)/g).filter(Boolean);

        let i = 0
        setTypedHtml('');
        setIsTyping(true);

        const step = () =>{
            if(i >= parts.length){
                setIsTyping(false);
                return;
            }
            const chunk = String(parts[i++] ?? "")
            if(!chunk){
                setTimeout(step, 0)
                return
            }

            setTypedHtml(prev => String(prev ?? "") + chunk)
            setTimeout(step, 160);
        }
        step();
    }, [state])

    //Combine retake logic from useCaptureLogic with analysis cleanup
    const fullRetake = useCallback(() => {
        setPhotoDataUrl(''); // dari useCaptureLogic dependency
        retakePhotoAnalysis();
    }, [setPhotoDataUrl, retakePhotoAnalysis]);

    return{ ridInputRef, formAction, onSubmit, isLoading, typedHtml, isTyping, responseHtml, fullRetake, state};
}

