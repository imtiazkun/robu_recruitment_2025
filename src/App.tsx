// import Closed from "./closed";
import Dashboard from "./dashboard";
import FormPage from "./form"
import Login from "./login";

export default function App() {

    const location = window.location.pathname


    switch (location) {
        case '/login':
            return <Login />
            break;
        case '/hub':
            return <Dashboard />
            break;
        default:
            return <FormPage />
            break;
    }
}
