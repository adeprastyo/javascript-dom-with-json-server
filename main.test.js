const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require("jsdom");
const { waitFor, screen, fireEvent } = require("@testing-library/dom");
const { default: userEvent } = require("@testing-library/user-event");

const data = [
  {
    name: "Dito Bagus",
    birthDate: "1976-04-02",
    gender: "Male",
    room: "VIP",
    insurance: "Swasta",
    id: 2,
  },
  {
    name: "Fulan",
    birthDate: "2000-12-28",
    gender: "Male",
    room: "2",
    insurance: "BPJS",
    id: 3,
  },
  {
    name: "Fulana",
    birthDate: "2000-07-30",
    gender: "Female",
    room: "1",
    insurance: "Swasta",
    id: 4,
  },
];

let fetch;
/** @type {Document} */
let document;

beforeEach(async () => {
  const { window } = await JSDOM.fromFile("index.html", {
    runScripts: "dangerously",
    resources: "usable",
  });

  fetch = jest.fn().mockReturnValueOnce(Promise.resolve({ json: () => data }));

  window.fetch = fetch;
  const d = await new Promise((resolve) => {
    window.addEventListener("load", () => {
      resolve({
        window: window,
        document: window.document,
      });
    });
  });

  document = d.document;
});

describe("Form submission", () => {
  it("should call fetch with correct url", async () => {
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(fetch).toHaveBeenLastCalledWith("http://localhost:3001/patient");
  });

  it("should get initial patients", async () => {
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const rows = document.querySelectorAll("tbody tr");
    expect(rows.length).toBe(3);
    expect(rows[0].querySelectorAll("td")[1].textContent).toBe("Dito Bagus");
    expect(rows[0].querySelectorAll("td")[2].textContent).toBe("1976-04-02");
    expect(rows[0].querySelectorAll("td")[3].textContent).toBe("Male");
    expect(rows[0].querySelectorAll("td")[4].textContent).toBe("VIP");
    expect(rows[0].querySelectorAll("td")[5].textContent).toBe("Swasta");
  });

  it("should successfully add patient, and update the dom afterward", async () => {
    const user = userEvent.setup();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    fetch.mockReturnValue(
      Promise.resolve({
        json: () => [
          ...data,
          {
            name: "Eddy Permana",
            birthDate: "2000-12-28",
            gender: "Male",
            room: "2",
            insurance: "BPJS",
            id: 5,
          },
        ],
      })
    );

    const name = document.getElementById("input-name");

    await fireEvent.change(name, { target: { value: "Eddy Permana" } });

    const birthDate = document.getElementById("input-date");

    await fireEvent.change(birthDate, { target: { value: "2000-12-28" } });

    const gender = document.getElementById("input-gender");

    await fireEvent.change(gender, { target: { value: "Male" } });

    const room = document.getElementById("input-room");

    await fireEvent.change(room, { target: { value: "2" } });

    const insurance = document.getElementById("input-insurance");

    await fireEvent.change(insurance, { target: { value: "BPJS" } });

    fireEvent.click(document.getElementById("add-btn"));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    expect(fetch).nthCalledWith(2, "http://localhost:3001/patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Eddy Permana",
        birthDate: "2000-12-28",
        gender: "Male",
        room: "2",
        insurance: "BPJS",
      }),
    });

    await waitFor(() => {
      const rows = document.querySelectorAll("tbody tr");
      expect(rows.length).toBe(4);
    });
  }, 50000);

  it("should delete patient, and update the dom afterward", async () => {
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    /** @type {HTMLCollectionOf<HTMLButtonElement>} */
    const delete_button = await document.getElementsByClassName("delete-btn");

    fetch.mockReturnValue(
      Promise.resolve({
        json: () => data.slice(0, 2),
      })
    );

    delete_button[0].click();

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    expect(fetch).nthCalledWith(2, "http://localhost:3001/patient/2", {
      method: "DELETE",
    });

    await waitFor(() => {
      const rows = document.querySelectorAll("tbody tr");
      expect(rows.length).toBe(2);
    });
  });
});
