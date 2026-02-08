import React from "react";
import "../stylesheets/Contact.css";

const ContactPageHeader = () => {
  return (
    <>
      <section className="contact">
        <div className="container">
          <div class="row">
            {/* <!-- Contact Info item --> */}
            <div class="contact-info-item pad-15">
              <div class="icon">
                <i class="fa fa-phone"></i>
              </div>
              <h4>Helpline Number</h4>
              <p>+592 611 4775</p>
            </div>

            {/* <!-- Contact Info item --> */}
            <div class="contact-info-item pad-15">
              <div class="icon">
                <i class="fa fa-map"></i>
              </div>
              <h4>Address</h4>
              <p>
                {" "}
                Lot 54 Felicity, Happy Acres, East Coast Demerara, Georgetown,
                Guyana.
              </p>
            </div>

            {/* <!-- Contact Info item --> */}
            <div class="contact-info-item pad-15">
              <div class="icon">
                <i class="fa fa-envelope"></i>
              </div>
              <h4>Email</h4>
              <p>info@lemuria.gy</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPageHeader;
