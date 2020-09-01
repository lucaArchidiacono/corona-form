import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Button, TextField, Grid } from "@material-ui/core";
import Cookies from "universal-cookie";
import axios from "axios";

const API_PATH = "http://localhost:8888/index.php";

const NAME_LEER = "Darf nicht leer sein.\n";
const NAME_KURZ = "Zu Kurz.\n";
const NAME_NUR_BUCHSTABEN = "Nur Buchstaben erlaubt.\n";
const MEHR_ALS_10_PERSONEN = "Mehr als 10 Personen.\n";
const WENIGER_ALS_1_PERSON = "Weniger als 1 Person.\n";
const TEL_NR_LEER = "TelNr ist leer.\n";
const cookies = new Cookies();

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        fname: "",
        lname: "",
        nrPers: 1,
        phoneNr: "",
        tableNr: props.value,
      },
      errors: {},
      dbRequestSent: false,
      error: null,
    };
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //FirstName
    if (fields.fname === "") {
      formIsValid = false;
      errors["fname"] = NAME_LEER;
    } else {
      if (fields.fname.length <= 2) {
        formIsValid = false;
        errors["fname"] = NAME_KURZ;
      }
      if (!fields.fname.match(/^[a-zA-ZäöüÄÖÜ]+$/)) {
        formIsValid = false;
        errors["fname"] = NAME_NUR_BUCHSTABEN;
      }
    }

    //LastName
    if (fields.lname === "") {
      formIsValid = false;
      errors["lname"] = NAME_LEER;
    } else {
      if (fields.lname.length <= 2) {
        formIsValid = false;
        errors["lname"] = NAME_KURZ;
      }
      if (!fields.lname.match(/^[a-zA-ZäöüÄÖÜ]+$/)) {
        formIsValid = false;
        errors["lname"] = NAME_NUR_BUCHSTABEN;
      }
    }

    //Number of persons
    if (fields.nrPers > 10) {
      formIsValid = false;
      errors["nrPers"] = MEHR_ALS_10_PERSONEN;
    }
    if (fields.nrPers < 1) {
      formIsValid = false;
      errors["nrPers"] = WENIGER_ALS_1_PERSON;
    }

    //phone Number
    if (fields.phoneNr === "") {
      formIsValid = false;
      errors["phoneNr"] = TEL_NR_LEER;
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleFormSubmit(e) {
    e.preventDefault();

    if (this.handleValidation()) {
      axios({
        method: "post",
        url: `${API_PATH}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: this.state.fields,
      })
        .then((result) => {
          this.setState({
            dbRequestSent: result.data.sent,
          });
          console.log(result);
          cookies.set("taverne-form-sent", true, {
            path: "/",
          });
          alert("Formular wurde eingereicht.");
        })
        .catch((error) => {
          this.setState({ error: error.message });
          console.log(error);
          alert("Etwas ist schiefgelaufen.\n" + error);
        });
    } else {
      alert("Formular hat Fehler.");
    }
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    if (field === "phoneNr") {
      fields.phoneNr = e;
    } else {
      fields[field] = e.target.value;
    }
    this.setState({ fields });
  }

  render() {
    return (
      <div className="rootForm">
        <form onSubmit={this.handleFormSubmit.bind(this)}>
          <Grid
            container
            spacing={3}
            justify="space-evenly"
            direction="column"
            alignItems="center"
          >
            <Grid item>
              <p>Corona Formular</p>
            </Grid>
            <Grid item>
              <TextField
                id="filled-basic"
                label="Vorname"
                variant="filled"
                error={this.state.errors["fname"] !== undefined}
                helperText={
                  this.state.errors["fname"] !== undefined &&
                  this.state.errors["fname"]
                }
                fullWidth
                value={this.state.fields.fname}
                onChange={this.handleChange.bind(this, "fname")}
              />
            </Grid>
            <Grid item>
              <TextField
                id="filled-basic"
                label="Nachname"
                variant="filled"
                error={this.state.errors["lname"] !== undefined}
                helperText={
                  this.state.errors["lname"] !== undefined &&
                  this.state.errors["lname"]
                }
                fullWidth
                value={this.state.fields.lname}
                onChange={this.handleChange.bind(this, "lname")}
              />
            </Grid>
            <Grid item>
              <TextField
                id="filled-number"
                label="Personenanzahl"
                variant="filled"
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  this.state.errors["nrPers"] !== undefined &&
                  this.state.errors["nrPers"]
                }
                helperText={
                  this.state.errors["nrPers"] !== undefined &&
                  this.state.errors["nrPers"]
                }
                fullWidth
                value={this.state.fields.nrPers}
                onChange={this.handleChange.bind(this, "nrPers")}
              />
            </Grid>
            <Grid item>
              <PhoneInput
                placeholder="TelNr."
                id="phoneNr"
                defaultCountry="CH"
                value={this.state.fields.phoneNr}
                onChange={this.handleChange.bind(this, "phoneNr")}
              />
              <br />
              <span style={{ color: "red" }}>
                {this.state.errors["phoneNr"]}
              </span>
            </Grid>
            <Grid item>
              <Button
                id="submitButton"
                variant="contained"
                color="primary"
                size="large"
                onClick={(e) => this.handleFormSubmit(e)}
                disabled={
                  this.state.dbRequestSent ||
                  cookies.get("taverne-form-sent") === "true"
                }
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

export default Form;
