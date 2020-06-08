const onCanPlay = (video, fn) => {
    if(video.readyState >= video.HAVE_FUTURE_DATA)
        return fn()
    video.addEventListener(`canplay`, fn)
}

const preventDefault = fn => ev => { ev.preventDefault(); fn(ev)}

const startup = () => {
    const [video, canvas, photo, takePhotoBtn] = [`#current-image-stream`, `#image-canvas`, `#output-area`, `.take-photo`]
          .map(s => document.querySelector(s))

    const dimensions = {width: 320, height: null } // height resolved later

    const setPhotoFromCanvas = () => photo.setAttribute(`src`, canvas.toDataURL(`image/png`))

    const takePicture = () => {
        const ctx = canvas.getContext(`2d`)
        if(!dimensions.width || !dimensions.height)
            return clearPhoto()
        Object.assign(canvas, dimensions)
        ctx.drawImage(video, 0, 0, dimensions.width, dimensions.height)
        setPhotoFromCanvas()
    }

    const clearPhoto = () => {
        const ctx = canvas.getContext(`2d`)
        ctx.fillStyle = `#AAA`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        setPhotoFromCanvas()
    }

    const initializeVideo = () => {
        dimensions.height = video.videoHeight / (video.videoWidth / dimensions.width)
        console.log(`dimensions`, dimensions)
        video.setAttribute(`width`, dimensions[`width`])
        canvas.setAttribute(`width`, dimensions[`width`])
        video.setAttribute(`height`, dimensions[`height`])
        canvas.setAttribute(`height`, dimensions[`height`])
        takePhotoBtn.addEventListener(`click`, preventDefault(takePicture), false)
        clearPhoto()
    }

    onCanPlay(video, initializeVideo)

    navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(
        (stream) => {
            video.srcObject = stream
            video.play()
        }, (err) => console.error(`An error`, err)
    )
}

if(document.readyState === `loading`)
    window.addEventListener(`DOMContentLoaded`, startup)
else startup()
