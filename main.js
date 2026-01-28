function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("open");
}

function handleAppointment(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    const subject = encodeURIComponent(`Appointment Request - ${data.name || "Patient"}`);
    const body = encodeURIComponent(
        `Name: ${data.name || ""}
Phone: ${data.phone || ""}
Department: ${data.dept || ""}
Preferred Date: ${data.date || ""}
Message: ${data.message || ""}

Address: Survey No.53, Sai Housing Society, Karve Nagar Rd, State Bank Nagar, Sramik Vasahat, Karvenagar, Pune, Maharashtra 411052`
    );

    // Default action: open email draft (change to WhatsApp/back-end later if you want)
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
