import { NextResponse } from "next/server";
import connecToDatabase from "@/lib/mongodb";
import User from "@/models/auth"; 

export async function POST(req) {
    try {
        await connecToDatabase();

        const { name, email, contact, password } = await req.json();

        const newuser = await User.create({
            name,
            email,
            contact,
            password,
        });

        return NextResponse.json(
            { success: true, data: newuser }, { status: 201 }
        );
    } catch (err) {
        console.error("Signup error:", err);
        return NextResponse.json(
            { success: false, error: err.message },   { status: 500 }
        ); 
    }
}
