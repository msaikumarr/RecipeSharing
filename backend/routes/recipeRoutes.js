const express = require("express");
const router = express.Router();
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe, getRecipesByState, searchRecipes, getUserFavoriteRecipes, getUserRecipes, getRecipesByCategory } = require("../controllers/recipeController");
const { protect } = require("../middleware/authMiddleware");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage that chooses destination based on fieldname
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const base = path.join(__dirname, '..', 'uploads');
		const sub = file.fieldname === 'video' ? 'recipe_videos' : 'recipes';
		const uploadPath = path.join(base, sub);
		fs.mkdirSync(uploadPath, { recursive: true });
		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		const ext = path.extname(file.originalname);
		cb(null, file.fieldname + '-' + uniqueSuffix + ext);
	}
});

const upload = multer({ storage });

// Routes
// Accept optional image and video files when creating/updating recipes
router.post("/", protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), createRecipe); // Create a new recipe
router.get("/", getRecipes); // Get all recipes
router.get("/my-recipes", protect, getUserRecipes);
router.get("/state/:state", getRecipesByState); // get recipes by state
router.get("/search", searchRecipes); // search recipes based on name
router.get("/favorites", protect, getUserFavoriteRecipes); // get user's favorite recipes
router.get('/category/:category', getRecipesByCategory); // Add this route
router.get("/:id", getRecipeById); // Get a recipe by ID
router.put("/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), updateRecipe); // Update a recipe
router.delete("/:id", deleteRecipe); // Delete a recipe

module.exports = router;
