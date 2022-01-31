import React, {useState, useRef} from 'react'
import { Container, Form, Row, Col, Button } from 'react-bootstrap'
import API, { endpoints } from './API'
import { Redirect } from 'react-router'
export default function Register() {
    const [email, setEmail] = useState()
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [password, setPassword] = useState()
    const [repassword, setRepassword] = useState()
    const [username, setUsername] = useState()
    const [isSignedUp, setIsSignedUp] = useState(false)
    const [phone, setPhone] = useState()

    const avatar = useRef()

    const register = async (event) => {
        event.preventDefault()
        if(password === repassword)
        {
            let formData = new FormData()
            formData.append('last_name',lastName )
            formData.append('first_name',firstName )
            formData.append('username',username )
            formData.append('email',email )
            formData.append('password',password )
            formData.append('phone',phone )
            formData.append('avatar',avatar.current.files[0])
            let UserSignUp =  await API.post(endpoints["user"], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                    } 
            }).then((res) =>{
                API.post(endpoints["saveMailUser"],formData,{
                    headers: {
                        'Content-Type': 'multipart/form-data'
                        } 
                })
                API.post(endpoints["sendMailUserSignUp"],formData,{
                    headers: {
                        'Content-Type': 'multipart/form-data'
                        } 
                })
                setIsSignedUp(true)
            }).catch(() => {window.alert("Đăng Ký Không thành công ")})

        }else{
            window.alert("Mật Khẩu không trùng nhau !")
        }
    }
    if (isSignedUp){
        window.alert("Đăng Ký thành công !")
        return <Redirect to="login" />
    }

    return (
        <div class="mt-5 mb-5">
            <Container  style={{  border:"1px solid  #C0C0C0 ", borderRadius:"10px 10px", boxShadow: "5px 5px 5px #C0C0C0", margin: "auto", width:"50%"}}>
                <Form style={{padding:"25px"}} onSubmit={register}>
                    <h3 className="text-center text-danger">Đăng Ký</h3>
                    <FormRegister id="mail" label="Email:" type="email" placeholder="Nhập vào Email..." field={email} change={event => setEmail(event.target.value)}/>
                    <FormRegister id="firstName" label="Tên:" type="text" placeholder="Nhập vào Tên..." field={firstName} change={event => setFirstName(event.target.value)}/> 
                    <FormRegister id="lastName" label="Họ:" type="text" placeholder="Nhập vào Họ..." field={lastName} change={event => setLastName(event.target.value)}/>
                    <FormRegister id="phone" label="Điện Thoại:" type="number" placeholder="Nhập vào số điện thoại..." field={phone} change={event => setPhone(event.target.value)}/>  
                    <FormRegister id="username" label="Tài Khoản:" type="text" placeholder="Tên Tài Khoản..." field={username} change={event => setUsername(event.target.value)}/> 
                    <FormRegister id="password" label="Mật Khẩu:" type="password" placeholder="Nhập vào mật Khẩu..." field={password} change={event => setPassword(event.target.value)}/>  
                    <FormRegister id="confirmPassword" label="Xác Nhận:" type="password" placeholder="Xác nhận lại mật khẩu..." field={repassword} change={event => setRepassword(event.target.value)}/>
                    <Form.Group as={Row} className="mb-3" controlId="avatar">
                        <Form.Label column sm="2">Avatar</Form.Label>
                        <Col sm="10">
                            <Form.Control type="file" ref={avatar}/>
                        </Col>
                    </Form.Group>
                    <Button type="submit" style={{ display:"flex", justifyContent: "center",width:"30%",
                    flexDirection:"column", margin:"0 auto", alignItems:"center"}}>Đăng Ký</Button>  
                </Form>
            </Container>
        </div>
    )
}

const FormRegister = (props) => {
    return (
        <Form.Group as={Row} className="mb-3" controlId={props.id}>
            <Form.Label column sm="2">{props.label}</Form.Label>
            <Col sm="10">
            <Form.Control type={props.type} placeholder={props.placeholder} value={props.field} onChange={props.change}/>
            </Col>
        </Form.Group>
    )
}