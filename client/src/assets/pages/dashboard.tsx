import { useNavigate } from 'react-router-dom';
import Nav from '../components/nav';


export default function Dashboard({children}:any){
    const navigate = useNavigate();

    return (
        <Nav>
            {children}
        </Nav>
    )
}
