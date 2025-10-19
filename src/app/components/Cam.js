'use client'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import Webcam from 'react-webcam'
import { FiBookOpen, FiCamera, FiRefreshCcw } from "react-icons/fi";
import { analyzeAction } from '@/action/analyzeAction';

function usePotrait() {
    const [potrait, setPotrait] = useState(false);

    useEffect(() => {
        const screenMedia = window.matchMedia("(orientation: portrait)")

        const onChange = () => setPotrait(screenMedia.matches)
        onChange()
        screenMedia.addEventListener?.("change", onChange);
        return () => screenMedia.removeEventListener?.("change", onChange)
    }, [])

    return potrait
}

const cleanUpHTML = (html) => 
    String(html ?? "")
    .replace(/\bundefined\b\s*$/i, "")
    .replace(/<\/section>\s*undefined\s*$/i, "</section>")
function Cam() {
    const webcamRef = useRef(null)
    const resultRef = useRef(null)
    const canvasRef = useRef(null)

    const [state, formAction] = React.useActionState(analyzeAction, {
        ok: false,
        html: '',
        rid: ''
    })

    const ridRef = useRef("")
    const ridInputRef = useRef(null)

    const [photoDataUrl, setPhotoDataUrl] = useState("");
    const [isLoading, setIsloading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [typedHtml, setTypedHtml] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [responseHtml, setResponseHtml] = useState('');


    const isPotrait = usePotrait(); //cek ukuran
    const videoConstraint = useMemo(
        () => ({
            facingMode: "user",
            width: { ideal: isPotrait? 720 : 1280 },
            height: { ideal: isPotrait? 1280 : 720 },
            frameRate: { ideal: 30, max: 60 }
        }), [isPotrait]
    )

    function capturePhoto(){
        setErrorMessage('')
        const video = webcamRef.current?.video; //capture video
        const canvas = canvasRef.current;
        console.log("canvas", canvas)
        console.log("video", video)
        if (!video || !canvas || !video.videoWidth){
            setErrorMessage("kamera belum siap, tunggu yaa........");
        }

         const vw = video.videoWidth, vh = video.videoHeight;

        const targetW = isPotrait ? 720 : 1280;
        const targetH = isPotrait ? 1280 : 720;
        
        const srcAspect = vw / vh, dstAspect = targetW / targetH;
        
        let sx = 0, sy = 0, sw = vw, sh = vh;

        if(srcAspect > dstAspect) { 
            sh = vh;
            sw = Math.round(vh * dstAspect); 
            sx = Math.round((vw - sw) / 2);
        } else {
            sw = vw;
            sh = Math.round(vw / dstAspect);
            sy = Math.round((vh - sh) / 2);
        }
        
        canvas.width = targetW;
        canvas.height = targetH;

        const context = canvas.getContext("2d")
        context.drawImage(video, sx, sy, sw, sh, 0, 0, targetW, targetH);

        const result = canvas.toDataURL("image/jpeg", 0.9)
        console.log(result)
        setPhotoDataUrl(result)
    }

    function retakePhoto(){
        setPhotoDataUrl('');
        setResponseHtml('');
        setTypedHtml('');
        setIsTyping(false);
        setIsloading(false);
        setErrorMessage('');

        window?.scrollTo({top : 0, behavior: "smooth"})
    }

    function onSubmit(e){
        if(!photoDataUrl){
            e.preventDefault();
            setErrorMessage("Belum ada foto. Ambil foto dah gih")
            return
        }

        const rid=`${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        console.log("rid",rid)
        ridRef.current = rid;
        if(ridInputRef.current) 
            ridInputRef.current.value = rid;

        console.log("ridInputRef.current.value : ",ridInputRef.current.value)

        setIsloading(true)
        setTypedHtml('')
        setIsTyping(true)
        setErrorMessage('')
    }

    useEffect(() =>{
        if(!state.ok || String(state?.rid?? "") !== String(ridRef.current)) return;

        const raw = typeof state.html === "string" ? state.html :"";
        setIsloading(false);

        if(!raw.trim()) {
            setResponseHtml('');
            setTypedHtml('');
            setIsTyping(false)
            return;
        }

        setResponseHtml(raw)
        resultRef.current.scrollIntoView({ behavior: "smooth", block:"start"});

        const parts = raw.split(/(?=<section)/g).filter(Boolean);

        let i = 0
        setTypedHtml('')
        setIsTyping(true)

        const step = () => {
            if(i >= parts.length){
                setIsTyping(false);
                return;
            }

            const chunk = String(parts[i++] ?? "")
            if(!chunk){
                setTimeout(step, 0)
                return
            }

            setTypedHtml(prev =>String(prev ??"") + chunk)
            setTimeout(step, 160);
        }

        step();
        }, [state])

        const htmlToRender = cleanUpHTML(typedHtml || (isTyping ? "" : responseHtml) ||"")
  return (
    <div>
        <div className='relative w-full rounded overflow-hidden bg-black'>
            <Webcam 
                ref={webcamRef}
                audio={false}
                className={` ${isPotrait ? 'aspect-[9/16]': 'aspect-video'} object-cover`}
                videoConstraints = {videoConstraint}
                mirrored
                screenshotFormat='image/jpeg'
                screenshotQuality={0.9}
            />

            {photoDataUrl && (
                <img src={photoDataUrl} alt='capture' className='absolute inset-0 w-full h-full object-cover' />
            )}

            <div className='absolute bottom-1 left-1/2 -translate-1/2 flex items-center gap-3'>
                {!photoDataUrl ? (
                    <button
                    onClick={capturePhoto}
                    className='w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center shadow'
                    title='Ambil foto'><FiCamera /></button>
                ) : (
                    <button
                    onClick={retakePhoto}
                    className='w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center shadow'
                    title='Retake foto'><FiRefreshCcw/></button>
                )
                }

                <form action={formAction} onSubmit={onSubmit}>
                    <input type='hidden' name="image" value={photoDataUrl} />
                    <input ref={ridInputRef} type='hidden' name='rid'  defaultValue={''} />

                    <button
                        type='submit'
                        disabled={!photoDataUrl || isLoading }
                        className={`px-4 h-14 rounded-xl text-white shadow transition ${
                            !photoDataUrl || isLoading ? "bg-gray-400" : "bg-emerald-700 hover:bg-emerald-800"
                        }`}
                        title='Analisis & Ramalan'
                    >
                        {isLoading ? "Tungguuu" : "Ramal"}
                    </button>
                </form>
            </div>
            {errorMessage && (<p className='w-full'>{errorMessage}</p>)}
            <canvas ref={canvasRef} className='hidden' />
            
        </div>
        <section ref={resultRef} className='w-full'>
            <div className='bg-gray-800 p-6 mt-8 rounded-xl shadow border border-gray-700'>
                <div className='text-lg text-amber-300 flex gap-2 items-center font-bold'>
                    <FiBookOpen />Hasil Ramalan
                </div>
                {isTyping && !typedHtml && (
                    <div className='flex items-center gap-1 text-sm text-gray-500'>
                        <span className='w-2 h2 rounded-full bg-gray-400 animate-pulse'/>

                        <span className='w-2 h2 rounded-full bg-gray-400 animate-pulse [animation-delay:.15s]'/>
                        <span className='w-2 h2 rounded-full bg-gray-400 animate-pulse [animation-delay:.3s]'/>
                    </div>
                )}
                {htmlToRender.trim() ? (
                    <div 
                        className='text-base leading-6 
                        [&_section]:mt-3
                        [&_h2]:mt-3
                        [$_ht]:text-lg
                        [$_ht]:font-bold 
                        '
                        dangerouslySetInnerHTML={{ __html: htmlToRender }}
                    />
                ) : (
                    <div className='bg-gray-500 p-4'>
                        <p className='font-semibold text-white'>Ambil Foto kamu lalu tekan 'Ramalkan' agar kamu tau kondisi kamu sekarang, asoyy</p>
                    </div>
                )}
            </div>
        </section>
    </div>
  )
}

export default Cam