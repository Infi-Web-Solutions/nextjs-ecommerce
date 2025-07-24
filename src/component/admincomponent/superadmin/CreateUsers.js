// "use client";

// import { useState } from "react";

// export default function Createusers() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     contact: "",
//     password: "",
//     role: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const roleid = form.role === "admin" ? "1" : form.role === "staff" ? "2" : "";

//     if (!roleid) {
//       alert("Please select a role.");
//       return;
//     }

//     try {
//       const res = await fetch("/api/superadmin/createuser", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: form.name,
//           email: form.email,
//           contact: form.contact,
//           password: form.password,
//           roleid,
//         }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert("User created successfully!");
//         setForm({
//           name: "",
//           email: "",
//           contact: "",
//           password: "",
//           role: "",
//         });
//       } else {
//         alert(data.message || "Failed to create user.");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert("Server error");
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center mt-2">
//       <div className="w-100" style={{ maxWidth: "500px" }}>
//         <h3 className="text-center mb-4">Create User</h3>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Name</label>
//             <input
//               name="name"
//               type="text"
//               className="form-control"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Enter a name"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input
//               name="email"
//               type="email"
//               className="form-control"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Enter an email"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Contact</label>
//             <input
//               name="contact"
//               type="text"
//               className="form-control"
//               value={form.contact}
//               onChange={handleChange}
//               placeholder="Enter a contact"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               name="password"
//               type="password"
//               className="form-control"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Enter a password"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Role</label>
//             <select
//               name="role"
//               className="form-control"
//               value={form.role}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Role</option>
//               <option value="admin">Admin</option>
//               <option value="staff">Staff</option>
//             </select>
//           </div>

//           <div className="d-grid">
//             <button type="submit" className="btn btn-primary">
//               Create User
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useOrganization } from "@/context/OrganizationContext";


export default function Createusers() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    role: "",
  });
  const { organization, loading } = useOrganization();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roleid = form.role === "admin" ? "1" : form.role === "staff" ? "2" : "";

    if (!roleid) {
      alert("Please select a role.");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      contact: form.contact,
      roleid,
    };
    const invitePayload = {
      name: form.name,
      email: form.email,
      contact: form.contact,
      role: form.role,
      roleid: roleid,
      organizationId: organization?._id,
    };
    console.log("Sending invite payload:", invitePayload);
    try {
      let res, data;

      // If password is filled => create user immediately
      if (form.password) {
        res = await fetch("/api/superadmin/createuser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            password: form.password,
          }),
        });
        data = await res.json();
      } else {
        if (!form.password) {
          console.log("Sending invite payload:", invitePayload);

          res = await fetch("/api/superadmin/invite-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invitePayload),
          });

          data = await res.json();
        }
      }

      if (res.ok) {
        alert(form.password ? "User created successfully!" : "Invite sent successfully!");
        setForm({
          name: "",
          email: "",
          contact: "",
          password: "",
          role: "",
        });
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-2">
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-4">Create User</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter a name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter an email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contact</label>
            <input
              name="contact"
              type="text"
              className="form-control"
              value={form.contact}
              onChange={handleChange}
              placeholder="Enter a contact"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password (leave blank to send invite)</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter a password or leave blank to invite"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-control"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              {form.password ? "Create User" : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

