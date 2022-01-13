import { Container, Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import {Component } from 'react';
import {Navigation} from "../components/Navigation";


export class Predictor extends Component {
    constructor(props) {
        super(props);
        this.state = {amount1: "", amount2: "", errors: "", output: ""};
    }

    doMath() {
        var result = this.state.amount1 - this.state.amount2;
        if (result >= 0)
            this.setState({output: "Saldo CHF " + result})
        else
            this.setState({output: "Schulden CHF " + -result})
    }



    render(){
        const valid_numbers_input = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

        return (
            <>
                <Navigation />
                <Container>
                <Row>
                    <div>
                        <Col className='offset-5 justify-content-center'>

                            <div className=' predictionTitle'>Predictor</div>
                        </Col>
                        <Col>
                            <div className="formdiv">
                                <InputGroup>
                                    <FormControl type="number" className="bg-light" placeholder='Einnahmen'  required  onChange={e => this.setState({ amount1: e.target.value })} amount1={this.state.amount1} onKeyDown={e => {if (!valid_numbers_input.includes(e.key)) e.preventDefault()}}/>
                                    <FormControl type="number" className="bg-light"   placeholder='Ausgaben' required  onChange={e => this.setState({ amount2: e.target.value })} amount2={this.state.amount2} onKeyDown={e => {if (!valid_numbers_input.includes(e.key)) e.preventDefault()}}/>
                                    <Button className="buttonColor"  onClick={() => {this.doMath()}}>berechnen</Button>
                                </InputGroup>
                                {this.state.output !== ""?<p>{this.state.output}</p>:<p></p>}
                            </div>
                        </Col>

                    </div>
                </Row>
            </Container>
            </>
        );
    }
}