// // src/context/OrganizationContext.js
// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// const OrganizationContext = createContext();

// export function OrganizationProvider({ children }) {
//   const [organization, setOrganization] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Auto fetch on mount (for refresh or direct visit to /admin)
//     async function fetchOrg() {
//       try {
//         const res = await fetch("/api/superadmin/createuser");
//         const data = await res.json();

//         if (res.ok && data.success && data.user?.organization) {
//           setOrganization(data.user.organization);
//         }
//       } catch (error) {
//         console.error("Failed to fetch organization:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOrg();
//   }, []);

//   return (
//     <OrganizationContext.Provider
//       value={{ organization, setOrganization, loading, setLoading }}
//     >
//       {children}
//     </OrganizationContext.Provider>
//   );
// }

// export function useOrganization() {
//   return useContext(OrganizationContext);
// }


"use client";

import { createContext, useContext, useEffect, useState } from "react";

const OrganizationContext = createContext();

export function OrganizationProvider({ children, initialOrganization = null }) {
  const [organization, setOrganization] = useState(initialOrganization);
  const [loading, setLoading] = useState(!initialOrganization);

  useEffect(() => {
    console.log("OrganizationProvider: useEffect triggered", { hasOrg: !!organization });
    if (!organization) {
      async function fetchOrg() {
        try {
          console.log("OrganizationProvider: Fetching organization...");
          const res = await fetch("/api/superadmin/createuser");
          
          if (res.status === 401) {
            console.log("OrganizationProvider: User not logged in (401)");
            setLoading(false);
            return;
          }

          const data = await res.json();
          if (res.ok && data.success && data.user?.organization) {
            console.log("OrganizationProvider: Organization fetched successfully", data.user.organization.name);
            setOrganization(data.user.organization);
          } else {
            console.log("OrganizationProvider: No organization found in response");
          }
        } catch (error) {
          console.error("OrganizationProvider: Failed to fetch organization:", error);
        } finally {
          console.log("OrganizationProvider: Setting loading to false");
          setLoading(false);
        }
      }

      fetchOrg();
    } else {
      console.log("OrganizationProvider: Organization already present, setting loading to false");
      setLoading(false);
    }
  }, [organization]);

  return (
    <OrganizationContext.Provider
      value={{ organization, setOrganization, loading, setLoading }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  return useContext(OrganizationContext);
}
