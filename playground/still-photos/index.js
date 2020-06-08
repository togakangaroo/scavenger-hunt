const onCanPlay = (video, fn) => {
    if(video.readyState >= video.HAVE_FUTURE_DATA)
        return fn()
    video.addEventListener(`canplay`, fn)
}

const preventDefault = fn => ev => { ev.preventDefault(); fn(ev)}

const startup = () => {
    const [video, canvas, photoTemplate, photoArea, takePhotoBtn] = [`#current-image-stream`, `#image-canvas`, `#photo-output-template`, `#photo-output-area`, `.take-photo`]
          .map(s => document.querySelector(s))

    const dimensions = {width: 320, height: null } // height resolved later

    const createPhotoElement = (src) => {
      const photo = photoTemplate.content.cloneNode(true).querySelector(`img`)
      photo.setAttribute(`src`, src)
      photoArea.appendChild(photo)
    }

    const takePicture = () => {
        const ctx = canvas.getContext(`2d`)
        if(!dimensions.width || !dimensions.height)
            return
        Object.assign(canvas, dimensions)
        ctx.drawImage(video, 0, 0, dimensions.width, dimensions.height)
        createPhotoElement(canvas.toDataURL(`image/png`))
    }

    const initializeVideo = () => {
        dimensions.height = video.videoHeight / (video.videoWidth / dimensions.width)
        video.setAttribute(`width`, dimensions[`width`])
        canvas.setAttribute(`width`, dimensions[`width`])
        video.setAttribute(`height`, dimensions[`height`])
        canvas.setAttribute(`height`, dimensions[`height`])
        takePhotoBtn.addEventListener(`click`, preventDefault(takePicture), false)
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
