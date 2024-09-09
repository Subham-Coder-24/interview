import { verifyToken } from "@clerk/backend";

export const isAuthenticateduser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  try {
    const sessionClaims = await verifyToken(token, {
      jwtKey: process.env.CLERK_JWT_KEY,
    });
    req.user_id = sessionClaims.sub
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
