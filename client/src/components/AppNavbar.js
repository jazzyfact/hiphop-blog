import React, { Fragment, useState, useCallback, useEffect } from "react";
import {
  Navbar,
  Container,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Form,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LOGOUT_REQUEST, POSTS_WRITE_REQUEST } from "../redux/types";
import LoginModal from "../components/auth/LoginModal";
import RegisterModal from "../components/auth/RegisterModal";
import SearchInput from "./search/searchInput";



const AppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, userRole } = useSelector(
    (state) => state.auth
  );
  console.log(userRole, "UserRole");

  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch({
      type: LOGOUT_REQUEST,
    });
  }, [dispatch]);

  useEffect(() => {
    setIsOpen(false);
  }, [user]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const addPostClick = () => {
    dispatch({
      type: POSTS_WRITE_REQUEST,
    });
  };

  //
  const authLink = (
    <>
      <NavItem>
        {userRole === "esens" ? (
          <Form className="col mt-2">
            <Link to="/post" className="btn btn-success block text-white px-3" onClick={addPostClick}>
              게시글 작성
            </Link>
          </Form>
        )  : (
          ""
        )}
      </NavItem>
      <NavItem  className="d-flex justify-content-center">
          <Form className="col mt-2">
            {user && user.name ? (
              <Link to={`/user/${user.name}/profile`}>
              <Button outline color="light" className="px-3" block>
                <strong>{user ? `${user.name}님 환영합니다` : ""}</strong>
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
          <Link onClick={onLogout} to="#" className="">
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
      <RegisterModal />
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
          <NavbarToggler onClick={handleToggle} />
          <Collapse isOpen={isOpen} navbar>
          <SearchInput isOpen={isOpen} />
          <Nav className="ml-auto d-felx justify-content-around" navbar>
              {/* 로그인 인증 */}
              {isAuthenticated ? authLink : guestLink}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AppNavbar;