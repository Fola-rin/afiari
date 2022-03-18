import React from "react";
import "./styles.css";

const Alert = ({ message, setAlert }) => {
	return (
		<div className="alert">
			<div className="wrapper">
				<h3>Alert</h3>
				<p>{message}</p>
				<button onClick={() => setAlert(false)}>Ok</button>
			</div>
		</div>
	);
};

export default Alert;
