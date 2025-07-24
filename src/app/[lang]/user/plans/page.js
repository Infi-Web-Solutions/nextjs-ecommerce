"use client";

import { useEffect, useState } from "react";
import PlanCard from "../../../../component/usercomponent/plains/PlanCard";
import { useTranslations } from "@/lib/TranslationsProvider";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const t = useTranslations();

  useEffect(() => {
    fetch("/api/stripe/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data.plans || []));
  }, []);

  async function handleSubscribe(priceId) {
    const res = await fetch("/api/stripe/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">{t("plan.choosePlan")}</h2>

      <div className="row">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSubscribe={handleSubscribe}
          />
        ))}
      </div>
    </div>
  );
}
