import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as ArrowDown } from "../assets/arrowDown.svg";

const isValidEmail = (text) => {
	let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	let valid = true;
	if (re.test(text) === false) {
		valid = false;
	}
	return valid;
};

const FormElement = ({ type, name, values, setValues, data, setAlert }) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [active, setActive] = useState(false);
	const [selectedflag, setSelectedflag] = useState("");

	const inputRef = useRef();

	const handlePlaceholderClick = () => {
		if (type === "email") {
			setActive(true);
			inputRef.current.focus();
		}
	};
	useEffect(() => {
		if (values.Email === "" && active && inputRef.current) {
			console.dir(inputRef.current);
			setActive(false);
			inputRef.current.blur();
		}
	}, [values.Email]);
	useEffect(() => {
		if (values[name] === "") {
			setActive(false);
			setSelectedflag("");
		}
	}, [values[name]]);

	const showContents = () => {
		if (name === "Country") {
			if (values.Email === "") {
				setAlert({ message: "Enter your email to continue", show: true });
			} else if (!isValidEmail(values.Email)) {
				setAlert({ message: "Enter a valid email to continue", show: true });
			} else {
				setShowDropdown(!showDropdown);
			}
		} else if (name === "State") {
			if (values.Country === "") {
				setAlert({ message: "Choose a country to continue", show: true });
			} else {
				setShowDropdown(!showDropdown);
			}
		} else if (name === "City/Town") {
			if (values.State === "") {
				setAlert({ message: "Choose a state to continue", show: true });
			} else {
				setShowDropdown(!showDropdown);
			}
		}
	};
	return (
		<div className="form-element">
			<div
				className={`placeholder${active ? " active" : ""}`}
				onClick={() => handlePlaceholderClick()}
			>
				<p>{name}</p>
			</div>

			{type === "dropdown" ? (
				<>
					<div className="selected">
						{name === "Country" ? (
							<img src={selectedflag} alt={values[name]} />
						) : (
							values[name]
						)}
					</div>
					<div className="dropdown">
						<button
							onClick={() => {
								showContents();
							}}
						>
							<ArrowDown />
						</button>
						{showDropdown ? (
							<div
								className={`contents${name === "Country" ? " country" : ""}`}
							>
								{name === "Country" ? (
									data.loading ? (
										<p>Loading...</p>
									) : data.error ? (
										<p>An Error occured</p>
									) : (
										data.data.map((country, id) => (
											<div
												className="item"
												key={id}
												onClick={() => {
													setValues({ ...values, [name]: country.name });
													setSelectedflag(country.flag);
													setActive(true);
													setShowDropdown(false);
												}}
											>
												<img src={country.flag} alt={country.name} />{" "}
												<p>{country.name}</p>
											</div>
										))
									)
								) : name === "State" ? (
									data.loading ? (
										<p>Loading...</p>
									) : data.error ? (
										<p>An Error occured</p>
									) : data.data.states.length === 0 ? (
										<p className="item">
											No states, choose another country to continue
										</p>
									) : (
										data.data.states.map((item, id) => (
											<p
												key={id}
												className="item"
												onClick={() => {
													setValues({ ...values, [name]: item.name });
													setActive(true);
													setShowDropdown(false);
												}}
											>
												{item.name}
											</p>
										))
									)
								) : data.loading ? (
									<p>Loading...</p>
								) : data.error ? (
									<p>An Error occured</p>
								) : data.data.length === 0 ? (
									<p className="item">
										No cities, choose another state/country to continue
									</p>
								) : (
									data.data.map((item, id) => (
										<p
											key={id}
											className="item"
											onClick={() => {
												setValues({ ...values, [name]: item });
												setActive(true);
												setShowDropdown(false);
											}}
										>
											{item}
										</p>
									))
								)}
							</div>
						) : (
							""
						)}
					</div>
				</>
			) : type === "email" ? (
				<input
					type="email"
					name="Email"
					onChange={(e) => {
						setValues({ ...values, Email: e.target.value });
						if (e.target.value === "") {
							setActive(true);
						}
					}}
					value={values.Email}
					ref={inputRef}
				/>
			) : (
				""
			)}
		</div>
	);
};

export default FormElement;
