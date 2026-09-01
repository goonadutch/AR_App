const categorySelect = document.getElementById("category")
const cameraBtn = document.getElementById("camera-btn")
const fileInput = document.getElementById("file-input")
const cameraVideo = document.getElementById("camera-video")
const cameraCanvas = document.getElementById("camera-canvas")
const captureBtn = document.getElementById("capture-btn")
const previewSection = document.getElementById("preview-section")
const previewImg = document.getElementById("preview-img")
const retakeBtn = document.getElementById("retake-btn")
const submitBtn = document.getElementById("submit-btn")
const statusSection = document.getElementById("status-section")
const statusText = document.getElementById("status-text")
const resultSection = document.getElementById("result-section")

let selectedCategory = categorySelect.value
let selectedPhoto = null
let cameraStream = null

categorySelect.addEventListener("change", () => {
	selectedCategory = categorySelect.value
})

async function openCamera() {
	cameraStream = await navigator.mediaDevices.getUserMedia({
		video: { facingMode: "environment" },
	})
	cameraVideo.srcObject = cameraStream
	cameraVideo.hidden = false
	captureBtn.hidden = false
	cameraBtn.hidden = true
	previewSection.hidden = true
}

cameraBtn.addEventListener("click", () => {
	openCamera().catch((err) => setStatus("Could not open camera: " + err.message))
})

fileInput.addEventListener("change", () => {
	const file = fileInput.files[0]
	if (!file) return
	stopCamera()
	selectedPhoto = file
	previewImg.src = URL.createObjectURL(file)
	cameraVideo.hidden = true
	captureBtn.hidden = true
	cameraBtn.hidden = false
	previewSection.hidden = false
	updateSubmitState()
})

function updateSubmitState() {
	submitBtn.disabled = !selectedPhoto
}

function capturePhoto() {
	if (!cameraVideo.videoWidth || !cameraVideo.videoHeight) {
		setStatus("Camera is not ready yet, wait a moment and try again.")
		return
	}

	cameraCanvas.width = cameraVideo.videoWidth
	cameraCanvas.height = cameraVideo.videoHeight
	const ctx = cameraCanvas.getContext("2d")
	ctx.drawImage(cameraVideo, 0, 0)

	cameraCanvas.toBlob((blob) => {
		if (!blob) {
			setStatus("Could not capture photo, try again.")
			return
		}
		selectedPhoto = blob
		previewImg.src = URL.createObjectURL(blob)
		stopCamera()
		cameraVideo.hidden = true
		captureBtn.hidden = true
		previewSection.hidden = false
		updateSubmitState()
	}, "image/jpeg", 0.9)
}

function stopCamera() {
	if (cameraStream) {
		cameraStream.getTracks().forEach((track) => track.stop())
		cameraStream = null
	}
}

captureBtn.addEventListener("click", capturePhoto)

retakeBtn.addEventListener("click", () => {
	selectedPhoto = null
	fileInput.value = ""
	previewSection.hidden = true
	updateSubmitState()
	openCamera().catch((err) => setStatus("Could not open camera: " + err.message))
})

function setStatus(message) {
	statusSection.hidden = !message
	statusText.textContent = message
}

updateSubmitState()

submitBtn.addEventListener("click", handleSubmit)

async function handleSubmit() {
	if (!selectedPhoto) return

	resultSection.hidden = true
	submitBtn.disabled = true
	setStatus("Generating model, this can take a minute...")

	try {
		const glbUrl = await runInference(selectedPhoto)
		showResult(glbUrl)
		setStatus("")
	} catch (err) {
		setStatus("Something went wrong: " + err.message)
	} finally {
		submitBtn.disabled = false
	}
}

const SERVER_URL = "PASTE_YOUR_NGROK_URL_HERE"

async function runInference(photoFile) {
	const formData = new FormData()
	formData.append("photo", photoFile, "photo.jpg")

	const response = await fetch(SERVER_URL + "/generate", {
		method: "POST",
		body: formData,
	})

	if (!response.ok) {
		throw new Error("Server returned " + response.status)
	}

	const blob = await response.blob()
	return URL.createObjectURL(blob)
}

function showResult(glbUrl) {
	const modelViewer = document.getElementById("model-viewer")
	modelViewer.src = glbUrl
	resultSection.hidden = false
}
