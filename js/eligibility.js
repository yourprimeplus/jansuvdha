/* =========================================
   JanSuvidha - Smart Scheme Finder
========================================= */

const JanEligibility = {

    find() {

        const profile =
            JanProfile.get();

        if (!profile) {

            showToast(
                "Please complete your profile first."
            );

            openProfile();

            return [];

        }

        const all =
            JanSuvidha.getAllData();

        const recommendations =
            all.filter(
                item =>
                    this.isRelevant(
                        item,
                        profile
                    )
            );

        return recommendations;

    },


    isRelevant(item, profile) {

        const category =
            String(
                item.category || ""
            ).toLowerCase();


        const text =
            (
                String(item.name || "") +
                " " +
                String(item.description || "") +
                " " +
                category
            ).toLowerCase();


        /* Student */

        if (
            profile.userType === "student" ||
            profile.occupation === "student"
        ) {

            if (
                text.includes("scholar") ||
                text.includes("student") ||
                text.includes("education") ||
                text.includes("school") ||
                text.includes("college")
            ) {

                return true;

            }

        }


        /* Farmer */

        if (
            profile.userType === "farmer" ||
            profile.occupation === "farmer"
        ) {

            if (
                text.includes("farmer") ||
                text.includes("agriculture") ||
                text.includes("kisan") ||
                text.includes("crop")
            ) {

                return true;

            }

        }


        /* Business */

        if (
            profile.userType === "business" ||
            profile.occupation === "business"
        ) {

            if (
                text.includes("business") ||
                text.includes("loan") ||
                text.includes("enterprise") ||
                text.includes("startup")
            ) {

                return true;

            }

        }


        /* Senior Citizen */

        if (
            profile.age &&
            Number(profile.age) >= 60
        ) {

            if (
                text.includes("pension") ||
                text.includes("senior") ||
                text.includes("elderly")
            ) {

                return true;

            }

        }


        /* Category based matching */

        if (
            profile.category
        ) {

            const category =
                profile.category.toLowerCase();

            if (
                text.includes(category)
            ) {

                return true;

            }

        }


        /* State based matching */

        if (
            profile.state
        ) {

            const state =
                profile.state.toLowerCase();

            if (
                text.includes(state)
            ) {

                return true;

            }

        }


        return false;

    }

};


/* =========================================
   Open Smart Finder
========================================= */

function openEligibilityFinder() {

    const results =
        JanEligibility.find();

    const section =
        document.getElementById(
            "eligibilitySection"
        );

    const container =
        document.getElementById(
            "eligibilityResults"
        );


    if (!section || !container) {

        return;

    }


    section.style.display =
        "block";


    if (!results.length) {

        container.innerHTML = `

            <div class="no-results">

                <div style="font-size:42px;">
                    🔎
                </div>

                <h3>
                    No matching schemes found
                </h3>

                <p>
                    Try updating your profile
                    with more information.
                </p>

                <button
                    onclick="openProfile()"
                    style="
                        border:0;
                        padding:11px 18px;
                        border-radius:9px;
                        background:var(--primary);
                        color:#fff;
                        font-weight:800;
                    "
                >
                    👤 Update Profile
                </button>

            </div>

        `;

        section.scrollIntoView({
            behavior:"smooth"
        });

        return;

    }


    container.innerHTML = `

        <div class="results-header">

            <strong>
                ${results.length}
                matching scheme
                ${results.length > 1 ? "s" : ""}
            </strong>

        </div>

        <div class="results-grid">

            ${
                results
                    .map(
                        item =>
                            createEligibilityCard(
                                item
                            )
                    )
                    .join("")
            }

        </div>

    `;


    section.scrollIntoView({
        behavior:"smooth"
    });

}


/* =========================================
   Result Card
========================================= */

function createEligibilityCard(item) {

    const name =
        JanSuvidha.getText(
            item,
            "name"
        );

    const description =
        JanSuvidha.getText(
            item,
            "description"
        );

    const url =
        item.officialUrl ||
        item.url ||
        "#";


    return `

        <article class="result-card">

            <div class="result-category">
                ${escapeHTML(
                    item.category || "Scheme"
                )}
            </div>

            <h3>
                ${escapeHTML(name)}
            </h3>

            <p>
                ${escapeHTML(description)}
            </p>

            <div class="result-meta">

                <span>
                    🎯 Recommended for you
                </span>

                <span class="active-badge">
                    Check Eligibility
                </span>

            </div>

            <a
                class="result-button"
                href="${safeURL(url)}"
                target="_blank"
                rel="noopener noreferrer">

                Official Website ↗

            </a>

        </article>

    `;

}
