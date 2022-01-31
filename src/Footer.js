import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleDoubleRight} from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faYoutubeSquare} from '@fortawesome/free-brands-svg-icons' 
import { Link } from 'react-router-dom';


export default function Footer(){
    const s1 = {
        textDecoration: 'none',
        color: 'black'
    }
    const s2 = {
        marginBottom: "25px", 
        marginTop: "20px" 
    }
    const s3 = {
        textDecoration: 'none' 
    }
    let c = 
        <>
            <FontAwesomeIcon icon={faAngleDoubleRight} ></FontAwesomeIcon>
        </>
    return(
        <Container style={{padding:"20px 0 0 0"}}>
            <hr/>
            <Table style={{marginLeft: "auto", marginRight: "auto" }}>
                <Container>
                    <Row>
                        <Col >
                            <div class="container">
                                <div class="row" >
                                    <h6 style={{fontWeight:"1000"}}>TỔNG ĐÀI ĐẶT VÉ VÀ CSKH</h6>
                                    <div class="col bg-white col-auto col-md-6" style = {{padding: "0 10px 0 0"}}>
                                        <Link to style={{fontSize:"48px",fontWeight:"700", textDecoration: 'none', padding:'10px' }}>1900 6067</Link>
                                    </div>
                                    <div class="col bg-white col-auto col-md-6" style ={{padding: "15px 0 0 0"}}>
                                        <img src="/images/logo.png" style={{width:"150px"}} alt="bocongthuong"/>
                                    </div>
                                    <h6>CÔNG TY CỔ PHẦN XE KHÁCH OU</h6>
                                    <h6>Địa chỉ: 371 Nguyễn Kiệm, Phường 3, Q. Gò Vấp, TP. Hồ Chí Minh.</h6>
                                    <h6>Email: <Link to="#" style={s3}>hotro@ou.edu.vn</Link></h6>
                                    <div class="col bg-white col-auto" >
                                        <h6>Điện thoại: <Link to="#" style={s3}>028 3838 6852</Link></h6>
                                    </div>
                                    <div class="col bg-white col-auto" >
                                        <h6>Fax: <Link to="#" style={s3}>028 3838 6852</Link></h6>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col>
                        <div class="container">
                            <div class="row">
                                <h6 style={{fontWeight:"1000"}}>OU Bus Lines</h6>
                                <div class="col bg-white col-auto col-md-6" style = {{padding: "0 10px 0 0"}}>
                                    <h6 style = {s2}>{c} <Link to="#" style = {s1}>Về chúng tôi</Link> </h6>
                                    <h6 style = {s2}>{c} <Link to="#" style = {s1}>Lịch trình</Link> </h6>
                                    <h6 style = {s2}>{c} <Link to="#" style = {s1}>Tin tức</Link> </h6>
                                    <h6 style = {s2}>{c} <Link to="#" style = {s1}>Tra cứu thông tin đặt vé</Link> </h6>
                                </div>
                                <div class="col bg-white col-auto col-md-6" style ={{padding: "0"}}>
                                    <h6 style = {s2}>{c} <Link to="#" style = {s1}>Tuyển dụng</Link> </h6>
                                    <h6 style = {s2}>{c} <Link to="#" style = {s1}>Điều khoản sử dụng</Link> </h6>
                                    <h6 style = {s2}>{c} <Link to="#" style = {s1}>Hỏi đáp</Link> </h6>
                                    <h6 style = {s2}>{c} <Link to="#" style = {s1}>Hướng dẫn đặt vé</Link> </h6>
                                </div>
                            </div>
                        </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div class="container">
                                <div class="row">
                                    <h6 style={{fontWeight:"1000"}}>KẾT NỐI VỚI CHÚNG TÔI</h6>
                                    <div class="col bg-white col-auto" >
                                        <Link to style={{fontSize:"48px",fontWeight:"700", padding:'10px' }}><FontAwesomeIcon icon={faFacebookSquare} ></FontAwesomeIcon></Link>
                                    </div>
                                    <div class="col bg-white col-auto" >
                                        <Link to style={{fontSize:"48px",fontWeight:"700", padding:'10px' }}><FontAwesomeIcon icon={faYoutubeSquare} color="red"></FontAwesomeIcon></Link>
                                    </div>

                                   
                                   
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Table>
            <hr/>
            <p style={{textAlign:"center"}}>© 2021 | Bản quyền thuộc về Trường Đại học Mở TP.HCM | https://ou.edu.vn/</p>
        </Container>
    )
}