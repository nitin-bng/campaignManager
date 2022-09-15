import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
	const res = localStorage.getItem("userId");

	return (
		<>
			{res  ? (
				children
			 ) : (
				<Navigate to="/campmngr/" replace={true} />
			)} 
		</>
	);
};

export default RequireAuth;