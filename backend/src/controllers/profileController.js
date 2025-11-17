import User from "../models/user.js";

export const updateProfile = async (req, res) => {
  try {
    const { college, year, targetRole, experience } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        profile: { college, year, targetRole, experience },
        profileCompleted: true,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });

  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
