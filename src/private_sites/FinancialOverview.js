import { Fragment, Component } from 'react';
import { supabase } from '../components/supabaseClient'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { FaRegTrashAlt } from 'react-icons/fa';
import { Navigation } from "../components/Navigation";
import { Container, Row, Col, Accordion, Table, Button, InputGroup, FormControl, ButtonGroup } from 'react-bootstrap';
import "../styles/styles.css"

export class FinancialOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {income_forms: [], spending_forms: [], incomes: {}, spendings: {}};
    }

    async componentDidMount(){
        this.fetch_all()
        await supabase
            .from('income_forms')
            .select()

    }

    async fetch_all() {
        const data_income_forms = await this.fetchIncomeForms_forUser()
        const data_incomes_dict = {}
        for (let index_income_form in data_income_forms) {
            const id = data_income_forms[index_income_form].id
            data_incomes_dict[id] = await this.fetchIncomes_forIncomeForms(id)
        }

        const data_spending_forms = await this.fetchSpendingForms_forUser()
        const data_spendings_dict = {}
        for (let index_spending_form in data_spending_forms) {
            const id = data_spending_forms[index_spending_form].id
            data_spendings_dict[id] = await this.fetchSpendings_forSpendingForms(id)
        }

        this.setState({income_forms: data_income_forms, incomes: data_incomes_dict, spending_forms: data_spending_forms, spendings: data_spendings_dict})
    }

    async fetchIncomeForms_forUser() {
        const { data } = await supabase
            .from('income_forms')
            .select()
        return data
    }

    async fetchIncomes_forIncomeForms(income_forms_id) {
        const { data } = await supabase
            .from("incomes")
            .select()
            .eq("income_forms_id", income_forms_id)

        return data
    }

    async fetchSpendingForms_forUser() {
        const { data } = await supabase
            .from("spending_forms")
            .select()
        return data
    }

    async fetchSpendings_forSpendingForms(spending_forms_id) {
        const { data } = await supabase
            .from("spendings")
            .select()
            .eq("spending_forms_id", spending_forms_id)
        return data
    }

    async createIncomeCategorie(title) {
        if (!(title.replace(/\s/g, '') === '')) {
            await supabase
                .from('income_forms')
                .insert([
                    { title: title, user_id: supabase.auth.user().id }
                ])
            await this.fetch_all();
        }
        this.setState({title: ''})
    }

    async createSpendingCategorie(title) {
        if (!(title.replace(/\s/g, '') === '')) {
            await supabase
                .from('spending_forms')
                .insert([
                    { title: title, user_id: supabase.auth.user().id }
                ])
            await this.fetch_all();
        }
        this.setState({title: ''})
    }

    render() {
        return(
            <>
                <Navigation />
                <Container>
                    <Row className="mt-5">
                        <Col md={6}>
                            <div className="inTitle">
                                <h2 className="text-center title">Einnahmen</h2>
                            </div>
                            <div className="inTitle">
                                <InputGroup>
                                    <FormControl type="text" id="new_incomeform_input" placeholder="Neue Kategorie" className="bg-light" />
                                    <Button className="buttonColor" variant="secondary" onClick={() => {
                                        const input = document.getElementById("new_incomeform_input")
                                        this.createIncomeCategorie(input.value).then()
                                        input.value = ""
                                    }}>Einnahme-Kategorie erstellen</Button>
                                </InputGroup>
                                <br/>
                            </div>
                            <Accordion>
                                {
                                    insertAccordion(this.state.income_forms, this.state.incomes, true, this.fetch_all.bind(this))
                                }
                            </Accordion>
                        </Col>
                        <Col md={6}>
                            <div className="inTitle">
                                <h2 className="text-center title">Ausgabe</h2>
                            </div>
                            <div className="inTitle">
                                <InputGroup>
                                    <FormControl type="text" id="new_spendingform_input" placeholder="Neue Kategorie" className="bg-light" />
                                    <Button className="buttonColor" variant="secondary" onClick={() => {
                                        const input = document.getElementById("new_spendingform_input")
                                        this.createSpendingCategorie(input.value).then()
                                        input.value = ""
                                    }}>Ausgabe-Kategorie erstellen</Button>
                                </InputGroup>
                                <br/>
                            </div>
                            <Accordion>
                                {
                                    insertAccordion(this.state.spending_forms, this.state.spendings, false, this.fetch_all.bind(this))
                                }
                            </Accordion>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

function insertAccordion(forms, entries, isIncome, fetch_method) {
    return forms.map(form => (
        <Fragment key={form.id + isIncome}>
            <InsertAccordion isIncome={isIncome} form={form} amounts={entries[form.id]} fetch_method={fetch_method} />
        </Fragment>
    ))
}

class InsertAccordion extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isIncome: props.isIncome,
            form: props.form,
            amounts: props.amounts,
            title: '',
            amount: '',
            fetch_method: props.fetch_method
        }
    }

    async fetch_entries() {
        if (this.state.isIncome) {
            this.setState({amounts: await this.fetchIncomes()})
        }
        else {
            this.setState({amounts: await this.fetchSpendings()})
        }
    }

    async fetchIncomes() {
        const { data } = await supabase
            .from('incomes')
            .select()
            .eq("income_forms_id", this.state.form.id)
        return data
    }

    async fetchSpendings() {
        const { data } = await supabase
            .from('spendings')
            .select()
            .eq("spending_forms_id", this.state.form.id)
        return data
    }

    async create_entry() {
        if (!(this.state.title.replace(/\s/g, '') === '' || this.state.amount.replace(/\s/g, '') === '')) {
            let amounts
            if (this.state.isIncome) {
                await supabase
                    .from("incomes")
                    .insert([
                        { income_forms_id: this.state.form.id, title: this.state.title, amount: this.state.amount }
                    ])
                amounts = await this.fetchIncomes()
            }
            else {
                await supabase
                    .from("spendings")
                    .insert([
                        { spending_forms_id: this.state.form.id, title: this.state.title, amount: this.state.amount }
                    ])

                amounts = await this.fetchSpendings()
            }
            this.setState({amounts: amounts})
        }
        this.setState({title: '', amount: ''})
    }

    async delete_category() {
        if (this.state.isIncome) {
            await supabase
                .from('incomes')
                .delete()
                .match({income_forms_id: this.state.form.id})

            await supabase
                .from('income_forms')
                .delete()
                .match({id: this.state.form.id})
        }
        else {
            await supabase
                .from('spendings')
                .delete()
                .match({spending_forms_id: this.state.form.id})

            await supabase
                .from('spending_forms')
                .delete()
                .match({id: this.state.form.id})
        }
        await this.state.fetch_method()
    }


    render() {
        const valid_numbers_input = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "." , "Delete", "Backspace", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

        return(
            <Accordion.Item eventKey={this.state.form.id}>
                <ButtonGroup className="button-group">
                    <Accordion.Header className="button-accordion">
                        <span>{this.state.form.title}</span>
                    </Accordion.Header>
                    <Button className="button-del-category" variant="transparent" onClick={() => {this.delete_category().then()}}><FaRegTrashAlt className="text-danger"/></Button>
                </ButtonGroup>
                <Accordion.Body>
                    <InputGroup>
                        <FormControl type="text" className="bg-light" placeholder="Name" onChange={e => this.setState({ title: e.target.value })} value={this.state.title} />
                        <FormControl type="number" className="bg-light"  placeholder="Preis" onChange={e => this.setState({ amount: e.target.value })} onKeyDown={e => {if (!valid_numbers_input.includes(e.key)) e.preventDefault()}} value={this.state.amount} />
                        <Button className="inputField" variant="secondary" onClick={() => {this.create_entry().then()}}>hinzufügen</Button>
                    </InputGroup>
                    <br/>
                    <Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Preis</th>
                            <th className="table-del-row text-center"><FaRegTrashAlt/></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            insertTableContent(this.state.amounts, this.state.isIncome, this.fetch_entries.bind(this)/*, this.state.fetch_method*/)
                        }
                        </tbody>
                    </Table>
                </Accordion.Body>
            </Accordion.Item>
        );
    }
}

function insertTableContent(entries, isIncome, fetch_method) {
    return entries.map(entry => (
        <Fragment key={entry.id + isIncome}>
            <InsertTable isIncome={isIncome} entry={entry} fetch_method={fetch_method} />
        </Fragment>
    ))
}

class InsertTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isIncome: props.isIncome,
            entry: props.entry,
            fetch_method: props.fetch_method
        }
    }

    async delete_entry(entry_id) {
        if (this.state.isIncome) {
            await supabase
                .from('incomes')
                .delete()
                .match({id: entry_id})
        } else {
            await supabase
                .from('spendings')
                .delete()
                .match({id: entry_id})
        }
        await this.state.fetch_method()
    }

    render() {
        return(
            <tr>
                <td>{this.state.entry.title}</td>
                <td>{this.state.entry.amount}</td>
                <td><Button className="button-del-category" variant="transparent" onClick={() => {this.delete_entry(this.state.entry.id).then()}}><FaRegTrashAlt className="text-danger"/></Button></td>
            </tr>
        );
    }
}