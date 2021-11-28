import React from "react";
import { Row, Col } from "reactstrap";

const Footer = () => {
  const thisYear = () => {
    const year = new Date().getFullYear();
    return year;
  };

  return (
    <Row id="main-footer" className="text-center p-2">
      <Col>
        <p className="footer-copyright">
          Copyright &copy; |  Created by Hyemi Design<span>{thisYear()}</span>
        </p>
      </Col>
    </Row>
  );
};

export default Footer;
