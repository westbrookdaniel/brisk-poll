import faker from "@faker-js/faker";

describe("smoke tests", () => {
  it("should allow you to register and login", () => {
    const loginForm = {
      name: faker.name.findName(),
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visit("/");
    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /name/i }).type(loginForm.name);
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("button", { name: /menu/i }).click();
    cy.findByText(/logout/i).click();

    cy.findByRole("link", { name: /login/i });

    cy.cleanupUser();
  });

  it("should allow you to create a poll and vote", () => {
    const poll = {
      title: "Who is your favourite person?",
      options: [
        faker.name.findName(),
        faker.name.findName(),
        faker.name.findName(),
      ],
    };
    cy.visit("/");
    cy.findByRole("textbox", { name: /title/i }).type(poll.title);

    cy.findByPlaceholderText(/label for option 1/i).type(poll.options[0]);
    cy.findByPlaceholderText(/label for option 2/i).type(poll.options[1]);
    cy.findByText(/add option/i).click();
    cy.findByPlaceholderText(/label for option 3/i).type(poll.options[2]);

    cy.findByText(/create poll/i).click();

    cy.findByLabelText(poll.options[1]).click();

    cy.findByText(/confirm choice/i).click();

    cy.findByTestId(poll.options[1]).contains("1");
  });
});
