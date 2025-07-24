import Role from "@/models/role";
import Permission from "@/models/permission";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import User from "@/models/createuser";

export async function getUserPermissions(roleId) {
    
  const role = await Role.findOne({ userRoleId: roleId }).populate("permissionid");
  if (!role) return [];

  return role.permissionid.map(
    (perm) => `${perm.module}_${perm.action}`
  );
}

//  Decode user from JWT token (used in any protected API)
// export async function getUserFromToken(req) {
//   const token = req.cookies.get("token")?.value;
//   if (!token) return null;

//   try {
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     const { payload } = await jwtVerify(token, secret);
//     return payload; // contains userId, email, roleId, etc.
//   } catch (err) {
//     console.error("JWT verification failed:", err);
//     return null;
//   }
// }

export async function getUserFromToken() {
  const cookieStore = await cookies(); // ✅ must use await in App Router
  const token = cookieStore.get("token")?.value;
  
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log("Decoded user from token:", payload);
    return  payload
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}