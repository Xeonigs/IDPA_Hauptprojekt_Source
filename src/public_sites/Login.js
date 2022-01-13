import { useRef} from 'react'
import { useHistory } from 'react-router-dom'

import '../styles/styles.css'

import { useAuth } from '../components/Auth'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import {Navigation} from "../components/Navigation";


export function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()

  const { signIn } = useAuth()
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value

    const { error } = await signIn({ email, password })

    if (error) {
      alert('error logging in')
    } else {

      history.push('/overview')
    }
  }

  return (
      <>
        <Navigation />

        <Container>
          <Row>
            <Col className="mt-5" md={{ span :6, offset: 3 }}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 mt-3" controlId="email">
                  <Form.Label>Email Adresse eingeben</Form.Label>
                  <Form.Control  type="email" placeholder="name@example.com" ref={emailRef} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Passwort eingeben</Form.Label>
                  <Form.Control type="password" placeholder="Passwort" ref={passwordRef} />
                </Form.Group>
                <Form.Group>
                  <Button className='buttonRight' type="submit"  >Einloggen</Button>

                </Form.Group>
              </Form>
              <p>
                <br/>
                <br/>
                Noch nicht registriert? <Button className='buttonColor' href='/signup'  >Hier registrieren</Button>
              </p>
            </Col>
          </Row>
        </Container>

      </>
  )
}