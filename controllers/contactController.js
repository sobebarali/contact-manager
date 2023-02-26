const axios = require("axios");
const db = require("../database/db");
require("dotenv").config();

const config = {
  headers: {
    Authorization: `TOKEN token=${process.env.FRESHSALES_TOKEN}`,
    "Content-Type": "application/json",
  },
};

const createContact = async (req, res) => {
  const { first_name, last_name, email, mobile_number, data_store } = req.body;

  if (data_store === "CRM") {
    // create contact in FreshSales CRM
    const data = {
      contact: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        mobile_number: mobile_number,
      },
    };

    axios
      .post("https://domain.freshsales.io/api/contacts", data, config)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error creating contact in FreshSales CRM!");
      });
  } else if (data_store === "DATABASE") {
    // create contact in MySQL database
    const sql =
      "INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)";
    const values = [first_name, last_name, email, mobile_number];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error creating contact in MySQL database!");
      } else {
        res.send({ id: result.insertId });
      }
    });
  } else {
    res.status(400).send("Invalid data_store value!");
  }
};

const getContact = async (req, res) => {
  const { contact_id, data_store } = req.body;

  if (data_store === "CRM") {
    // get contact from FreshSales CRM
    const config = {
      headers: { Authorization: "Token token=TS3yNBLWG0-wv4ZUp8En5w" },
    };
    axios
      .get(`https://domain.freshsales.io/api/contacts/${contact_id}`, config)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error getting contact from FreshSales CRM!");
      });
  } else if (data_store === "DATABASE") {
    // get contact from MySQL database
    const sql = "SELECT * FROM contacts WHERE id = ?";
    db.query(sql, [contact_id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error getting contact from MySQL database!");
      } else if (result.length === 0) {
        res.status(404).send("Contact not found!");
      } else {
        res.send(result[0]);
      }
    });
  }
};

const updateContact = async (req, res) => {
  const { contact_id, new_email, new_mobile_number, data_store } = req.body;

  if (data_store === "CRM") {
    // update contact email and mobile number in FreshSales CRM
    const data = {
      contact: {
        email: new_email,
        mobile_number: new_mobile_number,
      },
    };
    axios
      .put(
        `https://domain.freshsales.io/api/contacts/${contact_id}`,
        data,
        config
      )
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error updating contact in FreshSales CRM!");
      });
  } else if (data_store === "DATABASE") {
    // update contact email and mobile number in MySQL database
    const sql = "UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?";
    db.query(sql, [new_email, new_mobile_number, contact_id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating contact in MySQL database!");
      } else if (result.affectedRows === 0) {
        res.status(404).send("Contact not found!");
      } else {
        res.send(`Contact ${contact_id} updated successfully!`);
      }
    });
  }
};

const deleteContact = async (req, res) => {
  const { contact_id, data_store } = req.body;

  if (data_store === "CRM") {
    // delete contact from FreshSales CRM
    axios
      .delete(`https://domain.freshsales.io/api/contacts/${contact_id}`, config)
      .then((response) => {
        res.send(
          `Contact ${contact_id} deleted successfully from FreshSales CRM!`
        );
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error deleting contact from FreshSales CRM!");
      });
  } else if (data_store === "DATABASE") {
    // delete contact from MySQL database
    const sql = "DELETE FROM contacts WHERE id = ?";
    db.query(sql, [contact_id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error deleting contact from MySQL database!");
      } else if (result.affectedRows === 0) {
        res.status(404).send("Contact not found!");
      } else {
        res.send(
          `Contact ${contact_id} deleted successfully from MySQL database!`
        );
      }
    });
  }
};

module.exports = { createContact, getContact, updateContact, deleteContact };
