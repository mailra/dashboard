console.clear();
const elApp = document.querySelector("#app");
const elButton = document.querySelector(".ui-submit");
const elPassword = document.querySelector(".ui-password-input");
const elReset = document.querySelector(".ui-reset");

const context = {
  password: ""
};

const actions = {
  assignPassword: XState.assign({
    password: (_, event) => event.value
  }),
  validatePassword: ctx => {
    setTimeout(() => {
      if (ctx.password === "password") {
        send("VALID");
      } else {
        send("INVALID");
      }
    }, 2000);
  },

  clearPassword: XState.assign({
    password: () => {
      elPassword.value = '';
      return '';
    }
  })
};

const passwordMachine = XState.Machine(
  {
    initial: "idle",
    context,
    states: {
      idle: {
        entry: "clearPassword",
        on: {
          SUBMIT: { target: "validating", cond: "passwordEntered" },
          CHANGE: {
            target: "idle",
            actions: "assignPassword",
            internal: true // this prevents onEntry from running again
          }
        },
        initial: 'normal',
        states: {
          normal: {},
          error: {
            after: {
              2000: "normal"
            }
          }
        }
      },
      validating: {
        onEntry: "validatePassword",
        on: {
          VALID: "success",
          INVALID: "idle.error"
        }
      },
      success: {}
    },
    on: {
      RESET: ".idle"
    }
  },
  {
    actions,
    guards: {
      passwordEntered: ctx => {
        return ctx.password && ctx.password.length
      }
    }
  }
);

let state = passwordMachine.initialState;

function activate(state) {
  elApp.dataset.state = state.toStrings().join(' ');

  document.querySelectorAll("[data-active]").forEach(el => {
    el.removeAttribute("data-active");
  });

  document.querySelectorAll(`[data-show~="${state.value}"]`).forEach(el => {
    el.setAttribute("data-active", true);
  });
}

const interpreter = XState
  .interpret(passwordMachine)
  .onTransition(activate)
  .start();

activate(state);

const { send } = interpreter;

elButton.addEventListener("click", () => send("SUBMIT"));
elPassword.addEventListener("input", e =>
  send({ type: "CHANGE", value: e.target.value })
);
elApp.addEventListener("submit", e => {
  e.preventDefault();
  send("SUBMIT");
});
elReset.addEventListener("click", () => send("RESET"));
