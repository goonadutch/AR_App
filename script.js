const categorySelect = document.getElementById("category")
const photoInput = document.getElementById("photo")
const submitBtn = document.getElementById("submit-btn")
const statusSection = document.getElementById("status-section")
const statusText = document.getElementById("status-text")
const resultSection = document.getElementById("result-section")

let selectedCategory = categorySelect.value
let selectedPhoto = null

categorySelect.addEventListener("change", () => {
	selectedCategory = categorySelect.value
})

photoInput.addEventListener("change", () => {
	selectedPhoto = photoInput.files[0] || null
	updateSubmitState()
})

function updateSubmitState() {
	submitBtn.disabled = !selectedPhoto
}

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
		const usdzUrl = await runInference(selectedPhoto)
		setStatus("")
	} catch (err) {
		setStatus("Something went wrong: " + err.message)
	} finally {
		submitBtn.disabled = false
	}
}

// Backend not connected yet. Replace this with a real call to the
// Hugging Face Space once it is deployed.
async function runInference(photoFile) {
	throw new Error("backend not connected yet")
}
