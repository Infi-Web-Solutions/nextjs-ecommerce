import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Organization from "@/models/organization";
import User from "@/models/createuser";
import Role from "@/models/role";
import Permission from "@/models/permission";

export async function POST() {
  try {
    await connectToDatabase();

    // 1. Create Permissions
    const permissionsData = [
      { module: "product", action: "view" },
      { module: "product", action: "create" },
      { module: "product", action: "update" },
      { module: "product", action: "delete" },
      { module: "order", action: "view" },
    ];

    const permissions = [];
    for (const p of permissionsData) {
      let perm = await Permission.findOne(p);
      if (!perm) {
        perm = await Permission.create(p);
      }
      permissions.push(perm._id);
    }

    // 2. Create Role
    let adminRole = await Role.findOne({ userRoleId: 1 });
    if (!adminRole) {
      adminRole = await Role.create({
        userRoleId: 1,
        name: "Admin",
        permissionid: permissions,
      });
    } else {
      adminRole.permissionid = permissions;
      await adminRole.save();
    }

    // 3. Create Organizations
    const orgsData = [
      {
        orgId: "ORG001",
        slug: "trendify",
        name: "Trendify Store",
        domain: "trendify.localhost",
        email: "contact@trendify.com",
      },
      {
        orgId: "ORG002",
        slug: "snapmart",
        name: "SnapMart Store",
        domain: "snapmart.localhost",
        email: "contact@snapmart.com",
      },
    ];

    const orgs = {};
    for (const o of orgsData) {
      let org = await Organization.findOne({ slug: o.slug });
      if (!org) {
        org = await Organization.create(o);
      }
      orgs[o.slug] = org;
    }

    // 4. Create Admin Users
    const usersData = [
      {
        name: "Trendify Admin",
        email: "admin@trendify.com",
        password: "admin123", // Plain text as per current logic
        roleid: 1,
        organizationId: orgs["trendify"]._id,
      },
      {
        name: "SnapMart Admin",
        email: "admin@snapmart.com",
        password: "admin123",
        roleid: 1,
        organizationId: orgs["snapmart"]._id,
      },
    ];

    for (const u of usersData) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        await User.create(u);
      } else {
        user.password = u.password;
        user.organizationId = u.organizationId;
        user.roleid = u.roleid;
        await user.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Admin seed successful!",
      data: {
        organizations: Object.keys(orgs),
        users: usersData.map(u => u.email),
      }
    });

  } catch (err) {
    console.error("Admin seed error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
