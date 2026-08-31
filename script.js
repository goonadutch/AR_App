const categorySelect = document.getElementById("category")
const photoInput = document.getElementById("photo")
const submitBtn = document.getElementById("submit-btn")

let selectedCategory = categorySelect.value
let selectedPhoto = null

categorySelect.addEventListener("change", () => {
	selectedCategory = categorySelect.value
})
