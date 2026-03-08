import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDeviceControl } from '../hooks/useDeviceControl';

const Logout = () => {
    const {controlDevice} = useDeviceControl()
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            controlDevice("Signed out of the system !")
            navigate('/login');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-red-500/45 hover:bg-red-600 text-white transition-colors font-bold"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
        </button>
    );
};

export default Logout;