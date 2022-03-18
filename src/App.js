import React, { useEffect, useState } from "react";
import FormElement from "./components/FormElement";

import { ReactComponent as EditIcon } from "./assets/edit.svg";
import { ReactComponent as DeleteIcon } from "./assets/xIcon.svg";

import Ellipse1 from "./assets/bg/Ellipse1.svg";
import Ellipse2 from "./assets/bg/Ellipse2.svg";
import Ellipse3 from "./assets/bg/Ellipse3.svg";
import Ellipse4 from "./assets/bg/Ellipse4.svg";
import Ellipse5 from "./assets/bg/Ellipse5.svg";
import Ellipse6 from "./assets/bg/Ellipse6.svg";
import Ellipse7 from "./assets/bg/Ellipse7.svg";

import "./App.css";
import axios from "axios";
import Alert from "./components/Alert";

const isValidEmail = (text) => {
	let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	let valid = true;
	if (re.test(text) === false) {
		valid = false;
	}
	return valid;
};

const App = () => {
	const [values, setValues] = useState({
		Email: "",
		Country: "",
		State: "",
		"City/Town": "",
	});
	const [editValue, setEditValue] = useState({});
	const [edit, setEdit] = useState(false);

	const [alert, setAlert] = useState({ message: "", show: false });

	const [countryData, setCountryData] = useState({ loading: true, data: [] });
	const [stateData, setStateData] = useState({ loading: true, data: [] });
	const [citiesData, setCitiesData] = useState({ loading: true, data: [] });

	const [contacts, setContacts] = useState(
		localStorage.getItem("contacts") !== null
			? JSON.parse(localStorage.contacts)
			: []
	);

	useEffect(() => {
		if (values.Email !== "") {
			axios({
				method: "get",
				url: `https://countriesnow.space/api/v0.1/countries/flag/images`,
			})
				.then((response) => {
					setCountryData({ loading: false, ...response.data });
				})
				.catch(function (error) {
					setCountryData({ loading: false, error: "an error occured" });
				});
		}
	}, [values.Email]);

	useEffect(() => {
		if (values.Email !== "" && values.Country !== "") {
			let data = JSON.stringify({ country: `${values.Country}` });

			axios({
				method: "post",
				url: "https://countriesnow.space/api/v0.1/countries/states",
				headers: {
					"Content-Type": "application/json",
				},
				data: data,
			})
				.then((response) => {
					setStateData({ loading: false, ...response.data });
					console.log(response.data);
				})
				.catch(function (error) {
					setStateData({ loading: false, error: "an error occured" });
				});
		}
	}, [values.Country]);

	useEffect(() => {
		if (values.Email !== "" && values.Country !== "" && values.State !== "") {
			let data = JSON.stringify({
				country: `${values.Country}`,
				state: `${values.State}`,
			});

			axios({
				method: "post",
				url: "https://countriesnow.space/api/v0.1/countries/state/cities",
				headers: {
					"Content-Type": "application/json",
				},
				data: data,
			})
				.then((response) => {
					setCitiesData({ loading: false, ...response.data });
				})
				.catch(function (error) {
					setCitiesData({ loading: false, error: "an error occured" });
				});
		}
	}, [values.State]);

	const submitHandler = () => {
		setValues({ Email: "", Country: "", State: "", "City/Town": "" });

		if (
			values.Email === "" ||
			values.Country === "" ||
			values.State === "" ||
			values["City/Town"] === ""
		) {
			setAlert({
				message: "Fill the appropriate details to continue",
				show: true,
			});
			return;
		} else if (!isValidEmail(values.Email)) {
			console.log("khbhkjhk");
			setAlert({ message: "Enter a valid email to continue", show: true });
			return;
		}
		setContacts([...contacts, values]);
		localStorage.setItem("contacts", JSON.stringify([...contacts, values]));
	};

	const editListHandler = (id) => {
		console.log(contacts[id]);
		setEditValue({ id, ...contacts[id] });
		setEdit(true);
	};
	const saveEditHandler = (index) => {
		if (
			editValue.Email === "" ||
			editValue.Country === "" ||
			editValue.State === "" ||
			editValue["City/Town"] === ""
		) {
			setAlert({
				message: "Fill the appropriate details to continue",
				show: true,
			});
			return;
		} else if (!isValidEmail(editValue.Email)) {
			console.log("khbhkjhk");
			setAlert({ message: "Enter a valid email to continue", show: true });
			return;
		}
		delete editValue.id;
		setContacts((newContacts) => {
			return newContacts.map((contact, id) =>
				id === index ? editValue : contact
			);
		});
		localStorage.setItem(
			"contacts",
			JSON.stringify(
				contacts.map((contact, id) => (id === index ? editValue : contact))
			)
		);
	};
	const deleteHandler = (index) => {
		setContacts(contacts.filter((contact, id) => id !== index));
		localStorage.setItem(
			"contacts",
			JSON.stringify(contacts.filter((contact, id) => id !== index))
		);
	};
	return (
		<div
			className="container"
			style={{
				backgroundImage: `url(${Ellipse1}), url(${Ellipse2}), url(${Ellipse3}), url(${Ellipse4}), url(${Ellipse5}), url(${Ellipse6}), url(${Ellipse7})`,
			}}
		>
			{alert.show ? <Alert setAlert={setAlert} message={alert.message} /> : ""}
			<div className="contact-form">
				<div className="heading">
					<h1>Let’s know you more</h1>
					<p>Fill the appropriate details</p>
				</div>
				<div className="form">
					<FormElement
						type="email"
						name="Email"
						values={values}
						setValues={setValues}
					/>
					<FormElement
						type="dropdown"
						name="Country"
						values={values}
						setValues={setValues}
						data={countryData}
						setAlert={setAlert}
					/>
					<FormElement
						type="dropdown"
						name="State"
						values={values}
						setValues={setValues}
						data={stateData}
						setAlert={setAlert}
					/>
					<FormElement
						type="dropdown"
						name="City/Town"
						values={values}
						setValues={setValues}
						data={citiesData}
						setAlert={setAlert}
					/>

					<button
						className={
							values.Email !== "" &&
							values.Country !== "" &&
							values.State !== "" &&
							values["City/Town"] !== ""
								? "submit-btn active"
								: "submit-btn"
						}
						onClick={() => submitHandler()}
					>
						Submit
					</button>
				</div>
			</div>
			<div className="contact-list">
				<h2>Contact list</h2>
				<hr />
				<div className="wrapper">
					<div className="heading">
						<div className="email">Email</div>
						<div className="country">Country</div>
						<div className="state">State</div>
						<div className="city">City</div>
					</div>
					{contacts.map((contact, id) => (
						<div className="content" key={id}>
							{edit && editValue.id === id ? (
								<>
									<input
										type="email"
										value={editValue.Email}
										onChange={(e) =>
											setEditValue({ ...editValue, Email: e.target.value })
										}
										className="email"
									/>
									<input
										type="text"
										disabled
										value={editValue.Country}
										className="country"
									/>
									<input
										type="text"
										disabled
										value={editValue.State}
										className="state"
									/>
									<input
										type="text"
										disabled
										value={editValue["City/Town"]}
										className="city"
									/>
									<div className="actions">
										<button onClick={() => saveEditHandler(id)}>Done</button>
									</div>
								</>
							) : (
								<>
									<div className="email">{contact.Email}</div>
									<div className="country">{contact.Country}</div>
									<div className="state">{contact.State}</div>
									<div className="city">{contact["City/Town"]}</div>
									<div className="actions">
										<button onClick={() => editListHandler(id)}>
											<EditIcon />
										</button>
										<button onClick={() => deleteHandler(id)}>
											<DeleteIcon />
										</button>
									</div>
								</>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default App;
