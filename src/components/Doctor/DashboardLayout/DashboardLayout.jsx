import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Progress, Tag } from "antd";
import DashboardSidebar from "../../UI/DashboardSidebar";
import Header from "../../Shared/Header/Header";
import useAuthCheck from "../../../redux/hooks/useAuthCheck";
import { getProfileCompletion } from "../../../utils/profileCompletion";

const DashboardLayout = ({ children }) => {
  const { data, role } = useAuthCheck();
  const location = useLocation();
  const {
    percentage,
    filledCount,
    totalCount,
    missingFields,
    missingRequired,
    requiredComplete,
    isComplete,
  } = getProfileCompletion(data, role);
  const isProfilePage = location.pathname === "/dashboard/profile-setting";

  // Green when all required fields filled, amber when >50%, red when <50%
  const progressColor = requiredComplete
    ? "#52c41a"
    : percentage < 50
    ? "#ff4d4f"
    : "#faad14";

  // Block access only when required fields are missing (same as original behavior)
  const shouldBlock = !requiredComplete && !isProfilePage;
  // Show non-blocking info banner when required done but optional fields remain
  const showOptionalBanner = requiredComplete && !isComplete && !isProfilePage;

  return (
    <>
      <Header />
      <div
        className="container-fluid"
        style={{ marginTop: 100, marginBottom: 50 }}
      >
        <div className="row">
          <div className="col-md-4 col-lg-4 col-xl-3">
            <DashboardSidebar />
          </div>
          <div className="col-md-8 col-lg-8 col-xl-9">
            {shouldBlock ? (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e8e8e8",
                  borderRadius: 10,
                  padding: "24px 32px",
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  flexWrap: "wrap",
                }}
              >
                <Progress
                  type="circle"
                  percent={percentage}
                  size={80}
                  strokeColor={progressColor}
                />

                <div style={{ flex: 1, minWidth: 200 }}>
                  <h5 style={{ fontWeight: 700, marginBottom: 6 }}>
                    Your profile is {percentage}% complete
                  </h5>
                  <p
                    style={{ color: "#888", fontSize: 14, marginBottom: 12 }}
                  >
                    Please fill in the required fields to unlock all features.
                  </p>

                  <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>
                    Required:
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginBottom: 16,
                    }}
                  >
                    {missingRequired.map((field) => (
                      <Tag color="red" key={field}>
                        {field}
                      </Tag>
                    ))}
                  </div>

                  <Link
                    to="/dashboard/profile-setting"
                    style={{
                      backgroundColor: "#1b5a90",
                      color: "#fff",
                      padding: "8px 24px",
                      borderRadius: 6,
                      fontWeight: 600,
                      textDecoration: "none",
                      fontSize: 14,
                    }}
                  >
                    Complete Profile ({filledCount}/{totalCount})
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {showOptionalBanner && (
                  <div
                    style={{
                      background: "#fff",
                      border: "5px solid #e8e8e8",
                      borderRadius: 15,
                      padding: "16px 24px",
                      marginTop: 20,
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      flexWrap: "wrap",
                    }}
                  >
                    <Progress
                      type="circle"
                      percent={percentage}
                      size={56}
                      strokeColor="#2b0057"
                    />
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <h6 style={{ fontWeight: 600, marginBottom: 4 }}>
                        Profile {percentage}% complete ({filledCount}/{totalCount})
                      </h6>
                      <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
                        All required fields filled! Complete optional fields to reach 100%.
                      </p>
                    </div>
                    <Link
                      to="/dashboard/profile-setting"
                      style={{
                        backgroundColor: "#2b0057",
                        color: "#fff",
                        padding: "6px 18px",
                        borderRadius: 6,
                        fontWeight: 600,
                        textDecoration: "none",
                        fontSize: 13,
                      }}
                    >
                      Edit Profile
                    </Link>
                  </div>
                )}
                {children}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
