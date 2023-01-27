import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";
import App from "../App";

test("renders without errors", () => {
  render(<App />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const header = screen.getByText("Contact Form");
  expect(header).toBeInTheDocument();
  expect(header).toHaveTextContent(/contact form/i);
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const fName = screen.getByLabelText(/First Name*/i);
  userEvent.type(fName, "L");

  const error = await screen.findAllByTestId("error");
  expect(error).toHaveLength(1);
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)

    await waitFor(() => {
        const error = screen.queryAllByTestId('error')
        expect(error).toHaveLength(3)
    })


});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const fName = screen.getByLabelText(/First Name*/i);
  userEvent.type(fName, "onetwothreefourfive");

  const lName = screen.getByLabelText(/Last Name*/i);
  userEvent.type(lName, "onetwothreefourfive");

    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)

    await waitFor(() => {
        const error = screen.queryAllByTestId('error')
        expect(error).toHaveLength(1)
    })

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);

    const email = screen.getByLabelText(/Email*/i)
    userEvent.type(email, 'notavalidemailaddress')
    
    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)

    await waitFor(() => {
        const error = screen.getByText(/Error: email must be a valid email address./i)
        expect(error).toBeInTheDocument()
    })


});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);

  const lname = screen.getByLabelText(/Last Name*/i)
    userEvent.type(lname, '')
    
    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)

    await waitFor(() => {
        const error = screen.getByText(/Error: lastName is a required field./i)
        expect(error).toBeInTheDocument()
    })

});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);

  const fName = screen.getByLabelText(/First Name*/i);
  userEvent.type(fName, "onetwothreefourfive");

  const lName = screen.getByLabelText(/Last Name*/i);
  userEvent.type(lName, "onetwothreefourfive");

  const email = screen.getByLabelText(/Email*/i)
    userEvent.type(email, 'nonvalid@email.adrs')

    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)

    await waitFor(() => {
        const confirmation = screen.getByText(/You Submitted/i)
        expect(confirmation).toBeInTheDocument()
    })

});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);

  const fName = screen.getByLabelText(/First Name*/i);
  userEvent.type(fName, "onetwothreefourfive");

  const lName = screen.getByLabelText(/Last Name*/i);
  userEvent.type(lName, "onetwothreefourfive");

  const email = screen.getByLabelText(/Email*/i)
    userEvent.type(email, 'nonvalid@email.adrs')

    const message = screen.getByLabelText(/Message/i)
    userEvent.type(message, 'message!')

    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)

    await waitFor(() => {
        const confirmation = screen.getByText(/You Submitted/i)
        expect(confirmation).toBeInTheDocument()

        const fNameConf = screen.getByText(/First Name:/i)
        expect(fNameConf).toBeInTheDocument()

        const lNameConf = screen.getByText(/Last Name:/i)
        expect(lNameConf).toBeInTheDocument()

        const emailConf = screen.getByText(/Email:/i)
        expect(emailConf).toBeInTheDocument()

        const messageConf = screen.getByText(/Message:/i)
        expect(messageConf).toBeInTheDocument()
    })

});
