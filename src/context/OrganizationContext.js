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
    if (!organization) {
      // Only fetch if not already set by SSR
      async function fetchOrg() {
        try {
          const res = await fetch("/api/superadmin/createuser");
          const data = await res.json();

          if (res.ok && data.success && data.user?.organization) {
            setOrganization(data.user.organization);
          }
        } catch (error) {
          console.error("Failed to fetch organization:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchOrg();
    } else {
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
