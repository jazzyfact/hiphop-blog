import React from "react";
import { Row, Col } from "reactstrap";

const Header = () => {
  return (
    <div className="page-header mb-3">
      <Row>
        <Col md="6" sm="auto" className="text-center m-auto">
          <h1>Always HipHop</h1>
          <p>힙합더쿠의 주절주절 리뷰 모음집</p>
        </Col>
      </Row>
    </div>
  );
};

export default Header;
