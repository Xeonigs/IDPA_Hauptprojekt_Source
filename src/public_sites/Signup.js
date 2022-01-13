import {React, useRef} from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../components/Auth'
import {Navigation} from "../components/Navigation";

export function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfRef = useRef()

  const { signUp } = useAuth()
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value
    const passwordConf = passwordConfRef.current.value


    if(password === passwordConf){
      const { error } = await signUp({ email, password, })
      if (error) {
        alert('error signing up')
      } else {
        history.push('/overview')
      }
    } else {
      alert('Passworte stimmen nicht Ã¼berein')
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
                  <Form.Control type="email" placeholder="name@example.com" ref={emailRef} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Passwort eingeben</Form.Label>
                  <Form.Control type="password" placeholder="Passwort" ref={passwordRef} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPlainTextPassword">
                  <Form.Label>Passwort nochmals eingeben</Form.Label>
                  <Form.Control type="password" placeholder="Passwort bestätigen" ref={passwordConfRef} />
                </Form.Group>

                <Form.Group>

                  <Button className='buttonRight' type="submit"  >Registrieren</Button>

                </Form.Group>
              </Form>
              <p>
                <br/>
                <br/>
                Schon registriert? <Button className='buttonColor' href='/login'  >Hier einloggen</Button>
              </p>
            </Col>
          </Row>
        </Container>
      </>
  )
}