/* =========================================
   JanSuvidha - Scheme Details
========================================= */

const JanSchemeDetails = {

    currentScheme: null,

    open(scheme) {

        if (!scheme) {
            return;
        }

        this.currentScheme = scheme;

        const modal =
            document.getElementById("schemeDetailsModal");

        if (!modal) {
            console.error("Scheme details modal not found.");
            return;
        }

        const title =
            document.getElementById("schemeDetailsTitle");

        const description =
            document.getElementById("schemeDetailsDescription");

        const benefits =
            document.getElementById("schemeDetailsBenefits");

        const eligibility =
            document.getElementById("schemeDetailsEligibility");

        const documents =
            document.getElementById("schemeDetailsDocuments");

        const apply =
            document.getElementById("schemeDetailsApply");

        if (title) {
            title.textContent =
                scheme.name || "Government Scheme";
        }

        if (description) {
            description.textContent =
                scheme.description ||
                "Official scheme information.";
        }

        if (benefits) {

            benefits.innerHTML =
                this.makeList(
                    scheme.benefits,
                    "Benefits information is available on the official portal."
                );

        }

        if (eligibility) {

            eligibility.innerHTML =
                this.makeList(
                    scheme.eligibility,
                    "Check eligibility on the official government portal."
                );

        }

        if (documents) {

            documents.innerHTML =
                this.makeList(
                    scheme.documents,
                    "Required documents may vary. Verify before applying."
                );

        }

        if (apply) {

            const url =
                scheme.officialUrl ||
                scheme.url ||
                "#";

            apply.href =
                safeURL(url);

            apply.style.display =
                url === "#"
                    ? "none"
                    : "inline-flex";

        }

        modal.style.display =
            "flex";

        document.body.style.overflow =
            "hidden";

    },


    makeList(items, fallback) {

        if (!Array.isArray(items) || !items.length) {

            return `
                <p class="muted">
                    ${escapeHTML(fallback)}
                </p>
            `;

        }

        return `
            <ul>
                ${
                    items
                        .map(
                            item =>
                                `<li>
                                    ${escapeHTML(String(item))}
                                </li>`
                        )
                        .join("")
                }
            </ul>
        `;

    },


    close() {

        const modal =
            document.getElementById(
                "schemeDetailsModal"
            );

        if (modal) {

            modal.style.display =
                "none";

        }

        document.body.style.overflow =
            "";

        this.currentScheme =
            null;

    },


    apply() {

        if (
            !this.currentScheme
        ) {
            return;
        }

        const url =
            this.currentScheme.officialUrl ||
            this.currentScheme.url;

        if (!url) {

            showToast(
                "Official application link is not available."
            );

            return;

        }

        window.open(
            safeURL(url),
            "_blank",
            "noopener,noreferrer"
        );

    }

};


window.JanSchemeDetails =
    JanSchemeDetails;


/* Close when clicking outside */

document.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "schemeDetailsModal"
            );

        if (
            modal &&
            event.target === modal
        ) {

            JanSchemeDetails.close();

        }

    }
);


/* Close with Escape */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            JanSchemeDetails.close();

        }

    }
);
