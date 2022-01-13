import { Button, Container, Nav, Navbar } from "react-bootstrap";
import {useAuth} from "./Auth";
import {supabase} from "./supabaseClient";

async function handleSignOut() {
    await supabase.auth.signOut()
}

export function Navigation() {
    const { user } = useAuth()

    if (user) {
        return(
            <Navbar className="navbar">
                <Container>
                    <Navbar.Brand >Finanzplaner</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/overview">Meine Finanzübersicht</Nav.Link>
                        <Nav.Link href="/predictor">Predictor</Nav.Link>
                    </Nav>

                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Eingeloggt als: <p>{supabase.auth.user().email} &nbsp; </p>
                        </Navbar.Text>
                        <Button className="buttonLogout" onClick={handleSignOut} >Ausloggen</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
    else {
        return(
            <Navbar className="navbar">
                <Container>
                    <Navbar.Brand href="/home">Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/predictor">Predictor</Nav.Link>
                    </Nav>


                    <Nav  className="justify-content-end">
                        <Nav.Link href="/login">Login</Nav.Link>
                        <Nav.Link href="/signup">Signup</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        )
    }
}