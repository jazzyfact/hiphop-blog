import React, {  useState, useCallback, useEffect } from "react";
import { 
    Navbar, 
    Container, 
    NavbarToggler, 
    Collapse, 
    Nav, 
    NavItem,
    Form,
    Button} from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT_REQUEST } from '../redux/types';

import LoginModal from './auth/LoginModal';
import RegiterModal from './auth/RegisterModal';


const AppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {isAuthenticated, user, userRole} = useSelector((state) => state.auth);
  console.log(userRole, "UserRole");

  const dispatch = useDispatch();

  //로그아웃
  const onLogout = useCallback(() => {
      dispatch({
        type : LOGOUT_REQUEST,
      })
    },[dispatch]);

  useEffect(() => {
    setIsOpen(false)
  },[user]);

  const handleToggle = () => {
    setIsOpen(!isOpen)
  };

  //
  const addPostLink = () => {

  };

  //
  const authLink = (
    <>
      <NavItem>
        {userRole === "esens" ? (
          <Form className="col mt-2">
            <Link to="post" className="btn btn-success block text-white px-3" onClick={addPostLink}>
              게시글 작성
            </Link>
          </Form>
        ) : ""}
      </NavItem>
      <NavItem className="d-flex justify-content-center">
          <Form className="col mt-2">
            {user && user.name ? (
              <Link>
                <Button outline color="light" className="px-3" block>
                  <strong>{user ? `${user.name} 님 환영합니다` : ""}</strong>
                </Button>
              </Link>
            ) : (
              <Button outline color="light" className="px-3" block>
              <strong>"유저를 찾을 수 없습니다."</strong>
            </Button>
            )}
          </Form>
      </NavItem>
      <NavItem>
        <Form className="col">
              <Link onClick={onLogout} to ="#" >
                <Button outline color="light" className="mt-2" block>
                  로그아웃
                </Button>
              </Link>
        </Form>
      </NavItem>
    </>
  );

  const guestLink = (
    <>
      <NavItem>
        <RegiterModal />
      </NavItem>
      <NavItem>
        <LoginModal />
      </NavItem>
    </>
  )


  return (
    <>
      <Navbar color="dark" dark expand="lg" className="sticky-top">
        <Container>
          <Link to="/" className="text-white text-decoration-none">
             Blog
          </Link>
          <NavbarToggler onClick={handleToggle}/>
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto d-flex justify-content-around" navbar>
              {/* 로그인 인증 */}
              {isAuthenticated ? ( 
                authLink
              ) : (
                guestLink
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AppNavbar;