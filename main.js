const table = document.querySelector("#patient-data");
const submitBtn = document.querySelector("#add-btn");
const deleteBtn = document.querySelectorAll(".delete-btn");

const inputFullname = document.querySelector("#input-name");
const inputBirthDate = document.querySelector("#input-date");
const inputGender = document.querySelector("#input-gender");
const inputRoom = document.querySelector("#input-room");
const inputInsurance = document.querySelector("#input-insurance");

function getPatient() {
  fetch("http://localhost:3001/patient")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((patient) => {
        const tr = table.insertRow();

        const tdId = tr.insertCell();
        tdId.setAttribute("id", "id-data");
        tdId.setAttribute("class", "border px-4 py-2");
        tdId.appendChild(document.createTextNode(patient.id));

        const tdFullname = tr.insertCell();
        tdFullname.setAttribute("class", "border px-4 py-2");
        tdFullname.appendChild(document.createTextNode(patient.name));

        const tdBirthDate = tr.insertCell();
        tdBirthDate.setAttribute("class", "border px-4 py-2");
        tdBirthDate.appendChild(document.createTextNode(patient.birthDate));

        const tdGender = tr.insertCell();
        tdGender.setAttribute("class", "border px-4 py-2");
        tdGender.appendChild(document.createTextNode(patient.gender));

        const tdRoomClass = tr.insertCell();
        tdRoomClass.setAttribute("class", "border px-4 py-2");
        tdRoomClass.appendChild(document.createTextNode(patient.room));

        const tdInsurance = tr.insertCell();
        tdInsurance.setAttribute("class", "border px-4 py-2");
        tdInsurance.appendChild(document.createTextNode(patient.insurance));

        const tdDeleteBtn = tr.insertCell();
        tdDeleteBtn.setAttribute("class", "border px-4 py-2");

        const btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "delete-btn text-red-600 font-bold");

        btn.appendChild(document.createTextNode("Delete"));
        tdDeleteBtn.appendChild(btn);

        btn.addEventListener("click", () => {
          deletePatient(patient.id);
        });
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

function addPatient() {
  let data = {
    name: inputFullname.value,
    birthDate: inputBirthDate.value,
    gender: inputGender.value,
    room: inputRoom.value,
    insurance: inputInsurance.value,
  };

  fetch("http://localhost:3001/patient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((patient) => {
      const tr = table.insertRow();

      const tdId = tr.insertCell();
      tdId.setAttribute("id", "id-data");
      tdId.setAttribute("class", "border px-4 py-2");
      tdId.appendChild(document.createTextNode(patient.id));

      const tdFullname = tr.insertCell();
      tdFullname.setAttribute("class", "border px-4 py-2");
      tdFullname.appendChild(document.createTextNode(patient.name));

      const tdBirthDate = tr.insertCell();
      tdBirthDate.setAttribute("class", "border px-4 py-2");
      tdBirthDate.appendChild(document.createTextNode(patient.birthDate));

      const tdGender = tr.insertCell();
      tdGender.setAttribute("class", "border px-4 py-2");
      tdGender.appendChild(document.createTextNode(patient.gender));

      const tdRoomClass = tr.insertCell();
      tdRoomClass.setAttribute("class", "border px-4 py-2");
      tdRoomClass.appendChild(document.createTextNode(patient.room));

      const tdInsurance = tr.insertCell();
      tdInsurance.setAttribute("class", "border px-4 py-2");
      tdInsurance.appendChild(document.createTextNode(patient.insurance));

      const tdDeleteBtn = tr.insertCell();
      tdDeleteBtn.setAttribute("class", "border px-4 py-2");

      const btn = document.createElement("button");
      btn.setAttribute("type", "button");
      btn.setAttribute("class", "delete-btn text-red-600 font-bold");

      btn.appendChild(document.createTextNode("Delete"));
      tdDeleteBtn.appendChild(btn);
    })
    .catch((error) => {
      console.error(error);
    });
}

function deletePatient(id) {
  fetch(`http://localhost:3001/patient/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {
      const row = document.querySelector(`#id-data-${id}`).parentNode;
      row.remove();
    })
    .catch((error) => {
      console.error(error);
    });
}

getPatient();

submitBtn.addEventListener("click", () => {
  addPatient();
});
