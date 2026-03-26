import React, { useState } from "react";
import { PLANS, COMPARISON_FEATURES } from "./pricingData";
import styles from "./Pricing.module.css";
import DashboardLayout from "../DashboardLayout/DashboardLayout";

const CheckIcon = () => (
  <svg
    className={styles.featureCheck}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const popularIndex = PLANS.findIndex((p) => p.isPopular);
  const [selectedIndex, setSelectedIndex] = useState(
    popularIndex !== -1 ? popularIndex : 0
  );

  return (
    <DashboardLayout>
    <div className={styles.pricingPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.badge}>Simple Pricing</span>
        <h1 className={styles.heroTitle}>
          Simple, Transparent Pricing for Your Practice
        </h1>
        <p className={styles.heroSubtitle}>
          Choose the plan that fits your practice's needs. From solo
          practitioners to digital clinics, we grow with you.
        </p>

        <div className={styles.toggleWrapper}>
          <span
            className={`${styles.toggleLabel} ${
              !isAnnual ? styles.toggleLabelActive : ""
            }`}
          >
            Monthly Billing
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isAnnual}
            className={styles.toggleSwitch}
            onClick={() => setIsAnnual((v) => !v)}
          >
            <span className={styles.toggleKnob} />
          </button>
          <span
            className={`${styles.toggleLabel} ${
              isAnnual ? styles.toggleLabelActive : ""
            }`}
          >
            Annual Billing
          </span>
          <span className={styles.saveBadge}>Save 20%</span>
        </div>
      </section>

      {/* Cards */}
      <section className={styles.cardsGrid}>
        {PLANS.map((plan, index) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
          const isSelected = index === selectedIndex;
          return (
            <div
              key={plan.name}
              className={`${styles.card} ${
                isSelected ? styles.cardPopular : ""
              }`}
              onClick={() => setSelectedIndex(index)}
              style={{ cursor: "pointer" }}
            >
              {plan.isPopular && (
                <span className={styles.popularBadge}>Most Popular</span>
              )}
              {plan.isCurrentPlan && (
                <span className={styles.currentPlanBadge}>Current Plan</span>
              )}

              <h3 className={styles.cardName}>{plan.name}</h3>
              <p className={styles.cardSubtitle}>{plan.subtitle}</p>

              <div className={styles.priceRow}>
                <span
                  className={`${styles.priceCurrency} ${
                    isSelected ? styles.pricePopular : ""
                  }`}
                >
                  {plan.currency}
                </span>
                <span
                  className={`${styles.priceAmount} ${
                    isSelected ? styles.pricePopular : ""
                  }`}
                >
                  {price.toLocaleString("en-IN")}
                </span>
                <span className={styles.pricePeriod}>/month</span>
              </div>

              <button
                className={`${styles.cardButton} ${
                  isSelected
                    ? styles.cardButtonSolid
                    : styles.cardButtonOutlined
                }`}
              >
                {plan.buttonText}
              </button>

              {plan.inheritLabel && (
                <div className={styles.inheritLabel}>{plan.inheritLabel}</div>
              )}

              <ul className={styles.featureList}>
                {plan.features.map((feat) => (
                  <li key={feat} className={styles.featureItem}>
                    <CheckIcon />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* Compare Features Table */}
      <section className={styles.compareSection}>
        <h2 className={styles.compareSectionTitle}>Compare Key Features</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free Trial</th>
                <th>Subscription</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  {["free", "subscription"].map((tier) => {
                    const val = row[tier];
                    return (
                      <td key={tier}>
                        {val === null ? (
                          <span className={styles.xMark}>&#x2715;</span>
                        ) : (
                          val
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Need help choosing a plan?</h2>
        <p className={styles.ctaText}>
          Our team of practice management experts is here to help you find the
          perfect setup for your clinic.
        </p>
        <div className={styles.ctaButtons}>
          <button className={styles.ctaButtonPrimary}>Schedule a Demo</button>
          <button className={styles.ctaButtonOutlined}>Contact Sales</button>
        </div>
      </section>
    </div>
    </DashboardLayout>
  );
};

export default Pricing;
