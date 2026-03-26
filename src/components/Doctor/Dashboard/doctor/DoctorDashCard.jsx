import "../../../../stylesheets/doctorStylesheets/Dashboard.css";
import { useGetDoctorAppointmentsQuery, useGetDoctorInvoicesQuery } from "../../../../redux/api/appointmentApi";
import { useGetDoctorPatientsQuery } from "../../../../redux/api/appointmentApi";

const DoctorDashCard = () => {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  const {
    data: patientData,
    isLoading: patientIsLoading,
    isError: patientIsError,
  } = useGetDoctorPatientsQuery();
  const totalPatient = Array.isArray(patientData) ? patientData.length : 0;

  const {
    data: appointmentData,
    isError: appointmentIsError,
    isLoading: appointmentIsLoading,
  } = useGetDoctorAppointmentsQuery({});
  const totalAppoint = Array.isArray(appointmentData)
    ? appointmentData.length
    : 0;

  const { data: invoicesData } = useGetDoctorInvoicesQuery();
  const totalRevenue = Array.isArray(invoicesData)
    ? invoicesData.reduce((sum, inv) => sum + Number(inv?.totalAmount || 0), 0)
    : 0;
  const formattedRevenue = `₹${totalRevenue.toLocaleString()}`;
  const avgRevenuePerPatient = totalPatient > 0 ? totalRevenue / totalPatient : 0;
  const formattedAvgRevenue = `₹${avgRevenuePerPatient.toFixed(2)}`;

  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  const todayAppointments = Array.isArray(appointmentData)
    ? appointmentData.filter((appointment) => {
        const appointmentDate = appointment.scheduleDate.split(" ")[0];
        return appointmentDate === formattedToday;
      })
    : [];

  return (
    <div className="row count-card mb-5">
      <div className="col-lg-4 col-sm-6 col-12 mb-3">
        <div className="dash-card">
          <span className="info-icon first-icon">
            <i class="fa-solid fa-bed-pulse"></i>
          </span>

          <p className="info-label">Total Patient</p>

          <h3 className="info-count">{totalPatient}</h3>

          <small className="info-date">{formattedDate}</small>
        </div>
      </div>

      <div className="col-lg-4 col-sm-6 col-12 mb-3">
        <div className="dash-card">
          <span className="info-icon second-icon">
            <i class="fa-solid fa-hospital-user"></i>
          </span>

          <p className="info-label">Today's Appointments</p>

          <h3 className="info-count">{todayAppointments.length}</h3>

          <small className="info-date">{formattedDate}</small>
        </div>
      </div>

      <div className="col-lg-4 col-sm-6 col-12 mb-3">
        <div className="dash-card">
          <span className="info-icon third-icon">
            <i class="fa-solid fa-calendar-check"></i>
          </span>

          <p className="info-label">Total Appointments</p>

          <h3 className="info-count">{totalAppoint}</h3>

          <small className="info-date">{formattedDate}</small>
        </div>
      </div>
      <div className="col-lg-4 col-sm-6 col-12 mb-3">
        <div className="dash-card">
          <span className="info-icon third-icon">
            <i class="fa-solid fa-calendar-check"></i>
          </span>

          <p className="info-label">Total Revenue</p>

          <h3 className="info-count">{formattedRevenue}</h3>

          <small className="info-date">{formattedDate}</small>
          <small className="info-date">Avg / Patient: {formattedAvgRevenue}</small>
        </div>
      </div>
    </div>
  );
};
export default DoctorDashCard;
