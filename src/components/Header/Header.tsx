import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import pcsocLogo from "../../assets/pcsoc.png";

interface NavbarProps {
  user: any;
  isAdmin: boolean;
}

const Header: React.FC<NavbarProps> = ({ user, isAdmin }) => {
  return (
    <Navbar expand="lg" className="navbar-header bg-body-tertiary primary-colour">
      <Container style={{ minWidth: '98%' }}>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img
            alt=""
            src={pcsocLogo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            style={{ marginRight: '10px' }}
          />{' '}
           Oceanic Prodigies: Valorant
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            {/* Conditional links for authenticated users */}
            {user ? (
              <>
              {user.emailVerified ? (
                <>
                {isAdmin   ? (
                  <>
                  <Nav.Link href="/InfoAndPrize">Information</Nav.Link>
                  <Nav.Link href="/leaderboard">Leaderboard</Nav.Link>
                  <Nav.Link href="/pickems">Pickems</Nav.Link>
                  <Nav.Link href="/admin">Admin</Nav.Link>
                  <Nav.Link href="/user">User</Nav.Link>
                  </>
                ) : (
                  <>
                  <Nav.Link href="/InfoAndPrize">Information</Nav.Link>
                  <Nav.Link href="/leaderboard">Leaderboard</Nav.Link>
                  <Nav.Link href="/pickems">Pickems</Nav.Link>
                  <Nav.Link href="/user">User</Nav.Link>
                  </>
                )}
                </>
              ) : (
                <>
                <Nav.Link href="/InfoAndPrize">Information</Nav.Link>
                <Nav.Link href="/user">User</Nav.Link>
                </>
              )}
              </>
            ) : (
              <>
                <Nav.Link href="/InfoAndPrize">Information</Nav.Link>
                <Nav.Link href="/signup">Signup</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
