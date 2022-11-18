import React, {useContext} from 'react'
import { RoomContext } from '../context/RoomContext'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../app.css'
import { TbScreenShare } from 'react-icons/tb';
import { BsCameraVideoOff,BsCameraVideo, } from 'react-icons/bs';
import { BiMicrophoneOff,BiMicrophone } from 'react-icons/bi';

export default function Navber(){
  
  const {screenShare,couperson,son} = useContext(RoomContext)
  return (
      
    <Navbar className='navbar' collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Collapse  id="responsive-navbar-nav">
          <Nav className='nav'>
            <Nav.Link  className='navlink' onClick={screenShare}><TbScreenShare size = '1.5rem' /></Nav.Link>
            <Nav.Link className='navlink'><BsCameraVideo size = '1.5rem'/> </Nav.Link>
            <Nav.Link className='navlink' onClick={couperson}> {son?  <BiMicrophoneOff size = '1.5rem'/>: <BiMicrophone size = '1.5rem'/> }</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      
      </Navbar>
     
  );
}
