/* =========================================
   JanSuvidha - Search & Filter System
========================================= */

function searchJanSuvidha(query) {

    const results =
        JanSuvidha.search(query);

    displaySearchResults(results, query);

}


function filterJanSuvidha(category) {

    const results =
        JanSuvidha.filterByCategory(category);

    displaySearchResults(
        results,
        category
    );

}


function filterJanSuvidhaByState(state) {

    const results =
        JanSuvidha.filterByState(state);

    displaySearchResults(
        results,
        state
    );

}


/* =========================================
   Display Results
========================================= */

function displaySearchResults(
    results,
    searchTerm = ""
) {

    const container =
        document.getElementById(
            "searchResults"
        );

    if(!container) {

        console.warn(
            "searchResults container not found."
        );

        return;

    }


    if(!results.length) {

        container.innerHTML = `

            <div class="no-results">

                <div style="font-size:40px">
                    🔎
                </div>

                <h3>
                    No results found
                </h3>

                <p>
                    We couldn't find anything
                    matching
                    <strong>
                        "${escapeHTML(searchTerm)}"
                    </strong>.
                </p>

                <p>
                    Try another keyword such as
                    <b>Scholarship</b>,
                    <b>Job</b>,
                    <b>Farmer</b> or
                    <b>Health</b>.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="results-header">

            <strong>
                ${results.length}
                result${results.length > 1 ? "s" : ""}
            </strong>

            ${
                searchTerm
                ? `for "${escapeHTML(searchTerm)}"`
                : ""
            }

        </div>

        <div class="results-grid">

            ${results
                .map(createResultCard)
                .join("")}

        </div>

    `;

}


/* =========================================
   Result Card
========================================= */

function createResultCard(item) {

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

    const category =
        JanSuvidha.getText(
            item,
            "category"
        );

    const url =
        item.officialUrl ||
        item.url ||
        "#";


    return `

        <article class="result-card">

            <div class="result-category">
                ${escapeHTML(category)}
            </div>

            <h3>
                ${escapeHTML(name)}
            </h3>

            <p>
                ${escapeHTML(description)}
            </p>

            <div class="result-meta">

                <span>
                    📍
                    ${escapeHTML(
                        item.state || "India"
                    )}
                </span>

                ${
                    item.status === "active"
                    ? `
                        <span class="active-badge">
                            Active
                        </span>
                    `
                    : ""
                }

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


/* =========================================
   Safe HTML
========================================= */

function escapeHTML(value) {

    if(value === undefined ||
       value === null) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   Safe External URL
========================================= */

function safeURL(url) {

    try {

        const parsed =
            new URL(url);

        if(
            parsed.protocol === "https:" ||
            parsed.protocol === "http:"
        ) {

            return parsed.href;

        }

    } catch(error) {

        console.warn(
            "Invalid URL:",
            url
        );

    }

    return "#";

}


/* =========================================
   Search Input Helpers
========================================= */

function connectSearchInputs() {

    const inputs =
        document.querySelectorAll(
            '[data-jan-search]'
        );


    inputs.forEach(input => {

        input.addEventListener(
            "keydown",
            function(event) {

                if(event.key === "Enter") {

                    searchJanSuvidha(
                        input.value
                    );

                }

            }
        );

    });

}


/* =========================================
   Global Search
========================================= */

window.janSearch =
function(query) {

    searchJanSuvidha(query);

};


/* =========================================
   Category Search
========================================= */

window.janCategory =
function(category) {

    filterJanSuvidha(category);

};


/* =========================================
   State Search
========================================= */

window.janState =
function(state) {

    filterJanSuvidhaByState(state);

};


/* =========================================
   Initialization
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        connectSearchInputs();

    }
);
