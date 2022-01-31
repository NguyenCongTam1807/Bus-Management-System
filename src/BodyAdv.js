import React from 'react'
import { Container, Carousel } from 'react-bootstrap'


export default function BodyAdv(){
    return (
        <Container >
            <Carousel style={{padding:"20px 0 20px 0"}}>
                <Carousel.Item>
                    <img className="d-block w-100" src="images/adv1.png" alt="First slide"/>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src="images/adv2.jpg" alt="Second slide" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src="images/adv3.jpg" alt="Third slide" />
                </Carousel.Item>
            </Carousel>
        </Container>
    )
}