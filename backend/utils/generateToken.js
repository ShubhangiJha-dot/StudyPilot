import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign( //payload (data inside the token) is userid
    { id: userId },
    // JWT_SECRET → signs it (VERY IMPORTANT), sign maane creation
    //secret key used to sign the token.
    process.env.JWT_SECRET,
    // token lifetime
    { expiresIn: "7d" }
  );
};