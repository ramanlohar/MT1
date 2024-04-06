// Event listeners
document
  .querySelector(".add-account-btn")
  .addEventListener("click", showAddAccountPopup);
document.querySelector("#Cancel").addEventListener("click", hidePopup);
document
  .querySelector("#action-btn")
  .addEventListener("click", saveOrUpdateAccount);
document.addEventListener("DOMContentLoaded", () => {
  updateAccountAmounts();
  displayAccounts();
});

function showPopup(title, action) {
  document.querySelector("#popup-title").textContent = title;
  document.querySelector("#action-btn").textContent = action;
  document.querySelector(".popup").classList.remove("dnone");
}

// Functions
function showAddAccountPopup() {
  showPopup("Add New", "Save");
}

function hidePopup() {
  document.querySelector(".popup").classList.add("dnone");
}

function saveOrUpdateAccount() {
  const name = document.querySelector("#name");
  const mobile = document.querySelector("#mobile");
  const id = parseInt(document.querySelector("#action-btn").dataset.id) || 0;

  if (!name.value || !mobile.value) {
    highlightInvalidInput(name, mobile);
    return;
  }

  const data = {
    Name: name.value,
    Mobile: mobile.value,
    initial: mobile.value,
  };
  const Acc_Count = parseInt(localStorage.getItem("Acc_Count") || 3) + 1;
  localStorage.setItem("Acc_Count", Acc_Count);
  localStorage.setItem("Acc_" + (id ? id : Acc_Count), JSON.stringify(data));

  hidePopup();
  document.querySelector(".form").reset();
  displayAccounts();
  window.location.reload();
}

function highlightInvalidInput(...inputs) {
  inputs.forEach((input) => (input.style.backgroundColor = "red"));
  setTimeout(() => {
    inputs.forEach((input) => (input.style.backgroundColor = ""));
  }, 1000);
}

function displayAccounts() {
  const Acc_Count = parseInt(localStorage.getItem("Acc_Count") || 0);
  const Accounts = document.getElementById("Accounts");
  Accounts.innerHTML = "";
  for (let index = 1; index <= Acc_Count; index++) {
    const accountData = JSON.parse(localStorage.getItem("Acc_" + index));
    if (accountData) {
      const accountHTML = createAccountHTML(index, accountData);
      Accounts.appendChild(accountHTML);
    }
  }
}

function createAccountHTML(index, accountData) {
  const accountDiv = document.createElement("div");
  accountDiv.classList.add("account");
  accountDiv.id = "Acc_" + index;

  const accountInfoHTML = `
                <div class="account-info-t">
                    <label for="">Name</label>
                    <label for="">Amount</label>
                    <label for="">Initial</label>
                </div>
                <div class="account-info">
                    <input type="text" value="${accountData.Name}" readonly>
                    <input type="text" value="${accountData.Mobile}" readonly>
                    <input type="text" value="${accountData.initial}" readonly>
                </div>
                <div class="account-info">
                    <input type="button" value="edit" onclick="editAccount(${index},'${accountData.Name}','${accountData.initial}')">
                    <input type="button" value="del" onclick="deleteAccount(${index})">
                </div>
            `;
  accountDiv.innerHTML = accountInfoHTML;
  return accountDiv;
}

function deleteAccount(id) {
  localStorage.removeItem("Acc_" + id);
  displayAccounts();
}

function editAccount(id, Name, amount) {
  showPopup("Edit", "Update");
  const name = document.querySelector("#name");
  const mobile = document.querySelector("#mobile");
  name.value = Name;
  mobile.value = amount;
  document.querySelector("#action-btn").dataset.id = id;
}

function updateAccountAmounts() {
  const Con_Count = parseInt(localStorage.getItem("Con_Count") || 0);
  const All_account_values = JSON.parse(
    localStorage.getItem("All_account_values") || "[]"
  );
  All_account_values.forEach((element) => {
    const acc_id = element.Id;
    const saved_acc_str = localStorage.getItem("Acc_" + acc_id);
    if (saved_acc_str !== null) {
      let saved_acc;
      try {
        saved_acc = JSON.parse(saved_acc_str);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        saved_acc = {};
      }
      const updatedAmount = element.Amount + parseFloat(saved_acc.initial || 0);
      const updatedData = {
        Name: saved_acc.Name || element.Name,
        Mobile: updatedAmount,
        initial: saved_acc.initial || 0,
      };
      localStorage.setItem("Acc_" + acc_id, JSON.stringify(updatedData));
    } else {
      console.error("No data found for Acc_" + acc_id);
    }
  });
  displayAccounts();
}

function getUniqueAccountIds() {
  const Con_Count = parseInt(localStorage.getItem("Con_Count") || 0);
  const accountIds = [];
  for (let j = 1; j <= Con_Count; j++) {
    const Contact = JSON.parse(localStorage.getItem("Con_" + j) || "{}");
    if (Contact.Allaccountarr) {
      Contact.Allaccountarr.forEach((element) => {
        const cAccountId = parseInt(element.Account_Id);
        if (!accountIds.includes(cAccountId)) {
          accountIds.push(cAccountId);
        }
      });
    }
  }
  return accountIds;
}

function updateAllAccountValues() {
  const accountIds = getUniqueAccountIds();
  const Con_Count = parseInt(localStorage.getItem("Con_Count") || 0);
  const arr = [];

  accountIds.forEach((i) => {
    let total = 0;
    let Account_Name = "";

    for (let j = 1; j <= Con_Count; j++) {
      const Contact = JSON.parse(localStorage.getItem("Con_" + j) || "{}");
      if (Contact.Allaccountarr) {
        Contact.Allaccountarr.forEach((element) => {
          if (element.Account_Id == i) {
            Account_Name = element.Account_Name;
            total += parseFloat(element.Ammount);
          }
        });
      }
    }

    const data = { Name: Account_Name, Id: i, Amount: total };
    arr.push(data);
  });

  localStorage.setItem("All_account_values", JSON.stringify(arr));
}


function displayTotalAccountAmount() {
    let totalAmount = 0;
    const Acc_Count = parseInt(localStorage.getItem("Acc_Count") || 0);
    
    for (let index = 1; index <= Acc_Count; index++) {
        const accountData = JSON.parse(localStorage.getItem("Acc_" + index));
        if (accountData) {
            totalAmount += parseFloat(accountData.Mobile);
        }
    }
    document.getElementById("Total_Account_Amount").innerText = "Tatal Amount : " + totalAmount;
    console.log("Total amount of all accounts:", totalAmount);
    // Display the total amount in your HTML or wherever necessary
}

updateAllAccountValues();
displayAccounts();
displayTotalAccountAmount();