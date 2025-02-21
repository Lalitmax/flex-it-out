// Schedule the function to run every midnight
import cron from "node-cron";
import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    console.log("papa");
    const { name, surname, email, mobile, password } = req.body;
    console.log(req.body);

    if (!name || !surname || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "field found empty",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      surname,
      email,
      password: hashedPass,
      mobile,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    const options = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };

    res.status(201).cookie("token", token, options).json({
      message: "Registered successfully",
      success: true,
      token,
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
      error,
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("start");
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "field found empty",
      });
    }
    console.log("end");
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "user not found",
        success: false,
      });
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return res.status(400).json({
        message: "Incorrect password.",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    const options = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };

    res.status(201).cookie("token", token, options).json({
      message: "logged in successfully",
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.aggregate([
      {
        $addFields: {
          totalExercises: {
            $sum: ["$pushUps", "$curls", "$squats"],
          },
        },
      },
      { $sort: { totalExercises: -1 } },
      { $limit: 3 },
    ]);

    res.status(200).json({
      success: true,
      leaderboard: topUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    console.log("1");
    const user = await User.findById(req.user.id).select("-password");
    console.log("2");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("3");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateNameAndPass = async (req, res) => {
  try {
    console.log(req.body);
    const { firstName, lastName, oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    console.log(user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update name fields if provided
    if (firstName) user.name = firstName;
    if (lastName) user.surname = lastName;

    // Password update logic
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect password" });
      }

      if (newPassword.length < 8) {
        return res
          .status(400)
          .json({
            success: false,
            message: "New password must be at least 8 characters long",
          });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: { firstName: user.firstName, lastName: user.lastName }, // Send updated details
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "No data found" });

    const caloriesBurned =
      user.pushUps * 0.29 + user.curls * 0.2 + user.squats * 0.32;

    res.status(200).json({
      success: true,
      message: "user calories fetched successfully",
      caloriesBurned,
      pushUps: user.pushUps,
      curls: user.curls,
      squats: user.squats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const detail = await User.findById(decoded.userId);
    return res.status(200).json({
      success: true,
      user: detail,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const updateExerciseCount = async (req, res) => {
  try {
    console.log("Received request!");

    const { exercise } = req.body;
    const userId = req.user.id; // Assuming authentication middleware sets `req.user`

    console.log("Exercise from frontend:", exercise); // Expected values: pushup, curl, squat

    // Map frontend names to schema field names
    const exerciseMap = {
      pushup: "pushUps",
      curl: "curls",
      squat: "squats",
    };

    const mappedExercise = exerciseMap[exercise];

    if (!mappedExercise) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid exercise type" });
    }

    console.log("Updating:", mappedExercise);

    await User.findByIdAndUpdate(userId, { $inc: { [mappedExercise]: 1 } });

    res.json({ success: true, message: `${mappedExercise} count updated!` });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ success: false, error: "Database update failed" });
  }
};

// Function to reset exercise data at 12 AM and store history
export const saveExerciseSession = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    
    const caloriesBurned =
      user.pushUps * 0.29 + user.curls * 0.2 + user.squats * 0.32;

    
    if (user.pushUps > 0 || user.curls > 0 || user.squats > 0) {
      user.exerciseHistory.push({
        date: new Date(),
        pushUps: user.pushUps,
        curls: user.curls,
        squats: user.squats,
        caloriesBurned: parseFloat(caloriesBurned.toFixed(2)), 
      });

      // Keep only last 10 days' data
      if (user.exerciseHistory.length > 10) {
        user.exerciseHistory.shift(); // Remove oldest entry
      }
    }

    // Reset today's exercise data
    user.pushUps = 0;
    user.curls = 0;
    user.squats = 0;

    await user.save();

    return res.status(200).json({ success: true, message: "Session saved successfully" });
  } catch (error) {
    console.error("Error saving session:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const getExerciseHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Assuming user ID is available from auth middleware
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      history: user.exerciseHistory,
    });
  } catch (error) {
    console.error("Error fetching exercise history:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const bmi = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); 
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { weight, height } = user;
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    let category;
    let message;
    let idealWeightRange;
    let recommendedExercises = [];

    if (bmi < 18.5) {
      category = "Underweight";
      idealWeightRange = [
        (18.5 * heightInMeters * heightInMeters).toFixed(1),
        (24.9 * heightInMeters * heightInMeters).toFixed(1)
      ];
      message = `You should gain at least ${(idealWeightRange[0] - weight).toFixed(1)} kg.`;
      recommendedExercises = [
        "Strength training",
        "Yoga and flexibility exercises",
        "Moderate cardio"
      ];
    } else if (bmi < 24.9) {
      category = "Normal weight";
      message = "You have a healthy weight. Maintain with balanced exercises.";
      recommendedExercises = [
        "Cardio",
        "Strength training",
        "Flexibility and mobility exercises"
      ];
    } else if (bmi < 29.9) {
      category = "Overweight";
      idealWeightRange = [
        (18.5 * heightInMeters * heightInMeters).toFixed(1),
        (24.9 * heightInMeters * heightInMeters).toFixed(1)
      ];
      message = `You should lose at least ${(weight - idealWeightRange[1]).toFixed(1)} kg.`;
      recommendedExercises = [
        "Cardio",
        "Strength training",
        "Core exercises"
      ];
    } else {
      category = "Obese";
      idealWeightRange = [
        (18.5 * heightInMeters * heightInMeters).toFixed(1),
        (24.9 * heightInMeters * heightInMeters).toFixed(1)
      ];
      message = `You should lose at least ${(weight - idealWeightRange[1]).toFixed(1)} kg.`;
      recommendedExercises = [
        "High-intensity cardio",
        "Strength training",
        "Low-impact exercises"
      ];
    }

    res.status(200).json({
      success: true,
      bmi,
      category,
      message,
      recommendedExercises,
    });
  } catch (error) {
    console.error("Error calculating BMI:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
