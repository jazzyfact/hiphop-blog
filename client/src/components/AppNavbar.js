import React, { Fragment } from "react";
import { 
    Navbar, 
    Container, 
    NavbarToggler, 
    Collapse, 
    Nav } from "reactstrap";
import { Link } from "react-router-dom";
import LoginModal from './auth/LoginModal';


const AppNavbar = () => {
  return (
    <>
      <Navbar color="dark" dark expand="lg" className="sticky-top">
        <Container>
          <Link to="/" className="text-white text-decoration-none">
             Blog
          </Link>
          <NavbarToggler />
          <Collapse isOpen={true} navbar>
            <Nav className="ml-auto d-flex justify-content-around" navbar>
              {false ? (
                <h1 className="text-white">authLink</h1>
              ) : (
               <LoginModal/>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AppNavbar;