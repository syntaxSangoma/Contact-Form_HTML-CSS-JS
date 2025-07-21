const form = document.querySelector("#contactForm");

if (form) {
  const inputs = form.querySelectorAll(
    "input[type='text'], input[type='email'], textarea"
  );
  const submitButton = form.querySelector(".submit-button");
  const checkbox = form.querySelector('input[type="checkbox"]');
  const radios = form.querySelectorAll('input[name="query"]');

  // String/Email/Textarea Validation
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      validateStringInput(input);
      updateSubmitButton();
    });
  });

  // Checkbox Validation
  checkbox.addEventListener("change", () => {
    validateCheckInput(checkbox);
    updateSubmitButton();
  });

  // Radio Button Validation
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      validateRadioInput();
      updateSubmitButton();
    });
  });

  // Validate text/email/textarea fields
  function validateStringInput(input) {
    const wrapper = input.closest(".input-wrapper");
    const message = wrapper.querySelector(".message");
    const value = input.value.trim();
    let isValid = true;

    input.classList.remove("valid", "invalid");
    message.textContent = "";
    message.style.display = "none";

    if (value === "") {
      setError("This field is required.");
    } else if (["first-name", "last-name"].includes(input.name)) {
      if (value.length < 2) {
        setError("Name must be at least 2 characters long.");
      } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/.test(value)) {
        setError("Name must only contain letters.");
      } else {
        setSuccess("Looks good!");
      }
    } else if (input.name === "message-input") {
      if (value.length > 2200) {
        setError("Message must not exceed 2200 characters.");
      } else {
        setSuccess("Looks good!");
      }
    } else if (input.type === "email") {
      if (!input.validity.valid) {
        setError("Please enter a valid email address.");
      } else {
        setSuccess("Looks good!");
      }
    } else {
      setSuccess("Looks good!");
    }

    function setError(msg) {
      isValid = false;
      input.classList.add("invalid");
      message.style.display = "block";
      message.textContent = msg;
      message.classList.add("error-message");
      message.classList.remove("success-message");
    }

    function setSuccess(msg) {
      isValid = true;
      input.classList.add("valid");
      message.style.display = "block";
      message.textContent = msg;
      message.classList.remove("error-message");
      message.classList.add("success-message");
    }

    return isValid;
  }

  // Validate radio buttons
  function validateRadioInput() {
    const selectedRadio = form.querySelector('input[name="query"]:checked');
    const wrapper = radios[0].closest(".form-query-wrapper");
    const message = wrapper.querySelector(".message");

    document.querySelectorAll(".query-button").forEach((label) => {
      label.classList.remove("valid", "invalid");
    });
    message.textContent = "";
    message.style.display = "none";

    if (selectedRadio) {
      const selectedLabel = selectedRadio.closest(".query-button");
      selectedLabel.classList.add("valid");
      message.style.display = "block";
      message.textContent = "Looks good!";
      message.classList.remove("error-message");
      message.classList.add("success-message");
      return true;
    } else {
      message.style.display = "block";
      message.textContent = "Please select a query.";
      message.classList.add("error-message");
      message.classList.remove("success-message");
      return false;
    }
  }

  // Validate checkbox
  function validateCheckInput(box) {
    const wrapper = box.closest(".check-wrapper");
    const message = wrapper.querySelector(".message");

    message.textContent = "";
    message.style.display = "none";

    if (!box.checked) {
      document.querySelector(".checkbox-label").classList.add("invalid");
      message.style.display = "block";
      message.textContent = "This checkbox must be selected.";
      message.classList.add("error-message");
      message.classList.remove("success-message");
      return false;
    } else {
      message.style.display = "block";
      message.textContent = "Looks good!";
      message.classList.remove("error-message");
      message.classList.add("success-message");
      return true;
    }
  }

  function updateSubmitButton() {
    let allValid = true;

    inputs.forEach((input) => {
      const valid = validateStringInput(input);
      if (!valid) allValid = false;
    });

    const isRadioValid = validateRadioInput();
    const isCheckboxValid = validateCheckInput(checkbox);

    if (allValid && isRadioValid && isCheckboxValid) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }

  form.addEventListener("submit", function (e) {
    const selectedRadio = form.querySelector('input[name="query"]:checked');
    const selectedCheck = form.querySelector('input[type="checkbox"]:checked');

    if (!selectedRadio) {
      e.preventDefault();
      validateRadioInput();
      return;
    }

    if (!selectedCheck) {
      e.preventDefault();
      validateRadioInput();
      return;
    }

    let formValid = true;

    inputs.forEach((input) => {
      const valid = validateStringInput(input);
      if (!valid) formValid = false;
    });

    const isRadioValid = validateRadioInput();
    const isCheckboxValid = validateCheckInput(checkbox);

    if (!formValid || !isRadioValid || !isCheckboxValid) {
      e.preventDefault();
      submitButton.disabled = false;
    } else {
      e.preventDefault();
      const popup = document.querySelector(".popup-content");

      popup.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        popup.style.display = "none";
      }, 5000);
    }
  });
}
