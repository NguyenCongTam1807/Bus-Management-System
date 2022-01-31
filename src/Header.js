import React,{useState} from 'react'
import { Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav,Button, Dropdown, Modal } from 'react-bootstrap';
import logo from './logo.svg'
import {faUser, faUserCog, faCogs, faSignOutAlt, faFileInvoiceDollar,faTicketAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cookies from 'react-cookies'
import { connect, useSelector, useStore } from 'react-redux';
import LoginForm from './LoginForm'
import API, { endpoints } from './API';
import { useDispatch } from 'react-redux'


export   function Header(props) {
    const [password, setPassword] = useState()
    const [rePassword, setRePassword] = useState()
    const [show, setShow] = useState()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dispatch = useDispatch()
    // const users = useSelector(state => state.users)
    // const store = useStore()
    // const auth = store.getState()
    let user = props.num
    if(cookies.load("user") != null)
        user = cookies.load("user")

    const LogOut = () =>{
        cookies.remove("user")
        cookies.remove("access_token")
    }
    const updatePassword = () => {

        if(password === rePassword){
            let formData = new FormData()
            formData.append('password',password )
            let newUser = API.patch(endpoints['updatePassword'],formData, {
                headers : {
                    'Authorization': `Bearer ${cookies.load('access_token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }).then(()=>{
                window.alert("Đổi Mật Khẩu Thành Công!")
                handleClose()
                setPassword(null)
                setRePassword(null)
                LogOut()
                setTimeout(function(){ window.location = "/login"; },1000);
            })
            // cookies.save("user", newUser.data)
            // dispatch ({
            //     "type" :"login",
            //     "payload": newUser.data
            // })

        }
        else
            window.alert("Hai mật khẩu không trùng nhau!")
    }
    let  r = <>
        <Nav>
            <Button variant="outline-danger" href="/login">Đăng Nhập</Button>{' '}
        </Nav>
    </>
    if(user != null )
        r = <>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    <FontAwesomeIcon icon={faUser}  ></FontAwesomeIcon> Xin Chào {user.username}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="/user"><FontAwesomeIcon icon={faUserCog}  ></FontAwesomeIcon> Thông tin User</Dropdown.Item>
                    <Dropdown.Item href="/ticket"><FontAwesomeIcon icon={faTicketAlt}  ></FontAwesomeIcon>  Thông Tin Đặt Vé</Dropdown.Item>
                    <Dropdown.Item href="/trip"><FontAwesomeIcon icon={faCogs}  ></FontAwesomeIcon> Lịch Sử Chuyến Đi</Dropdown.Item>
                    <Dropdown.Item href="/bills"><FontAwesomeIcon icon={faFileInvoiceDollar}  ></FontAwesomeIcon>   Hóa Đơn</Dropdown.Item>
                    <Dropdown.Item onClick={handleShow} ><FontAwesomeIcon icon={faKey}></FontAwesomeIcon> Đổi Mật Khẩu</Dropdown.Item>
                    <Dropdown.Item href="/" onClick={LogOut}><FontAwesomeIcon icon={faSignOutAlt}  ></FontAwesomeIcon>  Đăng Xuất</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    return (
        <div>
            <>  
                <Navbar style={{backgroundColor: '#faeee7'}}sticky="top" expand="lg" collapseOnSelect id="NavBar">
                    <Container>
                        <Navbar.Brand href="/">
                            <img
                                alt=""
                                src={logo}
                                width="120"
                                height="30"
                                className="d-inline-block align-top"/>{' '}
                            OU Bus Lines   
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto mx-auto ">
                                <Nav.Link as={Link} to='/'>Trang Chủ</Nav.Link>
                                <Nav.Link as={Link} to='/'>Lịch Trình</Nav.Link>
                                <Nav.Link as={Link} to='/'>Tin Tức</Nav.Link>
                                <Nav.Link as={Link} to='/'>Tuyển Dụng</Nav.Link>
                                <Nav.Link as={Link} to='/'>Liên Hệ</Nav.Link>
                                <Nav.Link as={Link} to='/trip/'>Lịch Sử Chuyến Đi</Nav.Link>
                                <Nav.Link as={Link} to='/'>Về Chúng Tôi</Nav.Link>                   
                            </Nav>
                            {r}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Container>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Thay Đổi Mật Khẩu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <LoginForm label="Mật Khẩu mới:" id="password" type="password" placeholder="Nhập vào mật khẩu mới của bạn..." 
                                field={password} change={event => setPassword(event.target.value)}/>
                        <LoginForm label="Nhập lại mật khẩu:" id="password" type="password" placeholder="Nhập lại mật khẩu mới của bạn..." 
                                field={rePassword} change={event => setRePassword(event.target.value)}/>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Thoát
                    </Button>
                    <Button variant="primary" onClick={updatePassword}>
                        Cập Nhật
                    </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
            </>
        </div>
    )
}
const mapStatetoProps = (state)=>{
    return {
        num : state.user
    }
}

export default connect(mapStatetoProps)(Header)