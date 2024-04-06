function high(){
    let Con_Count = parseInt(localStorage.getItem("Con_Count")); // Get the number of contacts

    let account_ids = []; // Initialize an array to store unique account IDs

    let max_Acc_Id = 0; // Initialize the maximum account ID

    // Iterate over each contact
    for (let j = 1; j <= Con_Count; j++) {
        let Contact = localStorage.getItem("Con_" + j); // Get contact information
        Contact = JSON.parse(Contact); // Parse the contact JSON data

        // Assuming Contact.Allaccountarr is an array of account information
        if (Contact && Contact.Allaccountarr) {
            // Iterate over each account in the contact's account array
            Contact.Allaccountarr.forEach((element) => {
                // Update max_Acc_Id if the current account ID is greater
                let c_account_id = parseInt(element.Account_Id);
                if (max_Acc_Id < c_account_id) {
                    max_Acc_Id = c_account_id; // Set the new maximum account ID
                }
                // Add the account ID to the array if it's not already present
                if (!account_ids.includes(c_account_id)) {
                    account_ids.push(c_account_id);
                }
            });
        }
    }   

    console.log(max_Acc_Id); // Log the maximum account ID to the console
    console.log(account_ids); // Log the array of unique account IDs
    addvalues(account_ids); // Pass the array of unique account IDs to the addvalues function
}

high();

function addvalues(account_ids) {
    let Con_Count = parseInt(localStorage.getItem("Con_Count"));
    let arr = [];

    account_ids.forEach((i) => { // Loop through the unique account IDs
        let total = 0;
        let Account_Name = "";

        for (let j = 1; j <= Con_Count; j++) {
            let Contact = localStorage.getItem("Con_" + j);
            Contact = JSON.parse(Contact);

            // Assuming Contact.Allaccountarr is an array of account information
            if (Contact && Contact.Allaccountarr) {
                Contact.Allaccountarr.forEach((element) => {
                    if (element.Account_Id == i) {
                        Account_Name = element.Account_Name;
                        total += parseFloat(element.Ammount);
                    }
                });
            }
        }

        let data = {
            Name: Account_Name,
            Id: i,
            Amount: total,
        };

        arr.push(data);
    });

    console.log(arr);
}
