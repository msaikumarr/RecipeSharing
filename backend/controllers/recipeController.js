const { protect } = require("../middleware/authMiddleware");
const Recipe = require("../models/Recipe");

const createRecipe = async (req, res) => {
  try {
    // Fields can come from multipart FormData (req.body) and files (req.files)
    const { title, description, image, video, ingredients, steps, category, state, benefits, recommendedHotels } = req.body;

    // Normalize ingredients and steps if they are comma/newline separated strings
    const normalizedIngredients = Array.isArray(ingredients)
      ? ingredients
      : (ingredients ? ingredients.split(',').map(i => i.trim()).filter(Boolean) : []);
    const normalizedSteps = Array.isArray(steps)
      ? steps
      : (steps ? steps.split(',').map(s => s.trim()).filter(Boolean) : []);

    // Parse recommendedHotels if provided as text
    let normalizedHotels = [];
    if (Array.isArray(recommendedHotels)) {
      normalizedHotels = recommendedHotels;
    } else if (typeof recommendedHotels === 'string' && recommendedHotels.trim()) {
      normalizedHotels = recommendedHotels.split('\n').map(line => {
        const [name, location, rating] = line.split(',');
        return { name: name?.trim(), location: location?.trim(), rating: parseFloat(rating) };
      });
    }

    // Handle uploaded files (multer)
    let imageUrl = image || '';
    let videoUrl = video || '';
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/recipes/${req.files.image[0].filename}`;
      }
      if (req.files.video && req.files.video[0]) {
        videoUrl = `${req.protocol}://${req.get('host')}/uploads/recipe_videos/${req.files.video[0].filename}`;
      }
    }

    const newRecipe = new Recipe({
      title,
      description,
      image: imageUrl,
      video: videoUrl,
      ingredients: normalizedIngredients,
      steps: normalizedSteps,
      category,
      state,
      benefits,
      recommendedHotels: normalizedHotels,
      user: req.user._id // Assuming you store user ID in the token
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
}



// Get all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a recipe
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // Update fields from req.body
    const fields = ['title', 'description', 'category', 'state', 'benefits'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) recipe[f] = req.body[f];
    });

    // Ingredients and steps normalization
    if (req.body.ingredients !== undefined) {
      recipe.ingredients = Array.isArray(req.body.ingredients)
        ? req.body.ingredients
        : (req.body.ingredients ? req.body.ingredients.split(',').map(i => i.trim()).filter(Boolean) : []);
    }
    if (req.body.steps !== undefined) {
      recipe.steps = Array.isArray(req.body.steps)
        ? req.body.steps
        : (req.body.steps ? req.body.steps.split(',').map(s => s.trim()).filter(Boolean) : []);
    }

    // recommendedHotels
    if (req.body.recommendedHotels !== undefined) {
      if (Array.isArray(req.body.recommendedHotels)) recipe.recommendedHotels = req.body.recommendedHotels;
      else if (typeof req.body.recommendedHotels === 'string' && req.body.recommendedHotels.trim()) {
        recipe.recommendedHotels = req.body.recommendedHotels.split('\n').map(line => {
          const [name, location, rating] = line.split(',');
          return { name: name?.trim(), location: location?.trim(), rating: parseFloat(rating) };
        });
      } else recipe.recommendedHotels = [];
    }

    // Handle uploaded files
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        recipe.image = `${req.protocol}://${req.get('host')}/uploads/recipes/${req.files.image[0].filename}`;
      }
      if (req.files.video && req.files.video[0]) {
        recipe.video = `${req.protocol}://${req.get('host')}/uploads/recipe_videos/${req.files.video[0].filename}`;
      }
    }

    const updated = await recipe.save();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get recipes by state
const getRecipesByState = async (req, res) => {
  try {
    const { state } = req.params;

    // Find recipes that match the selected state
    const recipes = await Recipe.find({ state });

    if (recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found for this state" });
    }

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Search recipes by title
const searchRecipes = async (req, res) => {
  console.log('hello');
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: "Title is required for searching." });
    }
    console.log("🔍 Searching for recipes with title:", title); // Debugging log

    // Case-insensitive search using regex
    const recipes = await Recipe.find({ title: { $regex: title, $options: "i" } });

    console.log(" Found recipes:", recipes); // Debugging log
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found with that title." });
    }
    res.json(recipes);
  } catch (error) {
    console.error(" Search Error:", error); // Logs error to console
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Toggle Favorite Recipe
const getUserFavoriteRecipes = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all recipes where the user is in the `favoritedBy` array
    const favoriteRecipes = await Recipe.find({ favoritedBy: userId });

    res.json(favoriteRecipes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// user uploaded recipes
const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getRecipesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const recipes = await Recipe.find({ category });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe, getRecipesByState, searchRecipes, getUserFavoriteRecipes, protect, getUserRecipes, getRecipesByCategory };
