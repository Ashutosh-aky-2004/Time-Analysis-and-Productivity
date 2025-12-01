import User from "../modal/User.js";
import { deleteAvatar } from "../helper/cloudinaryDeleteAvatar.js";

export const getProfileInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Profile structure
    const profile = {
      fullName: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phoneNumber || "",
      bio: user.bio || "",
      role: user.role || "",
      dailyGoal: user.dailyGoal || 0,
      weeklyGoal: user.weeklyGoal || 0,
      defaultCategory: user.defaultCategory || "",
      joinDate: new Date(user.createdAt).toDateString(),
      hoursTracked: user.hoursTracked || 0,
      avatar: user.avatar || "",
      
    };

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const updatePersonalDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const { firstName, lastName, phoneNumber, bio } = req.body;

    if (req.body.email || req.body.avatar || req.body.password) {
      return res.status(400).json({
        success: false,
        message: "You cannot update email, avatar or password from this route",
      });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (bio) updateData.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Transform for UI
    const profile = {
      fullName: `${updatedUser.firstName} ${updatedUser.lastName}`,
      email: updatedUser.email,
      phone: updatedUser.phoneNumber || "",
      bio: updatedUser.bio || "",
      role: updatedUser.role || "",
      dailyGoal: updatedUser.dailyGoal || 0,
      weeklyGoal: updatedUser.weeklyGoal || 0,
      defaultCategory: updatedUser.defaultCategory || "",
      joinDate: new Date(updatedUser.createdAt).toDateString(),
      hoursTracked: updatedUser.hoursTracked || 0,
      avatar: updatedUser.avatar || "",
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new password are required",
      });
    }

    // fetch user
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // hash new password
    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


export const updateProfileAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatar } = req.body;

    if (!avatar) return res.status(400).json({ error: "No avatar URL provided" });

    const user = await User.findById(userId).select("-password");
    user.avatar = avatar;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message+"Failed to update avatar" });
  }
}

export const deleteProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.avatar) return res.status(400).json({ message: "No avatar found" });

    await deleteAvatar(user.avatar);

    user.avatar = null;
    await user.save();

    res.status(200).json({ success: true, message: "Avatar removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}