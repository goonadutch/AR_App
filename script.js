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

updateSubmitState()
