const User = require("../models/User");

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // If a file was uploaded via multer, set profileImage to its accessible URL
    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/profile_images/${req.file.filename}`;
      user.profileImage = imageUrl;
    } else if (req.body.profileImage) {
      user.profileImage = req.body.profileImage || user.profileImage;
    }

    const updatedUser = await user.save();
    const userToReturn = updatedUser.toObject();
    delete userToReturn.password;
    res.json(userToReturn);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
