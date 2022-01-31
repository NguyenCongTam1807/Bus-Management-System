import React from 'react'
import { Form } from 'react-bootstrap'

const LoginForm = (props) => {
    return(
        <Form.Group classname="mt-5" controlId={props.id} style={{padding:"10px 5px"}}>
            <Form.Label style={{width:"150px"}}>{props.label}</Form.Label>
            <Form.Control type={props.type} value={props.field} onChange={props.change} placeholder={props.placeholder} style={{width: "75%", display: "inline-block"}}></Form.Control>
        </Form.Group>
    )
}
export default LoginForm;