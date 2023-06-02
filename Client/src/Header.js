import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import User from "./components/User/User";

function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" variant="dark">
      <Container>
        <h3 className="loat-md-start mb-0 align-middle px-5 text-white fw-bold" href="#home">Project manager</h3>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Item bg="white"><User /></Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;