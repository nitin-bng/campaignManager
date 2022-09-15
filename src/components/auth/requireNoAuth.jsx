
import { Navigate } from "react-router-dom";

const RequireNoAuth = ({ children }) => {

	const res = localStorage.getItem("userId");

	return (
		<>
			{res ? (
				<Navigate
					to={"/campmngr/home"}
					replace={true}
				/>
			) : (
				children
			    )}
		</>
	);
};

export default RequireNoAuth;