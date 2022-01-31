import React, {useState, useRef} from 'react'
import cookies from 'react-cookies'
import { Container, Col, Row , Form, Image, Button } from 'react-bootstrap'
import API, { endpoints } from './API'
import LoginForm from './LoginForm'
import { useDispatch } from 'react-redux'

function UserInfo() {
    let user = cookies.load("user")
    console.info(user)
    const [firstName, setFirstName] = useState(user.first_name)
    const [lastName, setLastName] = useState(user.last_name)
    const [email, setEmail] = useState(user.email)
    const [avatar, setAvatar] = useState(user.avatar)
    const [phone, setPhone] = useState(user.phone)
    const dispatch = useDispatch()

    const image = useRef()
    const userId = user.id


    let buttonPut = " "
    if(firstName !== user.first_name || lastName !== user.last_name || email !== user.email || image !== user.avatar || phone !==user.phone)
        buttonPut = 
        <>
                <Button type="submit" href="/user" style={{ display:"flex", justifyContent: "center",width:"30%",
                    flexDirection:"column", margin:"0 auto", alignItems:"center"}}>Cập Nhật</Button>  
        </>
        const UpdateUser = async (event) =>{
            event.preventDefault()
            let formData = new FormData()
            formData.append('id',userId)
            formData.append('last_name',lastName )
            formData.append('first_name',firstName )
            formData.append('email',email )
            formData.append('phone',phone)
            formData.append('avatar',image.current.files[0])
            
            let newUser = await API.patch(endpoints["updateUser"](userId), formData,  {
                headers : {
                    'Authorization': `Bearer ${cookies.load('access_token')}`
                }
            }).catch((console.error()))
            cookies.save("user", newUser.data)
            dispatch ({
                "type" :"login",
                "payload": newUser.data
            })
        }


    return (
        <div className="mt-5 mb-5">
            <Container style={{  border:"1px solid  #C0C0C0 ", borderRadius:"10px 10px", boxShadow: "5px 5px 5px #C0C0C0", margin: "auto", width:"40%"}}>
                <Form style={{padding:"25px "}}  >
                    <Row>
                        <Col class="col-xs-6 .col-md-4">
                            <span></span>
                        </Col>
                        <Col class="col-xs-6 .col-md-4">
                            <Image src={avatar} width="120%" height="100%" />
                        </Col>
                        <Col class="col-xs-6 .col-md-4">
                            <span></span>
                        </Col>
                    </Row>
                    <Row>    
                        <Col class ="col-md-5" >
                        <Form onClick={UpdateUser}>
                            <Form.Group as={Row} className="mb-3" controlId="image">
                                <Form.Label column sm="2"></Form.Label>
                                <Col sm="11">
                                    <Form.Control type="file" ref={image} />
                                </Col>
                            </Form.Group>
                            <LoginForm id="firsName" label="Họ : " type="text" field={firstName} change={event => setFirstName(event.target.value)} />
                            <LoginForm id="lastName" label="Tên : " type="text" field={lastName} change={event => setLastName(event.target.value)}/>
                            <LoginForm id="email" label="Email : " type="text" field={email} change={event => setEmail(event.target.value)}/>
                            <LoginForm id="phone" label="Điện Thoại : " type="number" field={phone} change={event => setPhone(event.target.value)}/>
                            {buttonPut}
                        </Form>    
                        </Col>
                        
                    </Row>
                </Form>

            </Container>
        </div>
    )
}

export default UserInfo
