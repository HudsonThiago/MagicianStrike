import { useNavigate } from 'react-router-dom';
import Main from './dashboard/main';
import { useUser } from '../context/UserContext';
import Lobby from './dashboard/lobby';
import Nav from '../components/nav';

export default function Dashboard(){
    const navigate = useNavigate();
    return (
        <Nav>
            <Lobby/>
        </Nav>
    )
}
