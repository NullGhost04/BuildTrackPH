/* =========================================================
   BUILDTRACKPH JAVASCRIPT
========================================================= */


/* =========================================================
   DATABASE
   Browser localStorage is used as the temporary database.
========================================================= */

const DB = {

    bookings:
        JSON.parse(
            localStorage.getItem("bt_bookings") || "[]"
        ),

    payments:
        JSON.parse(
            localStorage.getItem("bt_payments") || "[]"
        ),

    customers:
        JSON.parse(
            localStorage.getItem("bt_customers") || "[]"
        ),

    messages:
        JSON.parse(
            localStorage.getItem("bt_messages") || "[]"
        ),

    newsletter:
        JSON.parse(
            localStorage.getItem("bt_newsletter") || "[]"
        )

};


function saveDB() {

    localStorage.setItem(
        "bt_bookings",
        JSON.stringify(DB.bookings)
    );

    localStorage.setItem(
        "bt_payments",
        JSON.stringify(DB.payments)
    );

    localStorage.setItem(
        "bt_customers",
        JSON.stringify(DB.customers)
    );

    localStorage.setItem(
        "bt_messages",
        JSON.stringify(DB.messages)
    );

    localStorage.setItem(
        "bt_newsletter",
        JSON.stringify(DB.newsletter)
    );
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

        });


    const target =
        document.getElementById(pageName);


    if (target) {

        target.classList.add("active");

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    const nav =
        document.getElementById("mainNav");

    nav.classList.remove("mobile-open");


    if (pageName === "adminDashboard") {

        updateAdminDashboard();

    }
}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMobileMenu() {

    document
        .getElementById("mainNav")
        .classList.toggle("mobile-open");

}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    document
        .getElementById(id)
        .classList.add("active");

}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("active");

}


function openBooking(service = "") {

    openModal("bookingModal");


    if (service) {

        document
            .getElementById("bookingService")
            .value = service;

    }


    const date =
        document.getElementById("bookingDate");


    const tomorrow =
        new Date();

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    date.min =
        tomorrow
            .toISOString()
            .split("T")[0];

}


/* =========================================================
   BOOKING SYSTEM
========================================================= */

function submitBooking(event) {

    event.preventDefault();


    const booking = {

        id:
            "BT-" +
            Date.now(),

        service:
            document.getElementById(
                "bookingService"
            ).value,

        date:
            document.getElementById(
                "bookingDate"
            ).value,

        time:
            document.getElementById(
                "bookingTime"
            ).value,

        name:
            document.getElementById(
                "bookingName"
            ).value,

        company:
            document.getElementById(
                "bookingCompany"
            ).value,

        email:
            document.getElementById(
                "bookingEmail"
            ).value,

        phone:
            document.getElementById(
                "bookingPhone"
            ).value,

        details:
            document.getElementById(
                "bookingDetails"
            ).value,

        status:
            "Pending",

        created:
            new Date().toISOString()

    };


    DB.bookings.push(booking);


    addCustomer(
        booking.name,
        booking.email,
        booking.phone,
        booking.company
    );


    saveDB();


    closeModal("bookingModal");


    document
        .getElementById("bookingForm")
        .reset();


    showToast(
        "Booking confirmed! Reference: " +
        booking.id
    );


    setTimeout(() => {

        showPage("home");

    }, 1500);

}


/* =========================================================
   CUSTOMER
========================================================= */

function addCustomer(
    name,
    email,
    phone,
    company
) {

    const exists =
        DB.customers.find(
            c => c.email === email
        );


    if (!exists) {

        DB.customers.push({

            id:
                "CUS-" +
                Date.now(),

            name,
            email,
            phone,
            company,

            joined:
                new Date().toISOString()

        });

    }

}


/* =========================================================
   PRICING
========================================================= */

let billingCycle = "monthly";


const prices = {

    monthly: {

        Starter: 1200,

        Professional: 2500,

        Enterprise: 5000

    },

    annual: {

        Starter: 12000,

        Professional: 25000,

        Enterprise: 50000

    }

};


function setBilling(cycle) {

    billingCycle =
        cycle;


    document
        .getElementById("monthlyBtn")
        .classList
        .toggle(
            "active",
            cycle === "monthly"
        );


    document
        .getElementById("annualBtn")
        .classList
        .toggle(
            "active",
            cycle === "annual"
        );


    document
        .getElementById("starterPrice")
        .textContent =
        prices[cycle].Starter.toLocaleString();


    document
        .getElementById("professionalPrice")
        .textContent =
        prices[cycle].Professional.toLocaleString();


    document
        .getElementById("enterprisePrice")
        .textContent =
        cycle === "annual"
            ? "50,000"
            : "5,000+";

}


/* =========================================================
   CHECKOUT
========================================================= */

let selectedPlan =
    null;


function choosePlan(
    plan,
    price
) {

    selectedPlan = {

        plan,

        price:
            prices[
                billingCycle
            ][plan]

    };


    document
        .getElementById("checkoutPlan")
        .textContent =
        plan + " Plan";


    document
        .getElementById("checkoutCycle")
        .textContent =
        billingCycle === "monthly"
            ? "Monthly Billing"
            : "Annual Billing";


    document
        .getElementById("checkoutTotal")
        .textContent =
        "₱" +
        selectedPlan.price.toLocaleString();


    openModal(
        "checkoutModal"
    );

}


/* =========================================================
   PAYMENT TABS
========================================================= */

let currentPaymentMethod =
    "bank";


function paymentTab(
    method,
    button
) {

    currentPaymentMethod =
        method;


    document
        .querySelectorAll(
            ".payment-tabs button"
        )
        .forEach(
            b =>
                b.classList.remove(
                    "active"
                )
        );


    button.classList.add("active");


    document
        .querySelectorAll(
            ".payment-panel"
        )
        .forEach(
            panel =>
                panel.classList.add(
                    "hidden"
                )
        );


    if (method === "bank") {

        document
            .getElementById(
                "bankPayment"
            )
            .classList.remove(
                "hidden"
            );

    }


    if (method === "wallet") {

        document
            .getElementById(
                "walletPayment"
            )
            .classList.remove(
                "hidden"
            );

    }


    if (method === "card") {

        document
            .getElementById(
                "cardPayment"
            )
            .classList.remove(
                "hidden"
            );

    }

}


/* =========================================================
   PROCESS PAYMENT
========================================================= */

function processPayment(event) {

    event.preventDefault();


    if (!selectedPlan) {

        showToast(
            "Please select a plan first."
        );

        return;

    }


    const email =
        document.getElementById(
            "paymentEmail"
        ).value;


    let paymentReference =
        "PAY-" +
        Date.now();


    let method =
        currentPaymentMethod;


    if (method === "bank") {

        method =
            document.getElementById(
                "bankName"
            ).value;

    }


    if (method === "wallet") {

        method =
            document.getElementById(
                "walletName"
            ).value;

    }


    if (method === "card") {

        method =
            "Credit / Debit Card";

    }


    const payment = {

        id:
            paymentReference,

        plan:
            selectedPlan.plan,

        billing:
            billingCycle,

        amount:
            selectedPlan.price,

        method,

        email,

        status:
            "Paid",

        created:
            new Date().toISOString()

    };


    DB.payments.push(payment);


    addCustomer(
        email.split("@")[0],
        email,
        "",
        ""
    );


    saveDB();


    closeModal(
        "checkoutModal"
    );


    document
        .getElementById(
            "paymentForm"
        )
        .reset();


    showToast(
        "Payment successful! Receipt " +
        paymentReference
    );


    setTimeout(() => {

        alert(
            "BUILDTRACKPH PAYMENT CONFIRMATION\n\n" +

            "Plan: " +
            selectedPlan.plan +

            "\nBilling: " +
            billingCycle +

            "\nAmount: ₱" +
            selectedPlan.price.toLocaleString() +

            "\nPayment: " +
            method +

            "\nReference: " +
            paymentReference +

            "\n\nA simulated email/SMS receipt has been generated."
        );

    }, 500);

}


/* =========================================================
   LOGIN
========================================================= */

function openLogin() {

    openModal(
        "loginModal"
    );

}


function login(event) {

    event.preventDefault();


    const email =
        document.getElementById(
            "loginEmail"
        ).value
        .trim()
        .toLowerCase();


    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    /*
       OWNER ACCOUNT
    */

    if (

        email ===
        "angel@buildtrackph.com"

        &&

        password ===
        "BuildTrackPH!2026"

    ) {

        closeModal(
            "loginModal"
        );


        showToast(
            "Welcome, Angel Peralta."
        );


        setTimeout(() => {

            showPage(
                "adminDashboard"
            );

        }, 700);


        return;

    }


    /*
       CLIENT LOGIN
    */

    const customer =
        DB.customers.find(
            c =>
                c.email
                    .toLowerCase() ===
                email
        );


    if (customer) {

        closeModal(
            "loginModal"
        );


        showToast(
            "Welcome back!"
        );


        setTimeout(() => {

            showPage(
                "clientDashboard"
            );

        }, 700);


        return;

    }


    showToast(
        "Account not found. Book a demo or subscribe first."
    );

}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function updateAdminDashboard() {

    document
        .getElementById(
            "adminBookings"
        )
        .textContent =
        DB.bookings.length;


    document
        .getElementById(
            "adminCustomers"
        )
        .textContent =
        DB.customers.length;


    document
        .getElementById(
            "adminTransactions"
        )
        .textContent =
        DB.payments.length;


    const revenue =
        DB.payments.reduce(
            (
                total,
                payment
            ) =>
                total +
                Number(
                    payment.amount
                ),
            0
        );


    document
        .getElementById(
            "adminRevenue"
        )
        .textContent =
        "₱" +
        revenue.toLocaleString();


    renderBookings();

    renderPayments();

    renderCustomers();

    renderMessages();

}


function renderBookings() {

    const container =
        document.getElementById(
            "bookingTable"
        );


    if (!DB.bookings.length) {

        container.innerHTML =
            "<p>No bookings yet.</p>";

        return;

    }


    let html = `

        <div class="table-wrapper">

        <table class="admin-table">

        <thead>

        <tr>

            <th>Reference</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>

        </tr>

        </thead>

        <tbody>

    `;


    DB.bookings.forEach(
        booking => {

            html += `

                <tr>

                    <td>
                        ${booking.id}
                    </td>

                    <td>
                        <strong>
                            ${escapeHTML(
                                booking.name
                            )}
                        </strong>

                        <br>

                        <small>
                            ${escapeHTML(
                                booking.email
                            )}
                        </small>
                    </td>

                    <td>
                        ${escapeHTML(
                            booking.service
                        )}
                    </td>

                    <td>
                        ${booking.date}
                        <br>
                        ${booking.time}
                    </td>

                    <td>
                        <strong>
                            ${booking.status}
                        </strong>
                    </td>

                    <td>

                        <button
                            class="btn btn-primary"
                            onclick="completeBooking('${booking.id}')">

                            Complete

                        </button>

                    </td>

                </tr>

            `;

        }
    );


    html += `
        </tbody>
        </table>
        </div>
    `;


    container.innerHTML =
        html;

}


function completeBooking(id) {

    const booking =
        DB.bookings.find(
            b => b.id === id
        );


    if (booking) {

        booking.status =
            "Completed";

        saveDB();

        updateAdminDashboard();

        showToast(
            "Booking marked as completed."
        );

    }

}


/* =========================================================
   PAYMENT TABLE
========================================================= */

function renderPayments() {

    const container =
        document.getElementById(
            "paymentTable"
        );


    if (!DB.payments.length) {

        container.innerHTML =
            "<p>No payments yet.</p>";

        return;

    }


    let html = `

        <div class="table-wrapper">

        <table class="admin-table">

        <thead>

        <tr>

            <th>Reference</th>
            <th>Plan</th>
            <th>Billing</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Status</th>

        </tr>

        </thead>

        <tbody>

    `;


    DB.payments.forEach(
        payment => {

            html += `

                <tr>

                    <td>
                        ${payment.id}
                    </td>

                    <td>
                        ${payment.plan}
                    </td>

                    <td>
                        ${payment.billing}
                    </td>

                    <td>
                        ${payment.method}
                    </td>

                    <td>
                        ₱${Number(
                            payment.amount
                        ).toLocaleString()}
                    </td>

                    <td>
                        ${payment.status}
                    </td>

                </tr>

            `;

        }
    );


    html += `
        </tbody>
        </table>
        </div>
    `;


    container.innerHTML =
        html;

}


/* =========================================================
   CUSTOMER TABLE
========================================================= */

function renderCustomers() {

    const container =
        document.getElementById(
            "customerTable"
        );


    if (!DB.customers.length) {

        container.innerHTML =
            "<p>No customers yet.</p>";

        return;

    }


    let html = `

        <div class="table-wrapper">

        <table class="admin-table">

        <thead>

        <tr>

            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Joined</th>

        </tr>

        </thead>

        <tbody>

    `;


    DB.customers.forEach(
        customer => {

            html += `

                <tr>

                    <td>
                        ${escapeHTML(
                            customer.name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.company || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.email
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.phone || "-"
                        )}
                    </td>

                    <td>
                        ${new Date(
                            customer.joined
                        ).toLocaleDateString()}
                    </td>

                </tr>

            `;

        }
    );


    html += `
        </tbody>
        </table>
        </div>
    `;


    container.innerHTML =
        html;

}


/* =========================================================
   MESSAGES
========================================================= */

function renderMessages() {

    const container =
        document.getElementById(
            "messageTable"
        );


    if (!DB.messages.length) {

        container.innerHTML =
            "<p>No messages yet.</p>";

        return;

    }


    let html = `

        <div class="table-wrapper">

        <table class="admin-table">

        <thead>

        <tr>

            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Message</th>

        </tr>

        </thead>

        <tbody>

    `;


    DB.messages.forEach(
        message => {

            html += `

                <tr>

                    <td>
                        ${escapeHTML(
                            message.name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            message.company || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            message.email
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            message.message
                        )}
                    </td>

                </tr>

            `;

        }
    );


    html += `
        </tbody>
        </table>
        </div>
    `;


    container.innerHTML =
        html;

}


/* =========================================================
   ADMIN TABS
========================================================= */

function adminTab(
    tab,
    button
) {

    document
        .querySelectorAll(
            ".admin-tabs button"
        )
        .forEach(
            b =>
                b.classList.remove(
                    "active"
                )
        );


    button.classList.add(
        "active"
    );


    document
        .querySelectorAll(
            ".admin-panel"
        )
        .forEach(
            panel =>
                panel.classList.add(
                    "hidden"
                )
        );


    document
        .getElementById(
            "admin" +
            tab.charAt(0).toUpperCase() +
            tab.slice(1) +
            "Panel"
        )
        .classList.remove(
            "hidden"
        );

}


/* =========================================================
   CONTACT FORM
========================================================= */

function submitContact(event) {

    event.preventDefault();


    const message = {

        id:
            "MSG-" +
            Date.now(),

        name:
            document.getElementById(
                "contactName"
            ).value,

        company:
            document.getElementById(
                "contactCompany"
            ).value,

        email:
            document.getElementById(
                "contactEmail"
            ).value,

        phone:
            document.getElementById(
                "contactPhone"
            ).value,

        project:
            document.getElementById(
                "contactProject"
            ).value,

        message:
            document.getElementById(
                "contactMessage"
            ).value,

        created:
            new Date().toISOString()

    };


    DB.messages.push(
        message
    );


    saveDB();


    event.target.reset();


    showToast(
        "Your inquiry has been sent!"
    );

}


/* =========================================================
   NEWSLETTER
========================================================= */

function subscribeNewsletter(event) {

    event.preventDefault();


    const email =
        document.getElementById(
            "newsletterEmail"
        ).value;


    DB.newsletter.push({

        email,

        date:
            new Date().toISOString()

    });


    saveDB();


    event.target.reset();


    showToast(
        "Thanks for subscribing!"
    );

}


/* =========================================================
   PROJECT FILTER
========================================================= */

function filterProjects(
    category,
    button
) {

    document
        .querySelectorAll(
            ".filter-buttons button"
        )
        .forEach(
            b =>
                b.classList.remove(
                    "active"
                )
        );


    button.classList.add(
        "active"
    );


    document
        .querySelectorAll(
            ".project-card"
        )
        .forEach(card => {

            const cardCategory =
                card.dataset.category;


            if (
                category === "all" ||
                cardCategory === category
            ) {

                card.style.display =
                    "block";

            } else {

                card.style.display =
                    "none";

            }

        });

}


/* =========================================================
   FAQ
========================================================= */

function toggleFAQ(button) {

    const item =
        button.parentElement;


    item.classList.toggle(
        "open"
    );


    const icon =
        button.querySelector(
            "span"
        );


    icon.textContent =
        item.classList.contains(
            "open"
        )
            ? "−"
            : "+";

}


/* =========================================================
   CHAT
========================================================= */

function toggleChat() {

    document
        .getElementById(
            "chatBox"
        )
        .classList.toggle(
            "active"
        );

}


function sendChat(event) {

    event.preventDefault();


    const input =
        document.getElementById(
            "chatInput"
        );


    const message =
        input.value.trim();


    if (!message)
        return;


    const container =
        document.getElementById(
            "chatMessages"
        );


    container.innerHTML += `

        <div class="chat-user">
            ${escapeHTML(message)}
        </div>

    `;


    input.value = "";


    setTimeout(() => {

        container.innerHTML += `

            <div class="chat-bot">

                Thanks for contacting BuildTrackPH!
                Our team can help you with pricing,
                onboarding, bookings and project setup.

            </div>

        `;


        container.scrollTop =
            container.scrollHeight;

    }, 700);

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 3500);

}


/* =========================================================
   PRIVACY
========================================================= */

function showPrivacy() {

    alert(

        "BUILDTRACKPH PRIVACY NOTICE\n\n" +

        "BuildTrackPH is designed with privacy and " +
        "security in mind. Personal information collected " +
        "through this demonstration website is stored " +
        "locally in the browser.\n\n" +

        "Production deployment should implement " +
        "server-side security, HTTPS, authentication, " +
        "database protection and applicable Philippine " +
        "Data Privacy Act requirements."

    );

}


/* =========================================================
   SECURITY HELPER
========================================================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(
            /[&<>"']/g,
            char => ({

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            })[char]
        );

}


/* =========================================================
   DEMO DATA
========================================================= */

function initializeDemoData() {

    if (
        DB.bookings.length === 0
        &&
        DB.payments.length === 0
        &&
        DB.customers.length === 0
    ) {

        DB.customers.push({

            id:
                "CUS-DEMO",

            name:
                "Demo Contractor",

            email:
                "client@demo.com",

            phone:
                "09171234567",

            company:
                "Demo Construction Corp.",

            joined:
                new Date().toISOString()

        });


        DB.bookings.push({

            id:
                "BT-DEMO-001",

            service:
                "Progress Monitoring",

            date:
                "2026-10-10",

            time:
                "10:00 AM",

            name:
                "Demo Contractor",

            company:
                "Demo Construction Corp.",

            email:
                "client@demo.com",

            phone:
                "09171234567",

            details:
                "Sample construction project.",

            status:
                "Confirmed",

            created:
                new Date().toISOString()

        });


        DB.payments.push({

            id:
                "PAY-DEMO-001",

            plan:
                "Professional",

            billing:
                "monthly",

            amount:
                2500,

            method:
                "GCash",

            email:
                "client@demo.com",

            status:
                "Paid",

            created:
                new Date().toISOString()

        });


        saveDB();

    }

}


/* =========================================================
   CLOSE MODALS WHEN CLICKING BACKDROP
========================================================= */

document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    modal.classList.remove(
                        "active"
                    );

                }

            }
        );

    });


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeDemoData();

        setBilling("monthly");

        updateAdminDashboard();

    }
);