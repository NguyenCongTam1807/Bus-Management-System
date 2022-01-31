import React, { useState } from 'react'
import { Form, Button, Container, Modal } from 'react-bootstrap'
import API,{   endpoints } from './API'
import LoginForm from './LoginForm'
import cookies from 'react-cookies'
import { Redirect } from 'react-router'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Login() {
    const [password, setPassword] = useState(null)
    const [username, setUsername] = useState(null)
    const [isLogged, setLogged] = useState(false)
    const dispatch = useDispatch()
    //dialog
    const [email, setEmail] = useState()
    const [show, setShow] = useState()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const login = async (event) => {
        event.preventDefault()
        try {
            let res = await API.post(endpoints['login'], {
                'client_id' : 'rVkfZvdlVWhWfqwhA7CHr1AwvJoZ8KcUfEXKVszu',
                'client_secret': '8rvHbEDCmqlJZdS5iT3B1izyCOBsZzuuRepRPdDOexbDiJ0BVkkmu8uhrM5jNl04eeCS8TuevX693z8e0IXdh1xm4pHp3bbyb33nmDiehDCVzHEV4QBOmU8ji6fQqw04',
                'username':username,
                'password':password,
                'grant_type': 'password'
            })
            // console.info(res.data)
            cookies.save("access_token", res.data.access_token )
            let user = await API.get(endpoints['current-user'], {
                headers: {
                'Authorization': `Bearer ${cookies.load('access_token')}`
                } 
            })
            console.info(user.data)
            cookies.save("user", user.data)
    
            dispatch ({
                "type" :"login",
                "payload": user.data
            })
            setLogged(true)
        } catch (error) {
            window.alert("Tên tài khoản hoặc mật khẩu không chính xác !!!")
        }
        
    }
    if (isLogged)
        return <Redirect to="/" />

    const getPassword = async (event) => {
        event.preventDefault()
        let formData = new FormData()
        formData.append('email',email )
        await API.post(endpoints['resetPassword'], formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
                }
        }).then(()=>{
            window.alert("Mật khẩu mới đã được gữi vào trong mail!")
        }).catch(()=>{
            window.alert("Tài Khoản mail không hợp lệ!")    
        })


    }
    return (
        <div className="mt-5 mb-5">
            <Container  style={{  border:"1px solid  #C0C0C0 ", borderRadius:"10px 10px", boxShadow: "5px 5px 5px #C0C0C0", margin: "auto", width:"50%"}}>
                <Form style={{padding:"25px",}} onSubmit={login}>
                    <h3 className="text-center text-danger">Đăng Nhập</h3>
                    <LoginForm label="Tài Khoản:" id="username" type="text" placeholder="Nhập vào tên tài khoản..." field={username} change={event => setUsername(event.target.value)}/>
                    <LoginForm label="Mật Khẩu:" id="password" type="password" placeholder="Nhập vào mật khẩu..." field={password} change={event => setPassword(event.target.value)} />
                    <Button type="submit" style={{ display:"flex", justifyContent: "center",width:"30%",
                    flexDirection:"column", margin:"0 auto", alignItems:"center"}}>Đăng Nhập</Button>
                    <Link onClick={handleShow} to="/login" style={{textDecoration:"none"}}>Quên mật khẩu</Link>
                    <hr/>
                    <p>Chưa có tài khoản ?</p>
                    <Button variant="success" href="/register" type="submit" style={{ display:"flex", justifyContent: "center", flexDirection:"column",
                    margin:"0 auto", alignItems:"center", width:"60%"}}>Đăng Ký</Button>
                </Form>
            </Container>
            <Container>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Khôi Phục Mật Khẩu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <LoginForm label="Email:" id="mail" type="email" placeholder="Nhập vào Email đăng ký tài khoản..." 
                                field={email} change={event => setEmail(event.target.value)}/>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={getPassword}>
                        Gữi Email
                    </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    )
}






