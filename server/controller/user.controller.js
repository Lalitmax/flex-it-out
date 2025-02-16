import { User } from "../model/userModel.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const register = async (req,res) => {

    try {

        console.log("papa");
        const {name,surname,email,mobile,password} = req.body;
        console.log(req.body)

        if(!name || !surname || !email || !mobile || !password){
            return res.status(400).json({
                success: false,
                message: "field found empty"
            })
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
            message: "User already exists with this email.",
            success: false,
            });
        }

        const hashedPass =await bcrypt.hash(password,10);

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
          }
      
          res.status(201).cookie("token",token,options).json({
            message: "Registered successfully",
            success: true,
            token,
            newUser
          });

    } catch (error) {
        res.status(500).json({ 
            message: "Server error", 
            success: false, 
            error
        });
    }

}


export const login = async (req,res) => {

    try {
        
        const {email , password} = req.body;
    
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "field found empty"
            })
        }
    
        const user = await User.findOne({ email });
    
        if (!user) {
            return res.status(400).json({
                message: "user not found",
                success: false,
            });
        }

        const comparePass =await bcrypt.compare(password,user.password)
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
            }
      
          res.status(201).cookie("token",token,options).json({
                message: "logged in successfully",
                success: true,
                token,
                user
            });

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
    }




}


export const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.aggregate([
            {
                $addFields: {
                    totalExercises: { 
                        $sum: ["$pushUps", "$curls", "$squats"] 
                    }
                }
            },
            { $sort: { totalExercises: -1 } }, 
            { $limit: 3 }  
        ]);

        res.status(200).json({
            success: true,
            leaderboard: topUsers
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error 
        });
    }
};



export const getProfile = async (req, res) => {
    try {
        console.log("1")
        const user = await User.findById(req.user.id).select("-password"); 
        console.log("2")
        if (!user){
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        } 
        console.log("3")
        res.status(200).json({ 
            success: true, 
            user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};


export const updateNameAndPass = async (req, res) => {
    try {
        const { name, oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (name) user.name = name;

        if (oldPassword && newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Incorrect password" 
                });  
            } 

            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};



export const deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ 
            success: true, 
            message: "Account deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};


export const getAnalytics = async (req, res) => {
    try {
        const data = await User.findOne();
        if (!data) return res.status(404).json({ message: "No data found" });

        const caloriesBurned = (data.pushUps * 0.29) + (data.curls * 0.20) + (data.squats * 0.32);

        res.json({ ...data.toObject(), caloriesBurned });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



