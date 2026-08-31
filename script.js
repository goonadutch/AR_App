const categorySelect = document.getElementById("category")
const cameraBtn = document.getElementById("camera-btn")
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

function updateSubmitState() {
	submitBtn.disabled = !selectedPhoto
}

function capturePhoto() {
	cameraCanvas.width = cameraVideo.videoWidth
	cameraCanvas.height = cameraVideo.videoHeight
	const ctx = cameraCanvas.getContext("2d")
	ctx.drawImage(cameraVideo, 0, 0)

	cameraCanvas.toBlob((blob) => {
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

const SPACE_ID = "Neha03/spar-3d-mesh-generator"

async function runInference(photoFile) {
	const { Client } = await import("https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js")
	const client = await Client.connect(SPACE_ID)
	const result = await client.predict("/predict", {
		photo: photoFile,
		category: selectedCategory,
	})
	return result.data[0].url
}

function showResult(glbUrl) {
	const modelViewer = document.getElementById("model-viewer")
	modelViewer.src = glbUrl
	resultSection.hidden = false
}
