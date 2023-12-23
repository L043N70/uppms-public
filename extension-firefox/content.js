SCRIPT_DELAY = 3000;  // 3 seconds
ACTION_DELAY = 100;  // 3 second

console.log("Content script loaded at: " + new Date().toLocaleString());
console.log("Waiting for " + SCRIPT_DELAY + " milliseconds before executing the content script.");
setTimeout(() => {
    // Execute the content script after 3 seconds
    console.log("3 seconds passed. Current time: " + new Date().toLocaleString());

    // Execute the function with the provided JSON
    performActionsBasedOnJson(jsonInput);

}, SCRIPT_DELAY);


// Assuming 'jsonInput' is the JSON provided with actions for different websites
const jsonInput = `{
    "www.quantcast.com": {
        "ACCEPT_P": [
            ".css-1hy2vtq",
            "#Purposes-id\\\\:8 > button",
            "#Purposes-id\\\\:8 .qc-cmp2-toggle",
            ".qc-cmp2-footer .css-47sehv"
        ],
        "ACCEPT_ALL": [
            ".css-47sehv"
        ],
        "REJECT_ALL": [
            ".css-1hy2vtq",
            ".qc-cmp2-header-links > button.css-8rroe4:first-child",
            ".css-47sehv"
        ]
    }
}`;

// Declare the user_cookie_policy file as a JSON string
const userCookiePolicy = `{
    "version": "1.0.0",
    "user_policy_id": "ACCEPT_P"
  }`;

// Function to get the user action from the 'user_cookie_policy' file
function getUserAction() {
    // Parse the user_cookie_policy file
    const policy = JSON.parse(userCookiePolicy);

    // Check if the file format version is 1.0.0
    if (policy.version === "1.0.0") {
        // Return the value associated with the 'user_policy_id' key
        return policy.user_policy_id;
    } else {
        console.log('Unsupported file format version.');
        return null;
    }
}

// Function to perform actions as specified in the JSON input
function performActionsBasedOnJson(jsonInput) {
    // Parse the JSON input
    const siteActions = JSON.parse(jsonInput);

    // Determine the current website
    const currentUrl = window.location.hostname;

    // Check if the current website is in the JSON
    if (siteActions[currentUrl]) {
        // Get the action from the user policy file
        const userAction = getUserAction();

        // Check if the action is available for the current website
        if (userAction && siteActions[currentUrl][userAction]) {

            console.log(`Start of the stopwatch...`);
            const startActionTime = new Date().getTime();
            // Execute the actions with a ACTION_DELAY delay between each
            siteActions[currentUrl][userAction].forEach((selector, index) => {
                setTimeout(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        element.click();
                        console.log(`Clicked element with selector: ${selector}, after ${new Date().getTime() - startActionTime} milliseconds.`);
                    } else {
                        console.log(`Element with selector: ${selector} not found.`);
                    }
                }, ACTION_DELAY * index);
            });
        } else {
            console.log(`Action ${userAction} not found for ${currentUrl}`);
        }
    } else {
        console.log(`No actions found for ${currentUrl}`);
    }
}